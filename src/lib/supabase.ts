import type { SupabaseClient } from '@supabase/supabase-js'
import { getConfig } from './config'

/**
 * Supabase client, created once the runtime config is loaded (see initBackend).
 * Mousik is online-only: without a configured backend the app shows a "not available" screen.
 * ES module exports are live bindings, so importers see the value after init.
 */
export let supabase: SupabaseClient | null = null
export let backendConfigured = false

export async function initBackend() {
  const { supabaseUrl, supabaseAnonKey } = getConfig()
  if (!supabaseUrl || !supabaseAnonKey) return
  const { createClient } = await import('@supabase/supabase-js')
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce', // OAuth code flow with PKCE (no tokens in URLs)
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  backendConfigured = true
}
