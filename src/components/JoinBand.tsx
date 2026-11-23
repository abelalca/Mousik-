import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { BandMember } from '@/content/band'
import { useT } from '@/lib/i18n'
import { CHARACTERS, Character } from './characters'

/** Celebration when finishing a unit brings a new musician into Mo's band. */
export function JoinBandOverlay({ members, onClose }: { members: BandMember[]; onClose: () => void }) {
  const { t, tl } = useT()
  const nav = useNavigate()
  const m = members[0]
  if (!m) return null
  const name = m.id === 'mo' ? 'Mo' : tl(CHARACTERS[m.id].species)
  return (
    <motion.div className="fixed inset-0 z-50 bg-black/60 grid place-items-center px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="card w-full max-w-sm p-6 text-center"
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 16 }}
      >
        <div className="flex justify-center -mt-16">
          <div className="rounded-full p-3 shadow-lift" style={{ background: `color-mix(in srgb, ${CHARACTERS[m.id].color} 22%, rgb(var(--surface)))` }}>
            <Character id={m.id} size={150} mood="celebrate" playing />
          </div>
        </div>
        <p className="text-xs uppercase tracking-wider font-bold mt-3" style={{ color: CHARACTERS[m.id].color }}>
          {tl(m.roleName)}
        </p>
        <h2 className="text-3xl font-bold mt-1">
          {name} {t('joinsBand')}
        </h2>
        <p className="text-muted mt-2">{t('joinsBandBody')}</p>
        <div className="flex flex-col gap-2 mt-5">
          <button className="btn-primary" onClick={() => nav('/band')}>
            {t('meetBand')}
          </button>
          <button className="btn-ghost" onClick={onClose}>
            {t('continue')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
