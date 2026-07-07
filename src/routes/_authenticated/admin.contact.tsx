import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { AdminGate } from "@/components/portal/AdminGate";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type Enquiry = { id: string; kind: string; full_name: string; email: string; phone: string | null; company: string | null; subject: string | null; message: string; service_interest: string | null; budget: string | null; created_at: string; };

export const Route = createFileRoute("/_authenticated/admin/contact")({
  head: () => ({ meta: [{ title: "Enquiries — Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminGate><AdminContact /></AdminGate>,
});

function AdminContact() {
  const [rows, setRows] = useState<Enquiry[]>([]);
  const load = () => supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows((data ?? []) as Enquiry[]));
  useEffect(() => { load(); }, []);
  async function remove(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }
  return (
    <PortalShell isAdmin>
      <h1 className="font-display text-4xl">Enquiries</h1>
      <p className="mt-2 text-sm text-muted-foreground">Contact form, business enquiries, collaboration & quote requests.</p>
      <div className="mt-8 grid gap-4">
        {!rows.length && <div className="glass rounded-2xl p-8 text-center text-muted-foreground">No submissions yet.</div>}
        {rows.map(r => (
          <article key={r.id} className="glass rounded-2xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">{r.kind}</span>
                  <span className="font-semibold">{r.full_name}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  <a href={`mailto:${r.email}`} className="hover:text-primary">{r.email}</a>
                  {r.phone && <> · <a href={`tel:${r.phone}`} className="hover:text-primary">{r.phone}</a></>}
                  {r.company && <> · {r.company}</>}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("en-GB")}</div>
            </div>
            {r.subject && <div className="mt-3 text-sm font-medium">{r.subject}</div>}
            <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap">{r.message}</p>
            {(r.service_interest || r.budget) && <div className="mt-3 text-xs text-muted-foreground">{r.service_interest ? `Service: ${r.service_interest}` : ""}{r.budget ? ` · Budget: ${r.budget}` : ""}</div>}
            <div className="mt-4 flex gap-2">
              <button onClick={() => remove(r.id)} className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
            </div>
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
