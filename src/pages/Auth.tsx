import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { cloudEnabled } from '@/lib/supabase'
import { useT } from '@/lib/i18n'
import { Mascot } from '@/components/Mascot'
import { LangToggle } from './Welcome'

export default function Auth() {
  const { t } = useT()
  const [params, setParams] = useSearchParams()
  const mode = params.get('mode') === 'signin' ? 'signin' : 'signup'
  const { signIn, signUp, signInWithGoogle, continueLocally } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    if (mode === 'signin') {
      const r = await signIn(email, password)
      if (r.error) setError(r.error)
    } else {
      const r = await signUp(email, password)
      if (r.error) setError(r.error)
      else if (r.needsConfirm) setInfo(t('checkEmail'))
    }
    setBusy(false)
  }

  return (
    <div className="min-h-full flex flex-col">
      <header className="flex items-center justify-between px-5 py-4 max-w-md w-full mx-auto">
        <Link to="/" className="font-display text-2xl font-bold">
          Mousik
        </Link>
        <LangToggle />
      </header>
      <main className="flex-1 flex flex-col items-center px-6 py-6 max-w-sm w-full mx-auto">
        <Mascot mood="happy" size={110} />
        <h1 className="text-3xl font-bold mt-3 mb-6">{mode === 'signin' ? t('signIn') : t('signUp')}</h1>

        {!cloudEnabled ? (
          <div className="w-full space-y-4 text-center">
            <p className="text-sm text-muted card p-4 shadow-none">{t('localMode')}</p>
            <button className="btn-primary w-full" onClick={continueLocally}>
              {t('continueLocal')}
            </button>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <button className="btn-ghost w-full" onClick={() => signInWithGoogle()}>
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
                <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
              </svg>
              {t('google')}
            </button>
            <div className="flex items-center gap-3 text-xs text-muted uppercase">
              <div className="h-px flex-1 bg-line" />
              {t('orContinue')}
              <div className="h-px flex-1 bg-line" />
            </div>
            <form onSubmit={submit} className="space-y-3">
              <input
                type="email"
                required
                placeholder={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full card shadow-none px-4 py-3.5 outline-none focus:border-accent"
                autoComplete="email"
              />
              <input
                type="password"
                required
                minLength={6}
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full card shadow-none px-4 py-3.5 outline-none focus:border-accent"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
              {error && <p className="text-sm text-danger">{error}</p>}
              {info && <p className="text-sm text-success">{info}</p>}
              <button className="btn-primary w-full" disabled={busy}>
                {mode === 'signin' ? t('signIn') : t('signUp')}
              </button>
            </form>
            <p className="text-center text-sm text-muted">
              {mode === 'signin' ? t('noAccount') : t('yesAccount')}{' '}
              <button className="text-accent font-semibold" onClick={() => setParams({ mode: mode === 'signin' ? 'signup' : 'signin' })}>
                {mode === 'signin' ? t('signUp') : t('signIn')}
              </button>
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
