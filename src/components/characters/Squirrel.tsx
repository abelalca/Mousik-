import type { Genre } from '@/lib/types'
import { Arm, CharacterSvg, Cheeks, Eyes, Keys, Mouth, Moving, Nose, PINK, PlayingNotes, ThinkBubble, Whiskers, useGenre, type CharacterProps, type Mood } from './parts'

export const SQUIRREL_COLOR = '#ef4444'
const FUR = '#c97b43'
const FUR_DARK = '#9c5a2c'
const TAIL = '#d98b52'
const TAIL_LIGHT = '#eaa874'
const LIGHT = '#f8e6cc'

/**
 * Squirrel — the soloist. Theatrical, always up high; her huge tail ends in a curl
 * shaped like an eighth-note flag ♪. Violin (classical), keytar (pop), flying-V guitar (rock).
 */
export function Squirrel({ mood = 'idle', size = 120, genre, playing = false, silhouette = false }: CharacterProps) {
  const g = useGenre(genre)
  return (
    <CharacterSvg size={size} mood={mood} playing={playing} silhouette={silhouette}>
      <Tail playing={playing} />
      {/* body + feet */}
      <ellipse cx="62" cy="90" rx="19" ry="20" fill={FUR} />
      <ellipse cx="62" cy="95" rx="12" ry="14" fill={LIGHT} />
      <ellipse cx="52" cy="110" rx="7.5" ry="3.8" fill={FUR_DARK} />
      <ellipse cx="72" cy="110" rx="7.5" ry="3.8" fill={FUR_DARK} />
      <Outfit genre={g} />
      {/* pointed ears with tufts */}
      <path d="M37 42 40 14 55 31Z" fill={FUR} />
      <path d="M87 42 84 14 69 31Z" fill={FUR} />
      <path d="M41 36 42 22 50 31Z" fill={PINK} />
      <path d="M83 36 82 22 74 31Z" fill={PINK} />
      <path d="M40 15 36 8M40 15 41 7M84 15 88 8M84 15 83 7" stroke={FUR_DARK} strokeWidth="2.4" strokeLinecap="round" />
      {/* head */}
      <ellipse cx="62" cy="52" rx="27" ry="25" fill={FUR} />
      <ellipse cx="62" cy="62" rx="17" ry="13" fill={LIGHT} />
      <path d="M52 34q10-6 20 0" stroke={FUR_DARK} strokeWidth="2" fill="none" strokeLinecap="round" opacity=".6" />
      {g === 'pop' && (
        <g>
          <path d="M36 42Q62 28 88 42" stroke={SQUIRREL_COLOR} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M37 40Q62 27 87 40" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".8" />
        </g>
      )}
      <g transform="translate(2 0)">
        <Eyes mood={mood} />
        <Cheeks />
        <Nose color="#5b3a26" />
        <Whiskers color={FUR_DARK} />
        <Mouth mood={mood} />
      </g>
      {mood === 'think' && <ThinkBubble x={2} />}
      <Instrument genre={g} mood={mood} playing={playing} />
      <PlayingNotes playing={playing} color={SQUIRREL_COLOR} x={106} y={36} />
    </CharacterSvg>
  )
}

/** Big S-shaped tail behind her, ending in a ♪ flag curl. */
function Tail({ playing }: { playing: boolean }) {
  return (
    <Moving playing={playing} rotate={-3} duration={1.1}>
      <path d="M52 104C20 110 6 82 20 62C30 48 28 38 20 30" stroke={TAIL} strokeWidth="22" strokeLinecap="round" fill="none" />
      <path d="M20 30C14 20 18 8 28 8C38 9 40 22 32 30" stroke={TAIL} strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M46 102C24 104 14 84 24 66C31 54 31 44 25 36" stroke={TAIL_LIGHT} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M22 26C20 18 24 13 29 13" stroke={TAIL_LIGHT} strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </Moving>
  )
}

function Outfit({ genre }: { genre: Genre }) {
  if (genre === 'classical')
    return (
      <g>
        {/* tailcoat */}
        <path d="M43 82Q42 108 62 110Q82 108 81 82Q71 91 62 89Q53 91 43 82Z" fill="#1f2233" />
        <path d="M54 88 62 104 70 88Z" fill="#fbfaf7" />
        <path d="M62 89 54 85v8ZM62 89l8-4v8Z" fill={SQUIRREL_COLOR} />
        <circle cx="62" cy="89" r="1.8" fill="#991b1b" />
      </g>
    )
  if (genre === 'pop')
    return (
      <g>
        {/* neon jacket */}
        <path d="M43 82Q42 108 62 110Q82 108 81 82Q71 90 62 89Q53 90 43 82Z" fill="#22d3ee" />
        <path d="M62 89v20" stroke={SQUIRREL_COLOR} strokeWidth="2.2" />
        <path d="M45 96h10M69 96h10" stroke="#f0abfc" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    )
  return (
    <g>
      {/* leather jacket */}
      <path d="M43 82Q42 108 62 110Q82 108 81 82Q71 90 62 89Q53 90 43 82Z" fill="#1f1f23" />
      <path d="M62 89v20" stroke="#a1a1aa" strokeWidth="1.6" strokeDasharray="1.6 1.4" />
      <path d="M50 84 58 96 62 89M74 84 66 96 62 89" fill="#2e2e34" stroke="#3f3f46" strokeWidth="1" />
      <circle cx="49" cy="100" r="1.4" fill="#d4d4d8" />
      <circle cx="75" cy="100" r="1.4" fill="#d4d4d8" />
    </g>
  )
}

