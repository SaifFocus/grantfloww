// draft-application-step — Lovable AI drafts/refines one wizard section.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { grant, userInput, step, previousAnswers, currentAnswer, mode } = await req.json();
    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) throw new Error("LOVABLE_API_KEY missing");

    const isImprove = mode === "improve" && currentAnswer;

    const sys = `You write strong, concise grant application sections. Plain prose, no headings, no markdown. Stay grounded in the user's real inputs — do not invent facts (numbers, partners, dates). If a fact is missing, write a clear placeholder in [brackets].`;

    const user = `GRANT:
${JSON.stringify(grant, null, 2)}

USER PROFILE:
${JSON.stringify(userInput, null, 2)}

PREVIOUS ANSWERS:
${JSON.stringify(previousAnswers ?? {}, null, 2)}

CURRENT STEP: "${step.title}"
QUESTION: ${step.question}
GUIDANCE: ${step.hint}
TARGET LENGTH: ~${step.words} words

${isImprove ? `EXISTING DRAFT TO IMPROVE:\n${currentAnswer}\n\nReturn an improved version — clearer, more specific, same length range.` : `Write the answer now.`}`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
      }),
    });
    if (!r.ok) {
      if (r.status === 429) return new Response(JSON.stringify({ error: "Rate limit — try again soon." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (r.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await r.text();
      throw new Error(`AI ${r.status}: ${t}`);
    }
    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content?.trim() ?? "";
    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("draft-application-step error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
