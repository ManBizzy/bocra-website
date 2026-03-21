alter table public.publications
  add column if not exists source_url text,
  add column if not exists storage_bucket text,
  add column if not exists storage_path text;

alter table public.publications
  alter column storage_bucket set default 'publications';

update public.publications
set source_url = file_url
where source_url is null;

drop index if exists public.publications_source_url_key;

alter table public.publications
  add constraint publications_source_url_key unique (source_url);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'publications',
  'publications',
  true,
  52428800,
  array['application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
