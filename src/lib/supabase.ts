// Re-export barrel — keeps historical imports working while we migrate to split files.
export { createClient } from './supabase/client';
export { createSSRSupabase } from './supabase/server';
