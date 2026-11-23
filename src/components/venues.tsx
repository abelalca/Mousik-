import type { Genre, L } from '@/lib/types'

/**
 * The band's tour: the same 8 places for every genre (one per unit, from home to a giant
 * amphitheatre), dressed differently per genre. Each scene is a flat SVG in a 400 × 170 box
 * (ground line around y = 150). Places 4–8 use a simple stand-in until their unit is written.
 */
export interface Venue {
  id: string
  name: L
  /** "at home", "in the park"… used in "Recital at home!" */
  at: L
  sky: Record<Genre, [string, string]>
  Scene: (p: { genre: Genre }) => JSX.Element
  /** false = stand-in scene (final art comes with the unit). */
  drawn: boolean
}

// ---------- shared bits ----------

const Ground = ({ color, y = 150 }: { color: string; y?: number }) => <rect x="0" y={y} width="400" height={170 - y} fill={color} />

function Tree({ x, s = 1, leaf = '#5fae6b', dark = '#4a9457' }: { x: number; s?: number; leaf?: string; dark?: string }) {
  return (
    <g transform={`translate(${x} 150) scale(${s})`}>
      <rect x="-4" y="-46" width="8" height="46" fill="#7a5537" />
      <circle cx="0" cy="-62" r="24" fill={leaf} />
      <circle cx="-16" cy="-50" r="16" fill={dark} />
      <circle cx="16" cy="-52" r="17" fill={leaf} />
    </g>
  )
}

function StringLights({ y = 30, colors = ['#ffd166', '#ff7eb6', '#7bdff2', '#b8f2a1'] }: { y?: number; colors?: string[] }) {
  return (
    <g>
      <path d={`M0 ${y} Q100 ${y + 22} 200 ${y} T400 ${y}`} fill="none" stroke="#3b3346" strokeWidth="1.5" />
      {Array.from({ length: 16 }).map((_, i) => {
        const x = 12 + i * 25
        const t = (x % 200) / 200
        const yy = y + 22 * 2 * t * (1 - t) * (x < 200 ? 1 : -1)
        return <circle key={i} cx={x} cy={yy + 3} r="3.6" fill={colors[i % colors.length]} />
      })}
    </g>
  )
}

// =============================================================================
// 1 · HOME — living room / bedroom / garage
// =============================================================================

