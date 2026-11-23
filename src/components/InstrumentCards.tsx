import { useState } from 'react'
import { FAMILY_NAME, GENRE_ROLE_TEXT, INSTRUMENTS, type InstrumentId } from '@/lib/instruments'
import { midi } from '@/lib/music'
import { playPhrase, preload } from '@/lib/audio'
import { useT } from '@/lib/i18n'
import { useStore } from '@/store/useStore'
import { InstrumentIcon } from './InstrumentIcon'
import { Play } from './Icons'

const LO = midi('A0')
const HI = midi('C8')

/** Register bar: where the instrument sits on the full piano range. */
function RangeBar({ id }: { id: InstrumentId }) {
  const [a, b] = INSTRUMENTS[id].range.map(midi)
  if (id === 'drums') return null
  return (
    <div className="relative h-1.5 rounded-full bg-raised mt-2" title="Range">
      <div className="absolute inset-y-0 rounded-full bar-bg" style={{ left: `${((a - LO) / (HI - LO)) * 100}%`, width: `${((b - a) / (HI - LO)) * 100}%` }} />
    </div>
  )
}

export function InstrumentCards({ ids }: { ids: InstrumentId[] }) {
  const { tl, t, locale } = useT()
  const genre = useStore((s) => s.settings.genre)
  const [playing, setPlaying] = useState<InstrumentId | null>(null)

  const play = async (id: InstrumentId) => {
    setPlaying(id)
    await playPhrase(id)
    setTimeout(() => setPlaying((p) => (p === id ? null : p)), 2500)
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2" onPointerEnter={() => preload(ids)} onTouchStart={() => preload(ids)}>
      {ids.map((id) => {
        const inst = INSTRUMENTS[id]
        const role = GENRE_ROLE_TEXT[genre][id]
        const clef = inst.clef === 'treble' ? (locale === 'es' ? 'Clave de sol' : 'Treble clef') : inst.clef === 'bass' ? (locale === 'es' ? 'Clave de fa' : 'Bass clef') : inst.clef === 'grand' ? (locale === 'es' ? 'Sol y fa' : 'Treble + bass') : null
        return (
          <button
            key={id}
            type="button"
            onClick={() => play(id)}
            className={`card shadow-none text-left p-4 transition border-2 ${playing === id ? 'border-accent bg-accent/5' : 'hover:border-accent/40'}`}
          >
            <div className="flex items-start gap-3">
              <div className={`shrink-0 w-12 h-12 rounded-card grid place-items-center ${playing === id ? 'bg-accent text-accent-ink' : 'bg-raised text-accent'}`}>
                <InstrumentIcon family={inst.family} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-lg font-bold leading-tight">{tl(inst.name)}</p>
                  <span className={`shrink-0 w-7 h-7 rounded-full grid place-items-center ${playing === id ? 'bg-accent text-accent-ink' : 'bg-raised text-muted'}`}>
                    <Play size={12} />
                  </span>
                </div>
                <p className="text-[11px] uppercase tracking-wider text-muted font-semibold mt-0.5">
                  {tl(FAMILY_NAME[inst.family])}
                  {clef ? ` · ${clef}` : ''}
                </p>
              </div>
            </div>
            <p className="text-sm mt-2 text-ink/80">{tl(inst.blurb)}</p>
            {role && (
              <p className="text-sm mt-1.5">
                <span className="font-semibold text-accent">{t(genre)}: </span>
                {tl(role)}
              </p>
            )}
            <RangeBar id={id} />
          </button>
        )
      })}
    </div>
  )
}

/** Small "sound: Cello" chip shown in exercises. */
export function InstrumentChip({ id }: { id: InstrumentId }) {
  const { tl } = useT()
  const inst = INSTRUMENTS[id]
  return (
    <span className="chip bg-raised text-ink text-xs">
      <InstrumentIcon family={inst.family} size={16} className="text-accent" />
      {tl(inst.name)}
    </span>
  )
}
