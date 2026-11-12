-- Public media bucket for the portfolio images.
-- Anyone can read; only admins can upload, replace or delete. 3 MB, images only.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  3145728, -- 3 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "portfolio-media: public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'portfolio-media');

create policy "portfolio-media: admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio-media' and (select public.is_admin()));

create policy "portfolio-media: admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio-media' and (select public.is_admin()))
  with check (bucket_id = 'portfolio-media' and (select public.is_admin()));

create policy "portfolio-media: admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio-media' and (select public.is_admin()));
