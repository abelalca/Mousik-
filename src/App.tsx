import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { useCloudSync } from '@/lib/sync'
import { useStore } from '@/store/useStore'
import { Layout } from '@/components/Layout'
import { Mascot } from '@/components/Mascot'
import Welcome from '@/pages/Welcome'
import Auth from '@/pages/Auth'
import Onboarding from '@/pages/Onboarding'
import Home from '@/pages/Home'
import Profile from '@/pages/Profile'
const LessonPage = lazy(() => import('@/pages/Lesson'))

export default function App() {
  const { user, ready, init } = useAuth()
  const onboarded = useStore((s) => s.onboarded)
  const { genre, locale } = useStore((s) => s.settings)

  useEffect(init, [init])
  useCloudSync()

  // Theme + language live on <html>.
  useEffect(() => {
    document.documentElement.dataset.genre = genre
    document.documentElement.lang = locale
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim().split(/\s+/).join(',')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', `rgb(${bg})`)
  }, [genre, locale])

  if (!ready)
    return (
      <div className="h-full grid place-items-center">
        <Mascot size={90} />
      </div>
    )

  return (
    <BrowserRouter>
      <Routes>
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
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/lesson/:id" element={<Suspense fallback={<div className="h-full grid place-items-center"><Mascot mood="think" size={90} /></div>}><LessonPage /></Suspense>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}
