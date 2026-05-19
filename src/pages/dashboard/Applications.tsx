import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import StatusBadge from "@/components/grantflow/ui/StatusBadge";

interface AppRow {
  id: string;
  grant_name: string;
  funder: string | null;
  status: "drafting" | "submitted" | "approved" | "rejected" | "waitlisted";
  fit_score: number | null;
  created_at: string;
}

const Applications = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from("user_applications").select("id, grant_name, funder, status, fit_score, created_at")
      .eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { setRows((data ?? []) as AppRow[]); setLoading(false); });
  }, [user]);

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-4xl">My applications</h1>
      {loading ? (
        <div className="h-32 rounded-2xl animate-pulse bg-white/40" />
      ) : rows.length === 0 ? (
        <div className="glass-subtle rounded-2xl p-12 text-center text-muted-foreground">
          No applications yet — <Link to="/dashboard/grants" className="text-primary hover:underline">find grants</Link> to get started.
        </div>
      ) : (
        <div className="glass-subtle rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-white/60">
              <tr><th className="text-left p-3">Grant</th><th className="text-left p-3">Funder</th><th className="text-left p-3">Status</th><th className="text-left p-3">Fit</th><th className="text-left p-3">Created</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-white/40 last:border-0 hover:bg-white/40">
                  <td className="p-3 font-medium">{r.grant_name}</td>
                  <td className="p-3 text-muted-foreground">{r.funder}</td>
                  <td className="p-3"><StatusBadge status={r.status} /></td>
                  <td className="p-3">{r.fit_score ?? "—"}</td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="p-3"><Link to={`/dashboard/applications/${r.id}`} className="text-primary"><Eye className="w-4 h-4" /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Applications;
