import { useState } from "react";
import { ExternalLink, Heart, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FitScoreRing from "./FitScoreRing";
import { flagFor } from "./CountrySelector";

export interface GrantRow {
  id: string;
  name: string;
  funder: string;
  country: string;
  amount_min: number | null;
  amount_max: number | null;
  currency: string | null;
  deadline: string | null;
  eligibility_tags: string[];
  sector_tags: string[];
  stage_tags: string[];
  requirements_text: string | null;
  application_url: string | null;
  fitScore?: number;
  fitReason?: string;
}

interface Props {
  grant: GrantRow;
  saved?: boolean;
  onSave?: (g: GrantRow) => void;
  onDraft?: (g: GrantRow) => void;
  drafting?: boolean;
  variant?: "full" | "compact";
}

const formatAmount = (g: GrantRow) => {
  if (!g.amount_min && !g.amount_max) return "Varies";
  const f = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${Math.round(n/1000)}K` : `${n}`;
  const c = g.currency ?? "EUR";
  if (g.amount_min && g.amount_max) return `${c} ${f(g.amount_min)}–${f(g.amount_max)}`;
  return `Up to ${c} ${f((g.amount_max ?? g.amount_min) as number)}`;
};

const deadlineColor = (d: string | null) => {
  if (!d || d.toLowerCase() === "rolling") return "bg-emerald-100/70 text-emerald-700";
  return "bg-amber-100/70 text-amber-700";
};

const GrantCardNew = ({ grant, saved, onSave, onDraft, drafting, variant = "full" }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative glass-subtle rounded-2xl overflow-hidden flex flex-col">
      <div className="h-[2px] bg-gradient-primary" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{flagFor(grant.country)}</span>
              <span className="truncate">{grant.funder}</span>
            </div>
            <h4 className="font-serif text-xl leading-tight mt-1">{grant.name}</h4>
          </div>
          {typeof grant.fitScore === "number" && (
            <div className="shrink-0">
              <FitScoreRing score={grant.fitScore} size="sm" />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-white/60 border border-white/60 font-medium">{formatAmount(grant)}</span>
          {grant.deadline && (
            <span className={`px-2.5 py-1 rounded-full font-medium ${deadlineColor(grant.deadline)}`}>{grant.deadline}</span>
          )}
          {grant.eligibility_tags.slice(0, 2).map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px]">{t}</span>
          ))}
        </div>

        {grant.fitReason && (
          <p className="text-xs italic text-muted-foreground line-clamp-2">{grant.fitReason}</p>
        )}

        {variant === "full" && grant.requirements_text && (
          <div>
            <button onClick={() => setOpen((o) => !o)} className="text-xs text-primary hover:underline flex items-center gap-1">
              Requirements <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{grant.requirements_text}</p>}
          </div>
        )}

        <div className="flex items-center gap-2 mt-auto pt-2">
          <Button size="sm" onClick={() => onDraft?.(grant)} disabled={drafting}
            className="flex-1 rounded-xl bg-gradient-primary text-white border-0 hover:opacity-95">
            {drafting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Draft application"}
          </Button>
          {grant.application_url && (
            <a href={grant.application_url} target="_blank" rel="noopener noreferrer"
               className="w-9 h-9 grid place-items-center rounded-xl glass-subtle hover:bg-white/70 transition-colors" title="Visit grant page">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {onSave && (
            <button onClick={() => onSave(grant)}
              className={`w-9 h-9 grid place-items-center rounded-xl glass-subtle hover:bg-white/70 transition-colors ${saved ? "text-pink-500" : ""}`}
              title={saved ? "Saved" : "Save grant"}>
              <Heart className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrantCardNew;
