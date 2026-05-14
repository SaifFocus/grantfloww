import { Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const onHome = location.pathname === "/";

  const scrollTo = (id: string) => {
    if (!onHome) {
      navigate(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1180px,calc(100%-2rem))]">
      <nav className="glass-strong rounded-full px-5 py-2.5 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <span className="w-8 h-8 rounded-xl bg-gradient-primary grid place-items-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-semibold tracking-tight text-foreground">GrantFlow <span className="gradient-text-brand">AI</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <button onClick={() => scrollTo("how")} className="hover:text-foreground transition-colors">{t("nav.how")}</button>
          <button onClick={() => scrollTo("generator")} className="hover:text-foreground transition-colors">{t("nav.generator")}</button>
          <button onClick={() => scrollTo("dashboard")} className="hover:text-foreground transition-colors">{t("nav.dashboard")}</button>
          <Link to="/about" className="hover:text-foreground transition-colors">{t("nav.about")}</Link>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher />
          <Button
            onClick={() => scrollTo("generator")}
            className="rounded-full bg-gradient-primary text-white border-0 hover:opacity-95 hover:shadow-lg px-5 h-9"
          >
            {t("nav.cta")}
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
