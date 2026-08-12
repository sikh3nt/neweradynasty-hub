import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { LayoutDashboard, FolderKanban, MessageSquare, Receipt, Star, LogOut, Home, Shield, Users, Inbox, Menu, X, BarChart3 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function PortalShell({ children, isAdmin = false }: { children: React.ReactNode; isAdmin?: boolean }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  const clientLinks = [
    { to: "/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/portal/projects", label: "Projects", icon: FolderKanban },
    { to: "/portal/messages", label: "Messages", icon: MessageSquare },
    { to: "/portal/invoices", label: "Invoices", icon: Receipt },
    { to: "/portal/reviews", label: "My Reviews", icon: Star },
  ];
  const adminLinks = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/admin/reviews", label: "Reviews", icon: Star },
    { to: "/admin/projects", label: "Projects", icon: FolderKanban },
    { to: "/admin/clients", label: "Clients", icon: Users },
    { to: "/admin/contact", label: "Enquiries", icon: Inbox },
    { to: "/admin/analytics", label: "Demo analytics", icon: BarChart3 },
  ];
  const links = isAdmin ? adminLinks : clientLinks;

  return (
    <div className="min-h-dvh grid lg:grid-cols-[260px_1fr] bg-[color:var(--obsidian)]">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass-strong border-r border-border transition-transform lg:relative lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-royal)] text-primary-foreground font-bold">N</div>
            <div>
              <div className="text-sm font-semibold text-gold-gradient">{isAdmin ? "Admin Console" : "Client Portal"}</div>
              <div className="text-[10px] text-muted-foreground">New Era Dynasty</div>
            </div>
          </Link>
        </div>
        <nav className="px-3 grid gap-1">
          {links.map(({ to, label, icon: Icon, exact }) => (
            <Link key={to} to={to}
              activeProps={{ className: "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm bg-primary/15 text-primary" }}
              activeOptions={{ exact: !!exact }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-luxury">
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 inset-x-0 p-3 border-t border-border grid gap-1">
          {!isAdmin && (
            <Link to="/admin" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              <Shield className="h-4 w-4" /> Admin console
            </Link>
          )}
          {isAdmin && (
            <Link to="/portal" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              <LayoutDashboard className="h-4 w-4" /> Client view
            </Link>
          )}
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
            <Home className="h-4 w-4" /> Back to site
          </Link>
          <button onClick={signOut} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div>
        <div className="lg:hidden sticky top-0 z-30 glass-strong border-b border-border px-4 py-3 flex items-center justify-between">
          <button onClick={() => setOpen(v => !v)} aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-lg glass">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="text-sm font-semibold text-gold-gradient">{isAdmin ? "Admin" : "Portal"}</div>
          <div className="w-10" />
        </div>
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
