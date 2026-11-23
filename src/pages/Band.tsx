import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BAND, isInBand, member, unitNumber, unitPresenter, unitReached, type BandMember } from '@/content/band'
import { course } from '@/content/course'
import { useT } from '@/lib/i18n'
import { hasAnything } from '@/lib/song'
import { useStore } from '@/store/useStore'
import { CHARACTERS, Character, type CharacterId } from '@/components/characters'
import { InstrumentChip } from '@/components/InstrumentCards'
import { useSongPlayer } from '@/components/SongPlayer'
import { Lock, Play } from '@/components/Icons'

/** The stage: Mo's band, who is already playing and who is still to come. */
export default function BandPage() {
  const { t, tl } = useT()
  const genre = useStore((s) => s.settings.genre)
  const completed = useStore((s) => s.progress.completed)
  const song = useStore((s) => s.song)
  const { play, playing } = useSongPlayer()
  const [selected, setSelected] = useState<CharacterId>('mo')
  const sel = member(selected)

  return (
    <div className="pt-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('myBand')}</h1>
        <p className="text-muted mt-1">{t('bandIntro')}</p>
      </div>

      <section
        className="relative rounded-card overflow-hidden shadow-lift px-3 pt-6 pb-4"
        style={{
          background:
            'radial-gradient(60% 50% at 20% 0%, rgb(255 255 255 / .16), transparent 70%), radial-gradient(60% 50% at 80% 0%, rgb(255 255 255 / .12), transparent 70%), linear-gradient(180deg, #221a3d 0%, #14102a 70%, #2b2140 100%)',
        }}
      >
        <div className="grid grid-cols-3 gap-y-4 relative z-10">
          {BAND.map((m) => (
            <StageSpot key={m.id} m={m} inBand={isInBand(m, completed)} playing={playing && isInBand(m, completed)} active={selected === m.id} onClick={() => setSelected(m.id)} />
          ))}
        </div>
        {/* stage floor */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
      </section>

      {hasAnything(song) ? (
        <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={() => play()} disabled={playing}>
          <Play size={18} /> {playing ? t('playing') : t('playWithBand')}
        </button>
      ) : (
        <p className="card p-4 text-center text-muted text-sm">{t('stageSilence')}</p>
      )}

      <AnimatePresence mode="wait">
        <motion.section key={sel.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card p-4 flex gap-4">
          <div className="shrink-0">
            <Character id={sel.id} size={96} genre={genre} silhouette={!isInBand(sel, completed) && !metPresenter(sel, completed)} />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: CHARACTERS[sel.id].color }}>
                {tl(sel.roleName)}
              </p>
              <p className="font-display text-2xl font-bold leading-tight">{CHARACTERS[sel.id].name}</p>
              <p className="text-xs text-muted">
                {tl(CHARACTERS[sel.id].species)} · <i>{CHARACTERS[sel.id].name}</i> {tl(sel.nameMeaning)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted">{t('playsIn')}:</span>
              {sel.instrument[genre] ? <InstrumentChip id={sel.instrument[genre]!} /> : <span className="chip bg-raised">{tl(sel.instrumentName![genre]!)}</span>}
            </div>
            <p className="text-sm">
              <span className="text-muted">{t('addsToSong')}: </span>
              {tl(sel.adds)}
            </p>
            <p className="text-sm">
              <span className="text-muted">{t('presents')}: </span>
              {course
                .filter((u) => unitPresenter(u.id) === sel.id)
                .map((u) => `${t('unit')} ${unitNumber(u.id)} · ${tl(u.title)}`)
                .join(' / ')}
            </p>
            {isInBand(sel, completed) ? (
              <span className="chip bg-success/15 text-success text-xs">{t('inYourBand')}</span>
            ) : (
              <span className="chip bg-raised text-muted text-xs">
                <Lock size={12} /> {t('joinsInUnit')} {unitNumber(sel.joinsUnit!)}
              </span>
            )}
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  )
}

/** You meet a musician (see them in colour) once you reach the unit they teach. */
function metPresenter(m: BandMember, completed: Record<string, unknown>) {
  return !m.joinsUnit || unitReached(m.joinsUnit, completed)
}

function StageSpot({ m, inBand, playing, active, onClick }: { m: BandMember; inBand: boolean; playing: boolean; active: boolean; onClick: () => void }) {
  const { t, tl } = useT()
  const completed = useStore((s) => s.progress.completed)
  const met = metPresenter(m, completed)
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 rounded-card py-2 transition ${active ? 'bg-white/10' : ''}`} aria-pressed={active}>
      <div className={`relative ${inBand ? '' : 'opacity-60'}`} style={{ color: 'rgb(255 255 255 / .28)' }}>
        {inBand && <div className="absolute inset-x-2 bottom-0 h-3 rounded-full blur-md" style={{ background: CHARACTERS[m.id].color, opacity: 0.55 }} />}
        <Character id={m.id} size={86} mood={playing ? 'happy' : 'idle'} playing={playing} silhouette={!inBand && !met} />
      </div>
      <span className="text-[13px] font-bold text-white leading-tight">{CHARACTERS[m.id].name}</span>
      {inBand ? (
        <span className="text-[11px] font-semibold" style={{ color: CHARACTERS[m.id].color }}>
          {tl(m.roleName)}
        </span>
      ) : (
        <span className="text-[11px] text-white/60 flex items-center gap-1">
          <Lock size={10} /> {t('unit')} {unitNumber(m.joinsUnit!)}
        </span>
      )}
    </button>
  )
}
