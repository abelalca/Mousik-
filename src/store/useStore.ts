import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Genre, Locale } from '@/lib/types'
import type { Notation } from '@/lib/music'
import { setMuted } from '@/lib/audio'
import { emptySong, sanitizeSong, withSlot, type Song, type SongSlot } from '@/lib/song'

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

/** A finished lesson waiting to be confirmed by the server (e.g. while offline). */
export interface PendingCompletion {
  attemptId: string
  lessonId: string
  correct: number
  total: number
  timezone: string
}

export interface Progress {
  xp: number
  completed: Record<string, LessonRecord>
  streak: number
  lastActiveDate: string | null
  hearts: number
  heartsUpdatedAt: number
  todayXp: number
  todayDate: string | null
}

interface State {
  onboarded: boolean
  settings: Settings
  progress: Progress
  updatedAt: number
  pendingCompletions: PendingCompletion[]
  /** The learner's song (built one creative step per lesson). */
  song: Song
  setSongSlot: (slot: SongSlot, value: string) => void
  /** Replaces the song with the server copy when it is newer. */
  hydrateSong: (song: Song) => void
  setSettings: (s: Partial<Settings>) => void
  finishOnboarding: (s: Partial<Settings>) => void
  loseHeart: () => void
  refillHearts: () => void
  completeLesson: (lessonId: string, xp: number, accuracy: number) => void
  hydrateRemote: (data: { onboarded?: boolean; settings?: Settings; progress?: Partial<Progress> }) => void
  /** Server is the authority for XP and streak once a lesson is confirmed. */
  applyServerProgress: (p: { total_xp: number; streak: number; last_active_date: string }) => void
  addPending: (p: PendingCompletion) => void
  removePending: (attemptId: string) => void
  reset: () => void
}

const today = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time
const daysBetween = (a: string, b: string) =>
  Math.round((new Date(b + 'T00:00').getTime() - new Date(a + 'T00:00').getTime()) / 86400000)

const browserLocale: Locale = navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'

const initial = () => ({
  onboarded: false,
  settings: {
    locale: browserLocale,
    notation: (browserLocale === 'es' ? 'solfege' : 'letters') as Notation,
    genre: 'classical' as Genre,
    sound: true,
    dailyGoal: 30,
    displayName: '',
  },
  progress: {
    xp: 0,
    completed: {},
    streak: 0,
    lastActiveDate: null,
    hearts: MAX_HEARTS,
    heartsUpdatedAt: Date.now(),
    todayXp: 0,
    todayDate: null,
  } as Progress,
  updatedAt: 0,
  pendingCompletions: [] as PendingCompletion[],
  song: emptySong(),
})

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...initial(),
      setSongSlot: (slot, value) => set({ song: withSlot(get().song, slot, value) }),
      hydrateSong: (song) => set({ song }),
      setSettings: (s) => {
        set({ settings: { ...get().settings, ...s }, updatedAt: Date.now() })
        if (s.sound !== undefined) setMuted(!s.sound)
      },
      finishOnboarding: (s) => set({ onboarded: true, settings: { ...get().settings, ...s }, updatedAt: Date.now() }),
      loseHeart: () => {
        const p = get().progress
        const hearts = Math.max(0, p.hearts - 1)
        set({
          progress: { ...p, hearts, heartsUpdatedAt: p.hearts === MAX_HEARTS ? Date.now() : p.heartsUpdatedAt },
          updatedAt: Date.now(),
        })
      },
      refillHearts: () => {
        const p = get().progress
        if (p.hearts >= MAX_HEARTS) return
        const gained = Math.floor((Date.now() - p.heartsUpdatedAt) / HEART_REFILL_MS)
        if (gained <= 0) return
        const hearts = Math.min(MAX_HEARTS, p.hearts + gained)
        set({
          progress: { ...p, hearts, heartsUpdatedAt: p.heartsUpdatedAt + gained * HEART_REFILL_MS },
          updatedAt: Date.now(),
        })
      },
      completeLesson: (lessonId, xp, accuracy) => {
        const p = get().progress
        const d = today()
        let streak = p.streak
        if (p.lastActiveDate !== d) {
          streak = p.lastActiveDate && daysBetween(p.lastActiveDate, d) === 1 ? p.streak + 1 : 1
        }
        const prev = p.completed[lessonId]
        set({
          progress: {
            ...p,
            xp: p.xp + xp,
            streak,
            lastActiveDate: d,
            todayXp: (p.todayDate === d ? p.todayXp : 0) + xp,
            todayDate: d,
            completed: {
              ...p.completed,
              [lessonId]: {
                bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy),
                timesCompleted: (prev?.timesCompleted ?? 0) + 1,
                completedAt: new Date().toISOString(),
              },
            },
          },
          updatedAt: Date.now(),
        })
      },
      hydrateRemote: (data) =>
        set((s) => ({
          onboarded: data.onboarded ?? s.onboarded,
          settings: data.settings ?? s.settings,
          progress: { ...s.progress, ...data.progress },
        })),
      applyServerProgress: ({ total_xp, streak, last_active_date }) =>
        set((s) => ({ progress: { ...s.progress, xp: total_xp, streak, lastActiveDate: last_active_date } })),
      addPending: (p) => set((s) => ({ pendingCompletions: [...s.pendingCompletions.filter((x) => x.attemptId !== p.attemptId), p] })),
      removePending: (id) => set((s) => ({ pendingCompletions: s.pendingCompletions.filter((x) => x.attemptId !== id) })),
      reset: () => set(initial()),
    }),
    {
      name: 'mousik',
      version: 1,
      // Older saves have no song; a damaged one is cleaned instead of crashing the app.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<State>
        return { ...current, ...p, song: sanitizeSong(p.song) }
      },
      onRehydrateStorage: () => (state) => state && setMuted(!state.settings.sound),
    },
  ),
)

/** Streak shown to the user: broken streaks display as 0. */
export function liveStreak(p: Progress) {
  if (!p.lastActiveDate) return 0
  return daysBetween(p.lastActiveDate, today()) <= 1 ? p.streak : 0
}
export const todayXp = (p: Progress) => (p.todayDate === today() ? p.todayXp : 0)
