import { PenLine, MessageCircleQuestion, Wand2, ListTodo } from "lucide-react";
import Reveal from "./Reveal";

const steps = [
  { icon: PenLine, title: "Describe your idea", desc: "A few sentences are enough to get started." },
  { icon: MessageCircleQuestion, title: "Answer guided questions", desc: "Tell us your market, stage, and funding goals." },
  { icon: Wand2, title: "Generate your launch plan", desc: "AI builds your business concept, grant draft, and roadmap." },
  { icon: ListTodo, title: "Track next steps", desc: "Follow milestones and prepare your applications with confidence." },
];

const HowItWorks = () => {
  return (
    <section id="how" className="relative py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">How it works</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight text-balance">
              From rough idea to <span className="italic gradient-text-brand">launch-ready</span> in minutes.
            </h2>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="glass rounded-3xl p-6 h-full lift relative overflow-hidden">
                <div className="absolute -top-6 -right-6 text-7xl font-serif text-foreground/[0.04] select-none">
                  0{i + 1}
                </div>
                <div className="w-11 h-11 rounded-2xl bg-gradient-accent grid place-items-center mb-4 shadow-md">
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold mb-1.5">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
