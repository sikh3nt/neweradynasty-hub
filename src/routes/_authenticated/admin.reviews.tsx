import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { AdminGate } from "@/components/portal/AdminGate";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StarRating } from "@/components/site/StarRating";
import { toast } from "sonner";
import { Check, X, Pin, Trash2, Edit3, BadgeCheck } from "lucide-react";

type Review = { id: string; full_name: string; company: string | null; service_received: string | null;
  rating: number; body: string; avatar_url: string | null; status: "pending" | "approved" | "rejected";
  verified: boolean; featured: boolean; submitter_user_id: string | null; created_at: string; };

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  head: () => ({ meta: [{ title: "Reviews — Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminGate><AdminReviews /></AdminGate>,
});

function AdminReviews() {
  const [rows, setRows] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [editing, setEditing] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");

  const load = async () => {
    let q = supabase
      .from("reviews")
      .select(
        "id, full_name, company, service_received, rating, body, avatar_url, status, verified, featured, submitter_user_id, created_at",
      )
      .order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setRows((data ?? []) as Review[]);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  async function update(id: string, patch: Partial<Review>) {
    const { error } = await supabase.from("reviews").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    load();
  }
  async function approve(r: Review) { await update(r.id, { status: "approved", approved_at: new Date().toISOString(), verified: !!r.submitter_user_id } as Partial<Review>); }
  async function reject(r: Review) { await update(r.id, { status: "rejected" }); }
  async function feature(r: Review) { await update(r.id, { featured: !r.featured }); }
  async function remove(id: string) {
    if (!confirm("Delete this review permanently?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  }

  return (
    <PortalShell isAdmin>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-display text-4xl">Reviews</h1>
        <div className="flex gap-2">
          {(["pending", "approved", "rejected", "all"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-widest ${filter === f ? "bg-[image:var(--gradient-royal)] text-primary-foreground" : "glass"}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-4">
        {!rows.length && <div className="glass rounded-2xl p-8 text-center text-muted-foreground">No reviews.</div>}
        {rows.map(r => (
          <article key={r.id} className="glass rounded-2xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="font-semibold">{r.full_name}</div>
                  {r.verified && <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest rounded-full bg-primary/15 text-primary px-2 py-0.5"><BadgeCheck className="h-3 w-3" /> Verified</span>}
                  {r.featured && <span className="text-[10px] uppercase tracking-widest rounded-full bg-accent/20 text-accent px-2 py-0.5">Featured</span>}
                  <span className={`text-[10px] uppercase tracking-widest rounded-full px-2 py-0.5 ${r.status === "approved" ? "bg-green-500/15 text-green-400" : r.status === "rejected" ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"}`}>{r.status}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.company ?? "—"} · {r.service_received ?? "—"} · {new Date(r.created_at).toLocaleDateString("en-GB")}</div>
              </div>
              <StarRating value={r.rating} />
            </div>
            {editing === r.id ? (
              <div className="mt-4 grid gap-2">
                <textarea value={editBody} onChange={e => setEditBody(e.target.value)} rows={4} className="w-full rounded-xl bg-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <div className="flex gap-2">
                  <button onClick={async () => { await update(r.id, { body: editBody }); setEditing(null); }} className="rounded-full bg-[image:var(--gradient-royal)] px-4 py-1.5 text-xs text-primary-foreground">Save</button>
                  <button onClick={() => setEditing(null)} className="rounded-full glass px-4 py-1.5 text-xs">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-foreground/90">{r.body}</p>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              {r.status !== "approved" && <IconBtn icon={<Check className="h-3.5 w-3.5" />} label="Approve" onClick={() => approve(r)} />}
              {r.status !== "rejected" && <IconBtn icon={<X className="h-3.5 w-3.5" />} label="Reject" onClick={() => reject(r)} />}
              <IconBtn icon={<Pin className="h-3.5 w-3.5" />} label={r.featured ? "Unpin" : "Pin/Feature"} onClick={() => feature(r)} />
              <IconBtn icon={<Edit3 className="h-3.5 w-3.5" />} label="Edit" onClick={() => { setEditing(r.id); setEditBody(r.body); }} />
              <IconBtn icon={<Trash2 className="h-3.5 w-3.5" />} label="Delete" onClick={() => remove(r.id)} danger />
            </div>
          </article>
        ))}
      </div>
    </PortalShell>
  );
}

function IconBtn({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${danger ? "border border-destructive/40 text-destructive hover:bg-destructive/10" : "glass hover:border-primary"}`}>
      {icon}{label}
    </button>
  );
}
