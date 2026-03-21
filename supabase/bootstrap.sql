create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  role text not null default 'citizen' check (role in ('citizen', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (user_id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  category text not null check (category in ('announcement', 'consultation', 'regulation', 'update')),
  featured_image_url text,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  file_url text not null,
  file_type text not null check (file_type in ('pdf', 'doc', 'docx', 'xlsx', 'pptx')),
  category text not null,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  event_date timestamptz not null,
  location text,
  image_url text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  document_url text,
  start_date date not null,
  end_date date not null,
  status text not null default 'open' check (status in ('open', 'closed', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'responded')),
  created_at timestamptz not null default now()
);

create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  status text not null default 'open' check (status in ('open', 'in_review', 'resolved', 'closed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  submitted_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.news enable row level security;
alter table public.publications enable row level security;
alter table public.events enable row level security;
alter table public.consultations enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.complaints enable row level security;

drop policy if exists "own profile read" on public.profiles;
create policy "own profile read"
on public.profiles for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "own profile update" on public.profiles;
create policy "own profile update"
on public.profiles for update
to authenticated
using (auth.uid() = user_id);

drop policy if exists "public read news" on public.news;
create policy "public read news"
on public.news for select
to anon, authenticated
using (published = true);

drop policy if exists "public read publications" on public.publications;
create policy "public read publications"
on public.publications for select
to anon, authenticated
using (published = true);

drop policy if exists "public read events" on public.events;
create policy "public read events"
on public.events for select
to anon, authenticated
using (published = true);

drop policy if exists "public read consultations" on public.consultations;
create policy "public read consultations"
on public.consultations for select
to anon, authenticated
using (true);

drop policy if exists "public submit contact" on public.contact_submissions;
create policy "public submit contact"
on public.contact_submissions for insert
to anon, authenticated
with check (true);

drop policy if exists "own complaints read" on public.complaints;
create policy "own complaints read"
on public.complaints for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "own complaints insert" on public.complaints;
create policy "own complaints insert"
on public.complaints for insert
to authenticated
with check (auth.uid() = user_id);
