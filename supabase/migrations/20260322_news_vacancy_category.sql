alter table public.news
drop constraint if exists news_category_check;

alter table public.news
add constraint news_category_check
check (category in ('announcement', 'consultation', 'regulation', 'update', 'vacancy'));
