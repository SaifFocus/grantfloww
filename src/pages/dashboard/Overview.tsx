import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, FileText, CheckCircle2, Heart, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import StatsCard from "@/components/grantflow/ui/StatsCard";
import GrantCardNew, { GrantRow } from "@/components/grantflow/ui/GrantCardNew";

const Overview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ grants: 0, drafted: 0, submitted: 0, saved: 0 });
  const [topGrants, setTopGrants] = useState<GrantRow[]>([]);
  const [country, setCountry] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("full_name, country").eq("id", user.id).maybeSingle();
      const c = profile?.country ?? "Sweden";
      setCountry(c);
      setName(profile?.full_name || user.email?.split("@")[0] || "there");

      const [{ count: gC }, { data: apps }, { count: sC }] = await Promise.all([
        supabase.from("grants").select("*", { count: "exact", head: true }).eq("country", c).eq("is_active", true),
        supabase.from("user_applications").select("status").eq("user_id", user.id),
        supabase.from("saved_grants").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      setStats({
        grants: gC ?? 0,
        drafted: apps?.length ?? 0,
        submitted: (apps ?? []).filter((a) => a.status === "submitted").length,
        saved: sC ?? 0,
      });
      const { data: tops } = await supabase.from("grants").select("*").eq("country", c).eq("is_active", true).limit(3);
      setTopGrants((tops ?? []) as GrantRow[]);
    })();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl">Welcome back, {name}</h1>
        <p className="text-muted-foreground mt-1">{country && `Showing grants for ${country}`}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Search} value={stats.grants} label="Grants available" />
        <StatsCard icon={FileText} value={stats.drafted} label="Applications drafted" />
        <StatsCard icon={CheckCircle2} value={stats.submitted} label="Submitted" />
        <StatsCard icon={Heart} value={stats.saved} label="Saved grants" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { to: "/dashboard/grants", label: "Find grants", icon: Search },
          { to: "/dashboard/applications", label: "View applications", icon: FileText },
          { to: "/", label: "Idea generator", icon: ArrowRight },
        ].map((a) => (
          <Link key={a.to} to={a.to} className="glass-subtle rounded-2xl p-5 flex items-center justify-between hover:bg-white/70 transition-colors">
            <span className="flex items-center gap-3 font-medium"><a.icon className="w-4 h-4 text-primary" />{a.label}</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="font-serif text-2xl">Top grants for {country}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {topGrants.map((g) => <GrantCardNew key={g.id} grant={g} variant="compact" />)}
        </div>
      </div>
    </div>
  );
};

export default Overview;
