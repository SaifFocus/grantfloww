## Goal

Add a **"Find Grants"** experience to GrantFlow AI that:
1. **Discovers real grants** matching the user's idea, market, business type, and funding goal — pulled from live sources, not a hard-coded list.
2. **Recommends a shortlist** with name, funder, amount, deadline, eligibility fit, and a "why this matches you" line.
3. **Walks the user through writing the application** for any selected grant, step-by-step, AI-guided, with editable answers and a final exportable draft.

## What to integrate (and what's already in place)

You already have:
- **Lovable Cloud** (Supabase) — used for edge functions
- **Lovable AI Gateway** (`LOVABLE_API_KEY`) — used for Bob and Expand-with-AI

To make grant *discovery* return real, current results (not made-up names), one of these needs to be added:

| Option | What it does | Cost / setup |
|---|---|---|
| **Perplexity connector** (recommended) | One call returns AI-summarized grant matches with real source URLs and citations. Best fit because grants are a "live web research" task. | Connector — you'd just authorize it. Has its own usage cost. |
| **Firecrawl connector** | Lets us scrape specific grant portals (EU Funding & Tenders, Vinnova, gov.uk, etc.). More work, more brittle. | Connector — authorize + write scraping logic per source. |
| **AI-only (no integration)** | Use the existing Lovable AI to *generate* grant suggestions from its training data. Fast, free-ish, but may hallucinate names/amounts and won't know 2026 deadlines. | None. |

**Recommendation:** add the **Perplexity** connector. It's the cleanest fit — grant discovery is exactly what its grounded-search model is built for, and we get real source links to show under each suggestion. Application *writing* keeps using Lovable AI (no extra cost, no hallucination risk since we're writing, not researching).

If you'd rather not add a connector, we can ship the same UI powered by Lovable AI alone and clearly label results as "AI-suggested — verify before applying." Just say the word.

## UX flow

```text
Generator (existing)
   │ generates plan + saves user inputs
   ▼
Output tabs (existing)
   │ NEW tab: "Grants"  ← appears between Grant Draft and Roadmap
   ▼
Grants tab
   ├─ "Find matching grants" button
   │     ↓ calls find-grants edge function (Perplexity)
   ├─ Loading skeleton (4 cards)
   └─ Result cards:
        ┌─────────────────────────────────────┐
        │ EU Horizon Europe — EIC Accelerator │
        │ Up to €2.5M · Deadline: 12 Mar 2026 │
        │ "Why this fits: cross-border SME…"  │
        │ [source link]   [Write application →]│
        └─────────────────────────────────────┘

Click "Write application →"
   ▼
Guided Application modal (full-screen on mobile)
   ├─ Stepper: 1 Eligibility · 2 Project · 3 Impact · 4 Budget · 5 Review
   ├─ Each step:
   │     • Question + helper text from AI
   │     • Pre-filled draft answer (AI uses user's idea + grant context)
   │     • Editable textarea
   │     • "Improve with AI" button per field
   └─ Final step:
        • Compiled application preview
        • "Copy to clipboard" + "Download as .md"
        • Toast: "Saved locally — come back any time"
```

## Technical breakdown

**New edge functions**
- `find-grants` — takes `{ idea, businessType, market, fundingGoal, stage, needs }`, calls Perplexity (`sonar-pro`) with a strict JSON schema, returns `{ grants: [{ name, funder, amount, deadline, region, fitReason, sourceUrl, eligibility[] }] }`.
- `draft-application-step` — takes `{ grant, userInput, step, previousAnswers }`, calls Lovable AI to produce/refine one section at a time. Streams response.

**New components**
- `src/components/grantflow/GrantsTab.tsx` — tab body, list of grant cards, loading state.
- `src/components/grantflow/GrantCard.tsx` — single result card.
- `src/components/grantflow/ApplicationWizard.tsx` — modal/dialog with stepper, per-field "Improve with AI", final review + export.
- `src/components/grantflow/applicationSteps.ts` — the 5 step definitions (questions, hints, target word counts).

**Wiring**
- Add `"grants"` tab to `OutputSection.tsx` between "grant" and "roadmap".
- Persist found grants + draft answers in `localStorage` keyed by user input hash, so refresh doesn't wipe progress (still no auth, still no DB).
- Bob already knows the user's inputs — he can also answer "what should I write for impact?" naturally.

**Error handling**
- 429 / 402 from Perplexity → toast "Search busy, try again" / "Credits exhausted."
- Empty results → friendly empty state with a "Loosen filters" suggestion.
- All AI prompts kept server-side per existing pattern.

## What I need from you

Pick one:

1. **Add Perplexity** (recommended) — I'll trigger the connector flow, then build everything above.
2. **Skip the connector, AI-only** — same UX, results labeled as AI-suggested; you can add Perplexity later.
3. **Use Firecrawl** to scrape specific grant sites — slower to build, narrower coverage; only worth it if you have specific portals in mind.

Tell me which option (and any specific grant portals you care about if option 3) and I'll build it.
