import { supabase } from './supabase'
import { useAuth } from './auth'
import { useStore, type PendingCompletion } from '@/store/useStore'

/**
 * Server-authoritative progress.
 * - startAttempt() asks the server for an attempt id (it checks sign-in, unlock order, rate limit).
 * - submitCompletion() sends the result; the server validates it and returns the official XP/streak.
 * Results are queued locally and retried while offline (the server accepts them for 7 days).
 */

const cloudUser = () => {
  const u = useAuth.getState().user
  return supabase && u && !u.local ? u : null
}

/** Business errors (SQLSTATE P0001) are final; anything else (network) is retried later. */
const isFinal = (error: { code?: string } | null) => error?.code === 'P0001'

export async function startAttempt(lessonId: string): Promise<string | null> {
  if (!cloudUser()) return null
  const { data, error } = await supabase!.rpc('start_lesson', { p_lesson_id: lessonId })
  if (error) {
    // Offline or locked on the server: the lesson can still be played, it just won't count online.
    console.warn('start_lesson:', error.message)
    return null
  }
  return data as string
}

async function send(p: PendingCompletion): Promise<boolean> {
  const { data, error } = await supabase!.rpc('complete_lesson', {
    p_attempt_id: p.attemptId,
    p_correct: p.correct,
    p_total: p.total,
    p_timezone: p.timezone,
  })
  if (!error && data) {
    useStore.getState().applyServerProgress(data)
    return true
  }
  if (isFinal(error)) {
    console.warn('complete_lesson rejected:', error?.message)
    return true // drop it: retrying would fail the same way
  }
  return false
}

export async function submitCompletion(attemptId: string, lessonId: string, correct: number, total: number) {
  if (!cloudUser()) return
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  const p: PendingCompletion = { attemptId, lessonId, correct, total, timezone }
  useStore.getState().addPending(p)
  if (await send(p)) useStore.getState().removePending(attemptId)
}

let flushing = false
export async function flushPending() {
  if (!cloudUser() || flushing) return
  flushing = true
  try {
    for (const p of useStore.getState().pendingCompletions) {
      if (!(await send(p))) break // still offline
      useStore.getState().removePending(p.attemptId)
    }
  } finally {
    flushing = false
  }
}
