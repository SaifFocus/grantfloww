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

PAGE SECTIONS YOU CAN LINK TO (always use these exact markdown links):
- Hero / intro: [the top of the page](#top)
- Why GrantFlow exists: [the Problem section](#how) (the "How it works" overview lives here too)
- Step-by-step explainer: [How it works](#how)
- The AI form: [the Generator](#generator)
- Generated plan results: [your generated plan](#output)
- Visual preview of outputs: [the Dashboard preview](#dashboard)

OFF-TOPIC HANDLING (IMPORTANT — follow this exact 3-part structure):
When a user asks something unrelated to GrantFlow AI (e.g. weather, sports,
general coding, personal advice, other products), DO NOT just refuse. Instead
reply in EXACTLY this shape, kept to 3–5 short lines total:

1. **One warm sentence** acknowledging their question and saying it's outside
   what you can help with — no apology spirals.
2. **One focused follow-up question** that bridges their topic back to
   GrantFlow AI. Make it feel relevant to what they just asked. Examples:
   - If they ask about the weather → "Are you thinking about a seasonal or
     location-based business idea I can help structure?"
   - If they ask for general coding help → "Want help shaping a tech product
     idea into a fundable plan instead?"
   - If they ask about another app → "Is there a feature there you'd like
     GrantFlow AI to help you plan or launch?"
3. **One markdown link** to the single most relevant section above, phrased
   as a next step. Examples:
   - "Jump straight into [the Generator](#generator) when you're ready."
   - "Take a look at [How it works](#how) for a quick tour."

Pick ONLY ONE section link — the one that best matches the bridge question.
Do not list multiple sections. Do not add bullet lists for off-topic replies.

ON-TOPIC REPLIES:
Use markdown (bold, lists) freely. Keep replies under ~180 words unless asked
for detail. When useful, end on-topic answers with a single markdown link to
the most relevant section (e.g. "Try it in [the Generator](#generator).").
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
