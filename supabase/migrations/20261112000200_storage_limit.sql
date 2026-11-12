-- Images are now resized and compressed in the browser before upload (normally well under 1 MB).
-- Raise the bucket limit from 3 MB to 10 MB as a safety margin. Allowed mime types are unchanged.

update storage.buckets
set file_size_limit    = 10485760, -- 10 MB
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'portfolio-media';
