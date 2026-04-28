import { Lightbulb, FileText, Map, ListChecks, Target, Check, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { GeneratedPlan } from "./types";

interface Props { plan: GeneratedPlan }

const OutputSection = ({ plan }: Props) => {
  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle text-xs text-muted-foreground mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Plan ready
        </div>
        <h3 className="font-serif text-3xl md:text-4xl">
          Your <span className="gradient-text-brand italic">{plan.concept.name}</span> launch plan
        </h3>
      </div>

      <div className="glass-strong rounded-[2rem] p-4 md:p-8">
        <Tabs defaultValue="concept" className="w-full">
          <TabsList className="w-full glass-subtle rounded-2xl p-1.5 h-auto flex flex-wrap gap-1 mb-8 bg-white/40">
            {[
              { v: "concept", icon: Lightbulb, label: "Concept" },
              { v: "grant", icon: FileText, label: "Grant Draft" },
              { v: "roadmap", icon: Map, label: "Roadmap" },
              { v: "contracts", icon: ListChecks, label: "Contracts" },
              { v: "milestones", icon: Target, label: "Milestones" },
            ].map((t) => (
              <TabsTrigger
                key={t.v}
                value={t.v}
                className="flex-1 min-w-[120px] rounded-xl data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-md gap-1.5 h-10"
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Concept */}
          <TabsContent value="concept" className="space-y-4 mt-0 animate-fade-in">
            <Field label="Business name suggestion" value={plan.concept.name} highlight />
            <Field label="Concept summary" value={plan.concept.summary} />
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Target audience" value={plan.concept.audience} />
              <Field label="Revenue model" value={plan.concept.revenue} />
            </div>
            <Field label="Unique value proposition" value={plan.concept.uvp} />
          </TabsContent>

          {/* Grant */}
          <TabsContent value="grant" className="space-y-4 mt-0 animate-fade-in">
            <Field label="Project title" value={plan.grant.title} highlight />
            <Field label="Problem statement" value={plan.grant.problem} />
            <Field label="Proposed solution" value={plan.grant.solution} />
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Social / economic impact" value={plan.grant.impact} />
              <Field label="Why funding is needed" value={plan.grant.why} />
            </div>
            <Field label="Expected outcome" value={plan.grant.outcome} />
          </TabsContent>

          {/* Roadmap */}
          <TabsContent value="roadmap" className="mt-0 animate-fade-in">
            <div className="relative pl-8 md:pl-12">
              <div className="absolute left-3 md:left-5 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-accent to-orange-300" />
              {plan.roadmap.map((r, i) => (
                <div key={i} className="relative mb-5 last:mb-0">
                  <div className="absolute -left-[22px] md:-left-[30px] top-3 w-4 h-4 rounded-full bg-gradient-primary ring-4 ring-white shadow-md" />
                  <div className="glass-subtle rounded-2xl p-4 lift">
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">{r.when}</div>
                    <div className="text-foreground">{r.what}</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Contracts */}
          <TabsContent value="contracts" className="mt-0 animate-fade-in">
            <div className="grid sm:grid-cols-2 gap-3">
              {plan.contracts.map((c, i) => (
                <div key={i} className="glass-subtle rounded-2xl p-4 flex items-center gap-3 lift">
                  <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-sm shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{c}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 glass-subtle rounded-2xl p-4 flex gap-3 items-start text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
              <p>Legal templates should be reviewed by a qualified professional before use.</p>
            </div>
          </TabsContent>

          {/* Milestones */}
          <TabsContent value="milestones" className="mt-0 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-4">
              {plan.milestones.map((m, i) => (
                <div key={i} className="glass-subtle rounded-2xl p-5 lift">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm">{m.label}</span>
                    <span className="text-xs gradient-text-brand font-semibold">{m.progress}%</span>
                  </div>
                  <Progress value={m.progress} className="h-2 bg-white/60" />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Field = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
  <div className="glass-subtle rounded-2xl p-5">
    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
    <div className={highlight ? "text-xl md:text-2xl font-serif gradient-text-brand" : "text-foreground/90 leading-relaxed"}>{value}</div>
  </div>
);

export default OutputSection;
