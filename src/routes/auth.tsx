import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { Chrome, Mail, Lock, User, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Client Portal | New Era Dynasty" },
      { name: "description", content: "Sign in or create an account to access your client portal." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/portal" });
    });
  }, [navigate]);

  async function onEmailAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const full_name = String(fd.get("full_name") ?? "");
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        navigate({ to: "/portal" });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/portal", data: { full_name } },
        });
        if (error) throw error;
        toast.success("Account created. Check your email if verification is required.");
        navigate({ to: "/portal" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
        if (error) throw error;
        toast.success("Password reset email sent.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  }

  async function onGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/portal" });
    if (result.error) toast.error(result.error.message);
    else if (!result.redirected) navigate({ to: "/portal" });
  }

  return (
    <main className="min-h-dvh grid lg:grid-cols-2 hero-bg">
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <Link to="/" className="relative inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
        <div className="relative">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Client Portal</div>
          <h1 className="mt-4 font-display text-5xl text-foreground leading-tight">Your project, <br /><span className="text-gold-gradient">in your palm.</span></h1>
          <p className="mt-6 text-muted-foreground max-w-md">Track progress, exchange files, communicate securely, and leave verified reviews when the work is complete.</p>
        </div>
        <div className="relative text-xs text-muted-foreground">© {new Date().getFullYear()} New Era Dynasty</div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md glass-strong rounded-3xl p-8">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary mb-6"><ArrowLeft className="h-3.5 w-3.5" /> Back</Link>
          <h2 className="font-display text-3xl text-foreground">
            {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to access your client portal." : mode === "signup" ? "Join the Dynasty." : "We'll send you a reset link."}
          </p>

          {mode !== "reset" && (
            <>
              <button onClick={onGoogle} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm hover:border-primary hover:text-primary transition-luxury">
                <Chrome className="h-4 w-4" /> Continue with Google
              </button>
              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
              </div>
            </>
          )}

          <form onSubmit={onEmailAuth} className="grid gap-3">
            {mode === "signup" && (
              <IconInput icon={<User className="h-4 w-4" />} name="full_name" placeholder="Full name" required />
            )}
            <IconInput icon={<Mail className="h-4 w-4" />} name="email" type="email" placeholder="Email" required />
            {mode !== "reset" && (
              <IconInput icon={<Lock className="h-4 w-4" />} name="password" type="password" placeholder="Password" required minLength={6} />
            )}
            <button disabled={loading} className="mt-2 rounded-xl bg-[image:var(--gradient-royal)] px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow-gold disabled:opacity-60">
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-1 text-xs text-muted-foreground">
            {mode === "signin" && <>
              <button onClick={() => setMode("reset")} className="text-left hover:text-primary">Forgot your password?</button>
              <button onClick={() => setMode("signup")} className="text-left hover:text-primary">Don't have an account? Create one</button>
            </>}
            {mode === "signup" && <button onClick={() => setMode("signin")} className="text-left hover:text-primary">Already have an account? Sign in</button>}
            {mode === "reset" && <button onClick={() => setMode("signin")} className="text-left hover:text-primary">Back to sign in</button>}
          </div>
        </div>
      </div>
    </main>
  );
}

function IconInput({ icon, ...props }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      <input {...props} className="w-full rounded-xl bg-input pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
    </div>
  );
}
