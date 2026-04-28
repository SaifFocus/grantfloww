import { ExternalLink, Calendar, Coins, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GrantResult } from "./grantTypes";

interface Props {
  grant: GrantResult;
  onApply: (g: GrantResult) => void;
}

const GrantCard = ({ grant, onApply }: Props) => {
  return (
    <div className="glass-subtle rounded-2xl p-5 lift flex flex-col gap-3">
      <div>
        <h4 className="font-serif text-xl leading-tight">{grant.name}</h4>
        <p className="text-sm text-muted-foreground mt-1">{grant.funder}</p>
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
