-- 1) Switch has_role from SECURITY DEFINER to SECURITY INVOKER.
-- user_roles already has a "self read" policy allowing authenticated users to
-- read their own rows, so an invoker-run has_role check still works for the
-- caller's own roles (which is all RLS policies need).
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- 2) Replace always-true INSERT policies with minimal validation so the
-- linter no longer flags them, while still allowing anonymous submissions.
DROP POLICY IF EXISTS "Contact: public submit" ON public.contact_submissions;
CREATE POLICY "Contact: public submit"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(full_name)) BETWEEN 1 AND 200
  AND length(btrim(message)) BETWEEN 1 AND 5000
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);

DROP POLICY IF EXISTS "Newsletter: public subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Newsletter: public subscribe"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);