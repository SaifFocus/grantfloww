import { useEffect, useState } from "react";

interface Props {
  score: number;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { px: 56, stroke: 6, font: "text-sm" },
  md: { px: 80, stroke: 7, font: "text-lg" },
  lg: { px: 110, stroke: 9, font: "text-2xl" },
};

const FitScoreRing = ({ score, size = "sm" }: Props) => {
  const cfg = SIZES[size];
  const r = (cfg.px - cfg.stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgress(clamped), 50);
    return () => clearTimeout(t);
  }, [clamped]);

  const offset = c - (progress / 100) * c;
  const gradId = `fsr-${size}`;

  return (
    <div className="relative inline-grid place-items-center" style={{ width: cfg.px, height: cfg.px }}>
      <svg width={cfg.px} height={cfg.px} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-purple))" />
            <stop offset="60%" stopColor="hsl(var(--brand-pink))" />
            <stop offset="100%" stopColor="hsl(var(--brand-orange))" />
          </linearGradient>
        </defs>
        <circle cx={cfg.px / 2} cy={cfg.px / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={cfg.stroke} />
        <circle
          cx={cfg.px / 2} cy={cfg.px / 2} r={r} fill="none"
          stroke={`url(#${gradId})`} strokeWidth={cfg.stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 800ms cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className={`absolute inset-0 grid place-items-center ${cfg.font} font-bold`}>
        {clamped}
      </div>
    </div>
  );
};

export default FitScoreRing;
