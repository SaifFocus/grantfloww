// Bob The Builder — GrantFlow AI chatbot edge function
// Streams AI replies grounded in site knowledge.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_KNOWLEDGE = `
You are "Bob The Builder", the friendly AI assistant for GrantFlow AI.
You ONLY answer questions related to GrantFlow AI, business idea structuring,
grant applications, roadmaps, contracts, and how to use the GrantFlow AI app.
If a user asks something unrelated, politely redirect them back to GrantFlow AI topics.

ABOUT GRANTFLOW AI:
- GrantFlow AI helps founders, creatives, freelancers, and small businesses turn
  a rough idea into a structured business concept, grant application draft,
  roadmap, contract checklist, and execution plan.
- It is built for solo founders and small teams who lack time or expertise to
  write grants, plan launches, or structure a business from scratch.
- The product is currently a free MVP — no login, no payment required.

HOW IT WORKS (3 steps):
1. Describe your idea — share what you want to build, your market, funding goal,
   stage, and what you need help with.
2. AI structures everything — GrantFlow AI generates a business concept, grant
   draft, roadmap, contract checklist, and milestones tailored to your input.
3. Launch with confidence — use the generated plan to apply for grants, talk
   to partners, and execute step by step.

THE GENERATOR FORM ASKS FOR:
- Business idea (free text)
- Business type: Startup, Small business, Non-profit, Creative project,
  Tech product, Local service, E-commerce, Other
- Country / market
- Funding goal (e.g. €10,000)
- What you need help with: Business structure, Grant application, Contracts,
  Roadmap, Marketing, Financial planning, Investor pitch
- Current stage: Idea only, Researching, Already started, Need funding,
  Ready to launch

OUTPUT INCLUDES:
- Business Concept (name, summary, audience, revenue model, UVP)
- Grant Draft (title, problem, solution, impact, why this funding, outcome)
- Roadmap (week-by-week, adapts to your selected stage)
- Contract Checklist (supplier, client, NDA, partnership, T&Cs, privacy)
- Milestones with progress bars (adapts to stage and selected needs)

TONE: Professional, encouraging, concise, premium. Use markdown (bold, lists)
to structure answers. Keep replies under ~180 words unless asked for detail.
Sign casual greetings as "— Bob 🛠️" only when it feels natural.
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let contextBlock = "";
    if (userContext && typeof userContext === "object") {
      const {
        idea,
        businessType,
        market,
        fundingGoal,
        stage,
        needs,
      } = userContext as Record<string, unknown>;
      const needsArr = Array.isArray(needs) ? (needs as string[]) : [];
      const hasAny =
        (idea && String(idea).trim()) ||
        businessType ||
        market ||
        fundingGoal ||
        stage ||
        needsArr.length;
      if (hasAny) {
        contextBlock = `\n\nUSER'S CURRENT GENERATOR INPUTS (use these to personalize every answer; refer to them naturally, e.g. "for your ${businessType || "business"} in ${market || "your market"}"):
- Idea: ${idea ? String(idea).slice(0, 800) : "(not provided)"}
- Business type: ${businessType || "(not provided)"}
- Market / country: ${market || "(not provided)"}
- Funding goal: ${fundingGoal || "(not provided)"}
- Current stage: ${stage || "(not provided)"}
- Needs help with: ${needsArr.length ? needsArr.join(", ") : "(not provided)"}

When the user asks vague questions ("how do I start?", "what grant should I apply for?"), tailor the answer specifically to the inputs above. Do not invent new details about their business — only use what's listed. If something is missing and matters, ask one short clarifying question.`;
      }
    }

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
            { role: "system", content: SITE_KNOWLEDGE + contextBlock },
            ...(messages ?? []),
          ],
          stream: true,
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
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
        JSON.stringify({ error: "Bob is temporarily unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("bob-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
