import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { VENUES, venueForUnit } from '@/components/venues'
import { contourFor } from '@/components/StaffMap'
import { Concert } from '@/components/Concert'
import { course } from '@/content/course'

describe('tour', () => {
  it('has one venue per unit, from home to the amphitheatre', () => {
    expect(VENUES).toHaveLength(course.length)
    expect(venueForUnit(0).id).toBe('home')
    expect(venueForUnit(7).id).toBe('amphitheatre')
    expect(VENUES.slice(0, 3).every((v) => v.drawn)).toBe(true)
  })

  it('every venue renders in every genre', () => {
    for (const v of VENUES)
      for (const genre of ['classical', 'pop', 'rock'] as const)
        expect(renderToString(createElement('svg', null, createElement(v.Scene, { genre })))).toContain('<rect')
  })

  it('each unit path is a melody that stays on the staff', () => {
    for (let u = 0; u < 8; u++) {
      const c = contourFor(u, 6)
      expect(c).toHaveLength(6)
      expect(c.every((s) => s >= 0 && s <= 8)).toBe(true)
    }
  })

  it('the concert names the venue and the next stop', () => {
    const html = renderToString(createElement(MemoryRouter, null, createElement(Concert, { unitIndex: 0, onContinue: () => {} })))
    expect(html).toMatch(/casa|home/i)
    expect(html).toMatch(/parque|park/i)
  })
})
