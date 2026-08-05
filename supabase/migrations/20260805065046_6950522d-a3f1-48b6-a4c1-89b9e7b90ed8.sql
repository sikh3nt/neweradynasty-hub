REVOKE SELECT ON public.reviews FROM authenticated;
GRANT SELECT (id, submitter_user_id, project_id, full_name, company, service_received, project_title, rating, body, avatar_url, status, verified, featured, submitted_at, approved_at, created_at, updated_at) ON public.reviews TO authenticated;
REVOKE SELECT (email) ON public.reviews FROM anon, authenticated;