import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { AdminGate } from "@/components/portal/AdminGate";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Client = { id: string; full_name: string | null; company: string | null; phone: string | null; created_at: string };

export const Route = createFileRoute("/_authenticated/admin/clients")({
  head: () => ({ meta: [{ title: "Clients — Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminGate><AdminClients /></AdminGate>,
});

function AdminClients() {
  const [rows, setRows] = useState<Client[]>([]);
  useEffect(() => {
    supabase.from("profiles").select("id, full_name, company, phone, created_at").order("created_at", { ascending: false })
      .then(({ data }) => setRows((data ?? []) as Client[]));
  }, []);
  return (
    <PortalShell isAdmin>
      <h1 className="font-display text-4xl">Clients</h1>
      <p className="mt-2 text-sm text-muted-foreground">Registered client accounts.</p>
      <div className="mt-8 overflow-hidden glass rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Company</th><th className="px-4 py-3 text-left">Phone</th><th className="px-4 py-3 text-left">Joined</th></tr>
          </thead>
          <tbody>
            {rows.map(c => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-3">{c.full_name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.company ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.phone ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString("en-GB")}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No clients yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </PortalShell>
  );
}
