-- CFBUF CMS — run in Supabase SQL Editor (Dashboard → SQL → New query)
-- https://supabase.com/dashboard/project/_/sql

-- ── Tables ────────────────────────────────────────────────────────────────────

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null check (category in ('blog', 'vision', 'resource', 'agenda', 'county')),
  published_at timestamptz not null default now(),
  summary text not null,
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  sections jsonb not null default '[]',
  cover_image_url text,
  author_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  date timestamptz not null,
  end_date timestamptz,
  location text not null,
  description text not null default '',
  category text not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'ongoing', 'past')),
  is_featured boolean not null default false,
  video_url text,
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('speak_up', 'appointment')),
  data jsonb not null default '{}',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.page_visits (
  path text primary key,
  count integer not null default 0,
  last_visited timestamptz not null default now()
);

-- ── Updated-at trigger ────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blogs_updated_at on public.blogs;
create trigger blogs_updated_at
  before update on public.blogs
  for each row execute function public.set_updated_at();

drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ── Page visit counter (callable by anonymous visitors) ───────────────────────

create or replace function public.increment_page_visit(page_path text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.page_visits (path, count, last_visited)
  values (page_path, 1, now())
  on conflict (path) do update
  set count = page_visits.count + 1,
      last_visited = now();
end;
$$;

grant execute on function public.increment_page_visit(text) to anon, authenticated;

-- ── Storage bucket for cover images ───────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table public.blogs enable row level security;
alter table public.events enable row level security;
alter table public.form_submissions enable row level security;
alter table public.page_visits enable row level security;

-- Public read for published site content
create policy "Public read blogs"
  on public.blogs for select to anon, authenticated using (true);

create policy "Public read events"
  on public.events for select to anon, authenticated using (true);

-- Anyone can submit forms
create policy "Public insert submissions"
  on public.form_submissions for insert to anon, authenticated with check (true);

-- Authenticated admins: full CMS access
create policy "Admin manage blogs"
  on public.blogs for all to authenticated using (true) with check (true);

create policy "Admin manage events"
  on public.events for all to authenticated using (true) with check (true);

create policy "Admin read submissions"
  on public.form_submissions for select to authenticated using (true);

create policy "Admin update submissions"
  on public.form_submissions for update to authenticated using (true) with check (true);

create policy "Admin delete submissions"
  on public.form_submissions for delete to authenticated using (true);

create policy "Admin read visits"
  on public.page_visits for select to authenticated using (true);

-- Storage: public read, authenticated upload
create policy "Public read media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');

create policy "Admin upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media');

create policy "Admin update media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media');

create policy "Admin delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media');

-- ── Indexes ───────────────────────────────────────────────────────────────────

create index if not exists blogs_published_at_idx on public.blogs (published_at desc);
create index if not exists events_date_idx on public.events (date desc);
create index if not exists form_submissions_created_at_idx on public.form_submissions (created_at desc);
