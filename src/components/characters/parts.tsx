import { motion } from 'framer-motion'
import { useId, type ReactNode } from 'react'
import { useStore } from '@/store/useStore'
import type { Genre } from '@/lib/types'

/**
 * Shared drawing pieces for Mo and the band. Every character is drawn on the same
 * 120×120 grid and shares Mo's face (eyes, mouth, cheeks) so the cast looks like one family.
 * Face pieces use Mo's coordinates; place them on another head with a <g transform>.
 */

export type Mood = 'idle' | 'happy' | 'sad' | 'think' | 'celebrate'

export interface CharacterProps {
  mood?: Mood
  size?: number
  /** Defaults to the learner's genre. */
  genre?: Genre
  /** Animates the instrument (and a gentle groove). */
  playing?: boolean
  /** Flat shape for musicians that are still locked. */
  silhouette?: boolean
}

export const INK = '#1c1f30'
export const PINK = '#f0a7a7'
export const ACCENT = 'rgb(var(--accent))'
export const ACCENT2 = 'rgb(var(--accent2))'

export function useGenre(genre?: Genre): Genre {
  const storeGenre = useStore((s) => s.settings.genre)
  return genre ?? storeGenre
}

/** Whole-body motion for a mood (Mo's original timings) or a groove while playing. */
export function moodAnim(mood: Mood, playing = false) {
  if (playing && mood !== 'celebrate' && mood !== 'sad')
    return { y: [0, -2.5, 0], rotate: [0, -1.5, 0, 1.5, 0], transition: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' as const } }
  return mood === 'celebrate'
    ? { y: [0, -14, 0], rotate: [0, -4, 4, 0], transition: { duration: 0.7, repeat: Infinity, repeatDelay: 0.6 } }
    : mood === 'sad'
      ? { rotate: -4, y: 2, transition: { duration: 0.4 } }
      : mood === 'happy'
        ? { y: [0, -6, 0], transition: { duration: 0.5 } }
        : { y: [0, -3, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const } }
}

/** The <svg> every character is drawn in; `silhouette` floods the drawing with one muted color. */
export function CharacterSvg({
  size,
  mood,
  playing,
  silhouette,
  children,
}: {
  size: number
  mood: Mood
  playing?: boolean
  silhouette?: boolean
  children: ReactNode
}) {
  const id = `sil${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      animate={moodAnim(silhouette ? 'idle' : mood, !silhouette && playing)}
      style={{ overflow: 'visible' }}
      aria-hidden
    >
      {silhouette && (
        <defs>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
            <feFlood style={{ floodColor: 'rgb(var(--muted))' }} floodOpacity={0.5} />
            <feComposite operator="in" in2="SourceAlpha" />
          </filter>
        </defs>
      )}
      <g filter={silhouette ? `url(#${id})` : undefined}>{children}</g>
    </motion.svg>
  )
}

/**
 * Mo's eyes for each mood. `spread` moves them apart (px per side).
 * `sleepy` = half-closed calm eyes when idle/thinking (capybara); `brows` = flat serious brows (beaver).
 */
export function Eyes({ mood, ink = INK, spread = 0, sleepy = false, brows = false }: { mood: Mood; ink?: string; spread?: number; sleepy?: boolean; brows?: boolean }) {
  const side = (s: -1 | 1) => {
    const dx = s === -1 ? -spread : 26 + spread // left eye is drawn at Mo's x, right one 26px further
    const mirror = s === 1
    if (mood === 'happy' || mood === 'celebrate')
      return <path d={`M${42 + dx} 51q5-6 10 0`} stroke={ink} strokeWidth="3.2" strokeLinecap="round" fill="none" />
    if (mood === 'sad')
      return (
        <g>
          <ellipse cx={47 + dx} cy="52" rx="4" ry="4.5" fill={ink} />
          <path d={mirror ? `M${54 + dx} 43l-10 3` : `M${40 + dx} 43l10 3`} stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )
    if (sleepy)
      return (
        <g>
          <path d={`M${42.6 + dx} 51a4.4 4 0 0 0 8.8 0Z`} fill={ink} />
          <path d={`M${41.5 + dx} 50.5q5.5 1.6 11 0`} stroke={ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>
      )
    const think = mood === 'think'
    return (
      <g>
        <ellipse cx={(think ? 48 : 47) + dx} cy={think ? 49 : 51} rx={think ? 4 : 4.2} ry={think ? 5 : 5.2} fill={ink} />
        <circle cx={(think ? 49.5 : 48.5) + dx} cy={think ? 47 : 49} r={think ? 1.4 : 1.5} fill="#fff" />
        {brows && !think && <path d={`M${41.5 + dx} 42.5h11`} stroke={ink} strokeWidth="2.6" strokeLinecap="round" />}
      </g>
    )
  }
  return (
    <g>
      {side(-1)}
      {side(1)}
    </g>
  )
}

/** Mo's mouth for each mood (centered on x=60, y≈65). */
export function Mouth({ mood, ink = INK }: { mood: Mood; ink?: string }) {
  if (mood === 'celebrate') return <path d="M53 65q7 9 14 0Z" fill={ink} />
  if (mood === 'sad') return <path d="M55 69q5-4 10 0" stroke={ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
  if (mood === 'think') return <path d="M56 67h7" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
  return <path d="M55 65q2.5 3 5 0q2.5 3 5 0" stroke={ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
}

export function Cheeks({ color = PINK, dx = 0 }: { color?: string; dx?: number }) {
  return (
    <g>
      <circle cx={38 - dx} cy="62" r="4.5" fill={color} opacity=".55" />
      <circle cx={82 + dx} cy="62" r="4.5" fill={color} opacity=".55" />
    </g>
  )
}

export function Nose({ color = PINK }: { color?: string }) {
  return <ellipse cx="60" cy="59" rx="4" ry="3" fill={color} />
}

export function Whiskers({ color, long = false }: { color: string; long?: boolean }) {
  const k = long ? 6 : 0
  return (
    <g stroke={color} strokeWidth="1.4" strokeLinecap="round">
      <path d={`M50 61 ${36 - k} ${59 - k / 3}M50 64 ${37 - k} ${66 + k / 3}`} />
      <path d={`M70 61 ${84 + k} ${59 - k / 3}M70 64 ${83 + k} ${66 + k / 3}`} />
    </g>
  )
}

/** Thought bubbles (top right), as Mo shows them. */
export function ThinkBubble({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <g fill={ACCENT2} transform={`translate(${x} ${y})`}>
      <circle cx="98" cy="22" r="3" />
      <circle cx="106" cy="12" r="4.5" />
    </g>
  )
}

/** A strip of piano keys (white keys with the 2+3 black-key pattern). */
export function Keys({ x, y, w, h, n = 14, reverse = false }: { x: number; y: number; w: number; h: number; n?: number; reverse?: boolean }) {
  const kw = w / n
  const white = reverse ? '#24242b' : '#fbfaf7'
  const black = reverse ? '#f4f1ea' : '#1c1f30'
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="1" fill={white} stroke="#00000033" strokeWidth=".6" />
      {Array.from({ length: n - 1 }, (_, i) => (
        <path key={`l${i}`} d={`M${x + kw * (i + 1)} ${y}v${h}`} stroke="#00000030" strokeWidth=".5" />
      ))}
      {Array.from({ length: n - 1 }, (_, i) => i)
        .filter((i) => [0, 1, 3, 4, 5].includes(i % 7))
        .map((i) => (
          <rect key={`b${i}`} x={x + kw * (i + 1) - kw * 0.3} y={y} width={kw * 0.6} height={h * 0.6} fill={black} />
        ))}
    </g>
  )
}

/**
 * Scalloped ("fluffy") closed outline around an ellipse — chinchilla fur, squirrel tail, etc.
 */
export function fluff(cx: number, cy: number, rx: number, ry: number, bumps = 14, amp = 0.12, phase = 0) {
  const pt = (a: number, k = 1) => `${(cx + Math.cos(a) * rx * k).toFixed(1)} ${(cy + Math.sin(a) * ry * k).toFixed(1)}`
  const step = (Math.PI * 2) / bumps
  let d = `M${pt(phase)}`
  for (let i = 0; i < bumps; i++) {
    const a1 = phase + step * (i + 1)
    d += `Q${pt(phase + step * (i + 0.5), 1 + amp)} ${pt(a1)}`
  }
  return d + 'Z'
}

/** Arm drawn as a thick rounded stroke (Mo's style). `bob` makes it tap up and down while playing. */
export function Arm({ d, color, playing, delay = 0, width = 8 }: { d: string; color: string; playing?: boolean; delay?: number; width?: number }) {
  if (!playing) return <path d={d} stroke={color} strokeWidth={width} strokeLinecap="round" fill="none" />
  return (
    <motion.path
      d={d}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      fill="none"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.45, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  )
}

/** Wraps an instrument part that moves while playing (bow strokes, strums, mallets). */
export function Moving({ playing, children, x = 0, y = 0, rotate = 0, duration = 0.6, delay = 0 }: {
  playing?: boolean
  children: ReactNode
  x?: number
  y?: number
  rotate?: number
  duration?: number
  delay?: number
}) {
  if (!playing) return <g>{children}</g>
  return (
    <motion.g
      animate={{ x: [0, x, 0], y: [0, y, 0], rotate: [0, rotate, 0] }}
      transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      {children}
    </motion.g>
  )
}

/** Small floating notes shown while a character plays. */
export function PlayingNotes({ playing, color, x = 100, y = 30 }: { playing?: boolean; color: string; x?: number; y?: number }) {
  if (!playing) return null
  return (
    <motion.g
      fill={color}
      animate={{ y: [0, -10], opacity: [0, 1, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
    >
      <ellipse cx={x} cy={y} rx="3.2" ry="2.4" transform={`rotate(-20 ${x} ${y})`} />
      <path d={`M${x + 2.8} ${y - 0.5}v-10q4 2 4 6`} stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </motion.g>
  )
}
