// Data access layer. Every function resolves to { data, error } and never throws:
//   - with Supabase configured it talks to the database / storage
//   - without it, reads return the local seed and writes return NOT_CONNECTED
import { supabase, MEDIA_BUCKET } from '../lib/supabase.js';
import { seed } from './seed.js';

export const NOT_CONNECTED = 'Supabase not connected';
export const isConnected = Boolean(supabase);

const ok = (data) => ({ data, error: null });
const fail = (e) => ({ data: null, error: typeof e === 'string' ? e : e?.message || 'Unknown error' });
const clone = (x) => JSON.parse(JSON.stringify(x));

async function run(query) {
  if (!supabase) return fail(NOT_CONNECTED);
  try {
    const { data, error, count } = await query(supabase);
    return error ? fail(error) : ok(data ?? count ?? null);
  } catch (e) {
    return fail(e);
  }
}

// Columns the database owns; never sent back on save.
const strip = ({ created_at, updated_at, ...row }) => row;

/* ---------- list entities ---------- */

function listApi(seedKey, table) {
  const fetch = () =>
    supabase
      ? run((sb) => sb.from(table).select('*').order('sort_order').order('created_at'))
      : Promise.resolve(ok(clone(seed[seedKey])));

  return {
    fetch,
    insert: (row) => run((sb) => sb.from(table).insert(strip(row)).select().single()),
    update: (id, patch) => run((sb) => sb.from(table).update(strip(patch)).eq('id', id).select().single()),
    delete: (id) => run((sb) => sb.from(table).delete().eq('id', id)),
    // ids in their new order → sort_order 0..n-1
    reorder: async (ids) => {
      if (!supabase) return fail(NOT_CONNECTED);
      const results = await Promise.all(
        ids.map((id, i) => run((sb) => sb.from(table).update({ sort_order: i }).eq('id', id))),
      );
      return results.find((r) => r.error) || ok(ids);
    },
    // Persist a whole edited list in one go: delete what was removed, upsert the rest in order.
    saveAll: async (original, draft) => {
      if (!supabase) return fail(NOT_CONNECTED);
      const keep = new Set(draft.map((r) => r.id));
      const removed = original.filter((r) => !keep.has(r.id)).map((r) => r.id);
      if (removed.length) {
        const res = await run((sb) => sb.from(table).delete().in('id', removed));
        if (res.error) return res;
      }
      if (draft.length) {
        const rows = draft.map((r, i) => ({ ...strip(r), sort_order: i }));
        const res = await run((sb) => sb.from(table).upsert(rows));
        if (res.error) return res;
      }
      return fetch();
    },
  };
}

export const statsApi = listApi('stats', 'stats');
export const educationApi = listApi('education', 'education');
export const journeyApi = listApi('journey', 'journey');
export const skillLanesApi = listApi('skillLanes', 'skill_lanes');
export const serviceGroupsApi = listApi('serviceGroups', 'service_groups');
export const servicesApi = listApi('services', 'services');
export const projectsApi = listApi('projects', 'projects');
export const contactTopicsApi = listApi('contactTopics', 'contact_topics');

/* ---------- profile (single row, id = 1) ---------- */

const normalizeProfile = (row) => {
  const out = { ...seed.profile };
  for (const key of Object.keys(out)) {
    const blank = Array.isArray(out[key]) ? [] : '';
    out[key] = row && key in row ? row[key] ?? blank : blank;
  }
  out.id = 1;
  return out;
};

// An empty profile (used by the dashboard when the row doesn't exist yet).
export const blankProfile = () => normalizeProfile(null);

export const profileApi = {
  fetch: async () => {
    if (!supabase) return ok(clone(seed.profile));
    const res = await run((sb) => sb.from('profile').select('*').eq('id', 1).maybeSingle());
    return res.error ? res : ok(res.data ? normalizeProfile(res.data) : null);
  },
  update: async (patch) => {
    const res = await run((sb) => sb.from('profile').upsert({ ...strip(patch), id: 1 }).select().single());
    return res.error ? res : ok(normalizeProfile(res.data));
  },
};

