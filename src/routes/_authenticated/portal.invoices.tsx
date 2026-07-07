import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Invoice = { id: string; invoice_number: string; amount: number; currency: string; status: string; due_date: string | null; created_at: string; };

export const Route = createFileRoute("/_authenticated/portal/invoices")({
  head: () => ({ meta: [{ title: "Invoices — Client Portal" }, { name: "robots", content: "noindex" }] }),
  component: Invoices,
});

function Invoices() {
  const [rows, setRows] = useState<Invoice[]>([]);
  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase.from("invoices").select("*").eq("client_id", u.user.id).order("created_at", { ascending: false });
      setRows((data ?? []) as Invoice[]);
    })();
  }, []);
  return (
    <PortalShell>
      <h1 className="font-display text-4xl">Invoices</h1>
      <p className="mt-2 text-sm text-muted-foreground">Quotes, invoices, and payment history.</p>
      <div className="mt-8 overflow-hidden glass rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr><th className="px-4 py-3 text-left">Invoice</th><th className="px-4 py-3 text-left">Amount</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Due</th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono">{r.invoice_number}</td>
                <td className="px-4 py-3">{r.currency} {Number(r.amount).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] uppercase tracking-widest text-primary">{r.status}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{r.due_date ? new Date(r.due_date).toLocaleDateString("en-GB") : "—"}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No invoices yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </PortalShell>
  );
}
