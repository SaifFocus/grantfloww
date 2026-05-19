// match-grants — queries the curated grants table, then uses Lovable AI to score fit.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface Req {
  country?: string;
  businessType?: string;
  stage?: string;
  sectorTags?: string[];
  fundingMin?: number;
  fundingMax?: number;
  idea?: string;
}

async function callAI(messages: unknown[]): Promise<string> {
  const KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!KEY) throw new Error("LOVABLE_API_KEY missing");
  const r = await fetch(AI_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      response_format: { type: "json_object" },
    }),
  });
  if (!r.ok) throw new Error(`AI ${r.status}: ${await r.text()}`);
  const data = await r.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

async function fetchGrants(country: string, stage?: string, sectorTags?: string[]) {
  const params = new URLSearchParams({
    select: "*",
    is_active: "eq.true",
    country: `eq.${country}`,
    limit: "20",
  });
  const r = await fetch(`${SUPABASE_URL}/rest/v1/grants?${params}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  if (!r.ok) throw new Error(`grants ${r.status}`);
  let rows = await r.json() as Array<Record<string, unknown>>;
  // optional client-side tag filter; if too few, ignore
  if (stage || (sectorTags && sectorTags.length)) {
    const filtered = rows.filter((g) => {
      const st = (g.stage_tags as string[]) ?? [];
      const sec = (g.sector_tags as string[]) ?? [];
      const stageOK = !stage || st.length === 0 || st.includes(stage);
      const sectorOK = !sectorTags?.length || sec.length === 0 || sec.some((s) => sectorTags.includes(s));
      return stageOK && sectorOK;
    });
    if (filtered.length >= 5) rows = filtered;
  }
  return rows;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const input = await req.json() as Req;
    if (!input.country) {
      return new Response(JSON.stringify({ grants: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const candidates = await fetchGrants(input.country, input.stage, input.sectorTags);
    if (candidates.length === 0) {
      return new Response(JSON.stringify({ grants: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `User profile:
- Idea: ${input.idea ?? "n/a"}
- Business type: ${input.businessType ?? "n/a"}
- Stage: ${input.stage ?? "n/a"}
- Sectors: ${(input.sectorTags ?? []).join(", ") || "n/a"}
- Funding range: ${input.fundingMin ?? "?"}–${input.fundingMax ?? "?"}
- Country: ${input.country}

Candidate grants:
${candidates.map((g, i) => `[${i}] id=${g.id} ${g.name} by ${g.funder} | amount ${g.amount_min}–${g.amount_max} ${g.currency} | tags: stage=${(g.stage_tags as string[]).join(",")} sector=${(g.sector_tags as string[]).join(",")} eligibility=${(g.eligibility_tags as string[]).join(",")} | req: ${(g.requirements_text as string ?? "").slice(0, 240)}`).join("\n")}

For each candidate return JSON: {"scores":[{"id":"<grant id>","fitScore":<0-100>,"fitReason":"<one short sentence (max 22 words)>"}]}.
Score honestly: 85-100 = strong fit, 65-84 = good, 40-64 = partial, <40 = weak. Cite the user's specific inputs in fitReason.`;

    let scores: Array<{ id: string; fitScore: number; fitReason: string }> = [];
    try {
      const raw = await callAI([
        { role: "system", content: "Return only valid JSON." },
        { role: "user", content: prompt },
      ]);
      scores = JSON.parse(raw).scores ?? [];
    } catch (e) {
      console.error("AI scoring failed", e);
    }

    const scoreMap = new Map(scores.map((s) => [s.id, s]));
    const enriched = candidates.map((g) => {
      const s = scoreMap.get(g.id as string);
      return { ...g, fitScore: s?.fitScore ?? 50, fitReason: s?.fitReason ?? "" };
    }).sort((a, b) => (b.fitScore ?? 0) - (a.fitScore ?? 0));

    return new Response(JSON.stringify({ grants: enriched }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("match-grants error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
