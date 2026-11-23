import type { Genre } from '@/lib/types'
import { CharacterSvg, Cheeks, Eyes, Mouth, Moving, Nose, PINK, PlayingNotes, ThinkBubble, Whiskers, useGenre, type CharacterProps, type Mood } from './parts'

export const HAMSTER_COLOR = '#f59e0b'
const FUR = '#e9b87c'
const FUR_DARK = '#c48a4c'
const LIGHT = '#fff3e2'
const CHEEK = '#f7d6a8'

/**
 * Hamster — the percussionist. Round as a ball, huge cheeks (that's where the sticks live),
 * and a quarter note ♩ patch on the forehead. Timpani + cymbals in classical, a drum kit otherwise.
 */
export function Hamster({ mood = 'idle', size = 120, genre, playing = false, silhouette = false }: CharacterProps) {
  const g = useGenre(genre)
  const classical = g === 'classical'
  return (
    <CharacterSvg size={size} mood={mood} playing={playing} silhouette={silhouette}>
      {classical && <Cymbals playing={playing} />}
      {/* in classical he is small next to giant timpani */}
      <g transform={classical ? 'translate(60 66) scale(.84) translate(-60 -66)' : undefined}>
        <HamsterBody mood={mood} genre={g} playing={playing} />
      </g>
      {classical ? <Timpani /> : <DrumKit rock={g === 'rock'} playing={playing} />}
      <PlayingNotes playing={playing} color={HAMSTER_COLOR} x={104} y={34} />
    </CharacterSvg>
  )
}

function HamsterBody({ mood, genre, playing }: { mood: Mood; genre: Genre; playing: boolean }) {
  const stick = genre === 'classical' ? '#6b4a2b' : '#e8cf9c'
  const tip = genre === 'classical' ? '#f4ead8' : '#e8cf9c'
  const up = mood === 'celebrate'
  return (
    <g>
      {/* ears */}
      <circle cx="38" cy="40" r="8.5" fill={FUR} />
      <circle cx="82" cy="40" r="8.5" fill={FUR} />
      <circle cx="38" cy="40" r="4.5" fill={PINK} />
      <circle cx="82" cy="40" r="4.5" fill={PINK} />
      {/* one round body + head */}
      <ellipse cx="60" cy="72" rx="32" ry="33" fill={FUR} />
      <ellipse cx="60" cy="84" rx="21" ry="19" fill={LIGHT} />
      {/* cheeks */}
      <ellipse cx="36" cy="72" rx="13" ry="11.5" fill={CHEEK} />
      <ellipse cx="84" cy="72" rx="13" ry="11.5" fill={CHEEK} />
      <ellipse cx="60" cy="72" rx="15" ry="11" fill={LIGHT} />
      {/* ♩ forehead patch */}
      <g fill={FUR_DARK}>
        <ellipse cx="57.6" cy="53.6" rx="3.3" ry="2.4" transform="rotate(-20 57.6 53.6)" />
        <rect x="59.6" y="45" width="1.9" height="9" rx=".9" />
      </g>

      {/* outfits */}
      {genre === 'classical' && (
        <g>
          <path d="M30 84Q32 104 60 105Q88 104 90 84Q76 94 60 92Q44 94 30 84Z" fill="#22263a" />
          <path d="M52 91 60 104 68 91Z" fill="#fbfaf7" />
          <path d="M60 92 52 88v8ZM60 92l8-4v8Z" fill={HAMSTER_COLOR} />
          <circle cx="60" cy="92" r="2" fill="#b45309" />
        </g>
      )}
      {genre === 'pop' && (
        <g>
          {/* backwards cap */}
          <path d="M40 48Q42 34 60 33Q78 34 80 48Q60 42 40 48Z" fill={HAMSTER_COLOR} />
          <ellipse cx="80" cy="47" rx="9" ry="3" fill="#b45309" transform="rotate(-12 80 47)" />
          <circle cx="60" cy="34" r="2" fill="#b45309" />
        </g>
      )}
      {genre === 'rock' && (
        <g>
          {/* bandana */}
          <path d="M39 47Q42 33 60 32Q78 33 81 47Q60 40 39 47Z" fill="#dc2626" />
          <circle cx="50" cy="40" r="1.2" fill="#fff" />
          <circle cx="62" cy="37" r="1.2" fill="#fff" />
          <circle cx="72" cy="41" r="1.2" fill="#fff" />
          <path d="M81 46l9-3-3 7Z M82 47l8 4-6 3Z" fill="#b91c1c" />
        </g>
      )}

      {/* face (Mo's, moved down onto the round head) */}
      <g transform="translate(0 12)">
        <Eyes mood={mood} />
        <Cheeks dx={-2} />
        <Nose />
        <Whiskers color={FUR_DARK} />
        <Mouth mood={mood} />
      </g>
      {mood === 'think' && <ThinkBubble x={-4} y={8} />}

      {/* arms + sticks/mallets */}
      {up ? (
        <g>
          <path d="M34 78 22 60" stroke={FUR} strokeWidth="8" strokeLinecap="round" />
          <path d="M86 78 98 60" stroke={FUR} strokeWidth="8" strokeLinecap="round" />
          <path d="M22 60 16 44M98 60 104 44" stroke={stick} strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="16" cy="44" r="3" fill={tip} />
          <circle cx="104" cy="44" r="3" fill={tip} />
        </g>
      ) : (
        <g>
          <Moving playing={playing} y={-6} duration={0.45}>
            <path d="M34 82 26 92" stroke={FUR} strokeWidth="8" strokeLinecap="round" />
            <path d="M26 92 40 100" stroke={stick} strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="40" cy="100" r="3" fill={tip} />
          </Moving>
          <Moving playing={playing} y={-6} duration={0.45} delay={0.22}>
            <path d="M86 82 94 92" stroke={FUR} strokeWidth="8" strokeLinecap="round" />
            <path d="M94 92 80 100" stroke={stick} strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="80" cy="100" r="3" fill={tip} />
          </Moving>
        </g>
      )}
    </g>
  )
}

