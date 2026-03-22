alter table public.news
  add column if not exists source_url text,
  add column if not exists source_label text;
