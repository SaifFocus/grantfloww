## Goal

Build the **Find Grants → Guided Application** experience using:
- **Firecrawl** (connector) to pull real, current grant listings from a curated set of **free, public** grant portals.
- **Lovable AI** (no extra key) to rank/filter results against the user's idea and to power the 5-step application wizard.

No Perplexity, no paid search APIs, no per-user API keys.

## Free sources we'll target

A small, reliable starter set — all free, no login required:

1. **Grants.gov** — `https://www.grants.gov/search-grants` (US federal grants)
2. **EU Funding & Tenders Portal** — `https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-search` (EU grants)
3. **UK gov.uk grants** — `https://www.gov.uk/search/grants` (UK grants)
4. **Innovate UK / UKRI** — `https://www.ukri.org/opportunity/` (UK innovation funding)

We start with these four. Easy to add more later by editing one config array.

## How it works

```text
User clicks "Find matching grants" in new Grants tab
        │
        ▼
Edge fn: find-grants
   1. Take user inputs (idea, market, businessType, fundingGoal, stage, needs)
   2. Lovable AI → produce 3–5 short search queries + region hints
   3. For each (source, query):
        Firecrawl /v2/search  (scoped via `site:` to the free portal)
        → returns titles, URLs, snippets
   4. Deduplicate + cap to ~20 candidates
   5. For top ~8 candidates: Firecrawl /v2/scrape (markdown, onlyMainContent)
   6. Lovable AI → rank + extract structured fields per grant:
        { name, funder, amount, deadline, region, eligibility[], fitReason, sourceUrl }
   7. Return top 6 as JSON
        │
        ▼
GrantsTab renders cards (skeleton while loading)
        │
        ▼
"Write application →" opens ApplicationWizard
        │
        ▼
5-step wizard (Eligibility · Project · Impact · Budget · Review)
   - Each step: AI-drafted answer, editable, "Improve with AI" per field
   - Edge fn: draft-application-step (Lovable AI only, no Firecrawl)
   - Final step: preview + Copy + Download .md
   - Progress saved to localStorage (no auth, no DB)
```

## What gets built

**Connector**
- Link **Firecrawl** connector (one click, you'll be prompted).

**Edge functions** (`supabase/functions/`)
- `find-grants/index.ts` — orchestrates AI query gen → Firecrawl search → Firecrawl scrape → AI ranking. Returns `{ grants: [...] }`.
- `draft-application-step/index.ts` — Lovable AI, takes `{ grant, userInput, step, previousAnswers }`, returns drafted/refined section.

**Frontend** (`src/components/grantflow/`)
- `GrantsTab.tsx` — tab body, "Find matching grants" CTA, loading skeletons, empty state.
- `GrantCard.tsx` — one result card (name, funder, amount, deadline, fit reason, source link, "Write application").
- `ApplicationWizard.tsx` — full-screen dialog with 5-step stepper, per-field AI assist, final review + export to clipboard / `.md`.
- `applicationSteps.ts` — the 5 step definitions (questions, hints, target word counts).
- `grantSources.ts` — the free-portal config (name, base URL, region tags).

**Wiring**
- Add `"grants"` tab to `OutputSection.tsx` between "grant" and "roadmap".
- Persist `{ grants, draftAnswers }` in `localStorage`, keyed by hash of user inputs, so refresh doesn't wipe progress.

## Honest limitations

- Firecrawl free tier has limits — heavy use will eventually hit 402; we'll surface a clear message and the `LOVABLE50` coupon hint (since the connection is managed).
- Free portals don't always expose machine-readable deadlines; AI extraction is best-effort, so each card shows the **source link** for the user to verify before applying.
- Coverage is only as wide as the source list — easy to grow later.

## What you need to do

1. Approve this plan.
2. When prompted, authorize the **Firecrawl** connector.
3. That's it — no API keys to paste, no accounts to create.
