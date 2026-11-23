import { createElement, type ComponentType } from 'react'
import type { L } from '@/lib/types'
import { Mascot } from '../Mascot'
import { Hamster, HAMSTER_COLOR } from './Hamster'
import { Squirrel, SQUIRREL_COLOR } from './Squirrel'
import { Capybara, CAPYBARA_COLOR } from './Capybara'
import { Beaver, BEAVER_COLOR } from './Beaver'
import { Chinchilla, CHINCHILLA_COLOR } from './Chinchilla'
import type { CharacterProps } from './parts'

export type { CharacterProps, Mood } from './parts'

export type CharacterId = 'mo' | 'hamster' | 'squirrel' | 'capybara' | 'beaver' | 'chinchilla'

export interface CharacterMeta {
  id: CharacterId
  /** The musician's name: an Italian score term the learner meets in the course. */
  name: string
  /** Name of the animal (bilingual). */
  species: L
  /** Signature color: outfit accents, and the color of this musician's layer in the song. */
  color: string
  Component: ComponentType<CharacterProps>
}

const MoWithKeys = (p: CharacterProps) => createElement(Mascot, { ...p, instrument: true })

export const CHARACTERS: Record<CharacterId, CharacterMeta> = {
  mo: { id: 'mo', name: 'Mo', species: { en: 'Mouse', es: 'Ratón' }, color: 'rgb(var(--accent))', Component: MoWithKeys },
  hamster: { id: 'hamster', name: 'Tempo', species: { en: 'Hamster', es: 'Hámster' }, color: HAMSTER_COLOR, Component: Hamster },
  squirrel: { id: 'squirrel', name: 'Trino', species: { en: 'Squirrel', es: 'Ardilla' }, color: SQUIRREL_COLOR, Component: Squirrel },
  capybara: { id: 'capybara', name: 'Fermata', species: { en: 'Capybara', es: 'Capibara' }, color: CAPYBARA_COLOR, Component: Capybara },
  beaver: { id: 'beaver', name: 'Basso', species: { en: 'Beaver', es: 'Castor' }, color: BEAVER_COLOR, Component: Beaver },
  chinchilla: { id: 'chinchilla', name: 'Dolce', species: { en: 'Chinchilla', es: 'Chinchilla' }, color: CHINCHILLA_COLOR, Component: Chinchilla },
}

export const CHARACTER_IDS: CharacterId[] = ['mo', 'hamster', 'squirrel', 'capybara', 'beaver', 'chinchilla']

/** Renders any band member by id (Mo is shown with his keyboard). */
export function Character({ id, ...props }: CharacterProps & { id: CharacterId }) {
  return createElement(CHARACTERS[id].Component, props)
}
