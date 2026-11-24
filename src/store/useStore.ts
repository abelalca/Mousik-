import { create } from 'zustand'
import type { Genre, Locale } from '@/lib/types'
import type { Notation } from '@/lib/music'
import { setMuted } from '@/lib/audio'
import { emptySong, withSlot, type Song, type SongSlot } from '@/lib/song'

/**
 * In-memory cache of the signed-in learner's state.
 * Supabase is the source of truth: nothing here is persisted on the device. The store is
 * hydrated from the server after sign-in (see lib/sync.ts) and cleared on sign-out.
 * Settings and the song are written back by lib/sync.ts; progress, XP, streak and hearts
 * only change through validated server functions (lib/progressApi.ts).
 */

export const MAX_HEARTS = 5
export const HEART_REFILL_MS = 30 * 60 * 1000

export interface LessonRecord {
  bestAccuracy: number
  timesCompleted: number
  completedAt: string
}

export interface Settings {
  locale: Locale
  notation: Notation
  genre: Genre
  sound: boolean
  dailyGoal: number
  displayName: string
}

export interface Progress {
  xp: number
  completed: Record<string, LessonRecord>
  streak: number
  lastActiveDate: string | null
  hearts: number
  heartsUpdatedAt: number
  /** XP earned today in the learner's time zone (computed by the server). */
  todayXp: number
}

/** What the server returns for one confirmed lesson (complete_lesson). */
export interface CompletionResult {
  xp: number
  accuracy: number
  total_xp: number
  streak: number
  last_active_date: string
}

export interface ServerSnapshot {
  onboarded: boolean
  settings: Settings
  progress: Progress
  song: Song
}

interface State {
  /** True once the learner's data has been loaded from the server. */
  loaded: boolean
  onboarded: boolean
  settings: Settings
  progress: Progress
  /** The learner's song (built one creative step per lesson). */
  song: Song
  setSongSlot: (slot: SongSlot, value: string) => void
  setSettings: (s: Partial<Settings>) => void
  finishOnboarding: (s: Partial<Settings>) => void
  /** Replaces the cache with the server's copy. */
  hydrate: (data: ServerSnapshot) => void
  setHearts: (hearts: number, heartsUpdatedAt: number) => void
  setTodayXp: (xp: number) => void
  /** Applies a lesson the server has confirmed. */
  applyCompletion: (lessonId: string, r: CompletionResult) => void
  /** Clears the learner's data (sign-out); keeps the interface language. */
  reset: () => void
}

const browserLocale: Locale = typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'

export const defaultSettings = (locale: Locale = browserLocale): Settings => ({
  locale,
  notation: locale === 'es' ? 'solfege' : 'letters',
  genre: 'classical',
  sound: true,
  dailyGoal: 30,
  displayName: '',
})

const initial = (locale?: Locale) => ({
  loaded: false,
  onboarded: false,
  settings: defaultSettings(locale),
  progress: {
    xp: 0,
    completed: {},
    streak: 0,
    lastActiveDate: null,
    hearts: MAX_HEARTS,
    heartsUpdatedAt: 0,
    todayXp: 0,
  } as Progress,
  song: emptySong(),
})

export const useStore = create<State>()((set, get) => ({
  ...initial(),
  setSongSlot: (slot, value) => set({ song: withSlot(get().song, slot, value) }),
  setSettings: (s) => {
    set({ settings: { ...get().settings, ...s } })
    if (s.sound !== undefined) setMuted(!s.sound)
  },
  finishOnboarding: (s) => set({ onboarded: true, settings: { ...get().settings, ...s } }),
  hydrate: (data) => {
    set({ ...data, loaded: true })
    setMuted(!data.settings.sound)
  },
  setHearts: (hearts, heartsUpdatedAt) => set((s) => ({ progress: { ...s.progress, hearts, heartsUpdatedAt } })),
  setTodayXp: (todayXp) => set((s) => ({ progress: { ...s.progress, todayXp } })),
  applyCompletion: (lessonId, r) =>
    set((s) => {
      const prev = s.progress.completed[lessonId]
      return {
        progress: {
          ...s.progress,
          xp: r.total_xp,
          streak: r.streak,
          lastActiveDate: r.last_active_date,
          todayXp: s.progress.todayXp + r.xp,
          completed: {
            ...s.progress.completed,
            [lessonId]: {
              bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, r.accuracy),
              timesCompleted: (prev?.timesCompleted ?? 0) + 1,
              completedAt: new Date().toISOString(),
            },
          },
        },
      }
    }),
  reset: () => {
    set(initial(get().settings.locale))
    setMuted(false)
  },
}))

const today = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time
const daysBetween = (a: string, b: string) =>
  Math.round((new Date(b + 'T00:00').getTime() - new Date(a + 'T00:00').getTime()) / 86400000)

/** Streak shown to the user: broken streaks display as 0. */
export function liveStreak(p: Progress) {
  if (!p.lastActiveDate) return 0
  return daysBetween(p.lastActiveDate, today()) <= 1 ? p.streak : 0
}
