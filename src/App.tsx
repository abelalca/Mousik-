import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, MemoryRouter, Navigate, Route, Routes } from 'react-router-dom'

// In-memory routing when hosted as a static preview inside a sandboxed frame.
const Router = import.meta.env.VITE_ROUTER === 'memory' ? MemoryRouter : BrowserRouter
import { useAuth } from '@/lib/auth'
import { useServerState } from '@/lib/sync'
import { backendConfigured } from '@/lib/supabase'
import { useConnection } from '@/lib/connectivity'
import { useStore } from '@/store/useStore'
import { Layout } from '@/components/Layout'
import { Mascot } from '@/components/Mascot'
import { NotConfigured, Offline, Splash } from '@/components/Gate'
import Welcome from '@/pages/Welcome'
import Auth from '@/pages/Auth'
import Onboarding from '@/pages/Onboarding'
import Home from '@/pages/Home'
import Profile from '@/pages/Profile'
const LessonPage = lazy(() => import('@/pages/Lesson'))
// Notation (VexFlow) is heavy: the song page loads it on demand, like lessons do.
const SongPage = lazy(() => import('@/pages/Song'))
const BandPage = lazy(() => import('@/pages/Band'))
// Dev-only character sheet (removed from production builds).
const BandPreview = import.meta.env.DEV ? lazy(() => import('@/pages/BandPreview')) : null
// Dev-only: the end-of-unit concert, to review it without finishing a unit.
const ConcertPreview = import.meta.env.DEV ? lazy(() => import('@/components/Concert').then((m) => ({ default: () => <m.Concert unitIndex={0} onContinue={() => history.back()} /> }))) : null

export default function App() {
  const { user, ready, init } = useAuth()
  const onboarded = useStore((s) => s.onboarded)
  const loaded = useStore((s) => s.loaded)
  const { genre, locale } = useStore((s) => s.settings)
  const online = useConnection((s) => s.online)
  const [booted, setBooted] = useState(false)

  useEffect(init, [init])
  const { failed } = useServerState()
  // The app opens only after the backend has answered once; later drops show an overlay.
  useEffect(() => {
    if (online) setBooted(true)
  }, [online])

  // Theme + language live on <html>.
  useEffect(() => {
    document.documentElement.dataset.genre = genre
    document.documentElement.lang = locale
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim().split(/\s+/).join(',')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', `rgb(${bg})`)
  }, [genre, locale])

  // Online-only: without a backend, or before it has been reached, the app does not open.
  if (!backendConfigured) return <NotConfigured />
  if (!booted) return online === false ? <Offline /> : <Splash />
  if (!ready) return <Splash />
  // Signed in: wait for the learner's data before choosing onboarding or the map.
  if (user && !loaded) return failed ? <Offline /> : <Splash />

  return (
    <>
    {online === false && <Offline overlay />}
    <Router>
      <Routes>
        {BandPreview && <Route path="/dev/band" element={<Suspense fallback={null}><BandPreview /></Suspense>} />}
        {ConcertPreview && <Route path="/dev/concert" element={<Suspense fallback={null}><ConcertPreview /></Suspense>} />}
        {!user ? (
          <>
            <Route path="/" element={<Welcome />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : !onboarded ? (
          <Route path="*" element={<Onboarding />} />
        ) : (
          <>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/song" element={<Suspense fallback={<div className="pt-16 grid place-items-center"><Mascot mood="think" size={90} /></div>}><SongPage /></Suspense>} />
              <Route path="/band" element={<Suspense fallback={<div className="pt-16 grid place-items-center"><Mascot mood="think" size={90} /></div>}><BandPage /></Suspense>} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/lesson/:id" element={<Suspense fallback={<div className="h-full grid place-items-center"><Mascot mood="think" size={90} /></div>}><LessonPage /></Suspense>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
    </>
  )
}
