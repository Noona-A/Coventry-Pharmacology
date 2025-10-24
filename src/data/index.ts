import type { Deck } from '../store'
import { pharmacokineticsDynamics } from './pharmacokinetics-dynamics'
import { antibiotics } from './antibiotics'
import { kidney } from './kidney'
import { liver } from './liver'
import { gastrointestinal } from './gastrointestinal'
import { blood } from './blood'
import { respiratory } from './respiratory'
import { cardiology } from './cardiology'
import { diabetes } from './diabetes'
import { adr } from './adr'
import { pain } from './pain'
import { controlledDrugs } from './controlled-drugs'
import { alteredStates } from './altered-states'
import { polypharmacy } from './polypharmacy'

export const allDecks: Deck[] = [
  pharmacokineticsDynamics,
  antibiotics,
  kidney,
  liver,
  gastrointestinal,
  blood,
  respiratory,
  cardiology,
  diabetes,
  adr,
  pain,
  controlledDrugs,
  alteredStates,
  polypharmacy,
]
