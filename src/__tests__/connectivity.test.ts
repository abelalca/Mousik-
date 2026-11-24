import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('connectivity gate', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('is online when the backend health check answers', async () => {
    const fetch = vi.fn(async (_url: string) => ({ ok: true }))
    vi.stubGlobal('fetch', fetch)
    const { useConnection } = await import('@/lib/connectivity')
    expect(useConnection.getState().online).toBeNull()
    expect(await useConnection.getState().check()).toBe(true)
    expect(useConnection.getState().online).toBe(true)
    expect(String(fetch.mock.calls[0][0])).toContain('/auth/v1/health')
  })

  it('is offline when the request fails, and keeps retrying', async () => {
    const fetch = vi.fn(async () => { throw new Error('offline') })
    vi.stubGlobal('fetch', fetch)
    const { useConnection } = await import('@/lib/connectivity')
    expect(await useConnection.getState().check()).toBe(false)
    expect(useConnection.getState().online).toBe(false)
    await vi.advanceTimersByTimeAsync(10_000)
    expect(fetch).toHaveBeenCalledTimes(2)
  })
})
