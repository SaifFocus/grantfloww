# Plan: About page, waitlist, popups

## 1. New `/about` route
- Add `src/pages/About.tsx` and register `<Route path="/about">` in `src/App.tsx`.
- Add an "About" link to `Navbar.tsx` (real router link instead of scroll).
- Page sections:
  1. **Hero** — "About GrantFlow AI" + short story: why this project exists (helping Nordic founders/non-profits cut through grant paperwork).
  2. **Beta notice** — clear callout: "This is a public beta. Not all features are live yet, and the product is not officially launched."
  3. **About FOQUS** — paragraph about FOQUS as the Swedish branding, web design, video production and SEO agency behind GrantFlow, with one contextual dofollow link to https://focusbranding.se (anchor: "FOQUS — Swedish branding agency"). Stays within the existing one-contextual-link rule (replaces the footer "Colophon" duplicate if needed; we'll keep footer link as-is and just add this single contextual one).
  4. **The team** — 3 cards for the three mascots: **Tortoise** (e.g. "Head of Strategy"), **Elephant** ("Head of Memory / Knowledge"), **Owl** ("Head of Insight"). Each card uses a generated 3D cartoon character image (suit-wearing) matching the existing glassy/glossy aesthetic.
  5. **Waitlist section** (#waitlist) — headline "Be first when we launch" + email form.
- Reuse existing `GlassShapes`, gradients, and typography for visual consistency.

## 2. 3D mascot images
Generate 3 transparent PNGs in `src/assets/`:
- `mascot-tortoise.png`, `mascot-elephant.png`, `mascot-owl.png`
- Style: glossy 3D cartoon, soft studio lighting, pastel iridescent palette matching existing glass shapes, each wearing a tailored suit, friendly expressions, transparent background.

## 3. Waitlist backend (Lovable Cloud)
- Migration: `waitlist_signups` table — `email` (unique, citext or text+lower), `source` (text, e.g. "page" / "popup"), `created_at`. RLS enabled with **public INSERT** policy only (no SELECT for anon). Add a UNIQUE index on `lower(email)` to dedupe.
- Email confirmation:
  - Use Lovable's built-in email infrastructure.
  - Will trigger `email_domain--check_email_domain_status`; if no domain configured, surface the email-setup dialog before scaffolding.
  - Then `setup_email_infra` + `scaffold_transactional_email`.
  - Create one transactional template `waitlist-confirmation.tsx` ("You're on the GrantFlow AI waitlist").
  - Client invokes `send-transactional-email` after the insert succeeds, with idempotency key `waitlist-{uuid}`.

## 4. Reusable waitlist form component
`src/components/grantflow/WaitlistForm.tsx`:
- Zod-validated email (trim, email, max 255).
- On submit: insert row, call `send-transactional-email`, toast success / "already signed up".
- Used by both the About-page section and the popup.

## 5. Waitlist popup
`src/components/grantflow/WaitlistPopup.tsx`:
- Built on shadcn `Dialog`.
- Trigger: 15s after first visit, once per browser. Persisted via `localStorage` key `gf_waitlist_seen`.
- Mounted globally in `Index.tsx` (so it shows on the homepage; About page already has its own form section).
- Dismiss = remember; submit = remember + close.

## 6. Cookie consent popup
`src/components/grantflow/CookieConsent.tsx`:
- Bottom-fixed glass banner (not a modal blocker).
- Buttons: **Accept**, **Reject**, **Settings** (optional minimal: Accept / Reject only for v1).
- Persists choice in `localStorage` key `gf_cookie_consent` = `accepted|rejected|<timestamp>`.
- Mounted once in `App.tsx` so it appears on every route.
- Shows only if no choice has been recorded; respects choice on reload.
- No analytics scripts are gated yet (none currently exist), but the consent state is exposed via a tiny `useCookieConsent()` hook for future use.

## 7. SEO / meta
- About page sets `<title>About — GrantFlow AI</title>` and meta description via a small per-route head update (lightweight: directly mutate `document.title` + meta tag in a `useEffect`, no new dependency).
- Add `/about` entry to `public/sitemap.xml`.

## Technical notes
- No changes to existing edge functions besides the new transactional email wiring.
- All new UI uses existing semantic Tailwind tokens (no hardcoded colors).
- Footer FOQUS link stays as it is; the About page adds **one** in-context dofollow link to focusbranding.se (within the agreed maximum: footer + about + JSON-LD).
- No auth required for waitlist signup; RLS only allows insert.

## Files to create
- `src/pages/About.tsx`
- `src/components/grantflow/WaitlistForm.tsx`
- `src/components/grantflow/WaitlistPopup.tsx`
- `src/components/grantflow/CookieConsent.tsx`
- `src/assets/mascot-tortoise.png`, `mascot-elephant.png`, `mascot-owl.png`
- `supabase/functions/_shared/transactional-email-templates/waitlist-confirmation.tsx`
- DB migration for `waitlist_signups`

## Files to edit
- `src/App.tsx` (route + CookieConsent mount)
- `src/components/grantflow/Navbar.tsx` (About link)
- `src/pages/Index.tsx` (mount WaitlistPopup)
- `public/sitemap.xml` (add /about)
