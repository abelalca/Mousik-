import { useEffect } from 'react'
import { supabase } from './supabase'
import { useAuth } from './auth'
import { useStore } from '@/store/useStore'

/**
 * Keeps the local store and the user's row in `profiles` in sync.
 * Strategy: last-writer-wins on `updatedAt`, debounced upserts.
 */
export function useCloudSync() {
  const user = useAuth((s) => s.user)

  useEffect(() => {
    if (!supabase || !user || user.local) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let ready = false

    ;(async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      if (cancelled) return
      const local = useStore.getState()
      if (data && Number(data.updated_at_ms) > local.updatedAt) {
        local.hydrateRemote({
          onboarded: data.onboarded,
          settings: { ...local.settings, ...data.settings },
          progress: { ...local.progress, ...data.progress },
          updatedAt: Number(data.updated_at_ms),
        })
      } else if (local.updatedAt > 0) {
        await push()
      }
      ready = true
    })()

    async function push() {
      const s = useStore.getState()
      await supabase!.from('profiles').upsert({
        id: user!.id,
        onboarded: s.onboarded,
        settings: s.settings,
        progress: s.progress,
        updated_at_ms: s.updatedAt,
      })
    }

    const unsub = useStore.subscribe((s, prev) => {
      if (!ready || s.updatedAt === prev.updatedAt) return
      clearTimeout(timer)
      timer = setTimeout(push, 1200)
    })
    return () => {
      cancelled = true
      clearTimeout(timer)
      unsub()
    }
  }, [user])
}
