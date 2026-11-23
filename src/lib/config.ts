/**
 * Runtime configuration, read from /config.json when the app starts.
 * The same build is promoted DEV → QA → PROD; only config.json changes per environment
 * (the deploy workflow writes it). For local development, VITE_* variables are the fallback.
 * Nothing here is secret: the Supabase anon key is public by design and protected by RLS.
 */
export type AppEnv = 'local' | 'dev' | 'qa' | 'prod'
export type AuthProvider = 'google' | 'apple'

export interface AppConfig {
  env: AppEnv
  supabaseUrl: string
  supabaseAnonKey: string
  /** OAuth providers enabled in this environment's Supabase project. */
  authProviders: AuthProvider[]
}

let config: AppConfig = {
  env: 'local',
  supabaseUrl: (import.meta.env.VITE_SUPABASE_URL as string) ?? '',
  supabaseAnonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ?? '',
  authProviders: [],
}

const PROVIDERS: AuthProvider[] = ['google', 'apple']

export async function loadConfig(): Promise<AppConfig> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}config.json`, { cache: 'no-store' })
    if (res.ok) {
      const c = (await res.json()) as Partial<AppConfig>
      config = {
        env: (['local', 'dev', 'qa', 'prod'] as const).includes(c.env as AppEnv) ? (c.env as AppEnv) : config.env,
        supabaseUrl: typeof c.supabaseUrl === 'string' && c.supabaseUrl ? c.supabaseUrl : config.supabaseUrl,
        supabaseAnonKey: typeof c.supabaseAnonKey === 'string' && c.supabaseAnonKey ? c.supabaseAnonKey : config.supabaseAnonKey,
        authProviders: Array.isArray(c.authProviders) ? c.authProviders.filter((p): p is AuthProvider => PROVIDERS.includes(p)) : [],
      }
    }
  } catch {
    // offline or missing file: keep defaults
  }
  // Only HTTPS backends outside local development.
  if (config.supabaseUrl && config.env !== 'local' && !config.supabaseUrl.startsWith('https://')) {
    config = { ...config, supabaseUrl: '', supabaseAnonKey: '' }
  }
  return config
}

export const getConfig = () => config
