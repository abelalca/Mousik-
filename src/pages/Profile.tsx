import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useT } from '@/lib/i18n'
import { liveStreak, useStore } from '@/store/useStore'
import { Mascot } from '@/components/Mascot'
import { Bolt, Flame, Star } from '@/components/Icons'
import type { Genre } from '@/lib/types'
import type { Notation } from '@/lib/music'

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap rounded-card bg-raised p-1 gap-1">
      {options.map(([v, label]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`flex-1 min-w-[5.5rem] px-3 py-2 rounded-[calc(var(--radius)-4px)] text-sm font-semibold transition ${
            value === v ? 'bg-surface text-ink shadow-soft' : 'text-muted hover:text-ink'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function Profile() {
  const { t } = useT()
  const { settings, progress, setSettings } = useStore()
  const { user, signOut, deleteAccount } = useAuth()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const lessons = Object.keys(progress.completed).length

  return (
    <div className="pt-6 space-y-6">
      <section className="card p-6 flex items-center gap-5">
        <Mascot mood="happy" size={90} />
        <div className="min-w-0">
          <h1 className="text-3xl font-bold truncate">{settings.displayName || 'Mousik'}</h1>
          <p className="text-sm text-muted truncate">{user?.email}</p>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {[
          { icon: <Flame size={22} />, v: liveStreak(progress), l: t('dayStreak'), c: 'text-[#f59e0b]' },
          { icon: <Bolt size={22} />, v: progress.xp, l: t('totalXp'), c: 'text-accent2' },
          { icon: <Star size={22} />, v: lessons, l: t('lessonsDone'), c: 'text-accent' },
        ].map((s, i) => (
          <div key={i} className="card p-4 flex flex-col items-center text-center">
            <span className={s.c}>{s.icon}</span>
            <span className="text-2xl font-display font-bold mt-1">{s.v}</span>
            <span className="text-[11px] text-muted font-semibold uppercase tracking-wide">{s.l}</span>
          </div>
        ))}
      </section>

      <section className="card p-5 space-y-5">
        <h2 className="text-xl font-bold">{t('settings')}</h2>
        <Field label={t('name')}>
          <input
            value={settings.displayName}
            onChange={(e) => setSettings({ displayName: e.target.value })}
            className="w-full bg-raised rounded-card px-4 py-2.5 outline-none"
            maxLength={30}
          />
        </Field>
        <Field label={t('genre')}>
          <Segmented<Genre> value={settings.genre} onChange={(genre) => setSettings({ genre })} options={[['classical', t('classical')], ['pop', t('pop')], ['rock', t('rock')]]} />
        </Field>
        <Field label={t('language')}>
          <Segmented value={settings.locale} onChange={(locale) => setSettings({ locale })} options={[['es', 'Español'], ['en', 'English']]} />
        </Field>
        <Field label={t('noteNames')}>
          <Segmented<Notation> value={settings.notation} onChange={(notation) => setSettings({ notation })} options={[['solfege', 'Do Re Mi'], ['letters', 'C D E']]} />
        </Field>
        <Field label={t('sound')}>
          <Segmented value={settings.sound ? 'on' : 'off'} onChange={(v) => setSettings({ sound: v === 'on' })} options={[['on', t('on')], ['off', t('off')]]} />
        </Field>
      </section>

      <details className="card p-5 text-sm text-muted">
        <summary className="font-semibold text-ink cursor-pointer">{t('credits')}</summary>
        <ul className="mt-3 space-y-2 list-disc pl-5">
          <li>
            Piano: <em>Salamander Grand Piano</em> — Alexander Holm, CC-BY 3.0.
          </li>
          <li>
            {t('creditsInstruments')}: <em>tonejs-instruments</em> — Nicholas Brosowsky, CC-BY 3.0 (
            {t('creditsSources')}).
          </li>
          <li>{t('creditsSynths')} Tone.js (MIT). {t('creditsNotation')} VexFlow (MIT).</li>
        </ul>
      </details>

      <button className="btn-ghost w-full" onClick={signOut}>
        {t('signOut')}
      </button>

      <section className="card p-5 border-danger/30">
        {!confirmDelete ? (
          <button className="text-sm font-semibold text-danger" onClick={() => setConfirmDelete(true)}>
            {t('deleteAccount')}
          </button>
        ) : (
          <div className="space-y-3">
            <p className="font-semibold">{t('deleteAccount')}</p>
            <p className="text-sm text-muted">{t('deleteAccountBody')}</p>
            {deleteError && <p className="text-sm text-danger">{deleteError}</p>}
            <div className="flex flex-wrap gap-2">
              <button
                className="btn-primary !bg-danger !text-white"
                onClick={async () => {
                  const r = await deleteAccount()
                  if (r.error) setDeleteError(r.error)
                }}
              >
                {t('deleteConfirm')}
              </button>
              <button className="btn-ghost" onClick={() => setConfirmDelete(false)}>
                {t('cancel')}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-2">{label}</p>
      {children}
    </div>
  )
}
