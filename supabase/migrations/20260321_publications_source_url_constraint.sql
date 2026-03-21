drop index if exists public.publications_source_url_key;

alter table public.publications
  add constraint publications_source_url_key unique (source_url);
