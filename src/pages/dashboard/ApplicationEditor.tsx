import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Copy, Save, ExternalLink, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/grantflow/ui/StatusBadge";

type Status = "drafting" | "submitted" | "approved" | "rejected" | "waitlisted";

interface Section { title: string; content: string; }

const ApplicationEditor = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [app, setApp] = useState<{
    grant_name: string; funder: string | null; status: Status; notes: string | null;
    draft_content: { sections: Section[] } | null;
  } | null>(null);
  const [grant, setGrant] = useState<{ amount_min: number | null; amount_max: number | null; currency: string | null; deadline: string | null; requirements_text: string | null; application_url: string | null } | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [status, setStatus] = useState<Status>("drafting");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from("user_applications").select("*, grant:grants(amount_min,amount_max,currency,deadline,requirements_text,application_url)").eq("id", id).maybeSingle();
      if (data) {
        setApp(data as never);
        setGrant((data as { grant?: typeof grant }).grant ?? null);
        const dc = (data as { draft_content?: { sections?: Section[] } }).draft_content;
        setSections(dc?.sections ?? []);
        setStatus(data.status as Status);
        setNotes(data.notes ?? "");
      }
      setLoading(false);
    })();
  }, [id]);

  const save = async () => {
    if (!id) return;
    setSaving(true);
    const { error } = await supabase.from("user_applications").update({
      status, notes, draft_content: { sections } as unknown as never,
    }).eq("id", id);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Saved");
  };

  if (loading) return <div className="h-64 rounded-2xl animate-pulse bg-white/40" />;
  if (!app) return <div className="glass-subtle rounded-2xl p-8">Application not found.</div>;

  return (
    <div className="space-y-4">
      <Link to="/dashboard/applications" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Back to applications</Link>
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <aside className="glass-subtle rounded-2xl p-5 space-y-3 h-fit lg:sticky lg:top-6">
          <h2 className="font-serif text-2xl leading-tight">{app.grant_name}</h2>
          <p className="text-sm text-muted-foreground">{app.funder}</p>
          {grant && (
            <div className="space-y-2 text-xs">
              {(grant.amount_min || grant.amount_max) && <div><span className="text-muted-foreground">Amount:</span> {grant.currency} {grant.amount_min}–{grant.amount_max}</div>}
              {grant.deadline && <div><span className="text-muted-foreground">Deadline:</span> {grant.deadline}</div>}
              {grant.requirements_text && <p className="text-muted-foreground leading-relaxed pt-2 border-t border-white/60">{grant.requirements_text}</p>}
              {grant.application_url && (
                <a href={grant.application_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">Open grant page <ExternalLink className="w-3 h-3" /></a>
              )}
            </div>
          )}
          <div className="pt-3 border-t border-white/60 space-y-2">
            <label className="text-xs font-medium">Status</label>
            <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
              <SelectTrigger className="glass-subtle border-white/60 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["drafting","submitted","approved","rejected","waitlisted"] as Status[]).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <StatusBadge status={status} />
          </div>
        </aside>

        <div className="space-y-4">
          {sections.map((sec, i) => (
            <div key={i} className="glass-subtle rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{sec.title}</h3>
                <button onClick={() => { navigator.clipboard.writeText(sec.content); toast.success("Copied"); }} className="p-1.5 rounded hover:bg-white/60"><Copy className="w-3.5 h-3.5" /></button>
              </div>
              <Textarea value={sec.content} onChange={(e) => {
                const next = [...sections]; next[i] = { ...sec, content: e.target.value }; setSections(next);
              }} className="min-h-[160px] glass-subtle border-white/60 rounded-xl" />
            </div>
          ))}
          <div className="glass-subtle rounded-2xl p-4 space-y-2">
            <h3 className="font-medium">Notes</h3>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[80px] glass-subtle border-white/60 rounded-xl" />
          </div>
          <Button onClick={save} disabled={saving} className="rounded-xl bg-gradient-primary text-white border-0">
            <Save className="w-4 h-4 mr-1.5" /> {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationEditor;
