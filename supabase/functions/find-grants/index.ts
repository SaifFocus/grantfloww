// find-grants — uses Lovable AI to plan queries + Firecrawl to search/scrape
// free public grant portals, then Lovable AI to rank+structure results.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";
const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SOURCES = [
  { name: "Grants.gov", domain: "grants.gov", region: "US" },
  { name: "EU Funding & Tenders", domain: "ec.europa.eu", region: "EU" },
  { name: "gov.uk grants", domain: "gov.uk", region: "UK" },
  { name: "UKRI / Innovate UK", domain: "ukri.org", region: "UK" },
];

interface Filters {
  region?: string;
  grantType?: string;
  fundingStage?: string;
}

interface UserInput {
  idea?: string;
  businessType?: string;
  market?: string;
  fundingGoal?: string;
  stage?: string;
  needs?: string[];
  filters?: Filters;
}

async function callAI(messages: unknown[], json = false): Promise<string> {
  const KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!KEY) throw new Error("LOVABLE_API_KEY missing");
  const r = await fetch(AI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`AI ${r.status}: ${t}`);
  }
  const data = await r.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

async function firecrawlSearch(query: string, limit = 5) {
  const KEY = Deno.env.get("FIRECRAWL_API_KEY");
  if (!KEY) throw new Error("FIRECRAWL_API_KEY missing");
  const r = await fetch(`${FIRECRAWL_V2}/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, limit }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    if (r.status === 402) {
      const err: Error & { code?: number } = new Error("Firecrawl credits exhausted");
      err.code = 402;
      throw err;
    }
    throw new Error(`Firecrawl search ${r.status}: ${JSON.stringify(data)}`);
  }
  // v2 search returns { success, data: { web: [...] } } or { data: [...] }
  const web = data?.data?.web ?? data?.data ?? [];
  return Array.isArray(web) ? web : [];
}

async function firecrawlScrape(url: string): Promise<string> {
  const KEY = Deno.env.get("FIRECRAWL_API_KEY");
  if (!KEY) return "";
  try {
    const r = await fetch(`${FIRECRAWL_V2}/scrape`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return "";
    return (data?.data?.markdown ?? data?.markdown ?? "").slice(0, 4000);
  } catch {
    return "";
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const input: UserInput = await req.json();

    // 1) Ask AI for 3-4 concise search queries
    const queryPrompt = `User wants funding for this business:
- Idea: ${input.idea ?? ""}
- Type: ${input.businessType ?? ""}
- Market: ${input.market ?? ""}
- Funding goal: ${input.fundingGoal ?? ""}
- Stage: ${input.stage ?? ""}
- Needs: ${(input.needs ?? []).join(", ")}

Return JSON: { "queries": ["q1","q2","q3"] } — 3 short search queries (5-9 words each) to find matching GRANTS or public funding programs. No years, no quotes inside, just keywords.`;
    const qRaw = await callAI(
      [
        { role: "system", content: "You return only valid JSON." },
        { role: "user", content: queryPrompt },
      ],
      true,
    );
    let queries: string[] = [];
    try {
      queries = JSON.parse(qRaw).queries ?? [];
    } catch {
      queries = [`${input.businessType ?? "small business"} grants ${input.market ?? ""}`.trim()];
    }
    queries = queries.slice(0, 3).filter(Boolean);

    // 2) For each (query x source), call Firecrawl search
    const seen = new Set<string>();
    const candidates: { title: string; url: string; description: string; source: string; region: string }[] = [];

    for (const q of queries) {
      for (const src of SOURCES) {
        const scoped = `${q} site:${src.domain}`;
        let results: any[] = [];
        try {
          results = await firecrawlSearch(scoped, 3);
        } catch (e: unknown) {
          const err = e as { code?: number; message?: string };
          if (err.code === 402) {
            return new Response(
              JSON.stringify({
                error:
                  "Firecrawl credits exhausted. Reconnect with the email used to set up the Firecrawl connection and use coupon LOVABLE50 for 50% off the first 3 months.",
              }),
              { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
          }
          console.error("search failed", scoped, err.message);
          continue;
        }
        for (const r of results) {
          const url = r.url ?? r.link;
          if (!url || seen.has(url)) continue;
          seen.add(url);
          candidates.push({
            title: r.title ?? "Untitled",
            url,
            description: r.description ?? r.snippet ?? "",
            source: src.name,
            region: src.region,
          });
        }
      }
    }

    if (candidates.length === 0) {
      return new Response(JSON.stringify({ grants: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3) Scrape top ~6 for richer context
    const top = candidates.slice(0, 6);
    const scraped = await Promise.all(
      top.map(async (c) => ({ ...c, content: await firecrawlScrape(c.url) })),
    );

    // 4) Ask AI to extract+rank up to 6 grants
    const rankPrompt = `User profile:
${JSON.stringify(input)}

Candidate grant pages (title, url, source, snippet, scraped content):
${scraped
  .map(
    (c, i) =>
      `\n[${i + 1}] ${c.title}\nURL: ${c.url}\nSource: ${c.source} (${c.region})\nSnippet: ${c.description}\nContent: ${c.content || "(scrape unavailable)"}`,
  )
  .join("\n---")}

Return JSON: {"grants":[{"name":"","funder":"","amount":"","deadline":"","region":"","eligibility":["",""],"fitReason":"","sourceUrl":""}]}

Rules:
- Return up to 6 grants, ranked by fit to the user.
- Only include items that look like actual grant/funding programs (not news, not generic landing pages).
- "amount": short string like "Up to $500K" or "Unknown" if not found.
- "deadline": short date string or "Rolling" or "Unknown".
- "eligibility": 1-3 short bullet points pulled from the page.
- "fitReason": one sentence explaining why this matches the user.
- "sourceUrl": exact URL from the candidate.
- If nothing fits, return {"grants":[]}.`;

    const ranked = await callAI(
      [
        { role: "system", content: "You return only valid JSON. Be conservative — never invent grants." },
        { role: "user", content: rankPrompt },
      ],
      true,
    );

    let grants: unknown[] = [];
    try {
      grants = JSON.parse(ranked).grants ?? [];
    } catch (e) {
      console.error("rank parse failed", e, ranked.slice(0, 200));
    }

    return new Response(JSON.stringify({ grants }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("find-grants error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
