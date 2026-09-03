import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { AdminGate } from "@/components/portal/AdminGate";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Edit3, Trash2, Plus, Save, X } from "lucide-react";

type Profile = {
  id: string;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  created_at: string;
};

type ManualClient = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  source: string | null;
  notes: string | null;
  created_at: string;
};

type ManualDraft = Omit<ManualClient, "id" | "created_at">;

const emptyDraft: ManualDraft = {
  full_name: "",
  email: "",
  phone: "",
  company: "",
  status: "lead",
  source: "",
  notes: "",
};

const statuses = ["lead", "in discussion", "active", "completed", "archived"] as const;

export const Route = createFileRoute("/_authenticated/admin/clients")({
  head: () => ({ meta: [{ title: "Clients — Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AdminGate>
      <AdminClients />
    </AdminGate>
  ),
});

function AdminClients() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [manual, setManual] = useState<ManualClient[]>([]);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [profileDraft, setProfileDraft] = useState<Partial<Profile>>({});
  const [editingManual, setEditingManual] = useState<string | null>(null);
  const [manualDraft, setManualDraft] = useState<ManualDraft>(emptyDraft);
  const [adding, setAdding] = useState(false);
  const [newDraft, setNewDraft] = useState<ManualDraft>(emptyDraft);

  const load = async () => {
    const [p, m] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, company, phone, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("manual_clients")
        .select("id, full_name, email, phone, company, status, source, notes, created_at")
        .order("created_at", { ascending: false }),
    ]);
    setProfiles((p.data ?? []) as Profile[]);
    setManual((m.data ?? []) as ManualClient[]);
  };

  useEffect(() => {
    void load();
  }, []);

  async function saveProfile(id: string) {
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profileDraft.full_name ?? null,
        company: profileDraft.company ?? null,
        phone: profileDraft.phone ?? null,
      })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Client updated");
    setEditingProfile(null);
    void load();
  }

  async function deleteProfile(id: string) {
    if (!confirm("Delete this registered client profile? This cannot be undone.")) return;
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Client deleted");
    void load();
  }

  async function addManual() {
    if (!newDraft.full_name.trim()) return toast.error("Add a name first");
    const { error } = await supabase.from("manual_clients").insert({
      ...newDraft,
      email: newDraft.email || null,
      phone: newDraft.phone || null,
      company: newDraft.company || null,
      source: newDraft.source || null,
      notes: newDraft.notes || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Client added");
    setNewDraft(emptyDraft);
    setAdding(false);
    void load();
  }

  async function saveManual(id: string) {
    const { error } = await supabase
      .from("manual_clients")
      .update({
        full_name: manualDraft.full_name,
        email: manualDraft.email || null,
        phone: manualDraft.phone || null,
        company: manualDraft.company || null,
        status: manualDraft.status,
        source: manualDraft.source || null,
        notes: manualDraft.notes || null,
      })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Client updated");
    setEditingManual(null);
    void load();
  }

  async function deleteManual(id: string) {
    if (!confirm("Delete this client?")) return;
    const { error } = await supabase.from("manual_clients").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Client deleted");
    void load();
  }

  const inputCls =
    "w-full rounded-lg bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none";

  return (
    <PortalShell isAdmin>
      <h1 className="font-display text-4xl">Clients</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Registered accounts from the portal, plus clients you add manually.
      </p>

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Registered clients</h2>
        <div className="mt-3 overflow-x-auto glass rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((c) =>
                editingProfile === c.id ? (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <label className="sr-only" htmlFor={`pn-${c.id}`}>Name</label>
                      <input id={`pn-${c.id}`} className={inputCls} value={profileDraft.full_name ?? ""}
                        onChange={(e) => setProfileDraft((d) => ({ ...d, full_name: e.target.value }))} />
                    </td>
                    <td className="px-4 py-3">
                      <label className="sr-only" htmlFor={`pc-${c.id}`}>Company</label>
                      <input id={`pc-${c.id}`} className={inputCls} value={profileDraft.company ?? ""}
                        onChange={(e) => setProfileDraft((d) => ({ ...d, company: e.target.value }))} />
                    </td>
                    <td className="px-4 py-3">
                      <label className="sr-only" htmlFor={`pp-${c.id}`}>Phone</label>
                      <input id={`pp-${c.id}`} className={inputCls} value={profileDraft.phone ?? ""}
                        onChange={(e) => setProfileDraft((d) => ({ ...d, phone: e.target.value }))} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => void saveProfile(c.id)} className="rounded-lg bg-primary/15 p-2 text-primary" aria-label="Save client">
                          <Save className="h-4 w-4" />
                        </button>
                        <button onClick={() => setEditingProfile(null)} className="rounded-lg bg-muted p-2 text-muted-foreground" aria-label="Cancel edit">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-4 py-3">{c.full_name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.company ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProfile(c.id);
                            setProfileDraft(c);
                          }}
                          className="rounded-lg bg-muted p-2 text-muted-foreground hover:text-foreground"
                          aria-label={`Edit ${c.full_name ?? "client"}`}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => void deleteProfile(c.id)}
                          className="rounded-lg bg-muted p-2 text-destructive"
                          aria-label={`Delete ${c.full_name ?? "client"}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
              {!profiles.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    No registered clients yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Manual clients</h2>
          <button
            onClick={() => setAdding((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-royal)] px-4 py-2 text-xs font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Add client
          </button>
        </div>

        {adding && (
          <div className="mt-4 glass rounded-2xl p-4 grid gap-3 sm:grid-cols-2">
            <ManualFields draft={newDraft} onChange={setNewDraft} idPrefix="new" inputCls={inputCls} />
            <div className="sm:col-span-2 flex gap-2">
              <button onClick={() => void addManual()} className="rounded-full bg-primary/15 px-4 py-2 text-sm text-primary">
                Save client
              </button>
              <button onClick={() => setAdding(false)} className="rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 grid gap-3">
          {manual.map((c) =>
            editingManual === c.id ? (
              <div key={c.id} className="glass rounded-2xl p-4 grid gap-3 sm:grid-cols-2">
                <ManualFields draft={manualDraft} onChange={setManualDraft} idPrefix={c.id} inputCls={inputCls} />
                <div className="sm:col-span-2 flex gap-2">
                  <button onClick={() => void saveManual(c.id)} className="rounded-full bg-primary/15 px-4 py-2 text-sm text-primary">
                    Save changes
                  </button>
                  <button onClick={() => setEditingManual(null)} className="rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div key={c.id} className="glass rounded-2xl p-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="font-medium">
                    {c.full_name}
                    <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                      {c.status}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {[c.company, c.email, c.phone].filter(Boolean).join(" · ") || "No contact details"}
                  </div>
                  {c.source && <div className="mt-1 text-xs text-muted-foreground">Source: {c.source}</div>}
                  {c.notes && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{c.notes}</p>}
                  <div className="mt-2 text-xs text-muted-foreground">
                    Added {new Date(c.created_at).toLocaleDateString("en-GB")}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingManual(c.id);
                      setManualDraft({
                        full_name: c.full_name,
                        email: c.email ?? "",
                        phone: c.phone ?? "",
                        company: c.company ?? "",
                        status: c.status,
                        source: c.source ?? "",
                        notes: c.notes ?? "",
                      });
                    }}
                    className="rounded-lg bg-muted p-2 text-muted-foreground hover:text-foreground"
                    aria-label={`Edit ${c.full_name}`}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => void deleteManual(c.id)}
                    className="rounded-lg bg-muted p-2 text-destructive"
                    aria-label={`Delete ${c.full_name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ),
          )}
          {!manual.length && !adding && (
            <div className="glass rounded-2xl px-4 py-10 text-center text-sm text-muted-foreground">
              No manual clients yet. Add anyone who hires you outside the website.
            </div>
          )}
        </div>
      </section>
    </PortalShell>
  );
}

