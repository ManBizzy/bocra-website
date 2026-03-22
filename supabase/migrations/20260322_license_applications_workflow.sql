create table if not exists public.license_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_type text not null,
  organization_name text not null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  service_area text not null,
  summary text not null,
  attachments jsonb not null default '[]'::jsonb,
  status text not null default 'submitted' check (status in ('submitted', 'under_review', 'more_information_required', 'approved', 'rejected')),
  review_notes text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.license_applications enable row level security;

drop policy if exists "own license applications read" on public.license_applications;
create policy "own license applications read"
on public.license_applications for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "own license applications insert" on public.license_applications;
create policy "own license applications insert"
on public.license_applications for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "admin license applications read" on public.license_applications;
create policy "admin license applications read"
on public.license_applications for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.user_id = auth.uid() and profiles.role = 'admin'
  )
);

drop policy if exists "admin license applications update" on public.license_applications;
create policy "admin license applications update"
on public.license_applications for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.user_id = auth.uid() and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.user_id = auth.uid() and profiles.role = 'admin'
  )
);
