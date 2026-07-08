import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { SITE } from "@/lib/site";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Tozamile Sikhenjana | New Era Dynasty" },
      { name: "description", content: "Get in touch with Tozamile Sikhenjana. Business enquiries, collaborations, and quote requests welcome." },
      { property: "og:title", content: "Contact New Era Dynasty" },
      { property: "og:description", content: "Business enquiries, collaborations, and quote requests." },
          { property: "og:url", content: "https://neweradynasty-hub.lovable.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://neweradynasty-hub.lovable.app/contact" }],
  component: Contact,
});

const schema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  subject: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(2000),
  service_interest: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
});

function Contact() {
  const [kind, setKind] = useState<"contact" | "enquiry" | "collab" | "quote">("contact");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "Invalid form");
    setLoading(true);
    const { error } = await supabase.from("contact_submissions").insert({ kind, ...parsed.data });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Message sent. I'll get back to you shortly.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <PageShell eyebrow="Contact" title="Let's build something worthy." intro="Business enquiries, collaborations, and quote requests — I read every message personally.">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="grid gap-4 content-start">
          <div className="glass rounded-2xl p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-primary">Direct</div>
            <ul className="mt-4 grid gap-4 text-sm">
              <li className="flex items-start gap-3"><Mail className="h-5 w-5 text-primary mt-0.5" /><a href={`mailto:${SITE.email}`} className="hover:text-primary break-all">{SITE.email}</a></li>
              <li className="flex items-start gap-3"><Phone className="h-5 w-5 text-primary mt-0.5" /><a href={`tel:${SITE.phonePrimary.replace(/\s/g,'')}`} className="hover:text-primary">{SITE.phonePrimary}</a></li>
              <li className="flex items-start gap-3"><Phone className="h-5 w-5 text-primary mt-0.5" /><a href={`tel:${SITE.phoneSecondary.replace(/\s/g,'')}`} className="hover:text-primary">{SITE.phoneSecondary}</a></li>
              <li className="flex items-start gap-3"><MessageCircle className="h-5 w-5 text-primary mt-0.5" /><a target="_blank" rel="noopener noreferrer" href={`https://wa.me/${SITE.whatsapp}`} className="hover:text-primary">WhatsApp: {SITE.phonePrimary}</a></li>
              <li className="flex items-start gap-3"><MapPin className="h-5 w-5 text-primary mt-0.5" />{SITE.location}</li>
            </ul>
          </div>
          <a target="_blank" rel="noopener noreferrer" href={`https://wa.me/${SITE.whatsapp}?text=Hi%20Tozamile%2C%20I%27d%20like%20to%20discuss...`} className="glass rounded-2xl p-5 flex items-center gap-3 hover:shadow-glow-gold transition-luxury">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><MessageCircle className="h-5 w-5" /></div>
            <div>
              <div className="text-sm font-semibold">Chat on WhatsApp</div>
              <div className="text-xs text-muted-foreground">Fastest way to reach me</div>
            </div>
          </a>
        </div>

        <form onSubmit={onSubmit} className="glass-strong rounded-3xl p-6 sm:p-8 grid gap-4">
          <div className="flex flex-wrap gap-2">
            {(["contact", "enquiry", "collab", "quote"] as const).map((k) => (
              <button type="button" key={k} onClick={() => setKind(k)}
                className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-widest transition-luxury ${kind === k ? "bg-[image:var(--gradient-royal)] text-primary-foreground shadow-glow-gold" : "glass hover:border-primary"}`}>
                {k === "contact" ? "General" : k === "enquiry" ? "Business enquiry" : k === "collab" ? "Collaboration" : "Quote request"}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" name="full_name" required />
            <Input label="Email" name="email" type="email" required />
            <Input label="Phone (optional)" name="phone" />
            <Input label="Company (optional)" name="company" />
            {kind !== "contact" && <Input label="Service of interest" name="service_interest" placeholder="e.g. Website Development" />}
            {kind === "quote" && <Input label="Estimated budget" name="budget" placeholder="e.g. R10,000 – R25,000" />}
            <div className="sm:col-span-2"><Input label="Subject (optional)" name="subject" /></div>
          </div>
          <label className="block">
            <span className="block text-sm text-muted-foreground mb-2">Message</span>
            <textarea name="message" required minLength={10} maxLength={2000} rows={6}
              className="w-full rounded-xl bg-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </label>
          <button disabled={loading} className="justify-self-start rounded-full bg-[image:var(--gradient-royal)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow-gold disabled:opacity-60">
            {loading ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </PageShell>
  );
}

function Input({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-sm text-muted-foreground mb-2">{label}</span>
      <input name={name} type={type} required={required} placeholder={placeholder}
        className="w-full rounded-xl bg-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
    </label>
  );
}
