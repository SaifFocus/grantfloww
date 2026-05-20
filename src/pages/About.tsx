import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import Navbar from "@/components/grantflow/Navbar";
import Footer from "@/components/grantflow/Footer";
import GlassShapes from "@/components/grantflow/GlassShapes";
import Blobs from "@/components/grantflow/Blobs";
import WaitlistForm from "@/components/grantflow/WaitlistForm";
import tortoise from "@/assets/mascot-tortoise.png";
import elephant from "@/assets/mascot-elephant.png";
import owl from "@/assets/mascot-owl.png";

const team = [
  {
    name: "Sheldon",
    role: "Head of Strategy",
    img: tortoise,
    bio: "Slow, steady and impossible to outlast. Sheldon makes sure every plan can actually go the distance.",
  },
  {
    name: "Ellis",
    role: "Head of Memory",
    img: elephant,
    bio: "Remembers every grant deadline, every requirement, every tiny detail you'd rather not think about.",
  },
  {
    name: "Otis",
    role: "Head of Insight",
    img: owl,
    bio: "Reads the fine print so you don't have to — and spots the angle that makes your application stand out.",
  },
];

const About = () => {
  useEffect(() => {
    document.title = "About — GrantFlow AI";
    const desc = "About GrantFlow AI: a public beta built by FOQUS, the Swedish branding, web design, video production and SEO agency. Meet the team and join the launch waitlist.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 overflow-hidden">
        <Blobs />
        <GlassShapes variant="hero" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle text-xs text-muted-foreground mb-6 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to home
          </Link>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6">
            About <span className="gradient-text-brand italic">GrantFlow</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            A small experiment with a big ambition: make grant funding actually accessible to the people who need it most.
          </p>
        </div>
      </section>

      {/* Beta notice */}
      <section className="relative px-6 py-8">
        <div className="max-w-3xl mx-auto glass rounded-3xl p-6 md:p-8 flex items-start gap-4">
          <span className="w-10 h-10 rounded-xl bg-gradient-primary grid place-items-center shadow-md shrink-0">
            <AlertCircle className="w-5 h-5 text-white" />
          </span>
          <div>
            <h2 className="font-serif text-2xl mb-1">This is a public beta</h2>
            <p className="text-muted-foreground leading-relaxed">
              GrantFlow AI is not yet officially launched and not all features are fully functional. You're looking at a
              live work-in-progress — things will break, copy will change, and the product will get noticeably better
              every week. If you'd like to know when we go live, scroll down and join the waitlist.
            </p>
          </div>
        </div>
      </section>

      {/* Why this exists + FOQUS */}
      <section className="relative px-6 py-16 md:py-24 overflow-hidden">
        <GlassShapes variant="subtle" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-6">
            Why we built this
          </h2>
          <div className="space-y-5 text-foreground/85 text-lg leading-relaxed">
            <p>
              Most of the world's grant funding sits behind dense PDFs, government portals, and language that's
              actively hostile to first-time founders. We watched too many good ideas die in the application stage
              — not because they weren't fundable, but because nobody had three weeks to decode the paperwork.
            </p>
            <p>
              GrantFlow AI is our attempt to fix that. It reads the requirements for you, scores how well your idea
              fits, drafts the application step by step, and turns "I should apply for that" into something you can
              actually finish in an afternoon.
            </p>
            <p>
              The project is built and operated by{" "}
              <a
                href="https://focusbranding.se"
                rel="noopener"
                title="FOQUS — Swedish branding, web design, video production and SEO agency"
                className="font-medium underline decoration-dotted underline-offset-4 hover:text-foreground transition-colors"
              >
                FOQUS — a Swedish branding agency
              </a>{" "}
              specialising in branding, web design, video production and SEO. GrantFlow is our in-house R&amp;D into
              what AI tooling can do for the founders and creatives we work with every day.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative px-6 py-16 md:py-24 overflow-hidden">
        <Blobs />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-4">
              The team behind <span className="gradient-text-brand italic">GrantFlow</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              A patient strategist, a flawless memory, and a sharp pair of eyes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((m) => (
              <div
                key={m.name}
                className="glass rounded-3xl p-6 text-center flex flex-col items-center hover:-translate-y-1 transition-transform"
              >
                <div className="w-40 h-40 mb-4 grid place-items-center">
                  <img
                    src={m.img}
                    alt={`${m.name} the ${m.role.toLowerCase()} mascot`}
                    width={768}
                    height={768}
                    loading="lazy"
                    className="w-full h-full object-contain drop-shadow-[0_20px_30px_hsl(var(--brand-purple)/0.25)]"
                  />
                </div>
                <h3 className="font-serif text-2xl mb-1">{m.name}</h3>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  {m.role}
                </div>
                <p className="text-sm text-foreground/75 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="relative px-6 py-20 md:py-28 overflow-hidden">
        <GlassShapes variant="transition" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle text-xs text-muted-foreground mb-6">
            <Sparkles className="w-3 h-3" />
            Pre-launch waitlist
          </div>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight mb-5">
            Be first when we <span className="gradient-text-brand italic">launch</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Drop your email and we'll send you a single message the day GrantFlow AI is live. No spam, no newsletter — just one launch notice.
          </p>
          <div className="max-w-md mx-auto">
            <WaitlistForm source="page" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
