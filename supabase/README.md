# Supabase setup

Nothing in this folder has been run yet. Follow these steps once, in order.
Until step 6 is done the site keeps working on the local seed data (`src/data/seed.js`).

## 1. Create the project

1. Go to <https://supabase.com/dashboard> → **New project**.
2. Pick a name, a strong database password (save it), and the region closest to your visitors.
3. Wait until the project finishes provisioning.

## 2. Run the migrations

Use **one** of the two ways.

### Option A — SQL editor (no tools to install)

In the dashboard open **SQL Editor → New query**, then paste and **Run** each file, in this order:

1. `supabase/migrations/20261112000000_init.sql`
2. `supabase/migrations/20261112000100_storage.sql`

### Option B — Supabase CLI

```bash
npm install -g supabase            # or: npx supabase <command>
supabase login
supabase init                      # creates supabase/config.toml; keeps the existing migrations
supabase link --project-ref <your-project-ref>   # the ref is the id in your project URL
supabase db push
```

## 3. Run the seed

Loads the current site content (the same text as the original page).

- **SQL editor:** paste `supabase/seed.sql` into a new query and **Run**.
- **CLI (instead of the plain `db push` above):** `supabase db push --include-seed`

Run it only once — running it again would duplicate the list rows.

## 4. Create your admin user

Dashboard → **Authentication → Users → Add user → Create new user**.
Enter your email and a password and tick **Auto Confirm User**.

There is no public sign-up page in the app. To be safe, also turn sign-ups off:
**Authentication → Sign In / Providers → Email** → disable **Allow new users to sign up**.
(Even if someone did sign up, they could not edit anything: every write requires a row in `admins`.)

## 5. Make that user an admin

Copy your user's id from **Authentication → Users** (the **User UID** column), then in the
**SQL Editor** run this with that id in place of `USER_UID_HERE`:

```sql
insert into public.admins (user_id) values ('USER_UID_HERE');
```

Check it worked (should return one row):

```sql
select a.user_id, u.email from public.admins a join auth.users u on u.id = a.user_id;
```

## 6. Fill in `.env`

Dashboard → **Project Settings → API** (or **Connect**). Copy the **Project URL** and the
**anon / publishable** key, then in the project root:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your anon key>
```

Restart `npm run dev`. The site now reads from Supabase, and `/admin/login` accepts your email and password.

For Vercel, add the same two variables under **Project → Settings → Environment Variables** and redeploy.

> Never put the `service_role` key in `.env` or in Vercel — the anon key is the only one the browser needs.

## What the migrations create

| Thing | Purpose |
| --- | --- |
| `profile` | Single row (`id = 1`): name, hero, about, links, contact text |
| `stats`, `education`, `journey`, `skill_lanes`, `service_groups`, `services`, `projects`, `contact_topics` | Editable lists, ordered by `sort_order` |
| `messages` | Contact-form inbox |
| `admins` + `public.is_admin()` | Who may edit |
| bucket `portfolio-media` | Public images (JPG/PNG/WebP, max 3 MB), stored as `{section}/{uuid}.{ext}` |

Row Level Security is on for every table:

- **Content tables** — anyone can read (projects only when `is_published`, unless admin); only admins can insert/update/delete.
- **messages** — anyone can insert (length-checked); only admins can read, update or delete.
- **admins** — a signed-in user can read their own row; no client writes.
- **Storage** — public read; only admins can upload, replace or delete.
