CREATE TABLE public.demo_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  demo TEXT NOT NULL,
  detail TEXT,
  path TEXT NOT NULL,
  referrer TEXT,
  referrer_domain TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.demo_events TO authenticated;
GRANT INSERT ON public.demo_events TO anon;
GRANT ALL ON public.demo_events TO service_role;

ALTER TABLE public.demo_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a demo event"
ON public.demo_events FOR INSERT TO anon, authenticated
WITH CHECK (
  length(session_id) BETWEEN 8 AND 64
  AND event_type IN ('demo_view','demo_action','export')
  AND length(demo) BETWEEN 2 AND 64
  AND length(path) BETWEEN 1 AND 200
  AND (detail IS NULL OR length(detail) <= 200)
  AND (referrer IS NULL OR length(referrer) <= 300)
);

CREATE POLICY "Admins can read demo events"
ON public.demo_events FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX demo_events_created_at_idx ON public.demo_events (created_at DESC);
CREATE INDEX demo_events_demo_idx ON public.demo_events (demo);