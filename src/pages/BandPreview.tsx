import { useState } from 'react'
import { Mascot } from '@/components/Mascot'
import { CHARACTERS, CHARACTER_IDS, Character, type Mood } from '@/components/characters'
import type { Genre } from '@/lib/types'

const GENRES: Genre[] = ['classical', 'pop', 'rock']
const MOODS: Mood[] = ['idle', 'happy', 'sad', 'think', 'celebrate']
const GENRE_NAME: Record<Genre, string> = { classical: 'Clásica', pop: 'Pop', rock: 'Rock' }

/** DEV ONLY (/dev/band): character sheet used to review the band's art. */
export default function BandPreview() {
  const [playing, setPlaying] = useState(false)
  const ids = CHARACTER_IDS.filter((id) => CHARACTERS[id])
  return (
    <div data-genre="classical" className="min-h-full bg-bg text-ink p-6 space-y-8">
      <label className="flex items-center gap-2 font-semibold">
        <input type="checkbox" checked={playing} onChange={(e) => setPlaying(e.target.checked)} /> playing
      </label>

      <section id="sheet-genres" className="inline-block bg-bg p-4">
        <h1 className="text-3xl font-bold mb-4">La banda de Mo</h1>
        <div className="grid gap-3" style={{ gridTemplateColumns: `150px repeat(${GENRES.length}, 210px)` }}>
          <div />
          {GENRES.map((g) => (
            <div key={g} className="text-center font-display font-bold text-lg">
              {GENRE_NAME[g]}
            </div>
          ))}
          {ids.map((id) => (
            <Row key={id} label={`${CHARACTERS[id].name} · ${CHARACTERS[id].species.es}`} color={CHARACTERS[id].color}>
              {GENRES.map((g) => (
                <div key={g} data-genre={g} className="bg-bg rounded-card grid place-items-center h-[200px] border border-line">
                  <Character id={id} genre={g} size={165} playing={playing} />
                </div>
              ))}
            </Row>
          ))}
        </div>
      </section>

      <section id="sheet-moods" className="inline-block bg-bg p-4">
        <h2 className="text-2xl font-bold mb-4">Estados de ánimo · silueta (bloqueado) · tamaño pequeño (48 px)</h2>
        <div className="grid gap-2" style={{ gridTemplateColumns: `150px repeat(${MOODS.length + 2}, 124px)` }}>
          <div />
          {[...MOODS, 'silueta', '48 px'].map((m) => (
            <div key={m} className="text-center font-semibold text-sm text-muted">
              {m}
            </div>
          ))}
          {ids.map((id) => (
            <Row key={id} label={`${CHARACTERS[id].name} · ${CHARACTERS[id].species.es}`} color={CHARACTERS[id].color}>
              {MOODS.map((m) => (
                <div key={m} className="grid place-items-center h-[124px]">
                  <Character id={id} mood={m} size={104} />
                </div>
              ))}
              <div className="grid place-items-center h-[124px]">
                <Character id={id} size={104} silhouette />
              </div>
              <div className="grid place-items-center h-[124px]">
                <Character id={id} size={48} />
              </div>
            </Row>
          ))}
        </div>
      </section>

      <section id="mo-plain" className="inline-flex gap-4 bg-bg p-4">
        {GENRES.map((g) => (
          <div key={g} data-genre={g} className="bg-bg p-3 rounded-card flex gap-2">
            {MOODS.map((m) => (
              <Mascot key={m} genre={g} mood={m} size={90} />
            ))}
          </div>
        ))}
      </section>
    </div>
  )
}

function Row({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <>
      <div className="flex items-center gap-2 font-display font-bold text-lg">
        <span className="w-4 h-4 rounded-full shrink-0" style={{ background: color }} />
        {label}
      </div>
      {children}
    </>
  )
}
