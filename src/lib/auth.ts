import { create } from 'zustand'
import { supabase, cloudEnabled } from './supabase'

export interface AppUser {
  id: string
  email: string | null
  local: boolean
}

interface AuthState {
  user: AppUser | null
  ready: boolean
  init: () => void
  signUp: (email: string, password: string) => Promise<{ error?: string; needsConfirm?: boolean }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signInWithGoogle: () => Promise<{ error?: string }>
  continueLocally: () => void
  signOut: () => Promise<void>
}

const LOCAL_KEY = 'mousik-local-user'

export const useAuth = create<AuthState>((set) => ({
  user: null,
  ready: false,
  init: () => {
    if (!cloudEnabled) {
      const local = localStorage.getItem(LOCAL_KEY)
      set({ user: local ? { id: 'local', email: null, local: true } : null, ready: true })
      return
    }
    supabase!.auth.getSession().then(({ data }) => {
      const u = data.session?.user
      set({ user: u ? { id: u.id, email: u.email ?? null, local: false } : null, ready: true })
    })
    supabase!.auth.onAuthStateChange((_e, session) => {
      const u = session?.user
      set({ user: u ? { id: u.id, email: u.email ?? null, local: false } : null, ready: true })
    })
  },
  signUp: async (email, password) => {
    const { data, error } = await supabase!.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) return { error: error.message }
    return { needsConfirm: !data.session }
  },
  signIn: async (email, password) => {
    const { error } = await supabase!.auth.signInWithPassword({ email, password })
    return error ? { error: error.message } : {}
  },
  signInWithGoogle: async () => {
    const { error } = await supabase!.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    return error ? { error: error.message } : {}
  },
  continueLocally: () => {
    localStorage.setItem(LOCAL_KEY, '1')
    set({ user: { id: 'local', email: null, local: true } })
  },
  signOut: async () => {
    localStorage.removeItem(LOCAL_KEY)
    if (supabase) await supabase.auth.signOut()
    set({ user: null })
  },
}))
