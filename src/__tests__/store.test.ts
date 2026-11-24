import { beforeEach, describe, expect, it } from 'vitest'
import { MAX_HEARTS, defaultSettings, liveStreak, useStore } from '@/store/useStore'
import { emptySong } from '@/lib/song'

const snapshot = () => ({
  onboarded: true,
  settings: { ...defaultSettings('es'), genre: 'rock' as const, displayName: 'Ana' },
  progress: { xp: 40, completed: {}, streak: 2, lastActiveDate: null, hearts: 3, heartsUpdatedAt: 1, todayXp: 10 },
  song: { ...emptySong(), register: 'high' as const },
})

describe('in-memory learner store', () => {
  beforeEach(() => useStore.getState().reset())

  it('starts empty and not loaded (nothing comes from the device)', () => {
    const s = useStore.getState()
    expect(s.loaded).toBe(false)
    expect(s.onboarded).toBe(false)
    expect(s.progress.xp).toBe(0)
    expect(s.progress.hearts).toBe(MAX_HEARTS)
  })

  it('is hydrated from the server copy', () => {
    useStore.getState().hydrate(snapshot())
    const s = useStore.getState()
    expect(s.loaded).toBe(true)
    expect(s.settings.genre).toBe('rock')
    expect(s.song.register).toBe('high')
  })

  it('applies the official result of a confirmed lesson', () => {
    useStore.getState().hydrate(snapshot())
    useStore.getState().applyCompletion('u1-l1', { xp: 15, accuracy: 90, total_xp: 55, streak: 3, last_active_date: '2026-11-24' })
    const p = useStore.getState().progress
    expect(p.xp).toBe(55)
    expect(p.streak).toBe(3)
    expect(p.todayXp).toBe(25)
    expect(p.completed['u1-l1']).toMatchObject({ bestAccuracy: 90, timesCompleted: 1 })
  })

  it('forgets the learner on sign-out but keeps the interface language', () => {
    useStore.getState().hydrate(snapshot())
    useStore.getState().reset()
    const s = useStore.getState()
    expect(s.loaded).toBe(false)
    expect(s.settings.displayName).toBe('')
    expect(s.settings.locale).toBe('es')
    expect(s.song).toEqual(emptySong())
  })

  it('shows broken streaks as 0', () => {
    const p = snapshot().progress
    expect(liveStreak({ ...p, lastActiveDate: null })).toBe(0)
    expect(liveStreak({ ...p, lastActiveDate: '2000-01-01' })).toBe(0)
    expect(liveStreak({ ...p, lastActiveDate: new Date().toLocaleDateString('en-CA') })).toBe(2)
  })
})
