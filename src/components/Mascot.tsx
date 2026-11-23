import { motion } from 'framer-motion'
import type { Genre } from '@/lib/types'
import { ACCENT, ACCENT2, Arm, CharacterSvg, Cheeks, Eyes, INK, Keys, Mouth, Nose, PINK, ThinkBubble, Whiskers, useGenre, type Mood } from './characters/parts'

export type { Mood } from './characters/parts'

/**
 * Mo — Mousik's mascot: a little music-loving mouse whose tail curls like a treble clef.
 * Outfit follows the learner's genre: bow tie (classical), headphones (pop), shades (rock).
 * With `instrument`, Mo plays the band's keyboard: piano, stage piano or organ.
 */
export function Mascot({
  mood = 'idle',
  size = 120,
  genre,
  instrument = false,
  playing = false,
  silhouette = false,
}: {
  mood?: Mood
  size?: number
  genre?: Genre
  instrument?: boolean
  playing?: boolean
  silhouette?: boolean
}) {
  const g = useGenre(genre)
  const fur = g === 'rock' ? '#8d8f98' : g === 'pop' ? '#cfc6e6' : '#cbbfae'
  const furDark = g === 'rock' ? '#6d6f78' : g === 'pop' ? '#b3a7d4' : '#ae9f8b'
  const belly = g === 'rock' ? '#c9cbd2' : g === 'pop' ? '#f3effc' : '#f4ece0'
  const shades = g === 'rock' && (mood === 'idle' || mood === 'happy' || mood === 'celebrate')
  const play = instrument && playing

  return (
    <CharacterSvg size={size} mood={mood} playing={play} silhouette={silhouette}>
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
      ) : mood === 'think' && !instrument ? (
        <>
          <path d="M40 90 36 100" stroke={fur} strokeWidth="8" strokeLinecap="round" />
          <path d="M80 88 70 74" stroke={fur} strokeWidth="8" strokeLinecap="round" />
        </>
      ) : instrument ? null : (
        <>
          <path d="M40 88 34 100" stroke={fur} strokeWidth="8" strokeLinecap="round" />
          <path d="M80 88 86 100" stroke={fur} strokeWidth="8" strokeLinecap="round" />
        </>
      )}
      {/* ears */}
      <circle cx="30" cy="30" r="19" fill={fur} />
      <circle cx="90" cy="30" r="19" fill={fur} />
      <circle cx="30" cy="30" r="11" fill={PINK} />
      <circle cx="90" cy="30" r="11" fill={PINK} />
      {/* head */}
      <ellipse cx="60" cy="54" rx="32" ry="28" fill={fur} />
      <ellipse cx="60" cy="62" rx="20" ry="15" fill={belly} />

      {/* rock: spiky tuft */}
      {g === 'rock' && <path d="M50 28l4-12 4 10 5-13 3 13 6-9-1 13" fill={furDark} />}

      {/* eyes */}
      {shades ? (
        <g>
          <path d="M34 47h52" stroke={INK} strokeWidth="3" />
          <rect x="35" y="44" width="21" height="12" rx="5" fill={INK} />
          <rect x="64" y="44" width="21" height="12" rx="5" fill={INK} />
          <path d="M39 47l6 0" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />
          <path d="M68 47l6 0" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />
        </g>
      ) : (
        <Eyes mood={mood} />
      )}
      <Cheeks />
      <Nose />
      <Whiskers color={furDark} />
      <Mouth mood={mood} />

      {/* genre accessories */}
      {g === 'classical' && (
        <g>
          <path d="M60 79 47 72v14Z" fill={ACCENT} />
          <path d="M60 79 73 72v14Z" fill={ACCENT} />
          <circle cx="60" cy="79" r="3.6" fill={ACCENT2} />
        </g>
      )}
      {g === 'pop' && (
        <g>
          <path d="M24 44C24 14 96 14 96 44" fill="none" stroke={ACCENT} strokeWidth="5" strokeLinecap="round" />
          <rect x="17" y="40" width="13" height="20" rx="6" fill={ACCENT2} />
          <rect x="90" y="40" width="13" height="20" rx="6" fill={ACCENT2} />
        </g>
      )}
      {g === 'rock' && <path d="M50 78l20 0-4 6h-12Z" fill={ACCENT} />}
      {mood === 'think' && <ThinkBubble />}

      {instrument && <MoKeyboard genre={g} playing={play} />}
      {instrument && mood !== 'celebrate' && (
        <>
          <Arm d="M40 88 34 98" color={fur} playing={play} />
          <Arm d="M80 88 86 98" color={fur} playing={play} delay={0.22} />
        </>
      )}
    </CharacterSvg>
  )
}

/** Mo's keyboard per genre: a small grand piano, a stage piano on an X stand, or a drawbar organ. */
function MoKeyboard({ genre, playing }: { genre: Genre; playing?: boolean }) {
  if (genre === 'classical')
    return (
      <g>
        {/* lid and case of a small grand piano, seen from the keyboard */}
        <path d="M12 96 30 80h66l12 16Z" fill="#15161c" />
        <rect x="10" y="96" width="100" height="16" rx="3" fill="#1c1d24" />
        <Keys x={16} y={97} w={88} h={9} n={16} />
        <path d="M10 106h100" stroke={ACCENT2} strokeWidth="1.6" />
        <path d="M18 112v6M102 112v6" stroke="#15161c" strokeWidth="4" strokeLinecap="round" />
        <Glow playing={playing} />
      </g>
    )
  if (genre === 'pop')
    return (
      <g>
        <path d="M30 104 90 120M90 104 30 120" stroke="#3a3a46" strokeWidth="3" strokeLinecap="round" />
        <rect x="10" y="94" width="100" height="12" rx="3" fill="#2a2a34" />
        <Keys x={18} y={97} w={84} h={8} n={15} />
        <circle cx="14" cy="98" r="1.6" fill={ACCENT} />
        <circle cx="106" cy="98" r="1.6" fill={ACCENT2} />
        <Glow playing={playing} />
      </g>
    )
  return (
    <g>
      {/* drawbar organ */}
      <rect x="10" y="90" width="100" height="24" rx="3" fill="#6b2a1a" />
      <rect x="10" y="90" width="100" height="5" rx="2" fill="#4a1c11" />
      {['#6b4423', '#6b4423', '#f4f1ea', '#f4f1ea', '#1c1f30', '#f4f1ea', '#1c1f30', '#f4f1ea', '#f4f1ea'].map((c, i) => (
        <rect key={i} x={22 + i * 4} y={83 + (i % 3) * 2} width="2.6" height={10 - (i % 3) * 2} rx="1" fill={c} stroke="#00000040" strokeWidth=".4" />
      ))}
      <Keys x={16} y={96} w={88} h={9} n={16} />
      <rect x="14" y="107" width="92" height="3" rx="1.5" fill="#4a1c11" />
      <Glow playing={playing} />
    </g>
  )
}

/** Little sparkle above the keys while playing. */
function Glow({ playing }: { playing?: boolean }) {
  if (!playing) return null
  return (
    <motion.g fill={ACCENT2} animate={{ opacity: [0, 1, 0], y: [0, -8] }} transition={{ duration: 1.2, repeat: Infinity }}>
      <path d="M100 76l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5Z" />
      <path d="M22 80l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
    </motion.g>
  )
}
