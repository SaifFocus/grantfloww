import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Check, ChevronLeft, ChevronRight, Copy, Download, X } from "lucide-react";
import { toast } from "sonner";
import { APPLICATION_STEPS } from "./applicationSteps";
import type { GrantResult } from "./grantTypes";
import type { GeneratorInput } from "./types";

interface Props {
  grant: GrantResult;
  userInput: GeneratorInput;
  open: boolean;
  onClose: () => void;
}

const storageKey = (g: GrantResult) => `grantflow:wizard:${g.sourceUrl}`;

const ApplicationWizard = ({ grant, userInput, open, onClose }: Props) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  // Load saved
  useEffect(() => {
    const raw = localStorage.getItem(storageKey(grant));
    if (raw) {
      try { setAnswers(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, [grant]);

  // Persist
  useEffect(() => {
    localStorage.setItem(storageKey(grant), JSON.stringify(answers));
  }, [answers, grant]);

  const current = APPLICATION_STEPS[step];
  const isReview = current.id === "review";

  const callDraft = async (mode: "draft" | "improve") => {
    setBusyId(current.id);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/draft-application-step`;
      const r = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          grant,
          userInput,
          step: current,
          previousAnswers: answers,
          currentAnswer: answers[current.id] ?? "",
          mode,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        toast.error(data?.error ?? "AI couldn't help right now.");
        return;
      }
      setAnswers((a) => ({ ...a, [current.id]: data.text ?? "" }));
    } catch (e) {
      console.error(e);
      toast.error("Network error — please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const buildMarkdown = () => {
    const parts: string[] = [
      `# Grant application — ${grant.name}`,
      `**Funder:** ${grant.funder}`,
      grant.amount ? `**Amount:** ${grant.amount}` : "",
      grant.deadline ? `**Deadline:** ${grant.deadline}` : "",
      grant.sourceUrl ? `**Source:** ${grant.sourceUrl}` : "",
      "",
    ].filter(Boolean);
    for (const s of APPLICATION_STEPS) {
      if (s.id === "review") continue;
      parts.push(`## ${s.title}`);
      parts.push(answers[s.id]?.trim() || "_(not yet written)_");
      parts.push("");
    }
    return parts.join("\n");
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(buildMarkdown());
    toast.success("Copied to clipboard");
  };

  const download = () => {
    const blob = new Blob([buildMarkdown()], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${grant.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-application.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl">
        <div className="p-6 md:p-8 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Application wizard</p>
              <h3 className="font-serif text-2xl mt-1">{grant.name}</h3>
              <p className="text-sm text-muted-foreground">{grant.funder}</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/60" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {APPLICATION_STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-all ${
                    active
                      ? "bg-gradient-primary text-white border-transparent"
                      : done
                      ? "bg-white/60 border-white/60 text-foreground"
                      : "glass-subtle border-white/60 text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="w-3 h-3" /> : <span className="font-mono">{i + 1}</span>}
                  {s.title}
                </button>
              );
            })}
          </div>

          {/* Body */}
          {!isReview ? (
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">{current.question}</h4>
                <p className="text-sm text-muted-foreground mt-1">{current.hint}</p>
              </div>
              <Textarea
                value={answers[current.id] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [current.id]: e.target.value }))}
                placeholder={`Write here, or click "Draft with AI" to get started…`}
                className="min-h-[200px] glass-subtle border-white/60 rounded-2xl"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => callDraft("draft")}
                  disabled={busyId === current.id}
                  className="rounded-xl"
                >
                  {busyId === current.id ? (
                    <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Drafting…</>
                  ) : (
                    <><Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" /> Draft with AI</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => callDraft("improve")}
                  disabled={busyId === current.id || !(answers[current.id] ?? "").trim()}
                  className="rounded-xl"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" /> Improve with AI
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Review your full application below, then copy or download.</p>
              <pre className="glass-subtle rounded-2xl p-4 text-xs whitespace-pre-wrap font-sans max-h-[400px] overflow-y-auto">
                {buildMarkdown()}
              </pre>
              <div className="flex flex-wrap gap-2">
                <Button onClick={copyAll} className="rounded-xl bg-gradient-primary text-white border-0">
                  <Copy className="w-4 h-4 mr-1.5" /> Copy
                </Button>
                <Button onClick={download} variant="outline" className="rounded-xl">
                  <Download className="w-4 h-4 mr-1.5" /> Download .md
                </Button>
              </div>
            </div>
          )}

          {/* Nav */}
          <div className="flex justify-between pt-2 border-t border-white/60">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              size="sm"
              onClick={() => setStep((s) => Math.min(APPLICATION_STEPS.length - 1, s + 1))}
              disabled={step === APPLICATION_STEPS.length - 1}
              className="rounded-xl bg-gradient-primary text-white border-0"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationWizard;
