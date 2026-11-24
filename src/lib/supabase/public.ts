import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-less public anon client for public reads (Home, Gallery, Recent Arts).
 * Keeps public pages cacheable (ISR) and completely prevents leaking auth sessions.
 */
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
