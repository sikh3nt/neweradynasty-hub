import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Handshake, Gift, Percent, FileSignature, Wallet, CheckCircle2 } from "lucide-react";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/referral")({
  head: () => ({
    meta: [
      { title: "Referral partnership — free website, 20% commission" },
      { name: "description", content: "Get a free website from New Era Dynasty and earn 20% commission on every paying client you refer. Five partner slots open each month." },
      { property: "og:title", content: "Referral partnership — New Era Dynasty" },
      { property: "og:description", content: "A free website in exchange for referrals, plus 20% commission on every referred client who pays." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://neweradynasty-hub.lovable.app/referral" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Referral partnership — New Era Dynasty" },
      { name: "twitter:description", content: "A free website in exchange for referrals, plus 20% commission on every referred client who pays." },
    ],
    links: [{ rel: "canonical", href: "https://neweradynasty-hub.lovable.app/referral" }],
  }),
  component: Referral,
});

const steps = [
  { icon: Gift, title: "You get a website, free", desc: "Five partner slots open each month. I design and build your website at no cost — same standard as any paying client." },
  { icon: FileSignature, title: "We sign a simple agreement", desc: "A short partnership contract sets out the free build, the referral terms and how commission is paid. No hidden clauses." },
  { icon: Handshake, title: "You refer people to me", desc: "Share your website and my link. Tell anyone who needs a website, app, or branding to mention your name when they enquire." },
  { icon: Percent, title: "You earn 20% per paying client", desc: "Every referred client who pays earns you 20% of what they paid. No cap on how many you refer." },
  { icon: Wallet, title: "You get paid after the client pays", desc: "Commission is paid out once the client's payment clears, by EFT to your account." },
];

const examples = [
  { referrals: 1, note: "First referral" },
  { referrals: 3, note: "Steady sharing" },
  { referrals: 5, note: "Partner tier" },
  { referrals: 10, note: "Top partner" },
];

const EXAMPLE_FEE = 5000;

const applicationSchema = z.object({
  full_name: z.string().trim().min(2, { message: "Enter your full name" }).max(100),
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  phone: z.string().trim().max(30).optional(),
  company: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, { message: "Tell me a little more (10 characters minimum)" }).max(1000),
});

function Referral() {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = applicationSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_submissions").insert({
      kind: "referral",
      subject: "Referral partnership application",
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
      message: parsed.data.message,
    });
    setLoading(false);
    if (error) {
      toast.error("Could not send your application. Please try again.");
      return;
    }
    setSent(true);
    setForm({ full_name: "", email: "", phone: "", company: "", message: "" });
    toast.success("Application sent. I'll be in touch shortly.");
  };

  const field = "w-full rounded-xl bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <PageShell
      eyebrow="Referral partnership"
      title="A free website. Then 20% of everything you bring in."
      intro="Every month I build websites for five partners at no cost. In return, you refer paying clients — and earn a 20% commission on each one."
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {steps.map(({ icon: Icon, title, desc }, i) => (
          <div key={title} className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[image:var(--gradient-royal)] text-primary-foreground shadow-glow-gold">
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-display text-2xl text-muted-foreground/50">0{i + 1}</span>
            </div>
            <h2 className="mt-4 font-display text-lg text-foreground">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl text-foreground">What you could earn</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Illustration only, based on an example project fee of R {EXAMPLE_FEE.toLocaleString("en-ZA")} per referred client.
          Your actual commission is always 20% of what each referred client really pays.
        </p>
        <div className="mt-6 overflow-hidden glass rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Paying referrals</th>
                <th className="px-4 py-3 text-left">Commission rate</th>
                <th className="px-4 py-3 text-left">Example payout</th>
                <th className="px-4 py-3 text-left">Tier</th>
              </tr>
            </thead>
            <tbody>
              {examples.map(({ referrals, note }) => (
                <tr key={referrals} className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">{referrals}</td>
                  <td className="px-4 py-3 text-primary">20% each</td>
                  <td className="px-4 py-3 text-foreground">
                    R {(EXAMPLE_FEE * 0.2 * referrals).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-2xl text-foreground">The rules, in plain language</h2>
          <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
            {[
              "Five free partner websites are available each month, on a first-come basis.",
              "A signed partnership agreement is required before your free build starts.",
              "The referred client must name you as their referrer when they enquire or pay.",
              "Commission is 20% of the amount the referred client actually pays, per client.",
              "Payouts happen after the client's payment has cleared — usually within 7 days.",
              "There is no limit on how many clients you may refer.",
            ].map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>{rule}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">
            Questions first? WhatsApp {SITE.phonePrimary} or email{" "}
            <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a>.
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-2xl text-foreground">Apply for a partner slot</h2>
          {sent ? (
            <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-5 text-sm text-primary">
              Application received. I review partner applications weekly and will contact you with the agreement and next steps.
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 grid gap-3">
              <div>
                <label htmlFor="ref-name" className="sr-only">Full name</label>
                <input id="ref-name" className={field} placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </div>
              <div>
                <label htmlFor="ref-email" className="sr-only">Email address</label>
                <input id="ref-email" type="email" className={field} placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="ref-phone" className="sr-only">Phone number</label>
                  <input id="ref-phone" className={field} placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="ref-company" className="sr-only">Business name</label>
                  <input id="ref-company" className={field} placeholder="Business (optional)" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
              </div>
              <div>
                <label htmlFor="ref-message" className="sr-only">Your network and plan</label>
                <textarea id="ref-message" rows={5} className={field} placeholder="What kind of website do you need, and who could you refer me to?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <button disabled={loading} className="mt-1 rounded-full bg-[image:var(--gradient-royal)] px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow-gold disabled:opacity-60">
                {loading ? "Sending…" : "Apply for a partner slot"}
              </button>
            </form>
          )}
        </div>
      </section>
    </PageShell>
  );
}
