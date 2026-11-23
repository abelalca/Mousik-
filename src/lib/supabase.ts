import type { SupabaseClient } from '@supabase/supabase-js'
import { getConfig } from './config'

/**
 * Supabase client, created once the runtime config is loaded (see initBackend).
 * Null when no backend is configured — the app then runs in local mode.
 * ES module exports are live bindings, so importers see the value after init.
 */
export let supabase: SupabaseClient | null = null
export let cloudEnabled = false

export async function initBackend() {
  const { supabaseUrl, supabaseAnonKey } = getConfig()
  if (!supabaseUrl || !supabaseAnonKey) return
  // Loaded only when a backend is configured (keeps the first download small).
  const { createClient } = await import('@supabase/supabase-js')
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce', // OAuth code flow with PKCE (no tokens in URLs)
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  cloudEnabled = true
}
