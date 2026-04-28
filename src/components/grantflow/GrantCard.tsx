import { ExternalLink, Calendar, Coins, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GrantResult } from "./grantTypes";

interface Props {
  grant: GrantResult;
  onApply: (g: GrantResult) => void;
}

const scoreStyle = (score: number) => {
  if (score >= 85) return { label: "Excellent fit", ring: "ring-emerald-400/60", text: "text-emerald-700", bg: "from-emerald-500 to-teal-500" };
  if (score >= 65) return { label: "Good fit", ring: "ring-primary/50", text: "text-primary", bg: "from-primary to-accent" };
  if (score >= 40) return { label: "Partial fit", ring: "ring-amber-400/60", text: "text-amber-700", bg: "from-amber-500 to-orange-500" };
  return { label: "Weak fit", ring: "ring-muted-foreground/30", text: "text-muted-foreground", bg: "from-muted-foreground to-muted-foreground" };
};

const GrantCard = ({ grant, onApply }: Props) => {
  const score = typeof grant.fitScore === "number" ? Math.max(0, Math.min(100, Math.round(grant.fitScore))) : null;
  const s = score !== null ? scoreStyle(score) : null;
  return (
    <div className="glass-subtle rounded-2xl p-5 lift flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-serif text-xl leading-tight">{grant.name}</h4>
          <p className="text-sm text-muted-foreground mt-1">{grant.funder}</p>
        </div>
        {score !== null && s && (
          <div className="shrink-0 flex flex-col items-center" title={`${s.label} — ${score}/100`}>
            <div className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${s.bg} grid place-items-center shadow-sm ring-2 ${s.ring} ring-offset-2 ring-offset-white/60`}>
              <span className="text-white font-bold text-lg leading-none">{score}</span>
            </div>
            <span className={`text-[10px] font-medium mt-1 ${s.text}`}>{s.label}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {grant.amount && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/60 border border-white/60">
            <Coins className="w-3 h-3 text-primary" /> {grant.amount}
          </span>
        )}
        {grant.deadline && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/60 border border-white/60">
            <Calendar className="w-3 h-3 text-primary" /> {grant.deadline}
          </span>
        )}
        {grant.region && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/60 border border-white/60">
            <MapPin className="w-3 h-3 text-primary" /> {grant.region}
          </span>
        )}
      </div>

      {grant.fitReason && (
        <div className="text-sm text-foreground/80 flex gap-2">
          <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span><span className="font-medium">Why this fits: </span>{grant.fitReason}</span>
        </div>
      )}

      {grant.eligibility?.length > 0 && (
        <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-0.5">
          {grant.eligibility.slice(0, 3).map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}

      <div className="flex items-center justify-between gap-2 mt-auto pt-2">
        <a
          href={grant.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Source <ExternalLink className="w-3 h-3" />
        </a>
        <Button
          size="sm"
          onClick={() => onApply(grant)}
          className="rounded-xl bg-gradient-primary text-white border-0 hover:opacity-95"
        >
          Write application <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default GrantCard;
