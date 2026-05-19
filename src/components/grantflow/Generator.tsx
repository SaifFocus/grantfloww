import { useState } from "react";
import { Sparkles, Wand2, Building2, Globe, Coins, Layers, Briefcase, Megaphone, Calculator, FileSignature, Map, BarChart3, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { GeneratorInput, GeneratedPlan } from "./types";
import { generatePlan } from "./generatePlan";
import OutputSection from "./OutputSection";
import CountrySelector from "./ui/CountrySelector";
import Reveal from "./Reveal";
import { setLatestGeneratorInput } from "./generatorContext";

const businessTypes = ["Startup", "Small business", "Non-profit", "Creative project", "Tech product", "Local service", "E-commerce", "Other"];
const stages = ["Idea only", "Researching", "Already started", "Need funding", "Ready to launch"];
const needsOptions = [
  { id: "Business structure", icon: Building2 },
  { id: "Grant application", icon: FileSignature },
  { id: "Contracts", icon: Briefcase },
  { id: "Roadmap", icon: Map },
  { id: "Marketing", icon: Megaphone },
  { id: "Financial planning", icon: Calculator },
  { id: "Investor pitch", icon: BarChart3 },
];

const loadingMessages = ["Structuring your idea…", "Finding funding angles…", "Creating your roadmap…"];

const Generator = () => {
  const [form, setForm] = useState<GeneratorInput>({
    idea: "",
    businessType: "",
    market: "",
    fundingGoal: "",
    needs: [],
    stage: "Idea only",
  });
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [expanding, setExpanding] = useState(false);

  const toggleNeed = (id: string) => {
    setForm((f) => ({
      ...f,
      needs: f.needs.includes(id) ? f.needs.filter((n) => n !== id) : [...f.needs, id],
    }));
  };

  const handleExpandIdea = async () => {
    if (!form.idea.trim() || expanding) return;
    setExpanding(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/expand-idea`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          idea: form.idea,
          businessType: form.businessType,
          market: form.market,
          fundingGoal: form.fundingGoal,
          stage: form.stage,
          needs: form.needs,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        if (resp.status === 429) toast.error("Too many requests — try again in a moment.");
        else if (resp.status === 402) toast.error("AI credits exhausted. Add funds to continue.");
        else toast.error(data?.error || "Couldn't expand the idea right now.");
        return;
      }
      const expanded = (data?.expanded || "").trim();
      if (!expanded) {
        toast.error("Got an empty response — try again.");
        return;
      }
      setForm((f) => ({ ...f, idea: expanded }));
      toast.success("Idea expanded with AI ✨");
    } catch (e) {
      console.error(e);
      toast.error("Network error — please try again.");
    } finally {
      setExpanding(false);
    }
  };

  const handleGenerate = async () => {
    if (!form.idea.trim()) return;
    setLoading(true);
    setPlan(null);
    setLoadingMsg(0);
    const interval = setInterval(() => {
      setLoadingMsg((m) => Math.min(m + 1, loadingMessages.length - 1));
    }, 700);
    await new Promise((r) => setTimeout(r, 2100));
    clearInterval(interval);
    const result = generatePlan(form);
    setPlan(result);
    setLatestGeneratorInput(form);
    setLoading(false);
    setTimeout(() => {
      document.getElementById("output")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <section id="generator" className="relative py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">The Generator</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight text-balance">
              Build your <span className="italic gradient-text-brand">business plan</span>
            </h2>
            <p className="text-muted-foreground mt-4">Tell us about your idea — we'll structure the rest.</p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="glass-strong rounded-[2rem] p-6 md:p-10 relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-gradient-primary opacity-20 blur-3xl pointer-events-none" />
            <div className="relative space-y-6">
              {/* Idea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Your business idea
                  </Label>
                  <button
                    type="button"
                    onClick={handleExpandIdea}
                    disabled={!form.idea.trim() || expanding || loading}
                    className="group inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full glass-subtle border border-white/60 hover:bg-white/70 transition-all text-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    title={form.idea.trim() ? "Expand your rough idea with AI" : "Write a short idea first"}
                  >
                    {expanding ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                        <span>Expanding…</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                        <span>Expand with AI</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <Textarea
                    value={form.idea}
                    onChange={(e) => setForm({ ...form, idea: e.target.value })}
                    placeholder="Example: I want to start a car export business from Sweden to Finland…"
                    className="min-h-[120px] glass-subtle border-white/60 rounded-2xl resize-none text-base"
                    disabled={expanding}
                  />
                  {expanding && (
                    <div className="absolute inset-0 rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                      <div className="inline-flex items-center gap-2 text-sm text-foreground glass-subtle rounded-full px-4 py-2 border border-white/60">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        Expanding your idea…
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Tip: write 1–2 lines, then click <span className="font-medium text-foreground">Expand with AI</span> to flesh it out.
                </p>
              </div>

              {/* Grid: type, market, funding */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-primary" /> Business type
                  </Label>
                  <Select value={form.businessType} onValueChange={(v) => setForm({ ...form, businessType: v })}>
                    <SelectTrigger className="glass-subtle border-white/60 rounded-2xl h-11">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {businessTypes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-primary" /> Country / market
                  </Label>
                  <Input
                    value={form.market}
                    onChange={(e) => setForm({ ...form, market: e.target.value })}
                    placeholder="Sweden, Denmark, EU…"
                    className="glass-subtle border-white/60 rounded-2xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Coins className="w-3.5 h-3.5 text-primary" /> Funding goal
                    </Label>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          fundingGoal: f.fundingGoal === "N/A" ? "" : "N/A",
                        }))
                      }
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border transition-all ${
                        form.fundingGoal === "N/A"
                          ? "bg-gradient-primary text-white border-transparent shadow-sm"
                          : "glass-subtle border-white/60 text-muted-foreground hover:text-foreground hover:bg-white/70"
                      }`}
                      title="Set to N/A — open to any amount"
                    >
                      N/A
                    </button>
                  </div>
                  <Input
                    value={form.fundingGoal}
                    onChange={(e) => setForm({ ...form, fundingGoal: e.target.value })}
                    placeholder={form.fundingGoal === "N/A" ? "Open to any amount" : "€10,000 or N/A"}
                    disabled={form.fundingGoal === "N/A"}
                    className="glass-subtle border-white/60 rounded-2xl h-11 disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Needs */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-primary" /> What do you need help with?
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {needsOptions.map((n) => {
                    const active = form.needs.includes(n.id);
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => toggleNeed(n.id)}
                        className={`relative text-left rounded-2xl p-3 border transition-all duration-200 ${
                          active
                            ? "bg-gradient-primary text-white border-transparent shadow-md scale-[1.02]"
                            : "glass-subtle border-white/60 hover:bg-white/70"
                        }`}
                      >
                        <n.icon className={`w-4 h-4 mb-2 ${active ? "text-white" : "text-primary"}`} />
                        <div className={`text-xs font-medium leading-tight ${active ? "text-white" : "text-foreground"}`}>{n.id}</div>
                        {active && <Check className="w-3.5 h-3.5 absolute top-2 right-2 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stage */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Current stage</Label>
                <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
                  <SelectTrigger className="glass-subtle border-white/60 rounded-2xl h-11">
                    <SelectValue placeholder="Where are you today?" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {stages.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !form.idea.trim()}
                  size="lg"
                  className="w-full h-14 rounded-2xl bg-gradient-primary text-white border-0 hover:opacity-95 text-base font-medium shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      {loadingMessages[loadingMsg]}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Wand2 className="w-5 h-5" /> Generate AI Launch Plan
                    </span>
                  )}
                </Button>
                {!form.idea.trim() && !loading && (
                  <p className="text-xs text-muted-foreground text-center mt-3">Add your idea to generate a plan.</p>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Output */}
        <div id="output" className="mt-12">
          {plan && <OutputSection plan={plan} userInput={form} />}
        </div>
      </div>
    </section>
  );
};

export default Generator;
