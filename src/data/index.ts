import type { Deck } from '../store'
import { pharmacokineticsDynamics } from './pharmacokinetics-dynamics'
import { antibiotics } from './antibiotics'
import { kidney } from './kidney'
import { liver } from './liver'
import { gastrointestinal } from './gastrointestinal'
import { blood } from './blood'
import { respiratory } from './respiratory'

export const allDecks: Deck[] = [
  pharmacokineticsDynamics,
  antibiotics,
  kidney,
  liver,
  gastrointestinal,
  blood,
  respiratory,
  // Add more decks here as you create them
]
