// Expand a rough business idea into a richer, structured description.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert startup coach for GrantFlow AI.
Your job: take a user's ROUGH business idea and expand it into a clearer,
more compelling 3–5 sentence paragraph that the user can paste into a
business idea field.

Rules:
- Stay faithful to the user's original concept — do NOT invent a new business.
- Sharpen the WHO (target customer), WHAT (offering), WHERE (market/geography
  if hinted), and WHY (the problem solved or value created).
- If the user provided a business type, market, funding goal, stage, or needs,
  weave them in naturally.
- Plain prose only. No bullet points, no headings, no markdown, no quotes,
  no preface like "Here is your expanded idea:". Just the paragraph itself.
- 3–5 sentences. Around 60–110 words. Concrete and specific, not generic.
- Match the user's language (reply in the same language they wrote in).`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea, businessType, market, fundingGoal, stage, needs } =
      await req.json();

    if (!idea || typeof idea !== "string" || !idea.trim()) {
      return new Response(
        JSON.stringify({ error: "Please write a short idea first." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const needsArr = Array.isArray(needs) ? (needs as string[]) : [];
    const userBlock = `ORIGINAL IDEA:
"""
${idea.trim().slice(0, 1500)}
"""

CONTEXT (use only if helpful, ignore empty fields):
- Business type: ${businessType || "(not provided)"}
- Market / country: ${market || "(not provided)"}
- Funding goal: ${fundingGoal || "(not provided)"}
- Current stage: ${stage || "(not provided)"}
- Needs help with: ${needsArr.length ? needsArr.join(", ") : "(not provided)"}

Now write the expanded idea paragraph.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userBlock },
          ],
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests — please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Couldn't expand the idea right now." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    let expanded: string = data?.choices?.[0]?.message?.content ?? "";
    expanded = expanded.trim().replace(/^["']|["']$/g, "").trim();

    return new Response(
      JSON.stringify({ expanded }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("expand-idea error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
