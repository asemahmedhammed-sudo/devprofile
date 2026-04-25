import { createBrowserClient } from '@supabase/ssr';

/**
 * Client-side Supabase client — safe to use in 'use client' components.
 * Does NOT import next/headers.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
