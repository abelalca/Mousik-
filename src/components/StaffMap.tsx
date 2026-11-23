import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { Unit } from '@/content/types'
import { isUnlocked } from '@/content/course'
import { unitPresenter, unitReached } from '@/content/band'
import { useT } from '@/lib/i18n'
import { playSequence } from '@/lib/audio'
import { MO_INSTRUMENT } from '@/lib/song'
import { useStore } from '@/store/useStore'
import { useRich } from './RichText'
import { CHARACTERS, Character } from './characters'
import { venueForUnit } from './venues'
import { Lock, Play } from './Icons'

/**
 * The lesson map as a page of sheet music: each unit is a bar (system) and each lesson a note.
 * Done = filled note, current = pulsing hollow note, locked = dotted note. The unit's musician
 * stands where the clef would be, and a slice of the unit's venue sits on top of the card.
 */

/** Staff steps (0 = bottom line … 8 = top line) giving each unit's path a little melody. */
const CONTOURS = [
  [1, 3, 4, 6, 5, 7],
  [2, 4, 3, 5, 7, 6],
  [0, 2, 4, 5, 3, 8],
  [3, 1, 4, 6, 5, 7],
  [1, 4, 2, 5, 6, 8],
  [2, 3, 5, 4, 6, 7],
  [0, 3, 2, 5, 7, 6],
  [1, 2, 4, 6, 7, 8],
]
const STEP_NOTE = ['E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5']

export const contourFor = (unitIndex: number, n: number) => Array.from({ length: n }, (_, i) => CONTOURS[unitIndex % CONTOURS.length][i % 6])

type NodeState = 'done' | 'current' | 'open' | 'locked' | 'soon'
interface MapNode {
  id: string
  title: string
  goal: string
  state: NodeState
}

// geometry, in SVG units
const W = 400
const H = 160
const LINE = 16
const TOP = 58
const BOTTOM = TOP + LINE * 4
const X0 = 92
const yOf = (step: number) => BOTTOM - step * (LINE / 2)