function ManualFields({
  draft,
  onChange,
  idPrefix,
  inputCls,
}: {
  draft: ManualDraft;
  onChange: (d: ManualDraft) => void;
  idPrefix: string;
  inputCls: string;
}) {
  const set = (patch: Partial<ManualDraft>) => onChange({ ...draft, ...patch });
  return (
    <>
      <Field id={`${idPrefix}-name`} label="Full name">
        <input id={`${idPrefix}-name`} className={inputCls} value={draft.full_name} onChange={(e) => set({ full_name: e.target.value })} placeholder="Client name" />
      </Field>
      <Field id={`${idPrefix}-company`} label="Company">
        <input id={`${idPrefix}-company`} className={inputCls} value={draft.company ?? ""} onChange={(e) => set({ company: e.target.value })} placeholder="Company" />
      </Field>
      <Field id={`${idPrefix}-email`} label="Email">
        <input id={`${idPrefix}-email`} type="email" className={inputCls} value={draft.email ?? ""} onChange={(e) => set({ email: e.target.value })} placeholder="name@example.com" />
      </Field>
      <Field id={`${idPrefix}-phone`} label="Phone">
        <input id={`${idPrefix}-phone`} className={inputCls} value={draft.phone ?? ""} onChange={(e) => set({ phone: e.target.value })} placeholder="+27 …" />
      </Field>
      <Field id={`${idPrefix}-status`} label="Status">
        <select id={`${idPrefix}-status`} className={inputCls} value={draft.status} onChange={(e) => set({ status: e.target.value })}>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>
      <Field id={`${idPrefix}-source`} label="Source">
        <input id={`${idPrefix}-source`} className={inputCls} value={draft.source ?? ""} onChange={(e) => set({ source: e.target.value })} placeholder="Referral, WhatsApp, walk-in…" />
      </Field>
      <div className="sm:col-span-2">
        <Field id={`${idPrefix}-notes`} label="Notes">
          <textarea id={`${idPrefix}-notes`} rows={3} className={inputCls} value={draft.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} placeholder="What they need, budget, next step…" />
        </Field>
      </div>
    </>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
