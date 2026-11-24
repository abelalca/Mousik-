import { create } from 'zustand'
import { supabase } from './supabase'
import type { AuthProvider } from './config'
import { useStore } from '@/store/useStore'

export interface AppUser {
  id: string
  email: string | null
}

interface AuthState {
  user: AppUser | null
  ready: boolean
  init: () => void
  signUp: (email: string, password: string) => Promise<{ error?: string; needsConfirm?: boolean }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signInWithProvider: (provider: AuthProvider) => Promise<{ error?: string }>
  deleteAccount: () => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

/** Every learner has an account (there is no guest mode). */
export const useAuth = create<AuthState>((set) => ({
  user: null,
  ready: false,
  init: () => {
    if (!supabase) {
      set({ user: null, ready: true })
      return
    }
    const toUser = (u: { id: string; email?: string | null } | undefined | null): AppUser | null =>
      u ? { id: u.id, email: u.email ?? null } : null
    supabase.auth.getSession().then(({ data }) => set({ user: toUser(data.session?.user), ready: true }))
    supabase.auth.onAuthStateChange((_e, session) => {
      const next = toUser(session?.user)
      // Token refreshes keep the same user: don't trigger a reload of their data.
      set((s) => (s.user?.id === next?.id ? { ready: true } : { user: next, ready: true }))
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
  signInWithProvider: async (provider) => {
    const { error } = await supabase!.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    })
    return error ? { error: error.message } : {}
  },
  deleteAccount: async () => {
    const { error } = await supabase!.rpc('delete_my_account')
    if (error) return { error: error.message }
    await supabase!.auth.signOut({ scope: 'local' })
    useStore.getState().reset()
    set({ user: null })
    return {}
  },
  signOut: async () => {
    await supabase?.auth.signOut()
    useStore.getState().reset()
    set({ user: null })
  },
}))
