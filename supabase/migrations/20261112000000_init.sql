-- Portfolio schema: content tables, contact messages, admins, RLS.
-- Safe to run once on a fresh Supabase project (SQL editor or `supabase db push`).

/* ---------- helpers ---------- */

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

/* ---------- admins + is_admin() ---------- */

create table public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Security definer so it can read `admins` regardless of the caller's RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

/* ---------- profile (singleton: id is always 1) ---------- */

create table public.profile (
  id                  smallint primary key default 1 check (id = 1),
  full_name           text not null default '',
  kicker_line         text not null default '',
  hero_headline       text[] not null default '{}' check (cardinality(hero_headline) <= 3),
  hero_lead           text not null default '',
  availability_text   text not null default '',
  cv_url              text not null default '',
  hero_photo_url      text not null default '',
  about_photo_url     text not null default '',
  about_photo_caption text not null default '',
  about_heading       text not null default '',
  about_paragraphs    text[] not null default '{}',
  soft_skills         text[] not null default '{}',
  languages           text[] not null default '{}',
  email               text not null default '',
  phone               text not null default '',
  linkedin_url        text not null default '',
  behance_url         text not null default '',
  contact_heading     text not null default '',
  contact_text        text not null default '',
  footer_role_line    text not null default '',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

/* ---------- content lists ---------- */

create table public.stats (
  id           uuid primary key default gen_random_uuid(),
  placement    text not null default 'strip' check (placement in ('strip', 'about')),
  value_number numeric,
  value_text   text,
  suffix       text not null default '',
  label        text not null default '',
  icon         text not null default 'none' check (icon in ('devices', 'ring', 'swatches', 'network', 'none')),
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.education (
  id           uuid primary key default gen_random_uuid(),
  badge        text not null default '',
  title        text not null default '',
  institution  text not null default '',
  details      text not null default '',
  status_label text not null default '',
  is_current   boolean not null default false,
  is_featured  boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.journey (
  id           uuid primary key default gen_random_uuid(),
  period       text not null default '',
  title        text not null default '',
  organization text not null default '',
  description  text not null default '',
  tags         text[] not null default '{}',
  is_current   boolean not null default false,
  sticker_text text not null default '',
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.skill_lanes (
  id           uuid primary key default gen_random_uuid(),
  number_label text not null default '',
  title        text not null default '',
  subtitle     text not null default '',
  items        text[] not null default '{}',
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.service_groups (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null default '',
  lead       text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid not null references public.service_groups (id) on delete cascade,
  name        text not null default '',
  description text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.projects (
  id             uuid primary key default gen_random_uuid(),
  title          text not null default '',
  tag            text not null default '',
  description    text not null default '',
  cover_url      text not null default '',
  screen_urls    text[] not null default '{}' check (cardinality(screen_urls) <= 3),
  case_study_url text not null default '',
  is_published   boolean not null default false,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.contact_topics (
  id         uuid primary key default gen_random_uuid(),
  label      text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

/* ---------- messages (written by the public contact form) ---------- */

create table public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 120),
  email      text not null check (char_length(email) between 3 and 254 and email like '%_@_%._%'),
  topic      text not null default '' check (char_length(topic) <= 120),
  body       text not null check (char_length(body) between 1 and 5000),
  is_read    boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

/* ---------- indexes ---------- */

create index stats_sort_idx          on public.stats (placement, sort_order);
create index education_sort_idx      on public.education (sort_order);
create index journey_sort_idx        on public.journey (sort_order);
create index skill_lanes_sort_idx    on public.skill_lanes (sort_order);
create index service_groups_sort_idx on public.service_groups (sort_order);
create index services_group_sort_idx on public.services (group_id, sort_order);
create index projects_sort_idx       on public.projects (sort_order);
create index contact_topics_sort_idx on public.contact_topics (sort_order);
create index messages_created_idx    on public.messages (created_at desc);
create index messages_unread_idx     on public.messages (is_read) where not is_read;

/* ---------- updated_at triggers, RLS, grants ---------- */

do $$
declare
  t text;
begin
  -- updated_at trigger on every table that has the column
  foreach t in array array[
    'profile', 'stats', 'education', 'journey', 'skill_lanes',
    'service_groups', 'services', 'projects', 'contact_topics', 'messages'
  ] loop
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      t || '_set_updated_at', t
    );
  end loop;

  -- Content tables: anyone can read, only admins can write.
  foreach t in array array[
    'profile', 'stats', 'education', 'journey', 'skill_lanes',
    'service_groups', 'services', 'projects', 'contact_topics'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);

    if t = 'projects' then
      -- Drafts are visible to admins only.
      execute 'create policy "projects: read published or admin" on public.projects
               for select to anon, authenticated
               using (is_published or (select public.is_admin()))';
    else
      execute format(
        'create policy %I on public.%I for select to anon, authenticated using (true)',
        t || ': public read', t
      );
    end if;

    execute format(
      'create policy %I on public.%I for insert to authenticated with check ((select public.is_admin()))',
      t || ': admin insert', t
    );
    execute format(
      'create policy %I on public.%I for update to authenticated
         using ((select public.is_admin())) with check ((select public.is_admin()))',
      t || ': admin update', t
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using ((select public.is_admin()))',
      t || ': admin delete', t
    );
  end loop;
end;
$$;

-- messages: visitors may only insert (never read); admins manage the inbox.
alter table public.messages enable row level security;
grant insert on public.messages to anon, authenticated;
grant select, update, delete on public.messages to authenticated;

create policy "messages: anyone can send" on public.messages
  for insert to anon, authenticated
  with check (is_read = false);

create policy "messages: admin read" on public.messages
  for select to authenticated
  using ((select public.is_admin()));

create policy "messages: admin update" on public.messages
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "messages: admin delete" on public.messages
  for delete to authenticated
  using ((select public.is_admin()));

-- admins: a signed-in user can see only their own row; nobody can write from the client.
alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;
grant select on public.admins to authenticated;

create policy "admins: read own row" on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()));
