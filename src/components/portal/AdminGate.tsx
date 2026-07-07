import { useIsAdmin } from "@/hooks/use-is-admin";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ShieldOff } from "lucide-react";

export function AdminGate({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useIsAdmin();
  if (loading) return (
    <div className="min-h-dvh grid place-items-center text-muted-foreground text-sm">Checking access…</div>
  );
  if (!isAdmin) return (
    <div className="min-h-dvh grid place-items-center hero-bg p-6">
      <div className="glass-strong rounded-3xl p-10 text-center max-w-md">
        <ShieldOff className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-4 font-display text-3xl">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">This area is restricted to administrators. Contact Tozamile if you should have access.</p>
        <Link to="/portal" className="mt-6 inline-flex rounded-full bg-[image:var(--gradient-royal)] px-5 py-2.5 text-sm font-medium text-primary-foreground">Back to portal</Link>
      </div>
    </div>
  );
  return <>{children}</>;
}
