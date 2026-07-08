import { useState } from "react";
import { StarRating } from "./StarRating";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  full_name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  service_received: z.string().trim().min(2).max(120),
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().min(20).max(2000),
  avatar_url: z.string().url().max(500).optional().or(z.literal("")),
});

export function ReviewForm({ defaultService = "" }: { defaultService?: string }) {
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const captchaA = 3;
  const captchaB = 4;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (Number(captcha) !== captchaA + captchaB) return toast.error("Please answer the anti-spam question.");
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      full_name: String(fd.get("full_name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      service_received: String(fd.get("service_received") ?? ""),
      rating,
      body: String(fd.get("body") ?? ""),
      avatar_url: String(fd.get("avatar_url") ?? ""),
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "Invalid submission");
    setLoading(true);
    const { error } = await supabase.from("reviews").insert({
      full_name: parsed.data.full_name,
      company: parsed.data.company || null,
      email: parsed.data.email || null,
      service_received: parsed.data.service_received,
      rating: parsed.data.rating,
      body: parsed.data.body,
      avatar_url: parsed.data.avatar_url || null,
      status: "pending",
      featured: false,
      verified: false,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Thank you! Your testimonial has been submitted for review.");
    (e.target as HTMLFormElement).reset();
    setRating(5);
    setCaptcha("");
  }

  return (
    <form onSubmit={onSubmit} className="glass-strong rounded-2xl p-6 sm:p-8 grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="full_name" required defaultValue="" />
        <Field label="Company (optional)" name="company" />
        <Field label="Email (optional)" name="email" type="email" />
        <Field label="Service received" name="service_received" required defaultValue={defaultService} placeholder="e.g. Website Development" />
      </div>
      <div>
        <label className="block text-sm text-muted-foreground mb-2">Rating</label>
        <StarRating value={rating} size={28} interactive onChange={setRating} />
      </div>
      <div>
        <label className="block text-sm text-muted-foreground mb-2">Written testimonial</label>
        <textarea name="body" required minLength={20} maxLength={2000} rows={5}
          className="w-full rounded-xl bg-input px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Share your experience working with Tozamile & New Era Dynasty…" />
      </div>
      <Field label="Profile photo or company logo URL (optional)" name="avatar_url" placeholder="https://…" />
      <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label htmlFor="review-captcha" className="block text-sm text-muted-foreground mb-2">Anti-spam: what is {captchaA} + {captchaB}?</label>
          <input id="review-captcha" name="captcha" value={captcha} onChange={(e) => setCaptcha(e.target.value)} required inputMode="numeric"
            aria-label={`Anti-spam question: what is ${captchaA} plus ${captchaB}`}
            className="w-full rounded-xl bg-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <button disabled={loading} className="rounded-full bg-[image:var(--gradient-royal)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow-gold disabled:opacity-60">
          {loading ? "Submitting…" : "Submit testimonial"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">Submissions are reviewed before being published to prevent spam.</p>
    </form>
  );
}

function Field({ label, name, type = "text", required, defaultValue, placeholder }: {
  label: string; name: string; type?: string; required?: boolean; defaultValue?: string; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm text-muted-foreground mb-2">{label}</span>
      <input
        name={name} type={type} required={required} defaultValue={defaultValue} placeholder={placeholder}
        className="w-full rounded-xl bg-input px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </label>
  );
}
