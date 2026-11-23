import { NavLink, Outlet } from 'react-router-dom'
import { useT } from '@/lib/i18n'
import { Home, Note, User } from './Icons'
import { Stats } from './Stats'

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-xl hero-bg grid place-items-center text-white font-display font-bold">M</div>
      <span className="font-display text-2xl font-bold tracking-tight">Mousik</span>
    </div>
  )
}

export function Layout() {
  const { t } = useT()
  const link = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-card px-4 py-3 font-semibold transition ${
      isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-raised hover:text-ink'
    }`
  const mlink = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-0.5 text-[11px] font-semibold py-2 flex-1 ${isActive ? 'text-accent' : 'text-muted'}`
  return (
    <div className="min-h-full lg:flex">
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-line p-5 gap-6 sticky top-0 h-screen">
        <Logo />
        <nav className="flex flex-col gap-1">
          <NavLink to="/" end className={link}>
            <Home /> {t('learn')}
          </NavLink>
          <NavLink to="/song" className={link}>
            <Note /> {t('mySong')}
          </NavLink>
          <NavLink to="/profile" className={link}>
            <User /> {t('profile')}
          </NavLink>
        </nav>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur border-b border-line">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="lg:invisible">
              <Logo />
            </div>
            <Stats compact />
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 pb-28 lg:pb-12">
          <Outlet />
        </main>
      </div>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur border-t border-line flex safe-bottom">
        <NavLink to="/" end className={mlink}>
          <Home size={22} /> {t('learn')}
        </NavLink>
        <NavLink to="/song" className={mlink}>
          <Note size={22} /> {t('mySong')}
        </NavLink>
        <NavLink to="/profile" className={mlink}>
          <User size={22} /> {t('profile')}
        </NavLink>
      </nav>
    </div>
  )
}
