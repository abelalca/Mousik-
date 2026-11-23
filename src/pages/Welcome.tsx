import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mascot } from '@/components/Mascot'
import { useT } from '@/lib/i18n'
import { useStore } from '@/store/useStore'
import type { Genre } from '@/lib/types'
import { useEffect, useState } from 'react'

const GENRES: Genre[] = ['classical', 'pop', 'rock']

export function LangToggle() {
  const { locale } = useT()
  const setSettings = useStore((s) => s.setSettings)
  return (
    <div className="flex rounded-full bg-raised p-1 text-xs font-bold">
      {(['es', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setSettings({ locale: l })}
          className={`px-3 py-1 rounded-full uppercase transition ${locale === l ? 'bg-surface shadow-soft text-ink' : 'text-muted'}`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export default function Welcome() {
  const { t } = useT()
  const setSettings = useStore((s) => s.setSettings)
  const genre = useStore((s) => s.settings.genre)
  const [auto, setAuto] = useState(true)

  // Gently cycle the theme so visitors see the three styles.
  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => {
      const g = useStore.getState().settings.genre
      setSettings({ genre: GENRES[(GENRES.indexOf(g) + 1) % 3] })
    }, 3200)
    return () => clearInterval(id)
  }, [auto, setSettings])

  return (
    <div className="min-h-full flex flex-col">
      <header className="flex items-center justify-between px-5 py-4 max-w-5xl w-full mx-auto">
        <span className="font-display text-2xl font-bold">Mousik</span>
        <LangToggle />
      </header>
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-10 px-6 max-w-5xl w-full mx-auto py-8">
        <motion.div className="relative" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="absolute inset-6 rounded-full hero-bg blur-3xl opacity-25" />
          <Mascot mood="happy" size={230} />
        </motion.div>
        <div className="text-center lg:text-left max-w-md">
          <h1 className="text-5xl sm:text-6xl font-bold leading-[1.05]">
            <span className="metal-text">Mousik</span>
          </h1>
          <p className="text-xl text-muted mt-4">{t('tagline')}</p>
          <div className="flex gap-2 justify-center lg:justify-start mt-6">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => {
                  setAuto(false)
                  setSettings({ genre: g })
                }}
                className={`chip border transition ${genre === g ? 'bg-accent text-accent-ink border-accent' : 'border-line text-muted'}`}
              >
                {t(g)}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 mt-8">
            <Link to="/auth?mode=signup" className="btn-primary text-lg">
              {t('getStarted')}
            </Link>
            <Link to="/auth?mode=signin" className="btn-ghost">
              {t('haveAccount')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