/** Two giant copper kettle drums — comically bigger than the hamster. */
function Timpani() {
  const kettle = (cx: number) => (
    <g key={cx}>
      <path d={`M${cx - 27} 94Q${cx - 24} 119 ${cx} 119Q${cx + 24} 119 ${cx + 27} 94Z`} fill="#c27a3a" />
      <path d={`M${cx - 18} 97Q${cx - 15} 114 ${cx - 4} 116`} stroke="#e7a462" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx={cx} cy="94" rx="28" ry="6.5" fill="#f3ead8" stroke="#8a5428" strokeWidth="2.2" />
      {[-20, -7, 7, 20].map((d) => (
        <path key={d} d={`M${cx + d} 99v5`} stroke="#8a5428" strokeWidth="2" strokeLinecap="round" />
      ))}
    </g>
  )
  return <g>{[31, 89].map(kettle)}</g>
}

/** A pair of orchestral cymbals resting behind the timpani. */
function Cymbals({ playing }: { playing: boolean }) {
  return (
    <Moving playing={playing} rotate={4} duration={0.9}>
      <g transform="rotate(-18 104 70)">
        <ellipse cx="104" cy="70" rx="5" ry="15" fill="#e2b546" stroke="#a57d1e" strokeWidth="1.2" />
        <ellipse cx="104" cy="70" rx="1.6" ry="4" fill="#a57d1e" />
      </g>
      <g transform="rotate(-6 112 74)">
        <ellipse cx="112" cy="74" rx="5" ry="15" fill="#efc65a" stroke="#a57d1e" strokeWidth="1.2" />
        <ellipse cx="112" cy="74" rx="1.6" ry="4" fill="#a57d1e" />
      </g>
    </Moving>
  )
}

/** Bass drum, snare and a hi-hat. Rock = black shells, pop = signature amber. */
function DrumKit({ rock, playing }: { rock: boolean; playing: boolean }) {
  const shell = rock ? '#18181b' : HAMSTER_COLOR
  const head = rock ? '#27272a' : '#fbfaf7'
  return (
    <g>
      {/* hi-hat */}
      <path d="M104 80v34" stroke="#71717a" strokeWidth="2" />
      <Moving playing={playing} y={-2} duration={0.45}>
        <ellipse cx="104" cy="80" rx="13" ry="3" fill="#e2b546" stroke="#a57d1e" strokeWidth="1" />
        <ellipse cx="104" cy="83" rx="13" ry="3" fill="#d4a63c" stroke="#a57d1e" strokeWidth="1" />
      </Moving>
      {/* snare */}
      <path d="M12 96v9q0 4 14 4t14-4v-9Z" fill={shell} />
      <path d="M12 100h28" stroke="#d4d4d8" strokeWidth="1" />
      <ellipse cx="26" cy="96" rx="14" ry="4" fill={head} stroke="#a1a1aa" strokeWidth="1" />
      {/* bass drum */}
      <circle cx="60" cy="101" r="18.5" fill={shell} />
      <circle cx="60" cy="101" r="15" fill={head} />
      {rock ? (
        <path d="M62 90 54 102h6l-2.5 10 9-13.5h-6l3-8.5Z" fill={HAMSTER_COLOR} />
      ) : (
        <g fill={HAMSTER_COLOR}>
          <ellipse cx="57.5" cy="106" rx="3.8" ry="2.9" transform="rotate(-20 57.5 106)" />
          <path d="M60.6 105.5V94q5 2 5 7" stroke={HAMSTER_COLOR} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  )
}
