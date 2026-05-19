import { Outlet, NavLink, Link } from "react-router-dom";
import { LayoutDashboard, Search, FileText, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/dashboard/grants", icon: Search, label: "Find Grants" },
  { to: "/dashboard/applications", icon: FileText, label: "Applications" },
];

const DashboardLayout = () => {
  const { user, signOut } = useAuth();
  const initials = (user?.user_metadata?.full_name || user?.email || "?").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col glass-strong border-r border-white/40 p-4">
        <Link to="/" className="flex items-center gap-2 px-2 py-3 mb-4">
          <span className="w-8 h-8 rounded-xl bg-gradient-primary grid place-items-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-semibold tracking-tight">GrantFlow <span className="gradient-text-brand">AI</span></span>
        </Link>
        <nav className="flex-1 space-y-1">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive ? "glass-subtle text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-white/40"
                }`
              }>
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-gradient-primary" />}
                  <it.icon className="w-4 h-4" />
                  {it.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="glass-subtle rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-primary text-white grid place-items-center text-xs font-semibold shrink-0">{initials}</div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium truncate">{user?.user_metadata?.full_name || "Account"}</div>
            <div className="text-[10px] text-muted-foreground truncate">{user?.email}</div>
          </div>
          <button onClick={signOut} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-white/60" title="Sign out">
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 glass-strong border-b border-white/40">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-primary grid place-items-center"><Sparkles className="w-3.5 h-3.5 text-white" /></span>
            <span className="font-semibold text-sm">GrantFlow</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="w-4 h-4" /></Button>
        </header>
        <nav className="md:hidden flex gap-1 p-2 glass-subtle">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end}
              className={({ isActive }) =>
                `flex-1 text-center text-xs px-2 py-2 rounded-lg ${isActive ? "bg-gradient-primary text-white" : "text-muted-foreground"}`
              }>
              {it.label}
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
