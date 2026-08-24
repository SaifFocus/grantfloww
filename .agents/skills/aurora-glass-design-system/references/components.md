# Component recipes

## Blobs — ambient blurred color field

Drop inside any `relative overflow-hidden` section, before content (`z-0`).

```tsx
const Blobs = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="blob animate-blob-float" style={{ top: "-10%", left: "-5%", width: 520, height: 520, background: "hsl(var(--brand-pink) / 0.55)" }} />
    <div className="blob animate-blob-float" style={{ top: "10%", right: "-10%", width: 560, height: 560, background: "hsl(var(--brand-purple) / 0.5)", animationDelay: "-6s" }} />
    <div className="blob animate-blob-float" style={{ bottom: "-10%", left: "30%", width: 480, height: 480, background: "hsl(var(--brand-orange) / 0.45)", animationDelay: "-12s" }} />
    <div className="blob animate-blob-float" style={{ bottom: "20%", right: "20%", width: 380, height: 380, background: "hsl(var(--brand-blue) / 0.35)", animationDelay: "-3s" }} />
  </div>
);

export default Blobs;
```

## GlassShapes — floating iridescent 3D objects

Requires three transparent PNGs in `src/assets/`. Generate with an image model:

- `glass-bubble-pink.png` — "A soft pink iridescent glass sphere on a clean white background, photorealistic 3D render, caustics, soft highlights"
- `glass-bubble-small.png` — "A small pearlescent glass bubble on a clean white background, photorealistic 3D render"
- `glass-star.png` — "A four-point rounded glass sparkle shape, purple-pink iridescent, on a clean white background, photorealistic 3D render"

Use transparent background output for all three.

```tsx
import bubblePink from "@/assets/glass-bubble-pink.png";
import bubbleSmall from "@/assets/glass-bubble-small.png";
import star from "@/assets/glass-star.png";

type Variant = "hero" | "transition" | "subtle";

interface Shape { src: string; alt: string; className: string; style?: React.CSSProperties }

const presets: Record<Variant, Shape[]> = {
  hero: [
    { src: bubblePink, alt: "", className: "absolute -left-24 top-1/3 w-[280px] md:w-[360px] opacity-90 animate-glass-float drop-shadow-[0_30px_60px_rgba(236,120,170,0.25)]", style: { animationDelay: "-2s" } },
    { src: star, alt: "", className: "absolute right-[-60px] top-24 w-[220px] md:w-[300px] opacity-95 animate-glass-float drop-shadow-[0_30px_60px_rgba(167,139,250,0.3)]", style: { animationDelay: "-7s", transform: "rotate(15deg)" } },
    { src: bubbleSmall, alt: "", className: "hidden md:block absolute right-10 bottom-8 w-[140px] opacity-85 animate-glass-float", style: { animationDelay: "-12s" } },
    { src: bubbleSmall, alt: "", className: "hidden lg:block absolute left-1/3 -bottom-10 w-[110px] opacity-80 animate-glass-float", style: { animationDelay: "-4s" } },
  ],
  transition: [
    { src: bubbleSmall, alt: "", className: "absolute left-[6%] top-1/2 -translate-y-1/2 w-[90px] md:w-[120px] opacity-80 animate-glass-float" },
    { src: star, alt: "", className: "hidden md:block absolute right-[8%] top-1/2 -translate-y-1/2 w-[110px] opacity-90 animate-glass-float", style: { animationDelay: "-6s", transform: "rotate(-12deg) translateY(-50%)" } },
  ],
  subtle: [
    { src: bubbleSmall, alt: "", className: "absolute right-[10%] top-1/2 -translate-y-1/2 w-[80px] opacity-70 animate-glass-float" },
  ],
};

const GlassShapes = ({ variant = "transition", className = "" }: { variant?: Variant; className?: string }) => (
  <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-visible z-0 ${className}`}>
    {presets[variant].map((s, i) => (
      <img key={i} src={s.src} alt={s.alt} loading="lazy" className={s.className} style={s.style} />
    ))}
  </div>
);

export default GlassShapes;
```

## Reveal — scroll entrance wrapper

```tsx
import { useEffect, useRef, useState, type ReactNode } from "react";

const Reveal = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setInView(true), delay);
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return <div ref={ref} className={`reveal ${inView ? "in-view" : ""} ${className}`}>{children}</div>;
};

export default Reveal;
```

## Bridge — glassy section transition

```tsx
const Bridge = ({ delay = "0s" }: { delay?: string }) => (
  <div className="relative h-24 md:h-32 -my-12 md:-my-16 overflow-visible">
    <GlassShapes variant="transition" />
    <span className="sr-only" style={{ animationDelay: delay }} />
  </div>
);
```

Place one between every pair of sections, cycling delays `0s / -3s / -6s / -9s`.

## Floating pill navbar

```tsx
<header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1180px,calc(100%-2rem))]">
  <nav className="glass-strong rounded-full px-5 py-2.5 flex items-center justify-between gap-3">
    {/* logo: gradient rounded square + wordmark with .gradient-text-brand accent */}
  </nav>
</header>
```

## Hero headline

```tsx
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle text-xs text-muted-foreground mb-6 animate-fade-in">
  <span className="w-1.5 h-1.5 rounded-full bg-gradient-primary" />
  Badge text
</div>
<h1 className="font-serif text-5xl md:text-7xl leading-[1.05] text-balance mb-6 animate-fade-in-up">
  First line
  <br />
  <span className="gradient-text-brand italic">Emphasis line</span>
</h1>
<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
  Subtitle
</p>
```

## Buttons

```tsx
{/* Primary */}
<Button size="lg" className="rounded-full bg-gradient-primary text-white border-0 hover:opacity-95 px-7 h-12 shadow-lg shadow-primary/20 group">
  Label <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
</Button>

{/* Secondary */}
<Button variant="ghost" size="lg" className="rounded-full glass border-0 px-7 h-12 hover:bg-white/80">Label</Button>
```

## Cards

```tsx
{/* Feature card */}
<div className="glass-subtle rounded-2xl p-4 lift">
  <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center mb-3 shadow-sm">
    <Icon className="w-4 h-4 text-white" />
  </div>
  <div className="text-xs font-medium text-muted-foreground mb-1">Label</div>
  <p className="text-sm text-foreground/90 leading-snug">Body</p>
</div>

{/* Showcase panel with gradient halo */}
<div className="relative">
  <div className="absolute -inset-8 bg-gradient-primary opacity-20 blur-3xl rounded-[3rem]" />
  <div className="relative glass-strong rounded-3xl p-6 md:p-8">…</div>
</div>
```

## States

- Loading skeleton: `animate-pulse bg-white/30 rounded-2xl`
- Error card: `bg-red-50/60 border border-red-200/60 rounded-2xl p-4` with a red icon
- Icons: `lucide-react`, `strokeWidth={2}`–`2.5`, sized `w-4 h-4` in pills, `w-5 h-5` in cards
