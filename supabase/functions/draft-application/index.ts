// draft-application — uses Lovable AI to draft a full multi-section grant application
// and upserts it into user_applications.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const SECTIONS = [
  "Executive Summary",
  "Problem Statement",
  "Proposed Solution",
  "Impact & Outcomes",
  "Budget Justification",
  "Team & Qualifications",
];

interface Req {
  grantId: string;
  userProfile: {
    idea?: string;
    businessType?: string;
    market?: string;
    fundingGoal?: string;
    stage?: string;
  };
  fitScore?: number;
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Identify user
    const userResp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SERVICE_KEY, Authorization: authHeader },
    });
    if (!userResp.ok) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const userData = await userResp.json();
    const userId = userData.id as string;

    const { grantId, userProfile, fitScore } = await req.json() as Req;

    // Fetch grant
    const gr = await fetch(`${SUPABASE_URL}/rest/v1/grants?id=eq.${grantId}&select=*`, {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    });
    const grants = await gr.json() as Array<Record<string, unknown>>;
    if (!grants.length) return new Response(JSON.stringify({ error: "grant not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const grant = grants[0];

    // Generate sections
    const prompt = `Draft a grant application for "${grant.name}" by ${grant.funder} in ${grant.country}.
Grant requirements: ${grant.requirements_text ?? "n/a"}
Amount range: ${grant.amount_min}–${grant.amount_max} ${grant.currency}

Applicant profile:
- Idea: ${userProfile.idea ?? "n/a"}
- Business type: ${userProfile.businessType ?? "n/a"}
- Market: ${userProfile.market ?? "n/a"}
- Funding goal: ${userProfile.fundingGoal ?? "n/a"}
- Stage: ${userProfile.stage ?? "n/a"}

Write the following sections, mirroring the language style and priorities of ${grant.funder}:
${SECTIONS.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Each section must be 2-4 short paragraphs, specific to this applicant and grant. Return JSON:
{"sections":[{"title":"Executive Summary","content":"..."},{"title":"Problem Statement","content":"..."}, ...]}`;

    let sections: Array<{ title: string; content: string }> = [];
    try {
      const raw = await callAI([
        { role: "system", content: "You are an expert grant writer. Return only valid JSON." },
        { role: "user", content: prompt },
      ]);
      sections = JSON.parse(raw).sections ?? [];
    } catch (e) {
      console.error("AI draft failed", e);
      return new Response(JSON.stringify({ error: "AI draft failed" }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Insert user_applications row
    const insertResp = await fetch(`${SUPABASE_URL}/rest/v1/user_applications`, {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        user_id: userId,
        grant_id: grantId,
        grant_name: grant.name,
        funder: grant.funder,
        status: "drafting",
        idea_snapshot: userProfile,
        draft_content: { sections },
        fit_score: fitScore ?? null,
      }),
    });
    const inserted = await insertResp.json();
    if (!insertResp.ok) {
      console.error("insert failed", inserted);
      return new Response(JSON.stringify({ error: "insert failed", detail: inserted }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const application = Array.isArray(inserted) ? inserted[0] : inserted;
    return new Response(JSON.stringify({ applicationId: application.id, sections }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("draft-application error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
