import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StarRating } from "@/components/site/StarRating";
import { toast } from "sonner";

type CompletedProject = { id: string; title: string; service_type: string | null };

export const Route = createFileRoute("/_authenticated/portal/reviews")({
  head: () => ({ meta: [{ title: "My Reviews — Client Portal" }, { name: "robots", content: "noindex" }] }),
  component: PortalReviews,
});

function PortalReviews() {
  const [completed, setCompleted] = useState<CompletedProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState<{ id: string; email: string; name: string; company: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: profile } = await supabase.from("profiles").select("full_name, company").eq("id", u.user.id).maybeSingle();
      setMe({ id: u.user.id, email: u.user.email ?? "", name: profile?.full_name ?? "", company: profile?.company ?? "" });
      const { data } = await supabase.from("projects").select("id, title, service_type").eq("client_id", u.user.id).eq("status", "completed");
      setCompleted((data ?? []) as CompletedProject[]);
    })();
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!me) return;
    const fd = new FormData(e.currentTarget);
    const project = completed.find(p => p.id === selectedProject);
    setLoading(true);
    const { error } = await supabase.from("reviews").insert({
      submitter_user_id: me.id,
      project_id: selectedProject || null,
      full_name: me.name || String(fd.get("name") ?? ""),
      company: me.company || null,
      email: me.email,
      service_received: project?.service_type ?? String(fd.get("service") ?? ""),
      project_title: project?.title ?? null,
      rating,
      body: String(fd.get("body") ?? ""),
      status: "pending",
      verified: false,
      featured: false,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Thank you! Your verified review has been submitted.");
    (e.target as HTMLFormElement).reset();
    setSelectedProject("");
    setRating(5);
  }

  return (
    <PortalShell>
      <h1 className="font-display text-4xl">My Reviews</h1>
      <p className="mt-2 text-sm text-muted-foreground">Leave verified reviews for completed projects. They receive a "Verified Client" badge once approved.</p>
      <form onSubmit={submit} className="mt-8 glass-strong rounded-3xl p-6 sm:p-8 grid gap-4 max-w-2xl">
        {completed.length > 0 ? (
          <label className="block">
            <span className="block text-sm text-muted-foreground mb-2">Which project?</span>
            <select required value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full rounded-xl bg-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="">— Select a completed project —</option>
              {completed.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </label>
        ) : (
          <div className="rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
            You'll be able to leave a verified review once a project is marked as completed.
          </div>
        )}
        <label className="block">
          <span className="block text-sm text-muted-foreground mb-2">Rating</span>
          <StarRating value={rating} size={28} interactive onChange={setRating} />
        </label>
        <label className="block">
          <span className="block text-sm text-muted-foreground mb-2">Your testimonial</span>
          <textarea name="body" required minLength={20} maxLength={2000} rows={5} className="w-full rounded-xl bg-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </label>
        <button disabled={loading || completed.length === 0} className="justify-self-start rounded-full bg-[image:var(--gradient-royal)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow-gold disabled:opacity-60">
          {loading ? "Submitting…" : "Submit verified review"}
        </button>
      </form>
    </PortalShell>
  );
}
