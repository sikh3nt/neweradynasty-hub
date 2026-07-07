import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { AdminGate } from "@/components/portal/AdminGate";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, FolderKanban, Users, Inbox } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — New Era Dynasty" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminGate><AdminHome /></AdminGate>,
});

function AdminHome() {
  const [stats, setStats] = useState({ pending: 0, projects: 0, clients: 0, enquiries: 0 });
  useEffect(() => {
    (async () => {
      const [{ count: pending }, { count: projects }, { count: clients }, { count: enquiries }] = await Promise.all([
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
      ]);
      setStats({ pending: pending ?? 0, projects: projects ?? 0, clients: clients ?? 0, enquiries: enquiries ?? 0 });
    })();
  }, []);
  const cards = [
    { label: "Pending reviews", value: stats.pending, icon: Star, to: "/admin/reviews" },
    { label: "Projects", value: stats.projects, icon: FolderKanban, to: "/admin/projects" },
    { label: "Clients", value: stats.clients, icon: Users, to: "/admin/clients" },
    { label: "Enquiries", value: stats.enquiries, icon: Inbox, to: "/admin/contact" },
  ];
  return (
    <PortalShell isAdmin>
      <h1 className="font-display text-4xl">Admin overview</h1>
      <p className="mt-2 text-sm text-muted-foreground">Manage projects, clients, reviews, and enquiries.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to} className="glass rounded-2xl p-5 hover:shadow-glow-gold transition-luxury">
            <Icon className="h-5 w-5 text-primary" />
            <div className="mt-4 font-display text-3xl">{value}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
          </Link>
        ))}
      </div>
    </PortalShell>
  );
}
