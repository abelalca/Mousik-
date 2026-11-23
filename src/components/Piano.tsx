import { useMemo } from 'react'
import { fromMidi, isBlack, keyLabel, midi } from '@/lib/music'
import { playNote } from '@/lib/audio'
import { useStore } from '@/store/useStore'

export type KeyMark = 'correct' | 'wrong' | 'hint'

interface Props {
  from: string
  to: string
  highlight?: string[]
  marks?: Record<number, KeyMark>
  labels?: boolean | 'white'
  onPress?: (note: string, midi: number) => void
  disabled?: boolean
  className?: string
}

/** Responsive piano keyboard. Black keys are positioned in % so it scales to any width. */
export function Piano({ from, to, highlight = [], marks = {}, labels = false, onPress, disabled, className = '' }: Props) {
  const notation = useStore((s) => s.settings.notation)
  const lo = midi(from)
  const hi = midi(to)
  const hl = useMemo(() => new Set(highlight.map(midi)), [highlight])

  const whites: number[] = []
  const blacks: { m: number; afterWhite: number }[] = []
  for (let m = lo; m <= hi; m++) {
    if (isBlack(m)) blacks.push({ m, afterWhite: whites.length })
    else whites.push(m)
  }
  const ww = 100 / whites.length
  const bw = ww * 0.62

  const press = (m: number) => {
    if (disabled) return
    playNote(fromMidi(m), 1.4)
    onPress?.(fromMidi(m), m)
  }

  const fill = (m: number, black: boolean) => {
    const mark = marks[m]
    if (mark === 'correct') return 'bg-success text-white'
    if (mark === 'wrong') return 'bg-danger text-white'
    if (mark === 'hint') return 'bg-success/35 text-ink'
    if (hl.has(m)) return black ? 'bg-accent text-accent-ink' : 'bg-accent/25 text-ink'
    return black ? 'bg-[#1a1a1f] text-white/80' : 'bg-white text-[#555]'
  }

  return (
    <div
      className={`relative w-full select-none touch-manipulation ${className}`}
      style={{ aspectRatio: `${whites.length * 2.2} / 9`, maxHeight: 210 }}
      role="group"
      aria-label="Piano"
    >
      <div className="absolute inset-0 flex rounded-b-xl overflow-hidden border border-line shadow-soft">
        {whites.map((m) => (
          <button
            key={m}
            type="button"
            aria-label={fromMidi(m)}
            onPointerDown={() => press(m)}
            className={`relative flex-1 border-r border-black/10 last:border-r-0 flex items-end justify-center pb-2
              text-[11px] sm:text-xs font-semibold transition-colors active:brightness-90 ${fill(m, false)}
              ${disabled ? 'cursor-default' : 'cursor-pointer hover:brightness-[.97]'}`}
          >
            {(labels === true || labels === 'white') && <span>{keyLabel(m, notation)}</span>}
          </button>
        ))}
      </div>
      {blacks.map(({ m, afterWhite }) => (
        <button
          key={m}
          type="button"
          aria-label={fromMidi(m)}
          onPointerDown={() => press(m)}
          className={`absolute top-0 z-10 rounded-b-md shadow-md flex items-end justify-center pb-1.5
            text-[8px] sm:text-[10px] leading-tight font-semibold transition-colors active:brightness-125 ${fill(m, true)}`}
          style={{ left: `${afterWhite * ww - bw / 2}%`, width: `${bw}%`, height: '60%' }}
        >
          {labels === true && <span className="px-0.5 text-center whitespace-pre-line">{keyLabel(m, notation).replace(' / ', '\n')}</span>}
        </button>
      ))}
    </div>
  )
}
