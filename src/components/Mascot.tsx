import { motion } from 'framer-motion'
import { useStore } from '@/store/useStore'
import type { Genre } from '@/lib/types'

export type Mood = 'idle' | 'happy' | 'sad' | 'think' | 'celebrate'

/**
 * Mo — Mousik's mascot: a little music-loving mouse whose tail curls like a treble clef.
 * Outfit follows the learner's genre: bow tie (classical), headphones (pop), shades (rock).
 */
export function Mascot({ mood = 'idle', size = 120, genre }: { mood?: Mood; size?: number; genre?: Genre }) {
  const storeGenre = useStore((s) => s.settings.genre)
  const g = genre ?? storeGenre
  const fur = g === 'rock' ? '#8d8f98' : g === 'pop' ? '#cfc6e6' : '#cbbfae'
  const furDark = g === 'rock' ? '#6d6f78' : g === 'pop' ? '#b3a7d4' : '#ae9f8b'
  const belly = g === 'rock' ? '#c9cbd2' : g === 'pop' ? '#f3effc' : '#f4ece0'
  const pink = '#f0a7a7'
  const ink = '#1c1f30'
  const shades = g === 'rock' && (mood === 'idle' || mood === 'happy' || mood === 'celebrate')

  const anim =
    mood === 'celebrate'
      ? { y: [0, -14, 0], rotate: [0, -4, 4, 0], transition: { duration: 0.7, repeat: Infinity, repeatDelay: 0.6 } }
      : mood === 'sad'
        ? { rotate: -4, y: 2, transition: { duration: 0.4 } }
        : mood === 'happy'
          ? { y: [0, -6, 0], transition: { duration: 0.5 } }
          : { y: [0, -3, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const } }

  return (
    <motion.svg width={size} height={size} viewBox="0 0 120 120" animate={anim} style={{ overflow: 'visible' }} aria-hidden>
      {/* tail — a treble-clef-like curl */}
      <path d="M78 98c14 2 24-6 22-17-2-9-13-10-15-2-1 5 5 7 7 3" fill="none" stroke={furDark} strokeWidth="3.5" strokeLinecap="round" />
      {/* body */}
      <ellipse cx="60" cy="92" rx="24" ry="20" fill={fur} />
      <ellipse cx="60" cy="96" rx="15" ry="13" fill={belly} />
      {/* feet */}
      <ellipse cx="48" cy="110" rx="8" ry="4" fill={furDark} />
      <ellipse cx="72" cy="110" rx="8" ry="4" fill={furDark} />
      {/* arms */}
      {mood === 'celebrate' ? (
        <>
          <path d="M38 86 26 70" stroke={fur} strokeWidth="8" strokeLinecap="round" />
          <path d="M82 86 94 70" stroke={fur} strokeWidth="8" strokeLinecap="round" />
        </>
      ) : mood === 'think' ? (
        <>
          <path d="M40 90 36 100" stroke={fur} strokeWidth="8" strokeLinecap="round" />
          <path d="M80 88 70 74" stroke={fur} strokeWidth="8" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M40 88 34 100" stroke={fur} strokeWidth="8" strokeLinecap="round" />
          <path d="M80 88 86 100" stroke={fur} strokeWidth="8" strokeLinecap="round" />
        </>
      )}
      {/* ears */}
      <circle cx="30" cy="30" r="19" fill={fur} />
      <circle cx="90" cy="30" r="19" fill={fur} />
      <circle cx="30" cy="30" r="11" fill={pink} />
      <circle cx="90" cy="30" r="11" fill={pink} />
      {/* head */}
      <ellipse cx="60" cy="54" rx="32" ry="28" fill={fur} />
      <ellipse cx="60" cy="62" rx="20" ry="15" fill={belly} />

      {/* rock: spiky tuft */}
      {g === 'rock' && <path d="M50 28l4-12 4 10 5-13 3 13 6-9-1 13" fill={furDark} />}

      {/* eyes */}
      {shades ? (
        <g>
          <path d="M34 47h52" stroke={ink} strokeWidth="3" />
          <rect x="35" y="44" width="21" height="12" rx="5" fill={ink} />
          <rect x="64" y="44" width="21" height="12" rx="5" fill={ink} />
          <path d="M39 47l6 0" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />
          <path d="M68 47l6 0" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />
        </g>
      ) : mood === 'happy' || mood === 'celebrate' ? (
        <g stroke={ink} strokeWidth="3.2" strokeLinecap="round" fill="none">
          <path d="M42 51q5-6 10 0" />
          <path d="M68 51q5-6 10 0" />
        </g>
      ) : mood === 'sad' ? (
        <g>
          <ellipse cx="47" cy="52" rx="4" ry="4.5" fill={ink} />
          <ellipse cx="73" cy="52" rx="4" ry="4.5" fill={ink} />
          <path d="M40 43l10 3M80 43l-10 3" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ) : mood === 'think' ? (
        <g>
          <ellipse cx="48" cy="49" rx="4" ry="5" fill={ink} />
          <ellipse cx="74" cy="49" rx="4" ry="5" fill={ink} />
          <circle cx="49.5" cy="47" r="1.4" fill="#fff" />
          <circle cx="75.5" cy="47" r="1.4" fill="#fff" />
        </g>
      ) : (
        <g>
          <ellipse cx="47" cy="51" rx="4.2" ry="5.2" fill={ink} />
          <ellipse cx="73" cy="51" rx="4.2" ry="5.2" fill={ink} />
          <circle cx="48.5" cy="49" r="1.5" fill="#fff" />
          <circle cx="74.5" cy="49" r="1.5" fill="#fff" />
        </g>
      )}
      {/* cheeks */}
      <circle cx="38" cy="62" r="4.5" fill={pink} opacity=".55" />
      <circle cx="82" cy="62" r="4.5" fill={pink} opacity=".55" />
      {/* nose + whiskers */}
      <ellipse cx="60" cy="59" rx="4" ry="3" fill={pink} />
      <g stroke={furDark} strokeWidth="1.4" strokeLinecap="round">
        <path d="M50 61 36 59M50 64 37 66" />
        <path d="M70 61 84 59M70 64 83 66" />
      </g>
      {/* mouth */}
      {mood === 'celebrate' ? (
        <path d="M53 65q7 9 14 0Z" fill={ink} />
      ) : mood === 'sad' ? (
        <path d="M55 69q5-4 10 0" stroke={ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      ) : mood === 'think' ? (
        <path d="M56 67h7" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
      ) : (
        <path d="M55 65q2.5 3 5 0q2.5 3 5 0" stroke={ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      )}

      {/* genre accessories */}
      {g === 'classical' && (
        <g>
          <path d="M60 79 47 72v14Z" fill="rgb(var(--accent))" />
          <path d="M60 79 73 72v14Z" fill="rgb(var(--accent))" />
          <circle cx="60" cy="79" r="3.6" fill="rgb(var(--accent2))" />
        </g>
      )}
      {g === 'pop' && (
        <g>
          <path d="M24 44C24 14 96 14 96 44" fill="none" stroke="rgb(var(--accent))" strokeWidth="5" strokeLinecap="round" />
          <rect x="17" y="40" width="13" height="20" rx="6" fill="rgb(var(--accent2))" />
          <rect x="90" y="40" width="13" height="20" rx="6" fill="rgb(var(--accent2))" />
        </g>
      )}
      {g === 'rock' && <path d="M50 78l20 0-4 6h-12Z" fill="rgb(var(--accent))" />}
      {mood === 'think' && (
        <g fill="rgb(var(--accent2))">
          <circle cx="98" cy="22" r="3" />
          <circle cx="106" cy="12" r="4.5" />
        </g>
      )}
    </motion.svg>
  )
}
