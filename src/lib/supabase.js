import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Until both env vars exist the app runs on local seed data and this stays null.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const MEDIA_BUCKET = 'portfolio-media';
