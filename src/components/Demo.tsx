import type { Demo as DemoT } from '@/content/types'
import { playChord, playSequence } from '@/lib/audio'
import { useT } from '@/lib/i18n'
import { Piano } from './Piano'
import { Staff } from './Staff'
import { Speaker } from './Icons'
import { useRich } from './RichText'

export function Demo({ demo }: { demo: DemoT }) {
  const { tl, t } = useT()
  const { plain } = useRich()
  if (demo.type === 'piano')
    return (
      <div>
        <Piano from={demo.from} to={demo.to} highlight={demo.highlight} labels={demo.labels} />
        <p className="text-xs text-muted text-center mt-2">{t('tapToHear')}</p>
      </div>
    )
  if (demo.type === 'staff')
    return <Staff clef={demo.clef} notes={demo.notes} labels={demo.labels} playable={demo.playable} className="card py-2 shadow-none" />
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {demo.buttons.map((b, i) => (
        <button
          key={i}
          type="button"
          className="btn-soft min-w-[9rem]"
          onClick={() => (b.mode === 'chord' ? playChord(b.notes) : playSequence(b.notes, 0.6))}
        >
          <Speaker size={18} className="text-accent" />
          {plain(tl(b.label))}
        </button>
      ))}
    </div>
  )
}