/* ---------- messages ---------- */

export const messagesApi = {
  fetch: () =>
    supabase
      ? run((sb) => sb.from('messages').select('*').order('created_at', { ascending: false }))
      : Promise.resolve(ok([])),
  // Used by the public contact form (anon can insert, not read back).
  insert: ({ name, email, topic, body }) => run((sb) => sb.from('messages').insert({ name, email, topic, body })),
  update: (id, patch) => run((sb) => sb.from('messages').update(patch).eq('id', id)),
  delete: (id) => run((sb) => sb.from('messages').delete().eq('id', id)),
  unreadCount: () =>
    supabase
      ? run((sb) => sb.from('messages').select('id', { count: 'exact', head: true }).eq('is_read', false))
      : Promise.resolve(ok(0)),
};

/* ---------- images ---------- */

// What the bucket stores (images are optimized to WebP, or JPEG as a fallback, before upload).
const UPLOAD_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const UPLOAD_MAX_BYTES = 10 * 1024 * 1024; // bucket limit; optimized files are far smaller

// What the file picker accepts. Any size: lib/optimizeImage.js shrinks it first.
// HEIC is allowed through and only works where the browser can decode it.
const PICKABLE = /^image\/(jpeg|png|webp|hei[cf])$/i;

export function validateImage(file) {
  if (!file) return 'No file selected.';
  if (!PICKABLE.test(file.type) && !/\.hei[cf]$/i.test(file.name || '')) return 'Use a JPG, PNG or WebP image.';
  return null;
}

// Uploads an (already optimized) image to `{section}/{uuid}.{ext}` and resolves to the public URL.
export async function uploadImage(section, file) {
  const ext = UPLOAD_TYPES[file?.type];
  if (!ext) return fail('Use a JPG, PNG or WebP image.');
  if (file.size > UPLOAD_MAX_BYTES) return fail('Image is still larger than 10 MB after optimizing.');
  if (!supabase) return fail(NOT_CONNECTED);
  const path = `${section}/${crypto.randomUUID()}.${ext}`;
  const res = await run((sb) =>
    sb.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type, cacheControl: '31536000' }),
  );
  if (res.error) return res;
  return ok(supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl);
}

const mediaPath = (url) => {
  const marker = `/object/public/${MEDIA_BUCKET}/`;
  const i = String(url || '').indexOf(marker);
  return i < 0 ? null : decodeURIComponent(url.slice(i + marker.length).split('?')[0]);
};

export async function deleteImages(urls) {
  const paths = urls.map(mediaPath).filter(Boolean);
  if (!paths.length) return ok([]);
  return run((sb) => sb.storage.from(MEDIA_BUCKET).remove(paths));
}

// Every bucket URL referenced anywhere inside a value (used to clean up replaced files after a save).
export function mediaUrlsIn(value, found = new Set()) {
  if (typeof value === 'string') {
    if (mediaPath(value)) found.add(value);
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((v) => mediaUrlsIn(v, found));
  }
  return found;
}

/* ---------- public site: everything in one call ---------- */

export async function fetchAllContent() {
  if (!supabase) return ok(clone(seed));

  const lists = {
    stats: statsApi,
    education: educationApi,
    journey: journeyApi,
    skillLanes: skillLanesApi,
    serviceGroups: serviceGroupsApi,
    services: servicesApi,
    projects: projectsApi,
    contactTopics: contactTopicsApi,
  };
  const keys = Object.keys(lists);
  const [profile, ...results] = await Promise.all([profileApi.fetch(), ...keys.map((k) => lists[k].fetch())]);

  // Anything that fails to load keeps its seed value, so the page never breaks.
  const content = clone(seed);
  if (profile.data) content.profile = profile.data;
  keys.forEach((k, i) => {
    if (results[i].data) content[k] = results[i].data;
    else console.warn(`[content] ${k}: ${results[i].error}`);
  });
  // Admins can read drafts through RLS; the public page never shows them.
  content.projects = content.projects.filter((p) => p.is_published);
  return ok(content);
}
