import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CountrySelector from "@/components/grantflow/ui/CountrySelector";
import GrantCardNew, { GrantRow } from "@/components/grantflow/ui/GrantCardNew";

const SECTORS = ["green", "health", "education", "fintech", "art", "agriculture", "general"];
const STAGES = ["idea", "early", "growth", "established"];

const FindGrants = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [country, setCountry] = useState("Sweden");
  const [stage, setStage] = useState<string>("");
  const [sectors, setSectors] = useState<string[]>([]);
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [drafting, setDrafting] = useState<string | null>(null);
  const [results, setResults] = useState<GrantRow[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("country").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data?.country) setCountry(data.country);
    });
  }, [user]);

  const toggleSector = (s: string) => setSectors((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]);

  const search = async () => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/match-grants`;
      const r = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ country, stage, sectorTags: sectors, idea }),
      });
      const data = await r.json();
      setResults(data.grants ?? []);
    } catch (e) {
      toast.error("Search failed");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onDraft = async (g: GrantRow) => {
    if (!session) {
      navigate("/auth");
      return;
    }
    setDrafting(g.id);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/draft-application`;
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ grantId: g.id, userProfile: { idea }, fitScore: g.fitScore }),
      });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error ?? "Draft failed"); return; }
      navigate(`/dashboard/applications/${data.applicationId}`);
    } catch (e) {
      toast.error("Draft failed");
      console.error(e);
    } finally {
      setDrafting(null);
    }
  };

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-6">
      <aside className="glass-subtle rounded-2xl p-5 space-y-4 h-fit">
        <div>
          <label className="text-xs font-medium mb-1.5 block">Country</label>
          <CountrySelector value={country} onChange={setCountry} />
        </div>
        <div>
          <label className="text-xs font-medium mb-1.5 block">Stage</label>
          <div className="flex flex-wrap gap-1.5">
            {STAGES.map((s) => (
              <button key={s} onClick={() => setStage(stage === s ? "" : s)}
                className={`px-2.5 py-1 rounded-full text-xs ${stage === s ? "bg-gradient-primary text-white" : "glass-subtle hover:bg-white/70"}`}>{s}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium mb-1.5 block">Sectors</label>
          <div className="flex flex-wrap gap-1.5">
            {SECTORS.map((s) => (
              <button key={s} onClick={() => toggleSector(s)}
                className={`px-2.5 py-1 rounded-full text-xs ${sectors.includes(s) ? "bg-gradient-primary text-white" : "glass-subtle hover:bg-white/70"}`}>{s}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium mb-1.5 block">Briefly describe your idea</label>
          <Input value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="Optional" className="glass-subtle border-white/60 rounded-xl" />
        </div>
        <Button onClick={search} disabled={loading} className="w-full rounded-xl bg-gradient-primary text-white border-0">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Find matching grants"}
        </Button>
      </aside>

      <div>
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => <div key={i} className="h-64 rounded-2xl animate-pulse bg-white/40" />)}
          </div>
        ) : results.length === 0 ? (
          <div className="glass-subtle rounded-2xl p-12 text-center text-muted-foreground">
            Set your filters and click "Find matching grants" to see results.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {results.map((g) => (
              <GrantCardNew key={g.id} grant={g} onDraft={onDraft} drafting={drafting === g.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindGrants;
