import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, LogIn, UserCircle2 } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";
import nedPyramid from "@/assets/new-era-dynasty-pyramid.jpg.asset.json";
import type { Session } from "@supabase/supabase-js";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-luxury ${
        scrolled ? "glass-strong shadow-elegant" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group min-w-0">
            <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-black/60 border border-border shadow-glow-gold">
              <img src={nedPyramid.url} alt="New Era Dynasty logo" className="h-full w-full object-contain p-1" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-base sm:text-lg font-semibold truncate text-gold-gradient">
                New Era Dynasty
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                Tozamile Sikhenjana
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-luxury relative"
                activeProps={{ className: "px-3 py-2 text-sm text-primary" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {session ? (
              <Link
                to="/portal"
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary hover:bg-primary/20 transition-luxury"
              >
                <UserCircle2 className="h-4 w-4" /> Portal
              </Link>
            ) : (
              <Link
                to="/auth"
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground hover:border-primary hover:text-primary transition-luxury"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
            )}
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center rounded-full bg-[image:var(--gradient-royal)] px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow-gold hover:brightness-110 transition-luxury"
            >
              Hire me
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden grid h-10 w-10 place-items-center rounded-lg glass"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden glass-strong border-t border-border">
          <div className="mx-auto max-w-7xl px-4 py-4 grid gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{ className: "rounded-lg px-3 py-2.5 text-sm text-primary bg-primary/10" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              {session ? (
                <Link to="/portal" className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary text-center">Portal</Link>
              ) : (
                <Link to="/auth" className="rounded-full border border-border px-4 py-2 text-sm text-center">Sign in</Link>
              )}
              <Link to="/contact" className="rounded-full bg-[image:var(--gradient-royal)] px-4 py-2 text-sm text-primary-foreground text-center">Hire me</Link>
            </div>
            <div className="mt-3 text-xs text-muted-foreground text-center">
              {SITE.location}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
