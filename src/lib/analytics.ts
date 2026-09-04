import { useEffect } from "react";

type DemoEventType = "page_view" | "demo_view" | "demo_action" | "export";

const SESSION_KEY = "ned-demo-session";

/** Stable per-tab visitor id so we can count sessions without cookies or personal data. */
function sessionId(): string {
  if (typeof window === "undefined") return "";
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const created = crypto.randomUUID().replace(/-/g, "");
  window.sessionStorage.setItem(SESSION_KEY, created);
  return created;
}

/** Coarse device class derived from the viewport, never from fingerprinting. */
function deviceClass(): "mobile" | "tablet" | "desktop" {
  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

/** Fire-and-forget analytics. Never blocks or breaks the page it measures. */
export function trackDemoEvent(eventType: DemoEventType, demo: string, detail?: string): void {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({
    sessionId: sessionId(),
    eventType,
    demo,
    detail: detail?.slice(0, 200),
    path: window.location.pathname.slice(0, 200),
    referrer: document.referrer ? document.referrer.slice(0, 300) : undefined,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone?.slice(0, 64),
    device: deviceClass(),
  });

  void fetch("/api/public/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}

/** Records a single page view for a demo once it has mounted in the browser. */
export function useDemoView(demo: string | undefined): void {
  useEffect(() => {
    if (!demo) return;
    trackDemoEvent("demo_view", demo);
  }, [demo]);
}

/** Records every public page view so visits can be reviewed in the admin console. */
export function usePageView(pathname: string): void {
  useEffect(() => {
    if (pathname.startsWith("/portal") || pathname.startsWith("/admin")) return;
    trackDemoEvent("page_view", "site", pathname);
  }, [pathname]);
}
