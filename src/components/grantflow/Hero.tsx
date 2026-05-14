import { ArrowRight, FileText, Map, ListChecks, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Blobs from "./Blobs";
import GlassShapes from "./GlassShapes";

const Hero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="top" className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
      <Blobs />
      <GlassShapes variant="hero" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle text-xs text-muted-foreground mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-primary" />
            AI co-pilot for founders & creatives
          </div>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] text-balance mb-6 animate-fade-in-up">
            Turn your idea into a
            <br />
            <span className="gradient-text-brand italic">fundable business.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            GrantFlow AI helps you structure your idea, prepare grant applications, map your business journey,
            and generate the next steps to launch.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button
              onClick={() => scrollTo("generator")}
              size="lg"
              className="rounded-full bg-gradient-primary text-white border-0 hover:opacity-95 px-7 h-12 shadow-lg shadow-primary/20 group"
            >
              Start building your plan
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button
              onClick={() => scrollTo("how")}
              variant="ghost"
              size="lg"
              className="rounded-full glass border-0 px-7 h-12 hover:bg-white/80"
            >
              See how it works
            </Button>
          </div>
        </div>

        {/* Floating preview card */}
        <div className="relative mt-20 max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="absolute -inset-8 bg-gradient-primary opacity-20 blur-3xl rounded-[3rem]" />
          <div className="relative glass-strong rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
              </div>
              <div className="ml-3 text-xs text-muted-foreground inline-flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> grantflow.ai / your-plan
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Lightbulb, label: "Business Summary", text: "EV import service connecting Sweden ↔ Finland with curated logistics." },
                { icon: FileText, label: "Grant Draft", text: "Nordic Innovation • €10,000 • Cross-border green mobility focus." },
                { icon: Map, label: "Action Plan", text: "Validate → Permits → Pilot route → First 5 paying clients." },
                { icon: ListChecks, label: "Contract Checklist", text: "Supplier MOU, client agreement, NDA, terms & privacy." },
              ].map((c, i) => (
                <div key={i} className="glass-subtle rounded-2xl p-4 lift">
                  <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center mb-3 shadow-sm">
                    <c.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">{c.label}</div>
                  <p className="text-sm text-foreground/90 leading-snug">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
