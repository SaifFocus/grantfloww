import { useState } from "react";
import { Search, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import GrantCard from "./GrantCard";
import ApplicationWizard from "./ApplicationWizard";
import type { GrantResult } from "./grantTypes";
import type { GeneratorInput } from "./types";

interface Props {
  userInput: GeneratorInput;
}

const GrantsTab = ({ userInput }: Props) => {
  const [loading, setLoading] = useState(false);
  const [grants, setGrants] = useState<GrantResult[] | null>(null);
  const [active, setActive] = useState<GrantResult | null>(null);

  const findGrants = async () => {
    setLoading(true);
    setGrants(null);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/find-grants`;
      const r = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(userInput),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        if (r.status === 402) toast.error(data?.error ?? "Search credits exhausted.");
        else if (r.status === 429) toast.error("Too many requests — try again soon.");
        else toast.error(data?.error ?? "Couldn't fetch grants right now.");
        setGrants([]);
        return;
      }
      setGrants(data.grants ?? []);
    } catch (e) {
      console.error(e);
      toast.error("Network error — please try again.");
      setGrants([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="glass-subtle rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div>
          <h4 className="font-serif text-xl">Find grants matching your idea</h4>
          <p className="text-sm text-muted-foreground mt-1">
            We search free public portals (Grants.gov, EU, gov.uk, UKRI) and rank with AI.
          </p>
        </div>
        <Button
          onClick={findGrants}
          disabled={loading}
          size="lg"
          className="rounded-2xl bg-gradient-primary text-white border-0 hover:opacity-95 shrink-0"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Searching…</>
          ) : (
            <><Search className="w-4 h-4 mr-2" /> Find matching grants</>
          )}
        </Button>
      </div>

      {loading && (
        <div className="grid md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="glass-subtle rounded-2xl p-5 space-y-3 animate-pulse">
              <div className="h-5 w-2/3 bg-white/60 rounded" />
              <div className="h-3 w-1/2 bg-white/60 rounded" />
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-white/60 rounded-full" />
                <div className="h-5 w-24 bg-white/60 rounded-full" />
              </div>
              <div className="h-12 bg-white/60 rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && grants && grants.length === 0 && (
        <div className="glass-subtle rounded-2xl p-8 text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-foreground font-medium">No matching grants found.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try broadening your idea or market in the form above and search again.
          </p>
        </div>
      )}

      {!loading && grants && grants.length > 0 && (
        <>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" />
            AI-ranked from live results — verify each grant on its source page before applying.
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {grants.map((g, i) => (
              <GrantCard key={i} grant={g} onApply={setActive} />
            ))}
          </div>
        </>
      )}

      {active && (
        <ApplicationWizard
          grant={active}
          userInput={userInput}
          open={!!active}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
};

export default GrantsTab;
