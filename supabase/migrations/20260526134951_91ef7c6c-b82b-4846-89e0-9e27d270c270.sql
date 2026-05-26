
-- Reusable updated_at trigger function (idempotent)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Team members
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active team members"
ON public.team_members FOR SELECT
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage team members"
ON public.team_members FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Team applications (Join the Team form)
CREATE TABLE public.team_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interest_area TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.team_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.team_applications TO authenticated;
GRANT ALL ON public.team_applications TO service_role;

ALTER TABLE public.team_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit applications"
ON public.team_applications FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(full_name) BETWEEN 1 AND 120
  AND char_length(email) BETWEEN 3 AND 255
  AND char_length(message) BETWEEN 1 AND 2000
);

CREATE POLICY "Admins view applications"
ON public.team_applications FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update applications"
ON public.team_applications FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete applications"
ON public.team_applications FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for team photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-photos', 'team-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Team photos are public"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-photos');

CREATE POLICY "Admins upload team photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update team photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete team photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'));
