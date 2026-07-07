import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { ReviewForm } from "@/components/site/ReviewForm";
import { StarRating } from "@/components/site/StarRating";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "lucide-react";

type Review = {
  id: string; full_name: string; company: string | null; service_received: string | null;
  rating: number; body: string; avatar_url: string | null; verified: boolean; featured: boolean;
  created_at: string;
};

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials & Reviews — New Era Dynasty" },
      { name: "description", content: "Read verified client reviews and leave your own testimonial about working with Tozamile Sikhenjana." },
      { property: "og:title", content: "Testimonials & Reviews" },
      { property: "og:description", content: "Verified reviews from clients of New Era Dynasty." },
    ],
  }),
  component: Testimonials,
});

function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    supabase.from("reviews")
      .select("id, full_name, company, service_received, rating, body, avatar_url, verified, featured, created_at")
      .eq("status", "approved")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => setReviews((data ?? []) as Review[]));
  }, []);

  const { avg, count } = useMemo(() => {
    if (!reviews.length) return { avg: 0, count: 0 };
    return { avg: reviews.reduce((a, r) => a + r.rating, 0) / reviews.length, count: reviews.length };
  }, [reviews]);

  return (
    <PageShell eyebrow="Testimonials" title="What clients say." intro="Approved, verified reviews from clients across every discipline.">
      <div className="glass-strong rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="font-display text-5xl text-gold-gradient">{avg.toFixed(1)}</div>
          <div>
            <StarRating value={avg} size={20} />
            <div className="text-xs text-muted-foreground mt-1">{count} verified reviews</div>
          </div>
        </div>
        <a href="#leave" className="rounded-full bg-[image:var(--gradient-royal)] px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow-gold">Leave a review</a>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {(reviews.length ? reviews : []).map((r) => (
          <article key={r.id} className="glass rounded-2xl p-6 flex flex-col">
            <Quote className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm text-foreground flex-1">{r.body}</p>
            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-sm font-semibold flex items-center gap-2 truncate">
                  {r.full_name}
                  {r.verified && <span className="text-[10px] uppercase tracking-widest rounded-full bg-primary/15 text-primary px-2 py-0.5">Verified</span>}
                </div>
                <div className="text-xs text-muted-foreground truncate">{r.company ?? r.service_received}</div>
              </div>
              <StarRating value={r.rating} />
            </div>
          </article>
        ))}
        {!reviews.length && (
          <div className="md:col-span-2 lg:col-span-3 glass rounded-2xl p-8 text-center text-muted-foreground">
            No approved reviews yet — be the first to leave one below.
          </div>
        )}
      </div>

      <div id="leave" className="mt-16">
        <h2 className="font-display text-3xl text-foreground">Leave a review</h2>
        <p className="mt-2 text-sm text-muted-foreground">Submissions are reviewed before being published.</p>
        <div className="mt-6">
          <ReviewForm />
        </div>
      </div>
    </PageShell>
  );
}
