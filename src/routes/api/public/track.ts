import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const payloadSchema = z.object({
  sessionId: z.string().min(8).max(64),
  eventType: z.enum(["page_view", "demo_view", "demo_action", "export"]),
  demo: z.string().min(2).max(64),
  detail: z.string().max(200).optional(),
  path: z.string().min(1).max(200),
  referrer: z.string().max(300).optional(),
  timezone: z.string().max(64).optional(),
  device: z.enum(["mobile", "tablet", "desktop"]).optional(),
});

/** Extracts the bare domain of a referring page, ignoring self-referrals. */
function referrerDomain(referrer: string | undefined, host: string | null): string | null {
  if (!referrer) return null;
  try {
    const { hostname } = new URL(referrer);
    if (host && hostname === host.split(":")[0]) return null;
    return hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Masks a visitor IP so it identifies a network, not a person:
 * IPv4 keeps the first three blocks, IPv6 keeps the first four groups.
 */
function maskIp(raw: string | null): string | null {
  if (!raw) return null;
  const ip = raw.split(",")[0]?.trim();
  if (!ip) return null;
  if (ip.includes(":")) {
    const groups = ip.split(":").filter(Boolean).slice(0, 4);
    return groups.length ? `${groups.join(":")}::x` : null;
  }
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  return `${parts[0]}.${parts[1]}.${parts[2]}.x`;
}

export const Route = createFileRoute("/api/public/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
          return new Response("Invalid payload", { status: 400 });
        }
        const body = parsed.data;
        const headers = request.headers;

        // Edge network geo headers — coarse location and a masked network address only.
        const { error } = await supabase.from("demo_events").insert({
          session_id: body.sessionId,
          event_type: body.eventType,
          demo: body.demo,
          detail: body.detail ?? null,
          path: body.path,
          referrer: body.referrer ?? null,
          referrer_domain: referrerDomain(body.referrer, headers.get("host")),
          country: headers.get("cf-ipcountry") ?? headers.get("x-vercel-ip-country"),
          region: headers.get("cf-region") ?? headers.get("x-vercel-ip-country-region"),
          city: headers.get("cf-ipcity") ?? headers.get("x-vercel-ip-city"),
          ip_masked: maskIp(
            headers.get("cf-connecting-ip") ??
              headers.get("x-forwarded-for") ??
              headers.get("x-real-ip"),
          ),
          user_agent: headers.get("user-agent")?.slice(0, 300) ?? null,
          device: body.device ?? null,
          timezone: body.timezone ?? null,
        });

        if (error) {
          return new Response("Not recorded", { status: 202 });
        }
        return new Response(null, { status: 204 });
      },
    },
  },
});
