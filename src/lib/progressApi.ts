import { supabase } from './supabase'
import { useConnection } from './connectivity'
import { refreshProgress, timezone } from './sync'
import { MAX_HEARTS, useStore, type CompletionResult } from '@/store/useStore'

/**
 * Server-authoritative progress (no offline queue: the app only runs online).
 * - startAttempt(): the server checks sign-in, unlock order and the rate limit and returns an attempt id.
 *   A lesson can only be played once it has one.
 * - completeAttempt(): the server validates the result and returns the official XP/streak.
 * - loseHeart(): hearts live on the server; the local value is updated optimistically.
 */

export type ApiResult<T> = { ok: true; data: T } | { ok: false; code: string }

interface RpcError {
  code?: string
  message?: string
}

/** Business errors (SQLSTATE P0001) carry a stable code; anything else is treated as a connection problem. */
function failure(error: RpcError | null): { ok: false; code: string } {
  if (error?.code === 'P0001' && error.message) return { ok: false, code: error.message }
  useConnection.getState().reportFailure()
  return { ok: false, code: 'network' }
}

export async function startAttempt(lessonId: string): Promise<ApiResult<string>> {
  if (!supabase) return { ok: false, code: 'network' }
  const { data, error } = await supabase.rpc('start_lesson', { p_lesson_id: lessonId })
  if (error || !data) return failure(error)
  return { ok: true, data: data as string }
}

export async function completeAttempt(lessonId: string, attemptId: string, correct: number, total: number): Promise<ApiResult<CompletionResult>> {
  if (!supabase) return { ok: false, code: 'network' }
  const { data, error } = await supabase.rpc('complete_lesson', {
    p_attempt_id: attemptId,
    p_correct: correct,
    p_total: total,
    p_timezone: timezone(),
  })
  if (!error && data) {
    const r = data as CompletionResult
    useStore.getState().applyCompletion(lessonId, r)
    return { ok: true, data: r }
  }
  const f = failure(error)
  // A retry after a lost response: the first submission was saved, so read its result back.
  if (f.code === 'attempt_already_completed') {
    try {
      const { data: ev, error: evErr } = await supabase.from('xp_events').select('xp, accuracy').eq('attempt_id', attemptId).single()
      if (evErr) throw evErr
      await refreshProgress()
      const p = useStore.getState().progress
      return { ok: true, data: { xp: ev.xp, accuracy: ev.accuracy, total_xp: p.xp, streak: p.streak, last_active_date: p.lastActiveDate ?? '' } }
    } catch (e) {
      return failure(e as RpcError)
    }
  }
  return f
}

export async function loseHeart() {
  const s = useStore.getState()
  const { hearts, heartsUpdatedAt } = s.progress
  if (hearts > 0) s.setHearts(hearts - 1, hearts === MAX_HEARTS ? Date.now() : heartsUpdatedAt)
  if (!supabase) return
  const { data, error } = await supabase.rpc('lose_heart')
  if (error || !data) {
    failure(error)
    return
  }
  const r = data as { hearts: number; hearts_updated_at: string }
  useStore.getState().setHearts(r.hearts, new Date(r.hearts_updated_at).getTime())
}
