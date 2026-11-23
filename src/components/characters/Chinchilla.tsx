import type { Genre } from '@/lib/types'
import { Arm, CharacterSvg, Cheeks, Eyes, Keys, Mouth, Moving, Nose, PlayingNotes, ThinkBubble, Whiskers, fluff, useGenre, type CharacterProps, type Mood } from './parts'

export const CHINCHILLA_COLOR = '#38bdf8'
const FUR = '#b9c2cf'
const FUR_DARK = '#8e98a8'
const LIGHT = '#eef1f6'
const EAR = '#f3c4cf'
const NOTE = '#d98aa0'

/**
 * Chinchilla — the second voice. Dreamy and very fluffy, with enormous round ears
 * whose insides are shaped like eighth notes ♪. Flute (classical), synth pad (pop), combo organ (rock).
 */
export function Chinchilla({ mood = 'idle', size = 120, genre, playing = false, silhouette = false }: CharacterProps) {
  const g = useGenre(genre)
  const keys = g !== 'classical'
  return (
    <CharacterSvg size={size} mood={mood} playing={playing} silhouette={silhouette}>
      {/* big bushy tail */}
      <Moving playing={playing} rotate={4} duration={1.2}>
        <path d={fluff(96, 88, 13, 20, 12, 0.14, 0.2)} fill={FUR_DARK} transform="rotate(28 96 88)" />
        <path d={fluff(97, 86, 7, 13, 9, 0.12)} fill={FUR} transform="rotate(28 97 86)" />
      </Moving>
      {/* enormous upright ears with ♪ inside */}
      {[
        [27, -14],
        [93, 14],
      ].map(([cx, rot]) => (
        <g key={cx} transform={`rotate(${rot} ${cx} 26)`}>
          <ellipse cx={cx} cy="20" rx="20" ry="25" fill={FUR} />
          <ellipse cx={cx} cy="21" rx="13.5" ry="18" fill={EAR} />
          <ellipse cx={cx - 3} cy="29" rx="5.4" ry="4" fill={NOTE} transform={`rotate(-20 ${cx - 3} 29)`} />
          <path d={`M${cx + 1.8} 28.5V10q7 3 6 12`} stroke={NOTE} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>
      ))}
      {/* fluffy, extra-round body + head */}
      <path d={fluff(60, 90, 28, 22, 18, 0.1)} fill={FUR} />
      <path d={fluff(60, 95, 17, 14, 12, 0.08, 0.3)} fill={LIGHT} />
      <ellipse cx="50" cy="110" rx="7" ry="3.6" fill={FUR_DARK} />
      <ellipse cx="70" cy="110" rx="7" ry="3.6" fill={FUR_DARK} />
      <Outfit genre={g} />
      <path d={fluff(60, 56, 31, 25.5, 22, 0.08)} fill={FUR} />
      <path d="M54 32q3-6 6-1q3-6 6 1" stroke={FUR} strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="64" rx="17" ry="12" fill={LIGHT} />
      <Eyes mood={mood} spread={0.5} />
      <Cheeks />
      <Nose />
      <Whiskers color={FUR_DARK} long />
      <Mouth mood={mood} />
      <HairClip genre={g} />
      {mood === 'think' && <ThinkBubble />}
      <Instrument genre={g} mood={mood} playing={playing} />
      <PlayingNotes playing={playing} color={CHINCHILLA_COLOR} x={keys ? 106 : 100} y={keys ? 62 : 52} />
    </CharacterSvg>
  )
}

function HairClip({ genre }: { genre: Genre }) {
  if (genre === 'classical')
    return (
      <g transform="translate(78 37)">
        <path d="M0 0-7-4v8ZM0 0l7-4v8Z" fill={CHINCHILLA_COLOR} />
        <circle r="1.8" fill="#0369a1" />
      </g>
    )
  if (genre === 'pop')
    return <path d="M79 31l2 4.2 4.6.6-3.4 3.2.9 4.6-4.1-2.3-4.1 2.3.9-4.6-3.4-3.2 4.6-.6Z" fill={CHINCHILLA_COLOR} stroke="#fff" strokeWidth=".8" />
  return <path d="M80 30 74 39h4.5l-2 7 7-10h-4.5l2.5-6Z" fill={CHINCHILLA_COLOR} />
}

function Outfit({ genre }: { genre: Genre }) {
  if (genre === 'classical')
    return <path d={fluff(60, 78, 15, 5, 10, 0.25)} fill="#fbfaf7" stroke="#e5e7eb" strokeWidth=".8" />
  if (genre === 'rock')
    return (
      <g>
        <rect x="46" y="76" width="28" height="5" rx="2.5" fill="#1f1f23" />
        {[50, 56, 62, 68].map((x) => (
          <path key={x} d={`M${x} 81l1.6 3.2 1.6-3.2Z`} fill="#d4d4d8" />
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
        {/* transverse flute, held to her right */}
        <path d="M70 66.5 6 77" stroke="#9aa3b2" strokeWidth="5" strokeLinecap="round" />
        <path d="M70 66 6 76.5" stroke="#e6eaf0" strokeWidth="2.6" strokeLinecap="round" />
        {[20, 28, 36, 44, 52].map((x) => (
          <circle key={x} cx={x} cy={74.2 - (x - 6) * 0.165} r="1.4" fill="#7b8494" />
        ))}
        {up ? (
          <Arm d="M80 86 94 70" color={FUR} />
        ) : (
          <Moving playing={playing} y={-1} duration={0.4} delay={0.2}>
            <Arm d="M79 86 56 72" color={FUR} />
          </Moving>
        )}
        <Moving playing={playing} y={-1} duration={0.4}>
          <Arm d="M41 86 26 76" color={FUR} />
        </Moving>
      </g>
    )
  const pop = genre === 'pop'
  return (
    <g>
      {pop ? (
        <g>
          {/* synth with a glowing screen */}
          <path d="M26 112 94 112" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          <path d="M30 104v8M90 104v8" stroke="#334155" strokeWidth="3" />
          <rect x="10" y="88" width="100" height="18" rx="3" fill="#0c4a6e" />
          <rect x="14" y="90" width="18" height="4.5" rx="1" fill="#67e8f9" />
          {[40, 47, 54, 92, 99].map((x, i) => (
            <circle key={x} cx={x} cy="92.3" r="1.8" fill={i % 2 ? '#f0abfc' : CHINCHILLA_COLOR} />
          ))}
          <Keys x={14} y={96.5} w={92} h={8} n={17} />
        </g>
      ) : (
        <g>
          {/* combo organ on a chrome Z-stand, reverse-colour keys */}
          <path d="M30 104 90 118M90 104 30 118" stroke="#a1a1aa" strokeWidth="2.6" strokeLinecap="round" />
          <rect x="10" y="90" width="100" height="15" rx="2.5" fill="#ea580c" />
          <rect x="10" y="90" width="100" height="4" rx="2" fill="#9a3412" />
          <Keys x={15} y={95} w={90} h={8} n={17} reverse />
        </g>
      )}
      {up ? (
        <g>
          <Arm d="M40 86 26 70" color={FUR} />
          <Arm d="M80 86 94 70" color={FUR} />
        </g>
      ) : (
        <g>
          <Arm d="M40 88 34 98" color={FUR} playing={playing} />
          <Arm d="M80 88 86 98" color={FUR} playing={playing} delay={0.25} />
        </g>
      )}
    </g>
  )
}
