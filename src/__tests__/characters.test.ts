import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { CHARACTERS, CHARACTER_IDS, Character, type Mood } from '@/components/characters'
import { Mascot } from '@/components/Mascot'

const GENRES = ['classical', 'pop', 'rock'] as const
const MOODS: Mood[] = ['idle', 'happy', 'sad', 'think', 'celebrate']

describe('band characters', () => {
  it('has metadata for every character', () => {
    for (const id of CHARACTER_IDS) {
      expect(CHARACTERS[id].id).toBe(id)
      expect(CHARACTERS[id].species.en && CHARACTERS[id].species.es).toBeTruthy()
      expect(CHARACTERS[id].color).toMatch(/^(#[0-9a-f]{6}|rgb\(var\(--accent\)\))$/)
    }
  })

  it('renders every character in every genre, mood and state', () => {
    for (const id of CHARACTER_IDS)
      for (const genre of GENRES)
        for (const mood of MOODS)
          for (const playing of [false, true]) {
            const html = renderToString(createElement(Character, { id, genre, mood, playing, size: 64 }))
            expect(html).toContain('<svg')
          }
  })

  it('renders locked silhouettes with a flat fill filter', () => {
    for (const id of CHARACTER_IDS) {
      const html = renderToString(createElement(Character, { id, genre: 'pop', silhouette: true }))
      expect(html).toContain('<filter')
    }
  })

  it('keeps Mo without an instrument by default', () => {
    const plain = renderToString(createElement(Mascot, { genre: 'rock' }))
    const withKeys = renderToString(createElement(Mascot, { genre: 'rock', instrument: true }))
    expect(withKeys.length).toBeGreaterThan(plain.length)
  })
})
