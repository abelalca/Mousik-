import { create } from 'zustand'
import { getConfig } from './config'

/**
 * Mousik needs a connection: the app only runs while the backend can be reached.
 * - At start-up nothing is shown until the first check succeeds.
 * - Afterwards, going offline (browser event or a failed request) covers the app with the
 *   "no connection" screen; it lifts as soon as the backend answers again.
 */

interface ConnectionState {
  /** null = first check still running. */
  online: boolean | null
  checking: boolean
  check: () => Promise<boolean>
  /** Called when a request failed for network reasons. */
  reportFailure: () => void
}

const TIMEOUT_MS = 6000
const RETRY_MS = 10_000
let retryTimer: ReturnType<typeof setTimeout> | undefined

async function backendReachable(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return false
  const { supabaseUrl, supabaseAnonKey } = getConfig()
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: { apikey: supabaseAnonKey },
      cache: 'no-store',
      signal: ctrl.signal,
    })
    return res.ok
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

export const useConnection = create<ConnectionState>((set, get) => ({
  online: null,
  checking: false,
  check: async () => {
    set({ checking: true })
    const ok = await backendReachable()
    set({ online: ok, checking: false })
    clearTimeout(retryTimer)
    // Keep trying in the background while offline.
    if (!ok) retryTimer = setTimeout(() => get().check(), RETRY_MS)
    return ok
  },
  reportFailure: () => {
    if (!get().checking) get().check()
  },
}))

let started = false
export function startConnectivity() {
  if (started) return
  started = true
  const { check } = useConnection.getState()
  window.addEventListener('offline', () => check())
  window.addEventListener('online', () => check())
  check()
}
