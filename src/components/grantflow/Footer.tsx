import { Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative px-6 pb-10 pt-16">
      <div className="max-w-6xl mx-auto glass rounded-[2rem] p-8 md:p-10">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </span>
              <span className="font-semibold text-lg">GrantFlow <span className="gradient-text-brand">AI</span></span>
            </div>
            <p className="font-serif text-2xl md:text-3xl leading-tight max-w-md">
              From idea to <span className="italic gradient-text-brand">funding-ready</span> execution.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm">
            {[
              { h: "Product", l: ["Generator", "Dashboard", "Templates"] },
              { h: "Grants", l: ["Nordic", "EU", "Local"] },
              { h: "Roadmap", l: ["2025", "Beta", "Updates"] },
              { h: "Contact", l: ["Twitter", "Email", "Press"] },
            ].map((c) => (
              <div key={c.h}>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{c.h}</div>
                <ul className="space-y-2">
                  {c.l.map((x) => (
                    <li key={x}><a href="#" className="text-foreground/80 hover:text-foreground transition-colors">{x}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/40 flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} GrantFlow AI. Crafted for founders & creatives.</span>
          <span>Made with care · Beta</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
