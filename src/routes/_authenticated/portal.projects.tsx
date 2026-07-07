import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Project = { id: string; title: string; description: string | null; service_type: string | null; status: string; progress: number; estimated_completion: string | null; };
type Milestone = { id: string; project_id: string; title: string; due_date: string | null; completed: boolean; order_index: number; };

export const Route = createFileRoute("/_authenticated/portal/projects")({
  head: () => ({ meta: [{ title: "Projects — Client Portal" }, { name: "robots", content: "noindex" }] }),
  component: Projects,
});

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: ps } = await supabase.from("projects").select("*").eq("client_id", u.user.id).order("created_at", { ascending: false });
      setProjects((ps ?? []) as Project[]);
      const ids = (ps ?? []).map(p => p.id);
      if (ids.length) {
        const { data: ms } = await supabase.from("milestones").select("*").in("project_id", ids).order("order_index");
        setMilestones((ms ?? []) as Milestone[]);
      }
    })();
  }, []);

  return (
    <PortalShell>
      <h1 className="font-display text-4xl">My Projects</h1>
      <p className="mt-2 text-sm text-muted-foreground">Track progress, milestones, and estimated completion for every project.</p>
      <div className="mt-8 grid gap-6">
        {!projects.length && (
          <div className="glass rounded-2xl p-8 text-center text-muted-foreground">No projects yet. Your admin will create your first project soon.</div>
        )}
        {projects.map((p) => {
          const ms = milestones.filter(m => m.project_id === p.id);
          return (
            <article key={p.id} className="glass rounded-2xl p-6">
              <div className="flex flex-wrap justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-widest text-primary">{p.service_type ?? "Project"}</div>
                  <h2 className="mt-1 font-display text-2xl truncate">{p.title}</h2>
                  {p.description && <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>}
                </div>
                <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-xs uppercase tracking-widest text-primary self-start">{p.status.replace("_", " ")}</span>
              </div>
              <div className="mt-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-2"><span>Progress</span><span>{p.progress}%</span></div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-[image:var(--gradient-royal)]" style={{ width: `${p.progress}%` }} />
                </div>
                {p.estimated_completion && <div className="mt-2 text-xs text-muted-foreground">Estimated completion: {new Date(p.estimated_completion).toLocaleDateString("en-GB")}</div>}
              </div>
              {ms.length > 0 && (
                <div className="mt-6 grid gap-2">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Milestones</div>
                  {ms.map(m => (
                    <div key={m.id} className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2 text-sm">
                      <div className="flex items-center gap-3">
                        <span className={`h-2.5 w-2.5 rounded-full ${m.completed ? "bg-primary shadow-glow-gold" : "bg-muted-foreground/40"}`} />
                        <span className={m.completed ? "line-through text-muted-foreground" : ""}>{m.title}</span>
                      </div>
                      {m.due_date && <span className="text-xs text-muted-foreground">{new Date(m.due_date).toLocaleDateString("en-GB")}</span>}
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </PortalShell>
  );
}
