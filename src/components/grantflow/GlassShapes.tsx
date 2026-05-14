import bubblePink from "@/assets/glass-bubble-pink.png";
import bubbleSmall from "@/assets/glass-bubble-small.png";
import star from "@/assets/glass-star.png";

type Variant = "hero" | "transition" | "subtle";

interface Shape {
  src: string;
  alt: string;
  className: string;
  style?: React.CSSProperties;
}

const presets: Record<Variant, Shape[]> = {
  hero: [
    {
      src: bubblePink,
      alt: "",
      className:
        "absolute -left-24 top-1/3 w-[280px] md:w-[360px] opacity-90 animate-glass-float drop-shadow-[0_30px_60px_rgba(236,120,170,0.25)]",
      style: { animationDelay: "-2s" },
    },
    {
      src: star,
      alt: "",
      className:
        "absolute right-[-60px] top-24 w-[220px] md:w-[300px] opacity-95 animate-glass-float drop-shadow-[0_30px_60px_rgba(167,139,250,0.3)]",
      style: { animationDelay: "-7s", transform: "rotate(15deg)" },
    },
    {
      src: bubbleSmall,
      alt: "",
      className:
        "hidden md:block absolute right-10 bottom-8 w-[140px] opacity-85 animate-glass-float",
      style: { animationDelay: "-12s" },
    },
    {
      src: bubbleSmall,
      alt: "",
      className:
        "hidden lg:block absolute left-1/3 -bottom-10 w-[110px] opacity-80 animate-glass-float",
      style: { animationDelay: "-4s" },
    },
  ],
  transition: [
    {
      src: bubbleSmall,
      alt: "",
      className:
        "absolute left-[6%] top-1/2 -translate-y-1/2 w-[90px] md:w-[120px] opacity-80 animate-glass-float",
    },
    {
      src: star,
      alt: "",
      className:
        "hidden md:block absolute right-[8%] top-1/2 -translate-y-1/2 w-[110px] opacity-90 animate-glass-float",
      style: { animationDelay: "-6s", transform: "rotate(-12deg) translateY(-50%)" },
    },
  ],
  subtle: [
    {
      src: bubbleSmall,
      alt: "",
      className:
        "absolute right-[10%] top-1/2 -translate-y-1/2 w-[80px] opacity-70 animate-glass-float",
    },
  ],
};

interface Props {
  variant?: Variant;
  className?: string;
}

const GlassShapes = ({ variant = "transition", className = "" }: Props) => {
  const shapes = presets[variant];
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-visible z-0 ${className}`}
    >
      {shapes.map((s, i) => (
        <img
          key={i}
          src={s.src}
          alt={s.alt}
          loading="lazy"
          className={s.className}
          style={s.style}
        />
      ))}
    </div>
  );
};

export default GlassShapes;
