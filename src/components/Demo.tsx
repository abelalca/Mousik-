import type { Demo as DemoT } from '@/content/types'
import { playChord, playPhrase, playSequence } from '@/lib/audio'
import { INSTRUMENTS, resolveInstrument, type InstrumentId } from '@/lib/instruments'
import { useT } from '@/lib/i18n'
import { useStore } from '@/store/useStore'
import { Piano } from './Piano'
import { Staff } from './Staff'
import { Speaker } from './Icons'
import { useRich } from './RichText'
import { InstrumentCards, InstrumentChip } from './InstrumentCards'

/**
 * Renders a theory/exercise illustration. Instrument references ("role:bass", "auto") are
 * resolved for the learner's genre; theory defaults to the piano.
 */
export function Demo({ demo, seed = 0 }: { demo: DemoT; seed?: number }) {
  const { tl, t } = useT()
  const { plain } = useRich()
  const genre = useStore((s) => s.settings.genre)

  if (demo.type === 'instruments') return <InstrumentCards ids={demo.ids} />
  if (demo.type === 'piano') {
    const inst = resolveInstrument(demo.instrument ?? 'piano', genre, seed)
    return (
      <div>
        <Piano from={demo.from} to={demo.to} highlight={demo.highlight} labels={demo.labels} instrument={inst} />
        <p className="text-xs text-muted text-center mt-2 flex items-center justify-center gap-2">
          {t('tapToHear')}
          {inst !== 'piano' && <InstrumentChip id={inst} />}
        </p>
      </div>
    )
  }
  if (demo.type === 'staff') {
    const inst = resolveInstrument(demo.instrument ?? 'piano', genre, seed, demo.notes, true)
    return <Staff clef={demo.clef} notes={demo.notes} labels={demo.labels} playable={demo.playable} instrument={inst} className="card py-2 shadow-none" />
  }
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {demo.buttons.map((b, i) => {
        const inst = resolveInstrument(b.instrument ?? 'piano', genre, seed + i, b.notes, b.notes.length > 0)
        return (
          <button
            key={i}
            type="button"
            className="btn-soft min-w-[9rem] flex-col !gap-1"
            onClick={() => (b.mode === 'phrase' ? playPhrase(inst) : b.mode === 'chord' ? playChord(b.notes, 1.6, inst) : playSequence(b.notes, 0.6, inst))}
          >
            <span className="flex items-center gap-2">
              <Speaker size={18} className="text-accent" />
              {plain(tl(b.label))}
            </span>
            {inst !== 'piano' && <span className="text-xs text-muted font-medium">{tl({ en: 'on', es: 'en' })} {plain(tl(INSTRUMENT_NAME(inst)))}</span>}
          </button>
        )
      })}
    </div>
  )
}

const INSTRUMENT_NAME = (id: InstrumentId) => {
  const n = INSTRUMENTS[id].name
  return { en: n.en.toLowerCase(), es: n.es.toLowerCase() }
}
