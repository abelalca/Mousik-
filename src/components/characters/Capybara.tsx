import type { Genre } from '@/lib/types'
import { Arm, CharacterSvg, Cheeks, Eyes, Mouth, Moving, PlayingNotes, ThinkBubble, useGenre, type CharacterProps, type Mood } from './parts'

export const CAPYBARA_COLOR = '#10b981'
const FUR = '#a8794f'
const FUR_DARK = '#7d5634'
const MUZZLE = '#ba8c60'
const BELLY = '#c49a6c'

/**
 * Capybara — the accompanist. Big, square and unbothered; half-closed calm eyes,
 * a little bird that lives on her head, and a fermata 𝄐 ("hold it, relax") on the forehead.
 * Harp (classical), acoustic guitar (pop), clean electric guitar (rock).
 */
export function Capybara({ mood = 'idle', size = 120, genre, playing = false, silhouette = false }: CharacterProps) {
  const g = useGenre(genre)
  const harp = g === 'classical'
  return (
    <CharacterSvg size={size} mood={mood} playing={playing} silhouette={silhouette}>
      {harp && <Harp playing={playing} />}
      <g transform={harp ? 'translate(-10 0)' : undefined}>
        {/* feet + body */}
        <rect x="38" y="104" width="16" height="9" rx="4" fill={FUR_DARK} />
        <rect x="66" y="104" width="16" height="9" rx="4" fill={FUR_DARK} />
        <rect x="26" y="62" width="68" height="48" rx="23" fill={FUR} />
        <rect x="40" y="74" width="40" height="32" rx="16" fill={BELLY} />
        <Outfit genre={g} />
        {/* small ears */}
        <circle cx="37" cy="27" r="6.5" fill={FUR} />
        <circle cx="83" cy="27" r="6.5" fill={FUR} />
        <circle cx="37" cy="27" r="3.4" fill={FUR_DARK} />
        <circle cx="83" cy="27" r="3.4" fill={FUR_DARK} />
        {/* boxy head + wide muzzle */}
        <rect x="30" y="22" width="60" height="50" rx="23" fill={FUR} />
        <rect x="36" y="47" width="48" height="25" rx="12.5" fill={MUZZLE} />
        {/* 𝄐 fermata on the forehead */}
        <path d="M53 34q7-8 14 0" stroke={FUR_DARK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="60" cy="32.5" r="1.7" fill={FUR_DARK} />
        <g transform="translate(0 -9)">
          <Eyes mood={mood} sleepy />
        </g>
        <g transform="translate(0 -6)">
          <Cheeks dx={2} />
        </g>
        {/* nostrils */}
        <ellipse cx="54" cy="55" rx="2.6" ry="1.7" fill="#3b2a1d" />
        <ellipse cx="66" cy="55" rx="2.6" ry="1.7" fill="#3b2a1d" />
        <Mouth mood={mood} />
        <Bird />
        {mood === 'think' && <ThinkBubble x={-6} y={4} />}
        <Hands genre={g} mood={mood} playing={playing} />
      </g>
      <PlayingNotes playing={playing} color={CAPYBARA_COLOR} x={harp ? 18 : 104} y={harp ? 40 : 36} />
    </CharacterSvg>
  )
}

/** The little bird friend on her head. */
function Bird() {
  return (
    <g>
      <path d="M61 17 55 14 57 19Z" fill="#eab308" />
      <ellipse cx="66" cy="17.5" rx="6.5" ry="4.6" fill="#facc15" />
      <path d="M63 17q3 3 6 0" stroke="#eab308" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="71" cy="13.5" r="3.6" fill="#facc15" />
      <path d="M74.2 13 77.5 14 74.2 15.2Z" fill="#f97316" />
      <circle cx="72" cy="12.8" r=".9" fill="#1c1f30" />
      <path d="M64 22v2M68 22v2" stroke="#f97316" strokeWidth="1" strokeLinecap="round" />
    </g>
  )
}

function Outfit({ genre }: { genre: Genre }) {
  if (genre === 'classical')
    return (
      <g>
        <path d="M60 74 50 68v12ZM60 74l10-6v12Z" fill={CAPYBARA_COLOR} />
        <circle cx="60" cy="74" r="2.4" fill="#047857" />
      </g>
    )
  if (genre === 'pop')
    return (
      <g>
        {/* flower lei */}
        {[36, 44, 52, 60, 68, 76, 84].map((x, i) => (
          <circle key={x} cx={x} cy={72 + Math.abs(60 - x) * -0.12 + 3} r="4" fill={i % 2 ? '#f472b6' : CAPYBARA_COLOR} />
        ))}
        {[36, 52, 68, 84].map((x) => (
          <circle key={x} cx={x} cy={72 + Math.abs(60 - x) * -0.12 + 3} r="1.3" fill="#fef08a" />
        ))}
      </g>
    )
  return (
    <g>
      {/* denim vest with a patch */}
      <path d="M28 76Q26 100 36 108H50L46 76Z" fill="#1e3a5f" />
      <path d="M92 76Q94 100 84 108H70L74 76Z" fill="#1e3a5f" />
      <circle cx="82" cy="92" r="4" fill={CAPYBARA_COLOR} />
      <path d="M80.5 92h3M82 90.5v3" stroke="#fff" strokeWidth="1" />
    </g>
  )
}

function Hands({ genre, mood, playing }: { genre: Genre; mood: Mood; playing: boolean }) {
  const up = mood === 'celebrate'
  if (genre === 'classical')
    return (
      <g>
        {up ? <Arm d="M30 80 18 64" color={FUR} width={9} /> : <Arm d="M30 82 28 96" color={FUR} width={9} />}
        <Moving playing={playing} x={2} y={3} duration={0.5}>
          <Arm d="M88 80 98 72" color={FUR} width={9} />
        </Moving>
      </g>
    )
  return (
    <g>
      {genre === 'pop' ? <AcousticGuitar /> : <ElectricGuitar />}
      <Arm d="M88 80 96 72" color={FUR} width={9} />
      {up ? (
        <Arm d="M32 80 20 64" color={FUR} width={9} />
      ) : (
        <Moving playing={playing} y={4} duration={0.5}>
          <Arm d="M33 82 46 94" color={FUR} width={9} />
        </Moving>
      )}
    </g>
  )
}

function AcousticGuitar() {
  return (
    <g transform="translate(50 94) rotate(64)">
      <rect x="-2.2" y="-50" width="4.4" height="42" fill="#5b3a1e" />
      <path d="M-3.5 -50h7l-1 -8h-5Z" fill="#3b2614" />
      <ellipse cx="0" cy="-3" rx="10" ry="9" fill="#dca468" stroke="#a86b32" strokeWidth="1.2" />
      <ellipse cx="0" cy="9" rx="13" ry="11" fill="#dca468" stroke="#a86b32" strokeWidth="1.2" />
      <rect x="-9" y="-1" width="18" height="6" fill="#dca468" />
      <circle cx="0" cy="1" r="3.6" fill="#3b2614" />
      <rect x="-4" y="11" width="8" height="2.2" rx="1" fill="#3b2614" />
    </g>
  )
}

function ElectricGuitar() {
  return (
    <g transform="translate(50 94) rotate(64)">
      <rect x="-2" y="-52" width="4" height="44" fill="#e9c98b" />
      <path d="M-3 -52h7l-2 -9h-5Z" fill="#e9c98b" />
      <path d="M-11 0C-14-8-11-13-6-9C-4-13 3-13 5-10C9-17 15-11 12-2C16 8 12 18 0 18C-12 18-16 8-11 0Z" fill="#a7f3d0" stroke="#0f766e" strokeWidth="1.2" />
      <path d="M-7 2C-8-3-5-6-2-4H5C8-2 8 8 2 12C-4 13-7 8-7 2Z" fill="#fbfaf7" />
      <rect x="-3.5" y="0" width="7" height="2" fill="#1f1f23" />
      <rect x="-3.5" y="5" width="7" height="2" fill="#1f1f23" />
    </g>
  )
}

/** Golden concert harp beside her. */
function Harp({ playing }: { playing: boolean }) {
  const strings: [number, number, number][] = [
    [80, 34, 53],
    [84, 29, 66],
    [88, 25, 79],
    [92, 23, 92],
    [96, 22, 105],
  ]
  return (
    <g>
      <Moving playing={playing} x={0.6} duration={0.25}>
        {strings.map(([x, y1, y2]) => (
          <path key={x} d={`M${x} ${y1}V${y2}`} stroke="#c99a3e" strokeWidth="1.2" />
        ))}
      </Moving>
      <path d="M76 40 98 112" stroke="#b7862b" strokeWidth="5" strokeLinecap="round" />
      <path d="M104 24Q90 12 76 40" stroke="#d4a63c" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M104 22V112" stroke="#d4a63c" strokeWidth="5.5" strokeLinecap="round" />
      <circle cx="104" cy="20" r="4" fill="#e9c46a" />
      <path d="M90 113h20" stroke="#b7862b" strokeWidth="4" strokeLinecap="round" />
    </g>
  )
}
