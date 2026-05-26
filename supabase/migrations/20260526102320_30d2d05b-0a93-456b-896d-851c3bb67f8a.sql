REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.bootstrap_first_admin() FROM anon, authenticated, public;