import { course } from '@/content/course'
import { useT } from '@/lib/i18n'
import { todayXp, useStore } from '@/store/useStore'
import { Mascot } from '@/components/Mascot'
import { UnitStaff } from '@/components/StaffMap'

export default function Home() {
  const { t } = useT()
  const { completed } = useStore((s) => s.progress)
  const progress = useStore((s) => s.progress)
  const { displayName, dailyGoal } = useStore((s) => s.settings)
  const today = todayXp(progress)
  const currentId = course.flatMap((u) => u.lessons).find((l) => !completed[l.id])?.id

  return (
    <div className="pt-6 space-y-6">
      {/* greeting + daily goal */}
      <section className="card p-5 flex items-center gap-4">
        <Mascot mood="idle" size={68} />
        <div className="flex-1 min-w-0">
          <p className="font-display text-xl font-bold truncate">
            {t('greeting')}
            {displayName ? `, ${displayName}` : ''}!
          </p>
          <div className="mt-2">
            <div className="flex justify-between text-xs font-semibold text-muted mb-1">
              <span>{t('dailyGoal')}</span>
              <span>
                {Math.min(today, dailyGoal)} / {dailyGoal} XP
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-raised overflow-hidden">
              <div className="h-full bar-bg rounded-full transition-all" style={{ width: `${Math.min(100, (today / dailyGoal) * 100)}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* the map: a page of sheet music, one system (bar) per unit */}
      <div className="space-y-6 pb-4">
        {course.map((unit, ui) => (
          <UnitStaff key={unit.id} unit={unit} index={ui} last={ui === course.length - 1} currentId={currentId} />
        ))}
      </div>
    </div>
  )
}