function HomeScene({ genre }: { genre: Genre }) {
  if (genre === 'classical')
    return (
      <g>
        {/* striped wallpaper */}
        <rect x="0" y="0" width="400" height="150" fill="#f3e3c7" />
        {Array.from({ length: 20 }).map((_, i) => (
          <rect key={i} x={i * 20} y="0" width="8" height="150" fill="#ead3ad" />
        ))}
        <rect x="0" y="118" width="400" height="32" fill="#d9b98c" />
        {/* window with curtains */}
        <rect x="160" y="22" width="80" height="66" rx="3" fill="#bfe1f2" stroke="#fff" strokeWidth="5" />
        <path d="M200 22v66M160 55h80" stroke="#fff" strokeWidth="3" />
        <path d="M150 16q14 40 2 80h-8V16Z" fill="#9b2c3a" />
        <path d="M250 16q-14 40-2 80h8V16Z" fill="#9b2c3a" />
        {/* framed portrait */}
        <rect x="290" y="34" width="36" height="44" rx="2" fill="#c8a24a" />
        <rect x="295" y="39" width="26" height="34" fill="#4b3b2e" />
        <circle cx="308" cy="52" r="6" fill="#e8cfa9" />
        {/* upright piano */}
        <rect x="22" y="70" width="110" height="80" rx="4" fill="#3b2418" />
        <rect x="22" y="104" width="110" height="10" fill="#f6f1e7" />
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={28 + i * 11} y="104" width="5" height="6" fill="#1a1a1a" />
        ))}
        <rect x="58" y="80" width="38" height="16" rx="2" fill="#f6f1e7" />
        <path d="M64 86h26M64 90h26" stroke="#9a8c78" strokeWidth="1" />
        {/* floor lamp */}
        <rect x="356" y="64" width="4" height="86" fill="#5b4636" />
        <path d="M342 64h32l-6-20h-20Z" fill="#f0c987" />
        {/* rug */}
        <ellipse cx="220" cy="156" rx="120" ry="9" fill="#8c3b46" />
        <Ground color="#b88a5c" y={152} />
        <ellipse cx="220" cy="155" rx="120" ry="7" fill="#9b4651" />
      </g>
    )
  if (genre === 'pop')
    return (
      <g>
        <rect x="0" y="0" width="400" height="150" fill="#4b3a7a" />
        {/* LED strip glow */}
        <rect x="0" y="0" width="400" height="8" fill="#ff7eb6" />
        <rect x="0" y="8" width="400" height="26" fill="#ff7eb6" opacity=".18" />
        {/* posters */}
        <rect x="40" y="34" width="40" height="54" rx="3" fill="#7bdff2" />
        <path d="M48 76l12-24 12 24Z" fill="#fff" opacity=".8" />
        <rect x="90" y="44" width="34" height="44" rx="3" fill="#ffd166" />
        <circle cx="107" cy="62" r="9" fill="#ff7eb6" />
        {/* window with night city */}
        <rect x="270" y="30" width="96" height="60" rx="4" fill="#1d1640" stroke="#6b5aa6" strokeWidth="4" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={278 + i * 18} y={60 - (i % 3) * 10} width="12" height={30 + (i % 3) * 10} fill="#2f2660" />
        ))}
        <circle cx="352" cy="42" r="6" fill="#fff6c2" />
        {/* ring light */}
        <circle cx="180" cy="70" r="20" fill="none" stroke="#fff" strokeWidth="5" />
        <rect x="178" y="90" width="4" height="60" fill="#d8d0f2" />
        {/* bed corner */}
        <rect x="0" y="112" width="110" height="38" rx="6" fill="#7bdff2" />
        <rect x="0" y="104" width="34" height="14" rx="6" fill="#fff" />
        <Ground color="#2f2552" y={150} />
      </g>
    )
  // rock: garage
  return (
    <g>
      <rect x="0" y="0" width="400" height="150" fill="#8d9097" />
      {Array.from({ length: 6 }).map((_, i) => (
        <path key={i} d={`M0 ${i * 25}h400`} stroke="#7e8188" strokeWidth="1.5" />
      ))}
      {/* half-open garage door */}
      <rect x="230" y="0" width="170" height="62" fill="#c9ccd2" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M230 ${12 + i * 14}h170`} stroke="#aeb2b9" strokeWidth="2" />
      ))}
      <rect x="230" y="62" width="170" height="88" fill="#2b2d33" />
      {/* pegboard with tools */}
      <rect x="20" y="22" width="120" height="60" rx="3" fill="#c49a6c" />
      <path d="M40 34v30M38 34h4" stroke="#55585f" strokeWidth="4" strokeLinecap="round" />
      <path d="M70 32l14 30" stroke="#d1453b" strokeWidth="5" strokeLinecap="round" />
      <circle cx="112" cy="48" r="11" fill="none" stroke="#55585f" strokeWidth="4" />
      {/* old amp */}
      <rect x="40" y="104" width="58" height="46" rx="4" fill="#1f1f24" />
      <rect x="46" y="112" width="46" height="30" rx="2" fill="#3a3a42" />
      <circle cx="56" cy="108" r="1.6" fill="#e3c27a" />
      <circle cx="64" cy="108" r="1.6" fill="#e3c27a" />
      {/* bare bulb */}
      <path d="M180 0v18" stroke="#2b2d33" strokeWidth="2" />
      <circle cx="180" cy="24" r="7" fill="#ffe08a" />
      <Ground color="#6e7178" />
      <ellipse cx="150" cy="158" rx="26" ry="4" fill="#4d5057" />
    </g>
  )
}

// =============================================================================
// 2 · THE PARK — bandstand / bench / busking corner
// =============================================================================

function ParkScene({ genre }: { genre: Genre }) {
  if (genre === 'classical')
    return (
      <g>
        <Tree x={40} s={1.1} />
        <Tree x={360} s={1.2} />
        {/* bandstand (gazebo) */}
        <path d="M110 66 200 26l90 40Z" fill="#7a2f3b" />
        <rect x="114" y="66" width="172" height="6" fill="#fff" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={120 + i * 40} y="72" width="6" height="60" fill="#fff" />
        ))}
        <rect x="104" y="130" width="192" height="12" fill="#f1e9dd" />
        <rect x="96" y="142" width="208" height="8" fill="#ddd0bf" />
        {/* lanterns */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path d={`M${143 + i * 40} 72v8`} stroke="#5a4a3a" />
            <rect x={138 + i * 40} y="80" width="10" height="12" rx="3" fill="#ffd166" />
          </g>
        ))}
        <Ground color="#86c47a" />
      </g>
    )
  if (genre === 'pop')
    return (
      <g>
        <circle cx="340" cy="34" r="16" fill="#fff4b8" />
        <Tree x={60} s={1.15} leaf="#7fd18b" dark="#62b971" />
        <Tree x={330} s={0.95} leaf="#7fd18b" dark="#62b971" />
        {/* balloons */}
        {['#ff7eb6', '#7bdff2', '#ffd166'].map((c, i) => (
          <g key={i}>
            <path d={`M${250 + i * 12} 120 Q${246 + i * 12} 100 ${252 + i * 12} ${70 - i * 6}`} stroke="#777" fill="none" />
            <ellipse cx={252 + i * 12} cy={64 - i * 6} rx="9" ry="11" fill={c} />
          </g>
        ))}
        {/* bench */}
        <rect x="120" y="118" width="110" height="8" rx="2" fill="#c47a3c" />
        <rect x="120" y="104" width="110" height="8" rx="2" fill="#c47a3c" />
        <rect x="128" y="126" width="5" height="24" fill="#55585f" />
        <rect x="217" y="126" width="5" height="24" fill="#55585f" />
        {/* small speaker */}
        <rect x="244" y="122" width="24" height="28" rx="4" fill="#33363d" />
        <circle cx="256" cy="136" r="7" fill="#7bdff2" />
        <Ground color="#9ad88c" />
      </g>
    )
  // rock: busking corner by the park
  return (
    <g>
      <Tree x={360} s={1.1} leaf="#4f8a5a" dark="#3f7449" />
      {/* graffiti wall */}
      <rect x="0" y="52" width="300" height="98" fill="#5b5e66" />
      <path d="M222 120q20-30 40-6t30-8" stroke="#ff4f6d" strokeWidth="9" fill="none" strokeLinecap="round" />
      <text x="22" y="104" fontSize="34" fontWeight="900" fill="#ffd166" fontFamily="sans-serif" transform="rotate(-6 22 104)">
        ROCK
      </text>
      <path d="M120 66l18 18M138 66l-18 18" stroke="#7bdff2" strokeWidth="5" strokeLinecap="round" />
      {/* lamp post */}
      <rect x="312" y="36" width="5" height="114" fill="#2b2d33" />
      <circle cx="314.5" cy="38" r="7" fill="#ffe08a" />
      {/* open guitar case with coins */}
      <path d="M150 150c0-10 18-12 26-6 8-6 30-4 30 6Z" fill="#1f1f24" />
      <path d="M156 150c2-6 14-7 20-3 6-4 22-3 24 3Z" fill="#a8323e" />
      <circle cx="172" cy="148" r="2.4" fill="#f5c542" />
      <circle cx="186" cy="147" r="2.4" fill="#f5c542" />
      <Ground color="#8b8f97" />
    </g>
  )
}

// =============================================================================
// 3 · THE CAFÉ — Viennese café / cozy acoustic corner / small wooden stage
// =============================================================================

function Table({ x, top = '#f6f1e7', leg = '#5a4232', cup = '#fff' }: { x: number; top?: string; leg?: string; cup?: string }) {
  return (
    <g>
      <ellipse cx={x} cy="128" rx="22" ry="5" fill={top} />
      <rect x={x - 2} y="128" width="4" height="22" fill={leg} />
      <rect x={x - 6} y="118" width="10" height="8" rx="2" fill={cup} />
      <path d={`M${x + 4} 120q5 2 0 5`} stroke={cup} strokeWidth="2" fill="none" />
    </g>
  )
}

function CafeScene({ genre }: { genre: Genre }) {
  if (genre === 'classical')
    return (
      <g>
        <rect x="0" y="0" width="400" height="150" fill="#efe3cf" />
        <rect x="0" y="96" width="400" height="54" fill="#7a4b33" />
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={10 + i * 40} y="104" width="28" height="38" rx="2" fill="#86563c" />
        ))}
        {/* chandelier */}
        <path d="M200 0v18" stroke="#b8923f" strokeWidth="2" />
        <path d="M172 30q28 14 56 0" stroke="#b8923f" strokeWidth="3" fill="none" />
        {[172, 186, 200, 214, 228].map((x, i) => (
          <circle key={i} cx={x} cy={i % 2 ? 36 : 30} r="3.5" fill="#ffe7a3" />
        ))}
        {/* arched mirror */}
        <path d="M290 90V52a26 26 0 0 1 52 0v38Z" fill="#cfe3ea" stroke="#c8a24a" strokeWidth="4" />
        {/* music stand */}
        <path d="M96 150V96" stroke="#2b2b2b" strokeWidth="3" />
        <rect x="80" y="80" width="32" height="20" rx="2" fill="#2b2b2b" />
        <Table x={180} />
        <Table x={330} />
        <Ground color="#c9b08a" />
      </g>
    )
  if (genre === 'pop')
    return (
      <g>
        <rect x="0" y="0" width="400" height="150" fill="#f7d9c4" />
        <StringLights y={18} />
        {/* chalkboard menu */}
        <rect x="24" y="44" width="80" height="58" rx="4" fill="#2f3b37" stroke="#b07a4e" strokeWidth="4" />
        <path d="M36 60h40M36 72h52M36 84h30" stroke="#f1efe6" strokeWidth="2" strokeLinecap="round" />
        {/* neon sign */}
        <text x="300" y="72" textAnchor="middle" fontSize="26" fontWeight="900" fill="#ff7eb6" fontFamily="sans-serif" style={{ filter: 'drop-shadow(0 0 4px #ff7eb6)' }}>
          café ♥
        </text>
        {/* plants */}
        <rect x="364" y="120" width="20" height="30" rx="3" fill="#e4572e" />
        <path d="M374 120c-12-20-4-30 0-34 4 4 12 14 0 34Z" fill="#62b971" />
        <path d="M374 120c-20-6-22-18-20-24 6 0 18 8 20 24Z" fill="#7fd18b" />
        <Table x={180} top="#ffffff" leg="#b07a4e" cup="#7bdff2" />
        <Table x={300} top="#ffffff" leg="#b07a4e" cup="#ffd166" />
        <Ground color="#b07a4e" />
      </g>
    )
  // rock: small wooden stage
  return (
    <g>
      <rect x="0" y="0" width="400" height="150" fill="#3a2a22" />
      {Array.from({ length: 8 }).map((_, r) =>
        Array.from({ length: 14 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={c * 30 - (r % 2) * 15} y={r * 16} width="28" height="14" rx="1.5" fill="#4a352a" />
        )),
      )}
      {/* posters */}
      <rect x="30" y="30" width="40" height="54" rx="2" fill="#d1453b" />
      <text x="50" y="62" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff" fontFamily="sans-serif">
        LIVE
      </text>
      <rect x="320" y="36" width="44" height="50" rx="2" fill="#ffd166" />
      <path d="M332 76l10-26 10 26" stroke="#1f1f24" strokeWidth="4" fill="none" />
      {/* spotlight */}
      <path d="M200 0 140 130h120Z" fill="#fff" opacity=".1" />
      {/* the stage */}
      <rect x="110" y="128" width="180" height="22" fill="#8a5a3b" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${110 + i * 30} 128v22`} stroke="#6f4630" strokeWidth="2" />
      ))}
      <Table x={50} top="#6f4630" leg="#2b1d17" cup="#e3c27a" />
      <Table x={350} top="#6f4630" leg="#2b1d17" cup="#e3c27a" />
      <Ground color="#2b1d17" />
    </g>
  )
}

