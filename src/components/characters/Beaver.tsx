import type { Genre } from '@/lib/types'
import { Arm, CharacterSvg, Cheeks, Eyes, Moving, PlayingNotes, ThinkBubble, Whiskers, useGenre, type CharacterProps, type Mood } from './parts'

export const BEAVER_COLOR = '#8b5cf6'
const FUR = '#7b5034'
const FUR_DARK = '#5a3823'
const MUZZLE = '#b08562'
const BELLY = '#d9b48f'
const TAIL = '#4a3326'

/**
 * Beaver — the bassist. Serious and reliable: "the one who holds everything up".
 * Big front teeth and a flat tail scored with the five lines of a staff.
 * Cello (classical), electric bass (pop and rock, different strap and outfit).
 */
export function Beaver({ mood = 'idle', size = 120, genre, playing = false, silhouette = false }: CharacterProps) {
  const g = useGenre(genre)
  const cello = g === 'classical'
  return (
    <CharacterSvg size={size} mood={mood} playing={playing} silhouette={silhouette}>
      <g transform={cello ? 'translate(-8 0)' : undefined}>
        <Tail />
        {/* body + webbed feet */}
        <ellipse cx="62" cy="88" rx="25" ry="22" fill={FUR} />
        <ellipse cx="62" cy="93" rx="16" ry="15" fill={BELLY} />
        <ellipse cx="50" cy="110" rx="9" ry="4" fill={FUR_DARK} />
        <ellipse cx="74" cy="110" rx="9" ry="4" fill={FUR_DARK} />
        <Outfit genre={g} />
        {/* ears */}
        <circle cx="38" cy="34" r="7.5" fill={FUR} />
        <circle cx="86" cy="34" r="7.5" fill={FUR} />
        <circle cx="38" cy="34" r="3.8" fill={FUR_DARK} />
        <circle cx="86" cy="34" r="3.8" fill={FUR_DARK} />
        {/* head */}
        <ellipse cx="62" cy="54" rx="28" ry="25" fill={FUR} />
        {g === 'pop' && (
          <g>
            <path d="M35 46Q36 24 62 24Q88 24 89 46Z" fill={BEAVER_COLOR} />
            <rect x="33" y="41" width="58" height="8" rx="4" fill="#6d28d9" />
            <circle cx="62" cy="23" r="4" fill="#c4b5fd" />
          </g>
        )}
        <ellipse cx="62" cy="64" rx="17" ry="12" fill={MUZZLE} />
        <g transform="translate(2 0)">
          <Eyes mood={mood} brows />
          {g === 'classical' && (
            <g stroke="#d4a63c" strokeWidth="1.6" fill="none">
              <circle cx="47" cy="51" r="7.5" />
              <circle cx="73" cy="51" r="7.5" />
              <path d="M54.5 50h11" />
            </g>
          )}
          <Cheeks dx={2} />
          <Whiskers color={FUR_DARK} />
        </g>
        <Face mood={mood} />
        {mood === 'think' && <ThinkBubble x={2} y={2} />}
      </g>
      <Instrument genre={g} mood={mood} playing={playing} />
      <PlayingNotes playing={playing} color={BEAVER_COLOR} x={108} y={30} />
    </CharacterSvg>
  )
}

/** Big nose, mouth and the famous front teeth. */
function Face({ mood }: { mood: Mood }) {
  return (
    <g>
      <ellipse cx="62" cy="59" rx="5.2" ry="3.4" fill="#3b2416" />
      {mood === 'celebrate' && <ellipse cx="62" cy="70" rx="7" ry="6" fill="#1c1f30" />}
      {mood === 'sad' ? (
        <path d="M56 67.5q6-3.5 12 0" stroke="#1c1f30" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      ) : mood === 'think' ? (
        <path d="M58 66h8" stroke="#1c1f30" strokeWidth="2.2" strokeLinecap="round" />
      ) : (
        <path d="M56 65q6 3.5 12 0" stroke="#1c1f30" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      )}
      <rect x="58.4" y="66.5" width="7.2" height="8.5" rx="1.6" fill="#fffdf6" stroke="#d6cbb4" strokeWidth=".8" />
      <path d="M62 66.8v8" stroke="#d6cbb4" strokeWidth=".9" />
    </g>
  )
}

/** Flat paddle tail with the five lines of a staff. */
function Tail() {
  const lines = [-6, -3, 0, 3, 6].map((dx) => {
    const h = 22 * Math.sqrt(1 - (dx / 11.5) ** 2) - 2
    return <path key={dx} d={`M${26 + dx} ${94 - h}V${94 + h}`} stroke="#c9b49c" strokeWidth="1.1" opacity=".75" />
  })
  return (
    <g transform="rotate(-30 26 94)">
      <ellipse cx="26" cy="94" rx="12" ry="23" fill={TAIL} />
      {lines}
    </g>
  )
}

