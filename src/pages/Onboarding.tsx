import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mascot } from '@/components/Mascot'
import { useT } from '@/lib/i18n'
import { useStore } from '@/store/useStore'
import type { Genre, Locale } from '@/lib/types'
import type { Notation } from '@/lib/music'
import { playSequence, warmUp } from '@/lib/audio'
import { Check } from '@/components/Icons'

const GENRE_SOUND: Record<Genre, string[]> = {
  classical: ['C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4'],
  pop: ['C4', 'G4', 'A4', 'F4'],
  rock: ['E2', 'E2', 'G2', 'A2'],
}

export default function Onboarding() {
  const { t } = useT()
  const settings = useStore((s) => s.settings)
  const setSettings = useStore((s) => s.setSettings)
  const finish = useStore((s) => s.finishOnboarding)
  const [step, setStep] = useState(0)
  const [name, setName] = useState(settings.displayName)
  const steps = 5

  const Option = ({ active, onClick, title, desc }: { active: boolean; onClick: () => void; title: string; desc?: string }) => (
    <button onClick={onClick} className="option flex items-center gap-3" data-state={active ? 'selected' : 'idle'}>
      <span className="flex-1">
        <span className="block font-semibold text-lg">{title}</span>
        {desc && <span className="block text-sm text-muted mt-0.5">{desc}</span>}
      </span>
      {active && <Check className="text-accent" />}
    </button>
  )

  const content = [
    <>
      <h1 className="text-3xl font-bold">{t('obLangTitle')}</h1>
      <div className="space-y-3 mt-6">
        {([
          ['es', 'Español'],
          ['en', 'English'],
        ] as [Locale, string][]).map(([l, label]) => (
          <Option key={l} active={settings.locale === l} onClick={() => setSettings({ locale: l, notation: l === 'es' ? 'solfege' : 'letters' })} title={label} />
        ))}
      </div>
    </>,
    <>
      <h1 className="text-3xl font-bold">{t('obNameTitle')}</h1>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('obNamePlaceholder')}
        className="w-full card shadow-none px-4 py-4 text-lg outline-none focus:border-accent mt-6"
        maxLength={30}
      />
    </>,
    <>
      <h1 className="text-3xl font-bold">{t('obGenreTitle')}</h1>
      <p className="text-muted mt-2">{t('obGenreSub')}</p>
      <div className="space-y-3 mt-6">
        {(['classical', 'pop', 'rock'] as Genre[]).map((g) => (
          <Option
            key={g}
            active={settings.genre === g}
            onClick={() => {
              warmUp()
              setSettings({ genre: g })
              playSequence(GENRE_SOUND[g], g === 'rock' ? 0.3 : 0.25)
            }}
            title={t(g)}
            desc={t(`${g}Desc` as 'classicalDesc')}
          />
        ))}
      </div>
    </>,
    <>
      <h1 className="text-3xl font-bold">{t('obNotationTitle')}</h1>
      <div className="space-y-3 mt-6">
        {(['solfege', 'letters'] as Notation[]).map((n) => (
          <Option key={n} active={settings.notation === n} onClick={() => setSettings({ notation: n })} title={t(n)} />
        ))}
      </div>
    </>,
    <>
      <h1 className="text-3xl font-bold">{t('obGoalTitle')}</h1>
      <div className="space-y-3 mt-6">
        {([
          [10, 'goalCasual', 5],
          [20, 'goalRegular', 10],
          [30, 'goalSerious', 15],
          [50, 'goalIntense', 20],
        ] as const).map(([xp, key, min]) => (
          <Option key={xp} active={settings.dailyGoal === xp} onClick={() => setSettings({ dailyGoal: xp })} title={t(key)} desc={`${min} ${t('minPerDay')} · ${xp} XP`} />
        ))}
      </div>
    </>,
  ]

  const nextStep = () => {
    if (step === 1) setSettings({ displayName: name.trim() })
    if (step + 1 < steps) setStep(step + 1)
    else finish({ displayName: name.trim() })
  }

  return (
    <div className="min-h-full flex flex-col max-w-md mx-auto px-6">
      <div className="flex items-center gap-4 pt-6">
        {step > 0 && (
          <button className="text-muted text-sm font-semibold" onClick={() => setStep(step - 1)}>
            ← {t('back')}
          </button>
        )}
        <div className="flex-1 h-2.5 rounded-full bg-raised overflow-hidden">
          <motion.div className="h-full bar-bg" animate={{ width: `${((step + 1) / steps) * 100}%` }} />
        </div>
      </div>
      <div className="flex justify-center pt-8">
        <Mascot mood={step === 2 ? 'happy' : 'idle'} size={110} />
      </div>
      <div className="flex-1 pt-4">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            {content[step]}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="py-6 safe-bottom">
        <button className="btn-primary w-full" onClick={nextStep} disabled={step === 1 && !name.trim()}>
          {step + 1 < steps ? t('continue') : t('letsGo')}
        </button>
      </div>
    </div>
  )
}
