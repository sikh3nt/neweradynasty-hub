import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FolderKanban, MessageSquare, Receipt, Star, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/portal/")({
  head: () => ({ meta: [{ title: "Dashboard — Client Portal" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { isAdmin } = useIsAdmin();
  const [stats, setStats] = useState({ active: 0, completed: 0, unread: 0, outstanding: 0 });
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;
      const [{ data: profile }, { count: active }, { count: completed }, { count: unread }, { data: inv }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", uid).maybeSingle(),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("client_id", uid).in("status", ["planning","in_progress","review","on_hold"]),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("client_id", uid).eq("status", "completed"),
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("recipient_id", uid).is("read_at", null),
        supabase.from("invoices").select("amount").eq("client_id", uid).in("status", ["sent","overdue"]),
      ]);
      setName(profile?.full_name ?? u.user?.email ?? "");
      const outstanding = (inv ?? []).reduce((s, r) => s + Number(r.amount ?? 0), 0);
      setStats({ active: active ?? 0, completed: completed ?? 0, unread: unread ?? 0, outstanding });
    })();
  }, []);

  return (
    <PortalShell isAdmin={false}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-primary">Welcome</div>
          <h1 className="mt-2 font-display text-4xl">{name || "Client"}</h1>
        </div>
        {isAdmin && (
          <Link to="/admin" className="rounded-full bg-[image:var(--gradient-royal)] px-4 py-2 text-sm text-primary-foreground">Open admin console</Link>
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active projects" value={stats.active} icon={<FolderKanban className="h-5 w-5" />} to="/portal/projects" />
        <StatCard label="Completed" value={stats.completed} icon={<Star className="h-5 w-5" />} to="/portal/projects" />
        <StatCard label="Unread messages" value={stats.unread} icon={<MessageSquare className="h-5 w-5" />} to="/portal/messages" />
        <StatCard label="Outstanding (ZAR)" value={`R ${stats.outstanding.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`} icon={<Receipt className="h-5 w-5" />} to="/portal/invoices" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <QuickLink title="Projects" desc="Track progress, milestones, and deliverables." to="/portal/projects" />
        <QuickLink title="Messages" desc="Secure communication with Tozamile & team." to="/portal/messages" />
        <QuickLink title="Invoices" desc="Quotes, invoices, and payment history." to="/portal/invoices" />
        <QuickLink title="Leave a Review" desc="Verified feedback for completed work." to="/portal/reviews" />
      </div>
    </PortalShell>
  );
}

function StatCard({ label, value, icon, to }: { label: string; value: number | string; icon: React.ReactNode; to: string }) {
  return (
    <Link to={to} className="glass rounded-2xl p-5 hover:shadow-glow-gold transition-luxury">
      <div className="flex items-center justify-between text-primary">{icon}<ArrowRight className="h-4 w-4 opacity-60" /></div>
      <div className="mt-4 font-display text-3xl text-foreground">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </Link>
  );
}
function QuickLink({ title, desc, to }: { title: string; desc: string; to: string }) {
  return (
    <Link to={to} className="glass rounded-2xl p-6 hover:shadow-glow-gold transition-luxury">
      <div className="font-display text-xl text-foreground">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-4 inline-flex items-center gap-2 text-sm text-primary">Open <ArrowRight className="h-4 w-4" /></div>
    </Link>
  );
}
