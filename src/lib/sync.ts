import { useEffect } from 'react'
import { supabase } from './supabase'
import { useAuth } from './auth'
import { flushPending } from './progressApi'
import { useStore, type LessonRecord, type Settings } from '@/store/useStore'

/** Only these settings are stored server-side (the database also validates them). */
const remoteSettings = (s: Settings) => ({
  locale: s.locale,
  notation: s.notation,
  genre: s.genre,
  sound: s.sound,
  dailyGoal: s.dailyGoal,
})

/**
 * Loads the signed-in user's profile and progress, then keeps profile settings in sync.
 * XP, streak and lesson progress come from the server (written only by validated RPCs).
 */
export function useCloudSync() {
  const user = useAuth((s) => s.user)

  useEffect(() => {
    if (!supabase || !user || user.local) return
    let cancelled = false
    let ready = false
    let timer: ReturnType<typeof setTimeout> | undefined

    const pushProfile = async () => {
      const s = useStore.getState()
      await supabase!
        .from('profiles')
        .update({
          display_name: s.settings.displayName.trim() || null,
          settings: remoteSettings(s.settings),
          onboarded: s.onboarded,
        })
        .eq('id', user.id)
    }

    ;(async () => {
      const [profileRes, progressRes] = await Promise.all([
        supabase!.from('profiles').select('display_name, settings, onboarded, xp, streak, last_active_date').eq('id', user.id).single(),
        supabase!.from('lesson_progress').select('lesson_id, best_accuracy, times_completed, last_completed_at'),
      ])
      if (cancelled || profileRes.error) return
      const profile = profileRes.data
      const local = useStore.getState()

      const completed: Record<string, LessonRecord> = { ...local.progress.completed }
      for (const r of progressRes.data ?? [])
        completed[r.lesson_id] = { bestAccuracy: r.best_accuracy, timesCompleted: r.times_completed, completedAt: r.last_completed_at }

      local.hydrateRemote({
        onboarded: profile.onboarded || local.onboarded,
        settings: profile.onboarded
          ? { ...local.settings, ...(profile.settings as Partial<Settings>), displayName: profile.display_name ?? local.settings.displayName }
          : local.settings,
        progress: { xp: profile.xp, streak: profile.streak, lastActiveDate: profile.last_active_date, completed },
      })
      // First sign-in on this device after onboarding as a guest: save the choices.
      if (!profile.onboarded && local.onboarded) await pushProfile()
      ready = true
      flushPending()
    })()

    const unsub = useStore.subscribe((s, prev) => {
      if (!ready || (s.settings === prev.settings && s.onboarded === prev.onboarded)) return
      clearTimeout(timer)
      timer = setTimeout(pushProfile, 1000)
    })
    const onOnline = () => flushPending()
    window.addEventListener('online', onOnline)
    return () => {
      cancelled = true
      clearTimeout(timer)
      unsub()
      window.removeEventListener('online', onOnline)
    }
  }, [user])
}
