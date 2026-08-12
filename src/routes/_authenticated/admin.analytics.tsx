import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { AdminGate } from "@/components/portal/AdminGate";
import { supabase } from "@/integrations/supabase/client";
import { Globe2, MousePointerClick, Share2, Users } from "lucide-react";

type DemoEvent = {
  id: string;
  session_id: string;
  event_type: string;
  demo: string | null;
  detail: string | null;
  path: string | null;
  referrer_domain: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  created_at: string;
};

const ranges = [
  { id: "7", label: "Last 7 days" },
  { id: "30", label: "Last 30 days" },
  { id: "90", label: "Last 90 days" },
] as const;

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  head: () => ({
    meta: [{ title: "Demo analytics — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <AdminGate>
      <AdminAnalytics />
    </AdminGate>
  ),
});

/** Groups rows by a key and returns the biggest buckets first. */
function topBy(rows: DemoEvent[], pick: (row: DemoEvent) => string | null): [string, number][] {
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    const key = pick(row);
    if (!key) return;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
}

function AdminAnalytics() {
  const [rows, setRows] = useState<DemoEvent[]>([]);
  const [range, setRange] = useState<(typeof ranges)[number]["id"]>("30");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async (): Promise<void> => {
      setLoading(true);
      const since = new Date(Date.now() - Number(range) * 86_400_000).toISOString();
      const { data } = await supabase
        .from("demo_events")
        .select(
          "id, session_id, event_type, demo, detail, path, referrer_domain, country, region, city, created_at",
        )
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000);
      if (!active) return;
      setRows((data ?? []) as DemoEvent[]);
      setLoading(false);
    };
    void load();
    return () => {
      active = false;
    };
  }, [range]);

  const stats = useMemo(() => {
    const sessions = new Set(rows.map((row) => row.session_id)).size;
    return {
      sessions,
      views: rows.filter((row) => row.event_type === "demo_view").length,
      actions: rows.filter((row) => row.event_type === "demo_action").length,
      exports: rows.filter((row) => row.event_type === "export").length,
    };
  }, [rows]);

  const topDemos = useMemo(() => topBy(rows, (row) => row.demo), [rows]);
  const topReferrers = useMemo(() => topBy(rows, (row) => row.referrer_domain), [rows]);
  const topPlaces = useMemo(
    () =>
      topBy(rows, (row) =>
        row.country ? [row.city, row.region, row.country].filter(Boolean).join(", ") : null,
      ),
    [rows],
  );

  const cards = [
    { label: "Visitor sessions", value: stats.sessions, icon: Users },
    { label: "Demo views", value: stats.views, icon: Globe2 },
    { label: "Demo actions", value: stats.actions, icon: MousePointerClick },
    { label: "Exports", value: stats.exports, icon: Share2 },
  ];

  return (
    <PortalShell isAdmin>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Demo analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Anonymous engagement across the live demos, plus where your traffic and referrals come
            from.
          </p>
        </div>
        <div className="flex gap-2">
          {ranges.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setRange(option.id)}
              className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-widest ${
                range === option.id
                  ? "bg-[image:var(--gradient-royal)] text-primary-foreground"
                  : "glass"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="glass rounded-2xl p-5">
            <card.icon className="h-4 w-4 text-primary" />
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {card.label}
            </p>
            <p className="mt-1 font-display text-3xl">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {[
          { title: "Most used demos", data: topDemos, empty: "No demo activity yet." },
          {
            title: "Referral sources",
            data: topReferrers,
            empty: "No external referrals recorded yet.",
          },
          { title: "Visitor locations", data: topPlaces, empty: "No location data yet." },
        ].map((panel) => (
          <section key={panel.title} className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl">{panel.title}</h2>
            {panel.data.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                {loading ? "Loading…" : panel.empty}
              </p>
            ) : (
              <ul className="mt-4 grid gap-2 text-sm">
                {panel.data.map(([label, count]) => (
                  <li key={label} className="flex items-center justify-between gap-3">
                    <span className="truncate text-foreground">{label}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <section className="glass mt-6 rounded-2xl p-6">
        <h2 className="font-display text-xl">Latest activity</h2>
        <div className="mt-4 grid gap-2 text-sm">
          {rows.slice(0, 25).map((row) => (
            <div
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2 last:border-0"
            >
              <span className="text-foreground">
                {row.demo ?? row.path ?? "site"} · {row.event_type}
                {row.detail ? ` · ${row.detail}` : ""}
              </span>
              <span className="text-xs text-muted-foreground">
                {[row.city, row.country].filter(Boolean).join(", ") || "Unknown location"} ·{" "}
                {new Date(row.created_at).toLocaleDateString("en-GB")}
              </span>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="text-muted-foreground">
              {loading ? "Loading…" : "Nothing recorded in this period yet."}
            </p>
          )}
        </div>
      </section>
    </PortalShell>
  );
}
