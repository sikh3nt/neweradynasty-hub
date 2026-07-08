import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Enter a valid email");
    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    setLoading(false);
    if (error && !error.message.includes("duplicate")) toast.error(error.message);
    else {
      toast.success("Subscribed. Welcome to the Dynasty.");
      setEmail("");
    }
  };

  return (
    <footer className="relative mt-24 border-t border-border bg-[color:var(--obsidian)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[image:var(--gradient-royal)] text-primary-foreground font-bold shadow-glow-gold">N</div>
              <div>
                <div className="font-display text-lg text-gold-gradient">New Era Dynasty</div>
                <div className="text-xs text-muted-foreground">Reg. {SITE.regNumber}</div>
              </div>
            </Link>
            <p className="mt-6 max-w-md text-sm text-muted-foreground">
              {SITE.slogan}
            </p>
            <form onSubmit={subscribe} className="mt-6 flex max-w-sm items-center gap-2 rounded-full glass px-1.5 py-1.5">
              <label htmlFor="newsletter-email" className="sr-only">Email address for newsletter</label>
              <input
                id="newsletter-email"
                type="email"
                required
                aria-label="Email address for newsletter"
                placeholder="Join the newsletter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              <button disabled={loading} className="inline-flex items-center gap-1.5 rounded-full bg-[image:var(--gradient-royal)] px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60">
                <Send className="h-3.5 w-3.5" /> Join
              </button>
            </form>
          </div>

          <div>
            <div className="text-sm font-semibold text-foreground mb-4">Navigate</div>
            <ul className="grid gap-2 text-sm text-muted-foreground">
              {NAV.map((n) => (
                <li key={n.to}><Link to={n.to} className="hover:text-primary transition-luxury">{n.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-foreground mb-4">Contact</div>
            <ul className="grid gap-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary" /> <span>{SITE.location}</span></li>
              <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary" /> <a href={`mailto:${SITE.email}`} className="hover:text-primary break-all">{SITE.email}</a></li>
              <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary" /> <a href={`tel:${SITE.phonePrimary.replace(/\s/g,'')}`} className="hover:text-primary">{SITE.phonePrimary}</a></li>
              <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary" /> <a href={`tel:${SITE.phoneSecondary.replace(/\s/g,'')}`} className="hover:text-primary">{SITE.phoneSecondary}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} New Era Dynasty · {SITE.regNumber} · All rights reserved.</div>
          <div>Designed with precision. Built with purpose.</div>
        </div>
      </div>
    </footer>
  );
}
