import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useAuth } from './auth'
import { useConnection } from './connectivity'
import { sanitizeSong } from './song'
import { MAX_HEARTS, defaultSettings, useStore, type LessonRecord, type Settings } from '@/store/useStore'

/**
 * Supabase is the source of truth for everything the learner does.
 * - After sign-in the learner's profile, progress, hearts and song are loaded into the
 *   in-memory store; the app waits for this before showing onboarding or the map.
 * - Settings and the song are written back (debounced). If a write fails because the
 *   connection dropped, it is sent again when the backend is reachable.
 * - Progress, XP, streak and hearts only change through server functions (progressApi.ts).
 */

export const timezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'

/** Only these settings are stored server-side (the database also validates them). */
const remoteSettings = (s: Settings) => ({
  locale: s.locale,
  notation: s.notation,
  genre: s.genre,
  sound: s.sound,
  dailyGoal: s.dailyGoal,
})

interface StatusRow {
  hearts: number
  hearts_updated_at: string
  today_xp: number
}

const applyStatus = (s: StatusRow) => {
  useStore.getState().setHearts(s.hearts, new Date(s.hearts_updated_at).getTime())
  useStore.getState().setTodayXp(s.today_xp)
}

async function fetchProgress() {
  const { data, error } = await supabase!.from('lesson_progress').select('lesson_id, best_accuracy, times_completed, last_completed_at')
  if (error) throw error
  const completed: Record<string, LessonRecord> = {}
  for (const r of data ?? [])
    completed[r.lesson_id] = { bestAccuracy: r.best_accuracy, timesCompleted: r.times_completed, completedAt: r.last_completed_at }
  return completed
}

async function fetchStatus(): Promise<StatusRow> {
  const { data, error } = await supabase!.rpc('get_status', { p_timezone: timezone() })
  if (error) throw error
  return data as StatusRow
}

/** Loads everything the app shows for this learner. Throws on any error. */
async function loadLearner(userId: string) {
  const [profileRes, completed, status] = await Promise.all([
    supabase!.from('profiles').select('display_name, settings, onboarded, xp, streak, last_active_date, song').eq('id', userId).single(),
    fetchProgress(),
    fetchStatus(),
  ])
  if (profileRes.error) throw profileRes.error
  const p = profileRes.data
  const before = useStore.getState().settings
  useStore.getState().hydrate({
    onboarded: p.onboarded,
    // A learner who has not finished onboarding keeps what they picked before signing in
    // (language and genre on the welcome screen).
    settings: p.onboarded
      ? { ...defaultSettings(before.locale), ...(p.settings as Partial<Settings>), displayName: p.display_name ?? '' }
      : { ...before, displayName: p.display_name ?? '' },
    progress: {
      xp: p.xp,
      streak: p.streak,
      lastActiveDate: p.last_active_date,
      completed,
      hearts: status.hearts,
      heartsUpdatedAt: new Date(status.hearts_updated_at).getTime(),
      todayXp: status.today_xp,
    },
    song: sanitizeSong(p.song),
  })
}

/** Hearts (with the server's refill applied) and today's XP. */
export async function refreshStatus() {
  if (!supabase || !useAuth.getState().user) return
  try {
    applyStatus(await fetchStatus())
  } catch {
    useConnection.getState().reportFailure()
  }
}

/** Re-reads XP, streak and lesson progress (e.g. after a lesson confirmed on a lost response). */
export async function refreshProgress() {
  const user = useAuth.getState().user
  if (!supabase || !user) return
  const [profileRes, completed, status] = await Promise.all([
    supabase.from('profiles').select('xp, streak, last_active_date').eq('id', user.id).single(),
    fetchProgress(),
    fetchStatus(),
  ])
  if (profileRes.error) throw profileRes.error
  const { progress } = useStore.getState()
  useStore.setState({
    progress: { ...progress, xp: profileRes.data.xp, streak: profileRes.data.streak, lastActiveDate: profileRes.data.last_active_date, completed },
  })
  applyStatus(status)
}

/**
 * Loads the signed-in learner's data and keeps it in sync.
 * Returns whether loading failed (the app then shows the connection screen with a retry).
 */
export function useServerState() {
  const user = useAuth((s) => s.user)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  // Retry a failed load when the backend is reachable again.
  const online = useConnection((s) => s.online)
  useEffect(() => {
    if (failed && online) setAttempt((a) => a + 1)
  }, [failed, online])

  useEffect(() => {
    if (!supabase) return
    if (!user) {
      // Signed out (or the session ended): drop the previous learner's data.
      setFailed(false)
      if (useStore.getState().loaded) useStore.getState().reset()
      return
    }
    let cancelled = false
    let ready = false
    let profileDirty = false
    let songDirty = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let songTimer: ReturnType<typeof setTimeout> | undefined

    const pushProfile = async () => {
      const s = useStore.getState()
      const { error } = await supabase!
        .from('profiles')
        .update({ display_name: s.settings.displayName.trim() || null, settings: remoteSettings(s.settings), onboarded: s.onboarded })
        .eq('id', user.id)
      profileDirty = !!error
      if (error) useConnection.getState().reportFailure()
    }
    const pushSong = async () => {
      const { error } = await supabase!.from('profiles').update({ song: useStore.getState().song }).eq('id', user.id)
      songDirty = !!error
      if (error) useConnection.getState().reportFailure()
    }

    setFailed(false)
    loadLearner(user.id)
      .then(() => {
        if (!cancelled) ready = true
      })
      .catch(() => {
        if (cancelled) return
        setFailed(true)
        useConnection.getState().reportFailure()
      })

    const unsub = useStore.subscribe((s, prev) => {
      if (!ready) return
      if (s.song !== prev.song) {
        clearTimeout(songTimer)
        songTimer = setTimeout(pushSong, 800)
      }
      if (s.onboarded !== prev.onboarded) {
        // Finishing onboarding is saved right away.
        clearTimeout(timer)
        pushProfile()
      } else if (s.settings !== prev.settings) {
        clearTimeout(timer)
        timer = setTimeout(pushProfile, 1000)
      }
    })

    // Back online: send what could not be saved and refresh hearts.
    const unsubConn = useConnection.subscribe((c, prev) => {
      if (!ready || !c.online || prev.online) return
      if (profileDirty) pushProfile()
      if (songDirty) pushSong()
      refreshStatus()
    })

    // Hearts refill on the server over time; today's XP resets at midnight.
    const tick = setInterval(() => {
      if (ready && useStore.getState().progress.hearts < MAX_HEARTS) refreshStatus()
    }, 60_000)
    const onVisible = () => ready && document.visibilityState === 'visible' && refreshStatus()
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelled = true
      clearTimeout(timer)
      clearTimeout(songTimer)
      clearInterval(tick)
      unsub()
      unsubConn()
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [user, attempt])

  return { failed }
}
