import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — New Era Dynasty" }, { name: "robots", content: "noindex" }] }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase auto-parses the recovery token on this page load.
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") ?? "");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated.");
    navigate({ to: "/portal" });
  }

  return (
    <main className="min-h-dvh grid place-items-center hero-bg p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md glass-strong rounded-3xl p-8 grid gap-4">
        <h1 className="font-display text-3xl">Set a new password</h1>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input name="password" type="password" required minLength={6} placeholder="New password"
            className="w-full rounded-xl bg-input pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <button disabled={loading} className="rounded-xl bg-[image:var(--gradient-royal)] px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow-gold disabled:opacity-60">
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </main>
  );
}
