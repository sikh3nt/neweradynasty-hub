import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { AdminGate } from "@/components/portal/AdminGate";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus } from "lucide-react";

type Project = { id: string; client_id: string; title: string; description: string | null; service_type: string | null; status: string; progress: number; estimated_completion: string | null; created_at: string; };
type Client = { id: string; full_name: string | null; company: string | null };

export const Route = createFileRoute("/_authenticated/admin/projects")({
  head: () => ({ meta: [{ title: "Projects — Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminGate><AdminProjects /></AdminGate>,
});

function AdminProjects() {
  const [rows, setRows] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    setRows((data ?? []) as Project[]);
    const { data: c } = await supabase.from("profiles").select("id, full_name, company");
    setClients((c ?? []) as Client[]);
  };
  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("projects").insert({
      client_id: String(fd.get("client_id")),
      title: String(fd.get("title")),
      description: String(fd.get("description") ?? "") || null,
      service_type: String(fd.get("service_type") ?? "") || null,
      estimated_completion: String(fd.get("estimated_completion") ?? "") || null,
      status: "planning", progress: 0,
    });
    if (error) return toast.error(error.message);
    toast.success("Project created");
    setCreating(false);
    (e.target as HTMLFormElement).reset();
    load();
  }

  async function update(id: string, patch: Partial<Project>) {
    const { error } = await supabase.from("projects").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <PortalShell isAdmin>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-display text-4xl">Projects</h1>
        <button onClick={() => setCreating(v => !v)} className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-royal)] px-4 py-2 text-sm text-primary-foreground">
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>
      {creating && (
        <form onSubmit={create} className="mt-6 glass-strong rounded-2xl p-6 grid gap-3 sm:grid-cols-2">
          <select name="client_id" required className="rounded-xl bg-input px-4 py-3 text-sm sm:col-span-2">
            <option value="">— Assign to client —</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.full_name ?? c.id.slice(0, 8)} {c.company ? `· ${c.company}` : ""}</option>)}
          </select>
          <input name="title" placeholder="Project title" required className="rounded-xl bg-input px-4 py-3 text-sm" />
          <input name="service_type" placeholder="Service type (e.g. Website Development)" className="rounded-xl bg-input px-4 py-3 text-sm" />
          <input name="estimated_completion" type="date" className="rounded-xl bg-input px-4 py-3 text-sm" />
          <textarea name="description" placeholder="Description" rows={3} className="sm:col-span-2 rounded-xl bg-input px-4 py-3 text-sm" />
          <button className="sm:col-span-2 justify-self-start rounded-full bg-[image:var(--gradient-royal)] px-5 py-2 text-sm text-primary-foreground">Create</button>
        </form>
      )}
      <div className="mt-8 grid gap-4">
        {rows.map(p => {
          const client = clients.find(c => c.id === p.client_id);
          return (
            <article key={p.id} className="glass rounded-2xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">{client?.full_name ?? p.client_id.slice(0,8)} · {p.service_type ?? "—"}</div>
                  <h2 className="font-display text-xl mt-1">{p.title}</h2>
                </div>
                <select value={p.status} onChange={e => update(p.id, { status: e.target.value, completed_at: e.target.value === "completed" ? new Date().toISOString() : null } as Partial<Project>)} className="rounded-lg bg-input px-3 py-1.5 text-xs">
                  {["planning","in_progress","review","completed","on_hold","cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <input type="range" min={0} max={100} value={p.progress} onChange={e => update(p.id, { progress: Number(e.target.value) })} className="flex-1" />
                <span className="text-sm text-muted-foreground w-10 text-right">{p.progress}%</span>
              </div>
            </article>
          );
        })}
        {!rows.length && <div className="glass rounded-2xl p-8 text-center text-muted-foreground">No projects yet.</div>}
      </div>
    </PortalShell>
  );
}