function Outfit({ genre }: { genre: Genre }) {
  if (genre === 'classical')
    return (
      <g>
        <path d="M62 78 53 73v10ZM62 78l9-5v10Z" fill={BEAVER_COLOR} />
        <circle cx="62" cy="78" r="2.2" fill="#5b21b6" />
      </g>
    )
  if (genre === 'rock')
    return (
      <g>
        {/* leather vest */}
        <path d="M38 80Q36 102 46 108H56L52 78Z" fill="#1f1f23" />
        <path d="M86 80Q88 102 78 108H68L72 78Z" fill="#1f1f23" />
        {[84, 92, 100].map((y) => (
          <g key={y}>
            <circle cx="44" cy={y} r="1.2" fill="#d4d4d8" />
            <circle cx="80" cy={y} r="1.2" fill="#d4d4d8" />
          </g>
        ))}
      </g>
    )
  return null
}

function Instrument({ genre, mood, playing }: { genre: Genre; mood: Mood; playing: boolean }) {
  const up = mood === 'celebrate'
  if (genre === 'classical')
    return (
      <g>
        {/* cello standing on its endpin */}
        <g transform="translate(84 88) rotate(10)">
          <path d="M0 20v9" stroke="#52525b" strokeWidth="1.6" />
          <path d="M-2 -50h4v26h-4Z" fill="#7c3a17" />
          <path d="M-3 -50q3-7 6 0q-3 3-6 0Z" fill="#7c3a17" />
          <ellipse cx="0" cy="-12" rx="12" ry="11" fill="#c2622d" stroke="#7c3a17" strokeWidth="1.2" />
          <ellipse cx="0" cy="8" rx="15" ry="13.5" fill="#c2622d" stroke="#7c3a17" strokeWidth="1.2" />
          <rect x="-8.5" y="-4" width="17" height="6" fill="#c2622d" />
          <path d="M0 -48V6" stroke="#2b1b10" strokeWidth="3" />
          <path d="M-5 10h10" stroke="#f3e2c0" strokeWidth="1.6" />
          <path d="M-7 -2q-2 4 0 8M7 -2q2 4 0 8" stroke="#2b1b10" strokeWidth="1" fill="none" />
        </g>
        <Arm d="M70 82 86 62" color={FUR} width={9} />
        {up ? (
          <Arm d="M38 84 24 68" color={FUR} width={9} />
        ) : (
          <Moving playing={playing} x={10} y={-1.5} duration={0.9}>
            <Arm d="M38 86 32 98" color={FUR} width={9} />
            <path d="M30 98 104 91" stroke="#5b3a1e" strokeWidth="2" strokeLinecap="round" />
            <path d="M31 100.5 103 93.5" stroke="#efe6d2" strokeWidth="1" strokeLinecap="round" />
          </Moving>
        )}
      </g>
    )
  const rock = genre === 'rock'
  return (
    <g>
      {/* strap */}
      <path d="M44 78Q62 92 86 76" stroke={rock ? '#1f1f23' : '#f472b6'} strokeWidth="4" fill="none" strokeLinecap="round" />
      {rock && [50, 58, 66, 74, 80].map((x, i) => <circle key={x} cx={x} cy={[83, 86.5, 87.5, 85.5, 81.5][i]} r="1" fill="#d4d4d8" />)}
      {/* electric bass */}
      <g transform="translate(48 98) rotate(62)">
        <rect x="-2.2" y="-62" width="4.4" height="54" fill="#3f2a1a" />
        <path d="M-4 -62h8l-1 -10h-6Z" fill={rock ? '#1f1f23' : BEAVER_COLOR} />
        <path d="M-12 0C-16-9-12-15-6-10C-4-14 3-14 5-11C10-19 17-12 13-2C17 9 13 20 0 20C-13 20-17 9-12 0Z" fill={rock ? '#1f1f23' : BEAVER_COLOR} stroke={rock ? BEAVER_COLOR : '#5b21b6'} strokeWidth="1.4" />
        {rock && <path d="M-7 2C-8-3-5-6-2-4H5C8-2 8 9 2 13C-4 14-7 8-7 2Z" fill={BEAVER_COLOR} />}
        <rect x="-4.5" y="1" width="9" height="2.6" fill={rock ? '#e4e4e7' : '#1f1f23'} />
        <rect x="-4" y="9" width="8" height="2.4" fill={rock ? '#e4e4e7' : '#1f1f23'} />
      </g>
      <Arm d="M86 82 98 70" color={FUR} width={9} />
      {up ? (
        <Arm d="M38 84 24 68" color={FUR} width={9} />
      ) : (
        <Moving playing={playing} y={3} duration={0.55}>
          <Arm d="M38 86 46 98" color={FUR} width={9} />
        </Moving>
      )}
    </g>
  )
}