export function UnitStaff({ unit, index, last, currentId }: { unit: Unit; index: number; last: boolean; currentId?: string }) {
  const { t, tl, locale } = useT()
  const { plain } = useRich()
  const nav = useNavigate()
  const completed = useStore((s) => s.progress.completed)
  const genre = useStore((s) => s.settings.genre)
  const [open, setOpen] = useState<string | null>(null)

  const reached = unitReached(unit.id, completed)
  const presenter = unitPresenter(unit.id)
  const color = CHARACTERS[presenter].color
  const venue = venueForUnit(index)

  const nodes: MapNode[] = [
    ...unit.lessons.map((l) => ({
      id: l.id,
      title: tl(l.title),
      goal: tl(l.goal),
      state: (completed[l.id] ? 'done' : l.id === currentId ? 'current' : isUnlocked(l.id, completed) ? 'open' : 'locked') as NodeState,
    })),
    ...(unit.upcoming ?? []).map((u, i) => ({ id: `${unit.id}-soon-${i}`, title: tl(u), goal: '', state: 'soon' as NodeState })),
  ]
  const contour = contourFor(index, nodes.length)
  const dx = (W - X0 - 34) / Math.max(1, nodes.length - 1)
  const xOf = (i: number) => X0 + i * dx
  const done = nodes.filter((n) => n.state === 'done').length
  const played = (n: MapNode) => n.state === 'done' || n.state === 'current' || n.state === 'open'

  // Tap ▶ to hear the melody of your progress in this unit.
  const playPath = () => {
    const notes = nodes.flatMap((n, i) => (n.state === 'done' ? [STEP_NOTE[contour[i]]] : []))
    if (notes.length) playSequence(notes, 0.38, MO_INSTRUMENT[genre])
  }

  return (
    <section className={`card px-3 pt-4 pb-2 overflow-visible ${reached ? '' : 'opacity-85'}`}>
      {/* the venue where this unit's concert happens */}
      <div
        className="relative -mx-3 -mt-4 mb-3 h-16 overflow-hidden rounded-t-card"
        style={{ background: `linear-gradient(180deg, ${venue.sky[genre][0]}, ${venue.sky[genre][1]})`, filter: reached ? undefined : 'grayscale(1) opacity(.55)' }}
      >
        <svg viewBox="0 70 400 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
          <venue.Scene genre={genre} />
        </svg>
        <span className="absolute bottom-2 right-2 chip bg-black/55 text-white text-[11px] backdrop-blur">🎤 {tl(venue.name)}</span>
      </div>

      <div className="flex items-start justify-between gap-2 px-1">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[.16em] font-bold" style={{ color: reached ? color : undefined }}>
            {t('unit')} {index + 1} · {tl(unit.level)}
          </p>
          <h2 className="font-display text-lg font-bold leading-tight">{tl(unit.title)}</h2>
          <p className="text-xs text-muted mt-0.5">{tl(unit.description)}</p>
        </div>
        {unit.lessons.length > 0 && reached ? (
          <button className="chip bg-raised text-ink text-xs shrink-0" onClick={playPath} aria-label={locale === 'es' ? 'Escuchar tu camino' : 'Play your path'}>
            <Play size={12} /> {done}/{unit.lessons.length}
          </button>
        ) : (
          <span className="chip bg-raised text-muted text-xs shrink-0">
            <Lock size={12} /> {unit.lessons.length ? t('locked') : t('comingSoon')}
          </span>
        )}
      </div>

      <div className="relative">
        {/* the unit's musician stands where the clef would be */}
        <div className="absolute left-0 top-[16%] w-[22%] pointer-events-none" style={{ color: 'rgb(var(--muted) / .5)' }}>
          <Character id={presenter} size={78} silhouette={!reached} />
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" style={{ overflow: 'visible' }} aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={74} x2={W - 6} y1={TOP + i * LINE} y2={TOP + i * LINE} stroke="rgb(var(--muted) / .45)" strokeWidth="1.6" />
          ))}
          <line x1={74} x2={74} y1={TOP} y2={BOTTOM} stroke="rgb(var(--muted) / .6)" strokeWidth="1.6" />
          <line x1={W - 14} x2={W - 14} y1={TOP} y2={BOTTOM} stroke="rgb(var(--ink))" strokeWidth="1.6" />
          <line x1={W - 7} x2={W - 7} y1={TOP} y2={BOTTOM} stroke="rgb(var(--ink))" strokeWidth={last ? 5 : 1.6} />
          {/* the melody line through the notes you can already play */}
          <polyline
            points={nodes
              .map((n, i) => (played(n) ? `${xOf(i)},${yOf(contour[i])}` : null))
              .filter(Boolean)
              .join(' ')}
            fill="none"
            stroke={color}
            strokeOpacity=".35"
            strokeWidth="3"
            strokeDasharray="2 6"
            strokeLinecap="round"
          />
          {nodes.map((n, i) => {
            const x = xOf(i)
            const step = contour[i]
            const y = yOf(step)
            const up = step < 4
            const dim = n.state === 'locked' || n.state === 'soon'
            const stroke = dim ? 'rgb(var(--muted) / .55)' : color
            const dash = dim ? '3 3' : undefined
            return (
              <g key={n.id}>
                {n.state === 'current' && (
                  <motion.ellipse
                    cx={x}
                    cy={y}
                    rx={22}
                    ry={17}
                    fill={color}
                    opacity={0.25}
                    animate={{ scale: [1, 1.35, 1] }}
                    transition={{ repeat: Infinity, duration: 1.3 }}
                    style={{ transformOrigin: `${x}px ${y}px` }}
                  />
                )}
                <line x1={up ? x + 12.5 : x - 12.5} x2={up ? x + 12.5 : x - 12.5} y1={y} y2={up ? y - 44 : y + 44} stroke={stroke} strokeWidth="2.6" strokeDasharray={dim ? '3 4' : undefined} />
                <ellipse cx={x} cy={y} rx={13.5} ry={10} transform={`rotate(-20 ${x} ${y})`} fill={n.state === 'done' ? color : 'rgb(var(--surface))'} stroke={stroke} strokeWidth="3" strokeDasharray={dash} />
                {n.state === 'done' && <path d={`M${x - 5} ${y}l3.5 3.5 6.5-7`} stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
                <text x={x} y={148} textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--muted))">
                  {i + 1}
                </text>
              </g>
            )
          })}
        </svg>

        {/* real buttons over each note (big tap targets, keyboard accessible) */}
        {nodes.map((n, i) => {
          const left = (xOf(i) / W) * 100
          const top = (yOf(contour[i]) / H) * 100
          return (
            <div key={n.id} className={`absolute ${open === n.id ? 'z-30' : 'z-10'}`} style={{ left: `${left}%`, top: `${top}%` }}>
              {n.state === 'current' && open !== n.id && (
                <motion.div
                  className="absolute -top-12 left-1/2 -translate-x-1/2 chip bg-surface border border-line text-accent shadow-soft whitespace-nowrap text-sm pointer-events-none"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                >
                  {t('start')}
                </motion.div>
              )}
              <button className="absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full" aria-label={`${i + 1}. ${n.title}`} aria-expanded={open === n.id} onClick={() => setOpen(open === n.id ? null : n.id)} />
              <AnimatePresence>
                {open === n.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6 }}
                    // framer-motion owns `transform`, so the card is placed with `left` instead of translate
                    style={{ left: left > 60 ? -224 : left < 35 ? -36 : -128 }}
                    className="absolute top-7 w-64 card p-4 text-left shadow-lift"
                  >
                    <p className="font-display text-lg font-bold leading-tight">{plain(n.title)}</p>
                    {n.goal && <p className="text-sm text-muted mt-1">{n.goal}</p>}
                    {n.state === 'soon' ? (
                      <p className="chip bg-raised text-muted mt-3">{t('comingSoon')}</p>
                    ) : n.state === 'locked' ? (
                      <p className="chip bg-raised text-muted mt-3">
                        <Lock size={14} /> {t('locked')}
                      </p>
                    ) : (
                      <button className="btn-primary w-full mt-3 py-3" onClick={() => nav(`/lesson/${n.id}`)}>
                        {n.state === 'done' ? t('review') : t('start')}
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
