import { describe, expect, it } from 'vitest'
import { BAND, isInBand, joinsAfter, unitDone, unitPresenter, unitReached } from '@/content/band'
import { course } from '@/content/course'
import { GENRE_INSTRUMENTS } from '@/lib/instruments'

const rec = { bestAccuracy: 100, timesCompleted: 1, completedAt: '' }
const all = (unitId: string) => Object.fromEntries(course.find((u) => u.id === unitId)!.lessons.map((l) => [l.id, rec]))

describe('band', () => {
  it('has six distinct musicians, Mo always present', () => {
    expect(new Set(BAND.map((m) => m.id)).size).toBe(6)
    expect(isInBand(BAND[0], {})).toBe(true)
    expect(BAND.slice(1).every((m) => !isInBand(m, {}))).toBe(true)
  })

  it('a unit without lessons is never "done" (nobody joins from an unwritten unit)', () => {
    expect(unitDone('u2', {})).toBe(false)
    expect(unitDone('u1', all('u1'))).toBe(true)
    expect(unitDone('u1', {})).toBe(false)
  })

  it('units are reached in order', () => {
    expect(unitReached('u1', {})).toBe(true)
    expect(unitReached('u2', {})).toBe(false)
    expect(unitReached('u2', all('u1'))).toBe(true)
  })

  it('each musician presents the unit they join after, and plays an instrument of the genre', () => {
    for (const m of BAND.filter((x) => x.joinsUnit)) {
      expect(unitPresenter(m.joinsUnit!)).toBe(m.id)
      expect(joinsAfter(m.joinsUnit!)).toContain(m)
    }
    for (const m of BAND)
      for (const g of ['classical', 'pop', 'rock'] as const) {
        const inst = m.instrument[g]
        if (inst) expect(GENRE_INSTRUMENTS[g]).toContain(inst)
        else expect(m.instrumentName?.[g]).toBeTruthy()
      }
  })
})

import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { JoinBandOverlay } from '@/components/JoinBand'

describe('join band overlay', () => {
  it('announces the musician who joins', () => {
    const html = renderToString(createElement(MemoryRouter, null, createElement(JoinBandOverlay, { members: joinsAfter('u2'), onClose: () => {} })))
    expect(html).toContain('Tempo')
  })
})
