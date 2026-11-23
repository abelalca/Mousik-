import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { BAND, isInBand, unitPresenter } from '@/content/band'
import { course } from '@/content/course'
import { useT } from '@/lib/i18n'
import type { Genre, L } from '@/lib/types'
import { hasAnything } from '@/lib/song'
import { useStore } from '@/store/useStore'
import { CHARACTERS, Character } from './characters'
import { useSongPlayer } from './SongPlayer'
import { venueForUnit } from './venues'
import { Play } from './Icons'

const TITLE: Record<Genre, L> = {
  classical: { en: 'Recital {at}!', es: '¡Recital {at}!' },
  pop: { en: 'Show {at}!', es: '¡Show {at}!' },
  rock: { en: 'Gig {at}!', es: '¡Bolo {at}!' },
}

/**
 * Finishing a unit: the band plays the learner's song at the unit's venue, in front of a crowd
 * that matches the genre. Then the tour vehicle heads to the next stop.
 */
export function Concert({ unitIndex, onContinue }: { unitIndex: number; onContinue: () => void }) {
  const { t, tl, locale } = useT()
  const genre = useStore((s) => s.settings.genre)
  const completed = useStore((s) => s.progress.completed)
  const song = useStore((s) => s.song)
  const { play, playing } = useSongPlayer()
  const venue = venueForUnit(unitIndex)
  const nextUnit = course[unitIndex + 1]
  const next = nextUnit ? venueForUnit(unitIndex + 1) : null
  const band = BAND.filter((m) => isInBand(m, completed))
  const side = band.filter((m) => m.id !== 'mo')

  // The concert starts by itself.
  useEffect(() => {
    play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-full max-w-md mx-auto px-4 py-6 space-y-4">
      <div className="relative rounded-card overflow-hidden shadow-lift" style={{ background: `linear-gradient(180deg, #1b1430, ${venue.sky[genre][1]})` }}>
        <svg viewBox="0 0 400 300" className="w-full block" aria-hidden>
          <g transform="translate(0 110)">
            <venue.Scene genre={genre} />
          </g>
          <path d="M200 0 130 270h140Z" fill="#fff" opacity=".12" />
          <Crowd genre={genre} />
          {['♪', '♫', '♩', '♬'].map((n, i) => (
            <motion.text
              key={i}
              x={[40, 100, 300, 350][i]}
              y={[120, 160, 150, 115][i]}
              fontSize="26"
              fill={['#ffd166', '#ff7eb6', '#7bdff2', '#b8f2a1'][i]}
              animate={playing ? { y: [0, -10, 0] } : undefined}
              transition={{ repeat: Infinity, duration: 1 + i * 0.2 }}
            >
              {n}
            </motion.text>
          ))}
        </svg>
        {/* the band on stage: Mo in the middle, the rest around him */}
        <div className="absolute inset-x-0 bottom-[18%] flex justify-center items-end gap-1">
          {side.slice(0, Math.ceil(side.length / 2)).map((m) => (
            <Character key={m.id} id={m.id} size={86} mood="happy" playing={playing} />
          ))}
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>
            <Character id="mo" size={side.length ? 120 : 150} mood="celebrate" playing={playing} />
          </motion.div>
          {side.slice(Math.ceil(side.length / 2)).map((m) => (
            <Character key={m.id} id={m.id} size={86} mood="happy" playing={playing} />
          ))}
        </div>
        <div className="absolute top-3 inset-x-3 text-center">
          <span className="chip bg-black/55 text-white text-xs uppercase tracking-wider">
            {t('unit')} {unitIndex + 1} · {locale === 'es' ? 'completada' : 'complete'}
          </span>
          <h1 className="font-display text-3xl font-bold text-white mt-2 drop-shadow-[0_2px_8px_rgb(0_0_0/.7)]">{tl(TITLE[genre]).replace('{at}', tl(venue.at))}</h1>
        </div>
      </div>

      {hasAnything(song) && (
        <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={() => play()} disabled={playing}>
          <Play size={18} /> {playing ? t('playing') : t('listenSong')}
        </button>
      )}

      {next && nextUnit && (
        <div className="card p-3 flex items-center gap-3">
          <div className="relative w-28 h-20 rounded-xl overflow-hidden shrink-0" style={{ background: `linear-gradient(180deg, ${next.sky[genre][0]}, ${next.sky[genre][1]})` }}>
            <svg viewBox="0 60 400 110" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
              <next.Scene genre={genre} />
            </svg>
            <div className="absolute -bottom-1 right-0" style={{ color: 'rgb(30 20 50 / .6)' }}>
              <Character id={unitPresenter(nextUnit.id)} size={56} silhouette={unitPresenter(nextUnit.id) !== 'mo'} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted font-semibold">{t('nextStop')}</p>
            <p className="font-display text-lg font-bold leading-tight">{tl(next.name)}</p>
            <p className="text-sm text-muted">
              {CHARACTERS[unitPresenter(nextUnit.id)].name} · {tl(nextUnit.title)}
            </p>
          </div>
          <motion.div animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="shrink-0">
            <Vehicle genre={genre} />
          </motion.div>
        </div>
      )}

      <button className="btn-ghost w-full" onClick={onContinue}>
        {t('continue')}
      </button>
    </div>
  )
}

/** The audience: seated and clapping (classical), phone lights up (pop), horns up (rock). */
function Crowd({ genre }: { genre: Genre }) {
  return (
    <g>
      {Array.from({ length: 13 }).map((_, i) => {
        const x = 14 + i * 31
        const y = 262 - (i % 3) * 4
        return (
          <g key={i} fill="#2a1f3d">
            {genre === 'classical' && <rect x={x - 15} y={y + 2} width="30" height="40" rx="6" fill="#6b2533" />}
            <circle cx={x} cy={y} r="11" />
            <rect x={x - 12} y={y + 8} width="24" height="30" rx="10" />
            {/* classical: clapping hands raised in front of the face */}
            {genre === 'classical' && i % 2 === 0 && (
              <g>
                <path d={`M${x - 8} ${y + 10}l3-20M${x + 8} ${y + 10}l-3-20`} stroke="#2a1f3d" strokeWidth="5" strokeLinecap="round" />
                <circle cx={x - 3} cy={y - 12} r="3.4" fill="#f3d3b8" />
                <circle cx={x + 3} cy={y - 12} r="3.4" fill="#f3d3b8" />
              </g>
            )}
            {genre === 'pop' && i % 2 === 1 && (
              <g>
                <path d={`M${x + 8} ${y + 8}l6-22`} stroke="#2a1f3d" strokeWidth="5" strokeLinecap="round" />
                <rect x={x + 10} y={y - 24} width="8" height="12" rx="2" fill="#fff6c2" />
              </g>
            )}
            {genre === 'rock' && i % 2 === 0 && (
              <g stroke="#2a1f3d" strokeWidth="5" strokeLinecap="round" fill="none">
                <path d={`M${x - 8} ${y + 8}l-6-22`} />
                <path d={`M${x - 14} ${y - 14}l-3-8M${x - 14} ${y - 14}l3-8`} strokeWidth="3" />
              </g>
            )}
          </g>
        )
      })}
    </g>
  )
}

/** The tour vehicle: an old train (classical), a shiny tour bus (pop), a battered van (rock). */
export function Vehicle({ genre }: { genre: Genre }) {
  if (genre === 'classical')
    return (
      <svg width="80" height="50" viewBox="0 0 80 50" aria-hidden>
        <rect x="6" y="18" width="42" height="20" rx="3" fill="#7a2f3b" />
        <rect x="40" y="8" width="20" height="30" rx="3" fill="#7a2f3b" />
        <rect x="44" y="12" width="12" height="9" rx="1.5" fill="#ffe7a3" />
        <rect x="14" y="8" width="8" height="12" fill="#3b2418" />
        <circle cx="18" cy="5" r="4" fill="#ddd" opacity=".8" />
        <path d="M60 32l12 6H60Z" fill="#c8a24a" />
        <rect x="6" y="22" width="34" height="3" fill="#c8a24a" />
        {[16, 32, 52].map((x) => (
          <g key={x}>
            <circle cx={x} cy="40" r="6" fill="#222" />
            <circle cx={x} cy="40" r="2.4" fill="#c8a24a" />
          </g>
        ))}
      </svg>
    )
  if (genre === 'pop')
    return (
      <svg width="84" height="50" viewBox="0 0 84 50" aria-hidden>
        <rect x="2" y="8" width="78" height="30" rx="10" fill="#ff7eb6" />
        {[8, 22, 36, 50].map((x) => (
          <rect key={x} x={x} y="13" width="11" height="10" rx="2" fill="#e8f7ff" />
        ))}
        <path d="M64 13h10l4 10H64Z" fill="#e8f7ff" />
        <path d="M20 31l2-4 2 4-4-2.5h4Z M40 31l2-4 2 4-4-2.5h4Z" fill="#fff6c2" />
        <circle cx="18" cy="40" r="6" fill="#222" />
        <circle cx="64" cy="40" r="6" fill="#222" />
      </svg>
    )
  return (
    <svg width="78" height="50" viewBox="0 0 78 50" aria-hidden>
      <rect x="4" y="10" width="54" height="28" rx="4" fill="#4b4f57" />
      <path d="M58 16h8l8 10v12H58Z" fill="#4b4f57" />
      <path d="M60 19h5l6 8H60Z" fill="#cfe9ff" />
      <circle cx="16" cy="22" r="5" fill="#ffd166" />
      <rect x="26" y="16" width="14" height="8" rx="1" fill="#d1453b" transform="rotate(-8 33 20)" />
      <path d="M44 28l6 4" stroke="#7bdff2" strokeWidth="3" />
      <circle cx="18" cy="40" r="6" fill="#222" />
      <circle cx="60" cy="40" r="6" fill="#222" />
    </svg>
  )
}
