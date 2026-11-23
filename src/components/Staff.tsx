import { useEffect, useRef } from 'react'
import { Accidental, Annotation, Formatter, GhostNote, Renderer, Stave, StaveConnector, StaveNote, Voice } from 'vexflow/bravura'
import { midi, noteName, parse } from '@/lib/music'
import { playSequence } from '@/lib/audio'
import { useStore } from '@/store/useStore'
import type { Clef } from '@/content/types'
import type { InstrumentId } from '@/lib/instruments'
import { Play } from './Icons'

const cssColor = (name: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim().split(/\s+/)
  return v.length === 3 ? `rgb(${v.join(',')})` : '#222'
}

const toKey = (n: string) => {
  const p = parse(n)
  return `${p.letter.toLowerCase()}${p.acc === 1 ? '#' : p.acc === -1 ? 'b' : ''}/${p.octave}`
}

interface Props {
  clef: Clef
  notes: string[]
  labels?: boolean
  playable?: boolean
  highlight?: number
  className?: string
  instrument?: InstrumentId
}

/** Renders notes (as whole notes) on a treble, bass or grand staff using VexFlow. */
export function Staff({ clef, notes, labels, playable, highlight, className = '', instrument = 'piano' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { genre, notation } = useStore((s) => s.settings)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.innerHTML = ''
    const ink = cssColor('ink')
    const accent = cssColor('accent')
    const muted = cssColor('muted')

    const width = Math.max(200, 110 + notes.length * 46)
    const grand = clef === 'grand'
    const height = grand ? 250 : 140
    const renderer = new Renderer(el, Renderer.Backends.SVG)
    renderer.resize(width, height)
    const ctx = renderer.getContext()
    ctx.setFillStyle(ink)
    ctx.setStrokeStyle(ink)

    const top = new Stave(10, grand ? 10 : 15, width - 20)
    top.addClef(grand ? 'treble' : clef)
    top.setStyle({ strokeStyle: muted, fillStyle: ink })
    top.setContext(ctx).draw()

    let bottom: Stave | null = null
    if (grand) {
      bottom = new Stave(10, 125, width - 20)
      bottom.addClef('bass')
      bottom.setStyle({ strokeStyle: muted, fillStyle: ink })
      bottom.setContext(ctx).draw()
      new StaveConnector(top, bottom).setType('brace').setContext(ctx).draw()
      new StaveConnector(top, bottom).setType('singleLeft').setContext(ctx).draw()
    }

    const make = (n: string, staffClef: 'treble' | 'bass', i: number) => {
      const sn = new StaveNote({ keys: [toKey(n)], duration: 'w', clef: staffClef })
      const p = parse(n)
      if (p.acc) sn.addModifier(new Accidental(p.acc === 1 ? '#' : 'b'), 0)
      if (labels) {
        const a = new Annotation(noteName(n, notation))
        a.setFont('Inter', 12, 'bold')
        a.setVerticalJustification(Annotation.VerticalJustify.BOTTOM)
        sn.addModifier(a, 0)
      }
      const color = highlight === i ? accent : ink
      sn.setStyle({ fillStyle: color, strokeStyle: color })
      return sn
    }

    const ticks = notes.length * 4
    if (!grand) {
      const voice = new Voice({ num_beats: ticks, beat_value: 4 }).setMode(Voice.Mode.SOFT)
      voice.addTickables(notes.map((n, i) => make(n, clef as 'treble' | 'bass', i)))
      new Formatter().joinVoices([voice]).format([voice], width - 110)
      voice.draw(ctx, top)
    } else {
      const tv = new Voice({ num_beats: ticks, beat_value: 4 }).setMode(Voice.Mode.SOFT)
      const bv = new Voice({ num_beats: ticks, beat_value: 4 }).setMode(Voice.Mode.SOFT)
      notes.forEach((n, i) => {
        const upper = midi(n) >= 60
        tv.addTickable(upper ? make(n, 'treble', i) : new GhostNote({ duration: 'w' }))
        bv.addTickable(upper ? new GhostNote({ duration: 'w' }) : make(n, 'bass', i))
      })
      new Formatter().joinVoices([tv]).joinVoices([bv]).format([tv, bv], width - 110)
      tv.draw(ctx, top)
      bv.draw(ctx, bottom!)
    }

    const svg = el.querySelector('svg')
    if (svg) {
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      svg.setAttribute('width', '100%')
      svg.removeAttribute('height')
      svg.style.width = '100%'
      svg.style.height = 'auto'
      svg.style.maxWidth = `${Math.max(width * 1.6, 440)}px`
      svg.style.display = 'block'
      svg.style.margin = '0 auto'
    }
  }, [clef, notes.join(','), labels, highlight, genre, notation])

  return (
    <div className={`relative ${className}`}>
      <div ref={ref} className={playable ? 'cursor-pointer' : ''} onClick={() => playable && playSequence(notes, 0.55, instrument)} />
      {playable && (
        <button
          type="button"
          onClick={() => playSequence(notes, 0.55, instrument)}
          className="absolute top-1 right-1 chip bg-raised text-muted hover:text-ink"
          aria-label="Play"
        >
          <Play size={14} />
        </button>
      )}
    </div>
  )
}
