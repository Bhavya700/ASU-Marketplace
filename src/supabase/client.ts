import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and Anon Key from the environment variables.
// The `import.meta.env` object is how Astro exposes server-side environment variables.
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Create and export the Supabase client.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);