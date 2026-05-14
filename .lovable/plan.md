## Add glassy 3D decorative shapes across the site

Add the same translucent, iridescent glass objects from the reference (soft pink bubbles + the 4-point glassy star/sparkle) as floating decorations around the hero and between every section to create smooth visual transitions.

### Approach

1. **Generate 3 transparent PNG assets** with `imagegen` (transparent background, premium quality for clean edges):
   - `glass-bubble-pink.png` — large soft pink/peach iridescent sphere
   - `glass-bubble-small.png` — smaller pearlescent bubble
   - `glass-star.png` — the 4-point rounded glassy sparkle (purple/pink iridescent)

2. **Create a reusable `GlassShapes` component** (`src/components/grantflow/GlassShapes.tsx`) that renders absolutely-positioned shape images with:
   - Configurable variant (`hero`, `transition`, `subtle`)
   - Gentle float animation (reuse `animate-blob-float` or new `glass-float` keyframe with rotation)
   - `pointer-events-none`, responsive sizing, hidden on small screens for the larger ones
   - Parallax-style placement: peeking from page edges

3. **Place shapes**:
   - **Hero**: large pink bubble bottom-left, glass star top-right, small bubble mid-left (matching the reference)
   - **Between sections**: small `transition` clusters bridging Hero→Problem, Problem→HowItWorks, HowItWorks→Generator, Generator→Dashboard, Dashboard→Footer — placed in a thin wrapper with negative margin so they overlap the section boundary and create the "smooth transit" feel
   - Vary scale/rotation/opacity per placement so it doesn't feel repetitive

4. **Animation polish**: add a `glass-float` keyframe (subtle Y translate + slow rotate, 14–22s) in `tailwind.config.ts` and stagger delays.

5. **Z-index hygiene**: shapes sit above section background but below content (`-z-0` with content `relative z-10`). Make sure they don't intercept clicks.

### Files to create
- `src/assets/glass-bubble-pink.png`
- `src/assets/glass-bubble-small.png`
- `src/assets/glass-star.png`
- `src/components/grantflow/GlassShapes.tsx`

### Files to edit
- `src/pages/Index.tsx` — insert `<GlassShapes variant="transition" />` between sections
- `src/components/grantflow/Hero.tsx` — add hero shape cluster
- `tailwind.config.ts` — add `glass-float` keyframe/animation
- (optional) `src/index.css` — small utility for the parallax wrapper

### Notes
- All decorative — no logic/data changes.
- Existing colored `Blobs` stay (they provide the background glow); glass shapes layer on top for depth.
- Skipping shapes on `sm` breakpoint where they'd crowd content.
