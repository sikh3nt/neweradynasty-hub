ALTER TABLE public.demo_events
  ADD COLUMN IF NOT EXISTS ip_masked text,
  ADD COLUMN IF NOT EXISTS user_agent text,
  ADD COLUMN IF NOT EXISTS device text,
  ADD COLUMN IF NOT EXISTS timezone text;
CREATE INDEX IF NOT EXISTS demo_events_created_at_idx ON public.demo_events (created_at DESC);