# Yasmeen Ahmed Akl — Portfolio

Portfolio site of a UI/UX designer, plus a private dashboard at `/admin` for editing every
piece of content (text, lists, images, contact messages).

## Stack

- Vite + React (JavaScript), react-router-dom
- Plain CSS with custom properties — one folder per section/component, each with its own `.jsx` + `.css`
- Supabase (database, auth, storage) via `@supabase/supabase-js`

## Run it

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Environment variables

Copy `.env.example` to `.env` and fill in:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Without them the site still runs: it shows the built-in seed content (`src/data/seed.js`),
the contact form reports that it can't send, and the dashboard opens as a read-only preview.

## Dashboard

`/admin` — sign in at `/admin/login` with the admin account created in Supabase.
There is no public sign-up. The dashboard is a separate lazy-loaded chunk and is not part of
the public bundle.

## Supabase

Database schema, security policies, storage bucket and seed content live in `supabase/`.
Step-by-step setup: [supabase/README.md](supabase/README.md).

## Deploy

Any static host works. `vercel.json` rewrites all routes to `index.html` so `/admin/*` survives
a refresh. Set the two environment variables in the host's settings.
