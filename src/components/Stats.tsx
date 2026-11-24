import { liveStreak, useStore } from '@/store/useStore'
import { Bolt, Flame, Heart } from './Icons'

export function Stats({ compact = false }: { compact?: boolean }) {
  const progress = useStore((s) => s.progress)
  const streak = liveStreak(progress)
  return (
    <div className={`flex items-center ${compact ? 'gap-3' : 'gap-5'} font-semibold text-sm`}>
      <span className={`flex items-center gap-1 ${streak ? 'text-[#f59e0b]' : 'text-muted'}`} title="Streak">
        <Flame size={20} /> {streak}
      </span>
      <span className="flex items-center gap-1 text-accent2" title="XP">
        <Bolt size={19} /> {progress.xp}
      </span>
      <span className="flex items-center gap-1 text-danger" title="Hearts">
        <Heart size={19} /> {progress.hearts}
      </span>
    </div>
  )
}
