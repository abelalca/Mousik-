import { Mascot } from './Mascot'
import { useT, type UiKey } from '@/lib/i18n'
import { useConnection } from '@/lib/connectivity'

/** Full-screen message with Mo (used before the app can open, or over it while offline). */
function Screen({ title, body, mood, children, overlay }: { title: string; body: string; mood: 'sad' | 'think'; children?: React.ReactNode; overlay?: boolean }) {
  return (
    <div
      role={overlay ? 'alertdialog' : undefined}
      aria-modal={overlay || undefined}
      className={`${overlay ? 'fixed inset-0 z-[100]' : 'h-full'} bg-bg grid place-items-center px-6`}
    >
      <div className="max-w-sm text-center flex flex-col items-center gap-3">
        <Mascot mood={mood} size={130} />
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted">{body}</p>
        {children}
      </div>
    </div>
  )
}

export function Splash() {
  return (
    <div className="h-full grid place-items-center">
      <Mascot size={90} />
    </div>
  )
}

/** No backend configured for this build: the app cannot work. */
export function NotConfigured() {
  const { t } = useT()
  return <Screen title={t('unavailableTitle')} body={t('unavailableBody')} mood="sad" />
}

/** No connection to the backend. `onRetry` defaults to a new connectivity check. */
export function Offline({ overlay, onRetry, title = 'offlineTitle', body = 'offlineBody' }: { overlay?: boolean; onRetry?: () => void; title?: UiKey; body?: UiKey }) {
  const { t } = useT()
  const { checking, check } = useConnection()
  return (
    <Screen title={t(title)} body={t(body)} mood="sad" overlay={overlay}>
      <button className="btn-primary w-full mt-3" disabled={checking} onClick={() => (onRetry ? onRetry() : check())}>
        {checking ? t('checking') : t('retry')}
      </button>
    </Screen>
  )
}
