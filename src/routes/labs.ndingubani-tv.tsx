import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LabShell } from "@/components/labs/LabShell";
import { Play, Pause, Radio, CalendarDays, Volume2, VolumeX } from "lucide-react";

export const Route = createFileRoute("/labs/ndingubani-tv")({
  head: () => ({
    meta: [
      { title: "Ndingubani TV preview — live channel demo | New Era Dynasty" },
      {
        name: "description",
        content:
          "Preview the Ndingubani TV streaming channel: live hero player, news ticker, schedule strip and episode gallery. A simulated demo, no real broadcast.",
      },
      { property: "og:title", content: "Ndingubani TV — channel preview" },
      {
        property: "og:description",
        content:
          "A mobile-first live-streaming channel preview with ticker, schedule and episode gallery, built by Tozamile Sikhenjana.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: "https://neweradynasty-hub.lovable.app/labs/ndingubani-tv" },
    ],
    links: [
      { rel: "canonical", href: "https://neweradynasty-hub.lovable.app/labs/ndingubani-tv" },
    ],
  }),
  component: NdingubaniTvDemo,
});

type Episode = {
  title: string;
  series: string;
  duration: string;
  blurb: string;
};

type Slot = {
  time: string;
  title: string;
  tag: string;
};

const tickerItems: string[] = [
  "Tonight 20:00 — Ndingubani Live: the identity conversation continues",
  "New series: Roots & Records, every Thursday",
  "Community call-in line opens 30 minutes before each broadcast",
  "Missed an episode? Catch-up gallery updated every Monday",
];

const schedule: Slot[] = [
  { time: "06:00", title: "Morning Ubuntu", tag: "Talk" },
  { time: "10:00", title: "Roots & Records", tag: "Heritage" },
  { time: "13:00", title: "Gqeberha Now", tag: "News" },
  { time: "16:00", title: "Youth Desk", tag: "Community" },
  { time: "20:00", title: "Ndingubani Live", tag: "Flagship" },
  { time: "22:30", title: "Late Sessions", tag: "Music" },
];

const episodes: Episode[] = [
  {
    title: "Who am I without my surname?",
    series: "Ndingubani Live",
    duration: "48:12",
    blurb: "A panel on names, lineage and the stories families stop telling.",
  },
  {
    title: "The vinyl in my grandmother's room",
    series: "Roots & Records",
    duration: "32:40",
    blurb: "Tracing a family history through the records left behind.",
  },
  {
    title: "Township builders, city budgets",
    series: "Gqeberha Now",
    duration: "26:05",
    blurb: "Local contractors on what it takes to win and finish public work.",
  },
  {
    title: "First job, first lesson",
    series: "Youth Desk",
    duration: "38:57",
    blurb: "Six young people on the gap between school and the working world.",
  },
  {
    title: "Amapiano and the archive",
    series: "Late Sessions",
    duration: "55:21",
    blurb: "A live set plus a conversation on how new sound keeps old stories.",
  },
  {
    title: "Coming home after ten years",
    series: "Ndingubani Live",
    duration: "44:03",
    blurb: "Returning residents on belonging, distance and rebuilding roots.",
  },
];

function formatClock(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

function NdingubaniTvDemo() {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [elapsed, setElapsed] = useState(1287);
  const [viewers, setViewers] = useState(1342);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setElapsed((prev) => prev + 1);
      setViewers((prev) => {
        const drift = Math.round((Math.random() - 0.45) * 9);
        return Math.max(420, prev + drift);
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing]);

  const viewerLabel = useMemo(
    () => new Intl.NumberFormat("de-DE").format(viewers),
    [viewers],
  );

  const nowShowing = activeEpisode
    ? { label: "Catch-up", title: activeEpisode.title, sub: activeEpisode.series }
    : { label: "Live now", title: "Ndingubani Live", sub: "Flagship identity talk show" };

  return (
    <LabShell
      eyebrow="Live demo · Media & streaming"
      title="Ndingubani TV."
      intro="A preview of the branded streaming channel built for a client — live hero player, announcement ticker, daily schedule strip and a catch-up episode gallery, all mobile-first."
      notice="This is a visual preview only. No real broadcast is streaming and no viewer data is collected."
    >
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="glass-strong rounded-3xl overflow-hidden">
          <div className="relative aspect-video bg-black">
            <div className="absolute inset-0 bg-[image:var(--gradient-royal)] opacity-25" />
            <div
              className={`absolute inset-0 grid place-items-center transition-luxury ${playing ? "opacity-100" : "opacity-60"}`}
            >
              <div className="text-center px-6">
                <div className="font-display text-3xl sm:text-5xl text-foreground">Ndingubani</div>
                <div className="mt-2 text-xs uppercase tracking-[0.4em] text-primary">
                  Who am I?
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  {nowShowing.sub}
                </p>
              </div>
            </div>

            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-destructive/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-primary-foreground">
                <Radio className="h-3 w-3" /> {nowShowing.label}
              </span>
              <span className="rounded-full glass px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {viewerLabel} watching
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="h-1 w-full rounded-full bg-white/10">
                <div
                  className="h-1 rounded-full bg-primary"
                  style={{ width: `${(elapsed % 3600) / 36}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPlaying((prev) => !prev)}
                    aria-label={playing ? "Pause preview" : "Play preview"}
                    className="grid h-9 w-9 place-items-center rounded-full bg-[image:var(--gradient-royal)] text-primary-foreground hover:brightness-110 transition-luxury"
                  >
                    {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMuted((prev) => !prev)}
                    aria-label={muted ? "Unmute preview" : "Mute preview"}
                    className="grid h-9 w-9 place-items-center rounded-full glass text-muted-foreground hover:text-primary transition-luxury"
                  >
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatClock(elapsed)}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Simulated stream
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border bg-black/50 overflow-hidden">
            <div className="flex gap-10 whitespace-nowrap py-3 animate-[marquee_28s_linear_infinite] will-change-transform">
              {[...tickerItems, ...tickerItems].map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="text-xs text-muted-foreground flex items-center gap-3"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-primary">
              {nowShowing.label}
            </div>
            <h2 className="mt-2 font-display text-2xl text-foreground">{nowShowing.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {activeEpisode
                ? activeEpisode.blurb
                : "Conversations on identity, heritage and belonging, streamed for viewers arriving straight from shared social links."}
            </p>
            {activeEpisode && (
              <button
                type="button"
                onClick={() => setActiveEpisode(null)}
                className="mt-4 rounded-full bg-primary/10 border border-primary/30 px-4 py-2 text-xs text-primary hover:bg-primary/20 transition-luxury"
              >
                Back to live
              </button>
            )}
          </div>
        </div>

        <aside className="glass-strong rounded-3xl p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary">
            <CalendarDays className="h-3.5 w-3.5" /> Today's schedule
          </div>
          <ul className="mt-4 divide-y divide-border">
            {schedule.map((slot) => (
              <li key={slot.time} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-mono text-xs text-primary">{slot.time}</div>
                  <div className="text-sm text-foreground">{slot.title}</div>
                </div>
                <span className="rounded-full glass px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {slot.tag}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-foreground">Catch up on past episodes</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Select an episode to load it into the player.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {episodes.map((episode) => (
            <button
              key={episode.title}
              type="button"
              onClick={() => setActiveEpisode(episode)}
              className={`text-left glass rounded-3xl p-5 transition-luxury hover:bg-white/[0.06] ${
                activeEpisode?.title === episode.title ? "ring-1 ring-primary/50" : ""
              }`}
            >
              <div className="relative aspect-video rounded-2xl bg-black overflow-hidden">
                <div className="absolute inset-0 bg-[image:var(--gradient-royal)] opacity-20" />
                <div className="absolute inset-0 grid place-items-center">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {episode.duration}
                </span>
              </div>
              <div className="mt-4 text-[10px] uppercase tracking-[0.25em] text-primary">
                {episode.series}
              </div>
              <div className="mt-1 text-sm text-foreground">{episode.title}</div>
              <p className="mt-2 text-xs text-muted-foreground">{episode.blurb}</p>
            </button>
          ))}
        </div>
      </section>
    </LabShell>
  );
}
