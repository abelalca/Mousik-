import { afterEach, describe, expect, it, vi } from 'vitest'

const mockConfig = (body: unknown) =>
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => body })))

describe('runtime config', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })
  it('loads environment values', async () => {
    mockConfig({ env: 'qa', supabaseUrl: 'https://abc.supabase.co', supabaseAnonKey: 'k', authProviders: ['apple', 'evil'] })
    const { loadConfig } = await import('@/lib/config')
    const c = await loadConfig()
    expect(c.env).toBe('qa')
    expect(c.supabaseUrl).toBe('https://abc.supabase.co')
    expect(c.authProviders).toEqual(['apple'])
  })
  it('refuses a non-HTTPS backend outside local development', async () => {
    mockConfig({ env: 'prod', supabaseUrl: 'http://abc.supabase.co', supabaseAnonKey: 'k' })
    const { loadConfig } = await import('@/lib/config')
    const c = await loadConfig()
    expect(c.supabaseUrl).toBe('')
  })
  it('falls back to local mode when the file is missing', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline') }))
    const { loadConfig } = await import('@/lib/config')
    expect((await loadConfig()).env).toBe('local')
  })
})