function Instrument({ genre, mood, playing }: { genre: Genre; mood: Mood; playing: boolean }) {
  const up = mood === 'celebrate'
  if (genre === 'classical')
    return (
      <g>
        {/* violin under the chin, pointing to her left */}
        <g transform="translate(78 78) rotate(105)">
          <path d="M-1.6 -6h3.2v-24h-3.2Z" fill="#2b1b10" />
          <path d="M-2.6 -30q2.6-6 5.2 0q-2.6 3-5.2 0Z" fill="#7c3a17" />
          <ellipse cx="0" cy="-4" rx="7" ry="6.5" fill="#a24b1f" />
          <ellipse cx="0" cy="7" rx="8.6" ry="7.6" fill="#a24b1f" />
          <rect x="-4.2" y="-0.5" width="8.4" height="3" fill="#a24b1f" />
          <path d="M-1.6 -6v14" stroke="#2b1b10" strokeWidth="2.4" />
          <path d="M-4 9h8" stroke="#f3e2c0" strokeWidth="1.4" />
          <path d="M-4 2q-1.5 2 0 4M4 2q1.5 2 0 4" stroke="#2b1b10" strokeWidth=".9" fill="none" />
        </g>
        {/* left hand on the neck */}
        <Arm d="M79 86 98 84" color={FUR} />
        {/* bow arm */}
        {up ? (
          <g>
            <Arm d="M45 84 30 66" color={FUR} />
            <path d="M30 66 18 30" stroke="#5b3a1e" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        ) : (
          <Moving playing={playing} x={10} y={-4} duration={0.8}>
            <Arm d="M46 86 40 96" color={FUR} />
            <path d="M38 97 106 69" stroke="#5b3a1e" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M40 99 104 72.5" stroke="#efe6d2" strokeWidth="1" strokeLinecap="round" />
          </Moving>
        )}
      </g>
    )
  if (genre === 'pop')
    return (
      <g>
        {/* keytar */}
        <g transform="translate(34 104) rotate(-24)">
          <rect x="0" y="-7" width="48" height="14" rx="5" fill="#fbfaf7" stroke="#d4d4d8" strokeWidth="1" />
          <Keys x={4} y={-4} w={38} h={7} n={11} />
          <rect x="46" y="-3.5" width="22" height="7" rx="3" fill={SQUIRREL_COLOR} />
          <rect x="62" y="-4.5" width="8" height="9" rx="2.5" fill="#1f1f23" />
          <circle cx="3" cy="4" r="1.3" fill="#22d3ee" />
        </g>
        <Arm d="M80 86 92 82" color={FUR} playing={playing} delay={0.3} />
        {up ? <Arm d="M45 84 30 66" color={FUR} /> : <Arm d="M46 86 46 98" color={FUR} playing={playing} />}
      </g>
    )
  return (
    <g>
      {/* flying-V guitar */}
      <g transform="translate(52 96) rotate(58)">
        <path d="M-2 -6h4v-46h-4Z" fill="#e9c98b" />
        <path d="M-1 -12h2M-1 -22h2M-1 -32h2M-1 -42h2" stroke="#9c7a45" strokeWidth="1" />
        <path d="M-4 -52h8l2 -10h-6Z" fill={SQUIRREL_COLOR} stroke="#fff" strokeWidth="1" />
        <path d="M0 -10 -14 16 -8 19 0 6 8 19 14 16Z" fill={SQUIRREL_COLOR} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
        <rect x="-4" y="1" width="8" height="2.4" fill="#1f1f23" />
        <rect x="-4" y="-4" width="8" height="2.4" fill="#1f1f23" />
      </g>
      <Arm d="M80 86 94 76" color={FUR} />
      {up ? <Arm d="M45 84 30 66" color={FUR} /> : (
        <Moving playing={playing} y={4} duration={0.3}>
          <Arm d="M46 86 46 99" color={FUR} />
        </Moving>
      )}
    </g>
  )
}
