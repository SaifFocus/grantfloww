import { FileSignature, CalendarClock, Trophy, FolderOpen, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Reveal from "./Reveal";

const DashboardPreview = () => {
  return (
    <section id="dashboard" className="relative py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle text-xs text-muted-foreground mb-4">
              <Sparkles className="w-3 h-3" /> Coming soon — preview
            </div>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight text-balance">
              Your future <span className="italic gradient-text-brand">command center.</span>
            </h2>
            <p className="text-muted-foreground mt-4">Track every application, deadline and milestone — beautifully.</p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-primary opacity-15 blur-3xl rounded-[3rem]" />
            <div className="relative glass-strong rounded-[2rem] p-6 md:p-8">
              <div className="grid lg:grid-cols-3 gap-5">
                {/* Active applications */}
                <div className="glass-subtle rounded-2xl p-5 lift">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-sm">
                        <FileSignature className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-sm">Active applications</span>
                    </div>
                    <span className="text-xs gradient-text-brand font-bold">3</span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { name: "Nordic Innovation Fund", status: "In review" },
                      { name: "EU Green Mobility", status: "Draft" },
                      { name: "Local Business Grant", status: "Submitted" },
                    ].map((a, i) => (
                      <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-white/40 last:border-0">
                        <span className="text-foreground/90">{a.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/70 text-muted-foreground">{a.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming deadlines */}
                <div className="glass-subtle rounded-2xl p-5 lift">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-accent grid place-items-center shadow-sm">
                      <CalendarClock className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-sm">Upcoming deadlines</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { d: "12", m: "MAY", t: "Nordic Innovation submission" },
                      { d: "28", m: "MAY", t: "Pitch deck due" },
                      { d: "07", m: "JUN", t: "Partnership LOI" },
                    ].map((x, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-primary text-white grid place-items-center shrink-0">
                          <div className="text-center leading-none">
                            <div className="text-base font-bold">{x.d}</div>
                            <div className="text-[9px] opacity-80">{x.m}</div>
                          </div>
                        </div>
                        <span className="text-sm text-foreground/90">{x.t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones */}
                <div className="glass-subtle rounded-2xl p-5 lift">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-sm">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-sm">Business milestones</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { l: "Idea validated", p: 100 },
                      { l: "MVP launched", p: 65 },
                      { l: "First revenue", p: 30 },
                    ].map((x, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{x.l}</span>
                          <span className="text-muted-foreground">{x.p}%</span>
                        </div>
                        <Progress value={x.p} className="h-1.5 bg-white/60" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div className="glass-subtle rounded-2xl p-5 lift lg:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-accent grid place-items-center shadow-sm">
                      <FolderOpen className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-sm">Documents needed</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {["Business registration", "Financial projections", "Pitch deck", "Letters of intent", "Tax certificate", "Project timeline"].map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm py-2 px-3 rounded-xl bg-white/50">
                        <span className={`w-1.5 h-1.5 rounded-full ${i % 3 === 0 ? "bg-emerald-500" : i % 3 === 1 ? "bg-amber-500" : "bg-rose-400"}`} />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI recommendations */}
                <div className="glass-subtle rounded-2xl p-5 lift bg-gradient-to-br from-white/60 to-white/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-sm">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-sm">AI recommendations</span>
                  </div>
                  <ul className="space-y-2.5 text-sm text-foreground/90">
                    <li className="flex gap-2"><span className="gradient-text-brand">→</span> Tighten your problem statement to 2 sentences.</li>
                    <li className="flex gap-2"><span className="gradient-text-brand">→</span> Add 1 measurable KPI to your impact section.</li>
                    <li className="flex gap-2"><span className="gradient-text-brand">→</span> Reach out to 3 partners this week.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default DashboardPreview;
