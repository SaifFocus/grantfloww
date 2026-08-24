---
name: aurora-glass-design-system
description: Premium macOS-style glassmorphism design system (aurora blob background, frosted glass cards, Instrument Serif + Inter, purple/pink/orange gradient). Use when building or restyling a site with this look, or when the user asks for "the GrantFlow theme", "my glassy design", or "aurora glass".
---

# Aurora Glass design system

Light-first, airy, premium AI-SaaS. Near-white warm background washed with soft pink/purple/orange aurora gradients, floating blurred blobs and iridescent 3D glass shapes, and frosted glossy cards with an inner sheen. Serif display headlines against clean Inter body text.

## Non-negotiable rules

1. **Semantic tokens only.** Colors, gradients and shadows come from CSS variables in `src/index.css` used via Tailwind (`bg-background`, `text-muted-foreground`, `bg-gradient-primary`). Never `text-white` on surfaces, `bg-black`, or raw hex utilities in components. The one allowed exception is `text-white` *inside* a `bg-gradient-primary` pill/icon, where contrast is fixed by design.
2. **Glass, not flat.** Any raised surface uses `.glass`, `.glass-strong`, or `.glass-subtle` — never `bg-card` alone. These utilities carry the sheen pseudo-element; don't reimplement them per component.
3. **One warm gradient family.** Purple → pink → orange (`--gradient-primary`). Blue is an ambient blob accent only. No teal/green/indigo additions.
4. **Serif for display, Inter for everything else.** `font-serif` (Instrument Serif) on h1/h2 and hero numbers; italic serif for the emphasized half of a headline, tinted with `.gradient-text-brand`.
5. **Big radii.** `--radius: 1.25rem`. Cards `rounded-2xl` / `rounded-[2rem]`, buttons and pills `rounded-full`, nav is a floating pill.
6. **Motion is gentle and slow.** 16–18s ambient float loops, 0.6–0.8s entrances, 300ms hover lift. Nothing snappy or bouncy.

## Typography

| Role | Family | Tailwind |
| --- | --- | --- |
| Display headlines | Instrument Serif | `font-serif` (`text-5xl md:text-7xl leading-[1.05]`) |
| Body / UI | Inter | `font-sans` (default) |
| Meta, badges | Inter 500, `text-xs` | often inside `.glass-subtle` pills |

Load in `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

## Layout rhythm

- Container `max-w-6xl mx-auto px-6`; hero content `max-w-3xl mx-auto text-center`.
- Section padding `py-24 md:py-32`; hero `pt-36 pb-24 md:pt-44 md:pb-32`.
- Sections are transparent — the fixed body aurora shows through. Never paint a section background; add depth with `<Blobs />` and `<GlassShapes />` instead.
- Section transitions use a short `Bridge` strip (`h-24 md:h-32 -my-12 md:-my-16`) holding a `transition` glass-shape cluster.
- Navbar is a fixed floating `.glass-strong` pill: `fixed top-4 left-1/2 -translate-x-1/2 w-[min(1180px,calc(100%-2rem))] rounded-full`.

## Motion

- `blob-float` 18s, `glass-float` 16s — always with negative `animationDelay` per instance so they desync.
- Entrances: `animate-fade-in-up` with staggered `animationDelay` (0.15s / 0.3s / 0.5s).
- Scroll reveals via the `Reveal` IntersectionObserver wrapper + `.reveal` / `.reveal.in-view`.
- Cards get `.lift` (translateY(-4px) + stronger glass shadow on hover).

## Setup order for a new project

1. Paste the token block from `references/tokens.md` into `:root` in `src/index.css`, then the base/components/utilities layers below it.
2. Merge the `theme.extend` block (fonts, keyframes, animations) from `references/tokens.md` into `tailwind.config.ts`.
3. Add the font links to `index.html`.
4. Create `Blobs.tsx`, `GlassShapes.tsx`, and `Reveal.tsx` from `references/components.md`.
5. Generate the three iridescent PNGs (prompts in `references/components.md`) into `src/assets/`.
6. Build sections with glass cards, gradient CTAs, and `Bridge` separators.
