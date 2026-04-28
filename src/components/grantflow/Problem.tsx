import { Compass, FileWarning, Route } from "lucide-react";
import Reveal from "./Reveal";

const items = [
  { icon: Compass, title: "Unclear business structure", desc: "You have a vision but no clear model, audience, or pricing." },
  { icon: FileWarning, title: "Complicated grant applications", desc: "Forms, criteria, and language barriers slow down funding." },
  { icon: Route, title: "No roadmap from idea to execution", desc: "Without a plan, weeks turn into months without progress." },
];

const Problem = () => {
  return (
    <section className="relative py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">The Problem</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight text-balance">
              Most people have <span className="italic gradient-text-brand">ideas.</span>
              <br />
              Few know how to fund them.
            </h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="glass rounded-3xl p-7 h-full lift">
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary grid place-items-center mb-5 shadow-md">
                  <it.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{it.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{it.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;
