import { Sparkles, LogOut, LayoutDashboard, FileText } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const onHome = location.pathname === "/";

  const scrollTo = (id: string) => {
    if (!onHome) {
      navigate(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const initial = (user?.user_metadata?.full_name || user?.email || "?").charAt(0).toUpperCase();
  const displayName = user?.user_metadata?.full_name || user?.email || "";

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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="glass-subtle rounded-full pl-1 pr-3 py-1 flex items-center gap-2 hover:bg-white/60 transition-colors">
                  <span className="w-7 h-7 rounded-full bg-gradient-primary text-white grid place-items-center text-xs font-semibold">{initial}</span>
                  <span className="text-xs font-medium max-w-[110px] truncate hidden sm:inline">{displayName}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-strong rounded-2xl border-white/60 p-2 min-w-[200px]" align="end">
                <DropdownMenuItem onClick={() => navigate("/dashboard")} className="rounded-xl cursor-pointer">
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/applications")} className="rounded-xl cursor-pointer">
                  <FileText className="w-4 h-4 mr-2" /> My applications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="rounded-xl cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              className="rounded-full bg-gradient-primary text-white border-0 hover:opacity-95 hover:shadow-lg px-5 h-9"
            >
              {t("nav.cta")}
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