// =============================================================================
// 4–8 · stand-in: a stage with the venue's sign, coloured per genre
// =============================================================================

const STAND_IN: Record<Genre, { wall: string; floor: string; light: string }> = {
  classical: { wall: '#6b2533', floor: '#c9a46a', light: '#ffe7a3' },
  pop: { wall: '#3d2d7a', floor: '#2a1f5a', light: '#ff7eb6' },
  rock: { wall: '#1d1d22', floor: '#33333b', light: '#ff5a3c' },
}

function standIn(icon: string) {
  return function StandIn({ genre }: { genre: Genre }) {
    const c = STAND_IN[genre]
    return (
      <g>
        <rect x="0" y="0" width="400" height="150" fill={c.wall} />
        <path d="M120 0 90 150h80Z M280 0 230 150h80Z" fill={c.light} opacity=".12" />
        <rect x="70" y="120" width="260" height="30" fill={c.floor} />
        <text x="330" y="70" textAnchor="middle" fontSize="44">
          {icon}
        </text>
        <Ground color={c.floor} />
      </g>
    )
  }
}

const sky = (c: string): Record<Genre, [string, string]> => ({ classical: [c, c], pop: [c, c], rock: [c, c] })

export const VENUES: Venue[] = [
  {
    id: 'home',
    name: { en: 'Home', es: 'Casa' },
    at: { en: 'at home', es: 'en casa' },
    drawn: true,
    sky: { classical: ['#f3e3c7', '#f3e3c7'], pop: ['#4b3a7a', '#4b3a7a'], rock: ['#8d9097', '#8d9097'] },
    Scene: HomeScene,
  },
  {
    id: 'park',
    name: { en: 'The park', es: 'El parque' },
    at: { en: 'in the park', es: 'en el parque' },
    drawn: true,
    sky: { classical: ['#ffcf9e', '#ffe6c4'], pop: ['#a8dcff', '#e3f4ff'], rock: ['#ff9a76', '#ffcf9e'] },
    Scene: ParkScene,
  },
  {
    id: 'cafe',
    name: { en: 'The café', es: 'El café' },
    at: { en: 'at the café', es: 'en el café' },
    drawn: true,
    sky: { classical: ['#efe3cf', '#efe3cf'], pop: ['#f7d9c4', '#f7d9c4'], rock: ['#3a2a22', '#3a2a22'] },
    Scene: CafeScene,
  },
  { id: 'school', name: { en: 'The music school', es: 'La escuela de música' }, at: { en: 'at the music school', es: 'en la escuela de música' }, sky: sky('#6b2533'), Scene: standIn('🏫'), drawn: false },
  { id: 'theatre', name: { en: 'The theatre', es: 'El teatro' }, at: { en: 'at the theatre', es: 'en el teatro' }, sky: sky('#6b2533'), Scene: standIn('🎭'), drawn: false },
  { id: 'festival', name: { en: 'The open-air festival', es: 'El festival al aire libre' }, at: { en: 'at the festival', es: 'en el festival' }, sky: sky('#6b2533'), Scene: standIn('🎪'), drawn: false },
  { id: 'hall', name: { en: 'The great concert hall', es: 'El gran auditorio' }, at: { en: 'at the great concert hall', es: 'en el gran auditorio' }, sky: sky('#6b2533'), Scene: standIn('🏛️'), drawn: false },
  { id: 'amphitheatre', name: { en: 'The giant amphitheatre', es: 'El anfiteatro gigante' }, at: { en: 'at the giant amphitheatre', es: 'en el anfiteatro gigante' }, sky: sky('#6b2533'), Scene: standIn('🏟️'), drawn: false },
]

/** The venue where each unit is played (unit index 0 → home … 7 → amphitheatre). */
export const venueForUnit = (unitIndex: number) => VENUES[Math.min(unitIndex, VENUES.length - 1)]
