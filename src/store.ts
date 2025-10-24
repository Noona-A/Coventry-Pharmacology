import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { allDecks } from './data'

export type Card = {
  id: string
  prompt: string
  answer: string
  options: [string, string, string, string] // A, B, C, D
  correctOption: 'A' | 'B' | 'C' | 'D'
  // SRS (Spaced Repetition System) fields
  ease: number // ease factor (default 2.4, range 1.8-2.8)
  interval: number // legacy - kept for compatibility
  intervalDays: number // actual interval in days (can be fractional)
  repetitions: number // legacy - kept for compatibility
  reps: number // successful review count (new system)
  lapses: number // number of times card has been failed
  nextReview: Date
  dueDate: Date // explicit due date for new system
  lastReviewed?: Date
  seenCount: number // how many times user has seen this card
  suspended: boolean // whether card is suspended from reviews
  state: 'new' | 'learning' | 'review' | 'relearn' // card state
  sessionEncounterCount: number // times encountered in current session
}

export type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export type Deck = { id: string; name: string; cards: Card[]; icon?: string }

type Settings = {
  newCardsPerDay: number
  reviewsPerDay: number
  examDate: Date // target exam date for interval capping
}

export type BrainCosmetic = {
  id: string
  name: string
  type: 'color' | 'pattern' | 'accessory' | 'pet'
  cost: number
  emoji?: string
  image?: string // Path to image file for accessories
  color?: string
  description: string
}

export const BRAIN_COSMETICS: BrainCosmetic[] = [
  // Colors - with brain images
  { id: 'color-orange', name: 'Classic Orange', type: 'color', cost: 0, color: '#FF8A3D', image: '/Brain.png', description: 'The original brain color' },
  { id: 'color-blue', name: 'Ocean Blue', type: 'color', cost: 100, color: '#4587FF', image: '/Bluebrain.png', description: 'Cool and calming' },
  { id: 'color-pink', name: 'Bubblegum Pink', type: 'color', cost: 150, color: '#FF347A', image: '/Pinkbrain.png', description: 'Sweet and powerful' },
  { id: 'color-yellow', name: 'Sunny Yellow', type: 'color', cost: 200, color: '#FFD700', image: '/Yellowbrain.png', description: 'Bright and energetic' },
  
  // Accessories - None option (free to unequip)
  { id: 'accessory-none', name: 'No Accessory', type: 'accessory', cost: 0, emoji: '✖️', description: 'Go accessory-free' },
  
  // Accessories - Glasses
  { id: 'accessory-3d-glasses', name: '3D Glasses', type: 'accessory', cost: 250, image: '/3d glasses.png', description: 'See learning in 3D' },
  { id: 'accessory-blue-glasses', name: 'Blue Funky Glasses', type: 'accessory', cost: 300, image: '/Blueglassesfunky.png', description: 'Cool blue shades' },
  { id: 'accessory-cool-glasses', name: 'Cool Glasses', type: 'accessory', cost: 350, image: '/Coolglasses.png', description: 'Too cool for school' },
  { id: 'accessory-flame-glasses', name: 'Flame Glasses', type: 'accessory', cost: 400, image: '/Flameglasses.png', description: 'Hot knowledge' },
  { id: 'accessory-heart-glasses', name: 'Heart Glasses', type: 'accessory', cost: 300, image: '/Heartglasses.png', description: 'Love learning' },
  { id: 'accessory-monocle', name: 'Monocle', type: 'accessory', cost: 500, image: '/Monocle.png', description: 'Distinguished scholar' },
  { id: 'accessory-nerdy-glasses', name: 'Nerdy Glasses', type: 'accessory', cost: 200, image: '/Nerdyglasses.png', description: 'Classic nerd look' },
  { id: 'accessory-retro-glasses', name: 'Retro Glasses', type: 'accessory', cost: 350, image: '/Retroglasses.png', description: 'Vintage vibes' },
  { id: 'accessory-snowboard-glasses', name: 'Snowboard Goggles', type: 'accessory', cost: 400, image: '/Snowboardglasses.png', description: 'Extreme learning' },
  { id: 'accessory-star-glasses', name: 'Star Glasses', type: 'accessory', cost: 450, image: '/Starglasses.png', description: 'Superstar student' },
  
  // Pets - None option (free to unequip)
  { id: 'pet-none', name: 'No Pet', type: 'pet', cost: 0, emoji: '✖️', description: 'No companion' },
  
  // Pets - Companions
  { id: 'pet-bacteria', name: 'Bacteria Buddy', type: 'pet', cost: 1000, image: '/Bacteriapet.png', description: 'A friendly microbe companion' },
  { id: 'pet-capsule', name: 'Capsule Pal', type: 'pet', cost: 1000, image: '/capsulepet.png', description: 'Your medicinal friend' },
  { id: 'pet-covid', name: 'Covid Cutie', type: 'pet', cost: 1000, image: '/covidpet.png', description: 'The viral sensation' },
  { id: 'pet-droplet', name: 'Droplet Buddy', type: 'pet', cost: 1000, image: '/dropletpet.png', description: 'Liquid learning companion' },
  { id: 'pet-flask', name: 'Flask Friend', type: 'pet', cost: 1000, image: '/flaskpet.png', description: 'Lab equipment come to life' },
]

type Statistics = {
  totalCardsStudied: number
  totalReviews: number
  perfectAnswers: number
  streak: number // days in a row
  longestStreak: number
  totalGoldEarned: number
  studyHistory: Array<{ date: string; cardsStudied: number; reviews: number }>
}

type GameState = {
  decks: Deck[]
  currentDeckId?: string
  sessionCards: Card[] // Snapshot of cards for current session (due cards)
  originalSessionSize: number // Track original size for completion stats
  learningBatch: Card[] // Current batch of 5 cards being learned
  testingBatch: Card[] // Cards from current batch ready to test
  idx: number
  score: number
  phase: 'learn' | 'drag' | 'complete'
  eliminatedCorners: Corner[] // tracks wrong answers in current round
  attempts: number // tracks attempts on current card
  feedback: 'correct' | 'wrong' | null // feedback state for current answer
  settings: Settings
  studiedToday: { date: string; newCards: number; reviews: number } // track daily progress
  gold: number // currency for cosmetics
  ownedCosmetics: string[] // IDs of owned cosmetics
  equippedCosmetics: { color?: string; pattern?: string; accessory?: string; pet?: string }
  statistics: Statistics
  selectDeck: (id: string) => void
  next: () => void
  submitDrag: (corner: Corner, selectedOption?: 'A' | 'B' | 'C' | 'D') => void
  submitDifficulty: (difficulty: 'again' | 'hard' | 'good' | 'easy') => void
  resetEliminated: () => void
  getDeck: () => Card[] // helper to get current deck
  getDueCards: () => Card[] // get cards due for review today
  getSessionCard: () => Card | undefined // get current card from session
  restartSession: () => void
  updateCard: (deckId: string, cardId: string, updates: Partial<Card>) => void
  toggleSuspend: (deckId: string, cardId: string) => void
  updateSettings: (settings: Partial<Settings>) => void
  buyCosmetic: (cosmeticId: string) => boolean
  equipCosmetic: (cosmeticId: string) => void
  // Admin functions
  addGold: (amount: number) => void
}

// Anki SM-2 algorithm implementation (legacy - kept for compatibility)
function calculateNextReview(card: Card, quality: number): { ease: number; interval: number; repetitions: number } {
  let { ease, interval, repetitions } = card

  if (quality >= 3) {
    // Correct answer
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * ease)
    }
    repetitions += 1
    ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  } else {
    // Incorrect answer
    repetitions = 0
    interval = 1
    ease = Math.max(1.3, ease - 0.2)
  }

  // Bound ease and interval for short-term exam-focused schedule
  ease = Math.max(1.3, ease)
  // Cap interval to 14 days (exam in 3 weeks - keep intervals short)
  const cappedInterval = Math.min(interval, 14)
  return { ease, interval: cappedInterval, repetitions }
}

// New SRS System - Exam-focused with quality-based scheduling
type Result = 'perfect' | 'one_miss' | 'two_miss' | 'three_plus_miss'

function qualityFromResult(result: Result): 0 | 1 | 2 | 3 {
  if (result === 'perfect') return 3
  if (result === 'one_miss') return 2
  if (result === 'two_miss') return 1
  return 0 // three_plus_miss
}

function updateEase(ease: number, q: 0 | 1 | 2 | 3, daysToExam: number): number {
  const add = q === 3 ? 0.15 : q === 2 ? 0 : q === 1 ? -0.15 : -0.30
  let next = ease + add
  // Clamp to reasonable bounds
  next = Math.max(1.80, Math.min(2.80, next))
  // Taper ease growth in last 5 days before exam
  if (daysToExam <= 5 && q === 3) next = ease
  return next
}

function nextIntervalDays(prevInterval: number | null, ease: number, q: 0 | 1 | 2 | 3): number {
  if (q === 0) return -1 // Lapse - will be handled separately
  
  if (prevInterval === null) {
    // First graduation based on quality
    if (q === 3) return 2      // Perfect: 2 days
    if (q === 2) return 1      // One miss: 1 day
    if (q === 1) return 0.5    // Two miss: 12 hours
  }
  
  // Review card - apply multiplier
  const mult = q === 3 ? 1.0 : q === 2 ? 0.75 : 0.55
  return prevInterval! * ease * mult
}

function scheduleCard(
  card: Card,
  result: Result,
  today: Date,
  examDate: Date
): Partial<Card> {
  const q = qualityFromResult(result)
  const daysToExam = Math.max(0, (examDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))

  // Handle lapses (q=0)
  if (q === 0) {
    const newEase = updateEase(card.ease ?? 2.4, q, daysToExam)
    return {
      intervalDays: 0.5, // 12 hours for failed cards
      ease: newEase,
      lapses: (card.lapses ?? 0) + 1,
      state: 'relearn' as const,
      reps: card.reps ?? 0,
      dueDate: new Date(today.getTime() + 0.5 * 24 * 60 * 60 * 1000),
    }
  }

  // Calculate new interval
  const prevInterval = card.reps && card.reps > 0 ? card.intervalDays : null
  const newEase = updateEase(card.ease ?? 2.4, q, daysToExam)
  let interval = nextIntervalDays(prevInterval, newEase, q)

  // Apply guards and clamps
  if (card.reps && card.reps > 0) {
    interval = Math.max(interval, 0.33) // Minimum 8 hours for review cards
  }
  interval = Math.min(interval, Math.max(1, daysToExam)) // Don't push past exam

  // Early cram taper (last 5 days)
  if (daysToExam <= 5) {
    interval = Math.min(interval, 3)
  }

  const dueDate = new Date(today.getTime() + interval * 24 * 60 * 60 * 1000)

  return {
    intervalDays: interval,
    ease: newEase,
    reps: Math.max(1, (card.reps ?? 0) + 1),
    dueDate,
    state: 'review' as const,
    lapses: card.lapses ?? 0,
  }
}

// Helper to ensure cards have all required fields with defaults
function migrateCard(card: Partial<Card>): Card {
  return {
    ...card,
    ease: card.ease ?? 2.4,
    interval: card.interval ?? 0,
    intervalDays: card.intervalDays ?? 0,
    repetitions: card.repetitions ?? 0,
    reps: card.reps ?? 0,
    lapses: card.lapses ?? 0,
    nextReview: card.nextReview ?? new Date(),
    dueDate: card.dueDate ?? new Date(),
    seenCount: card.seenCount ?? 0,
    suspended: card.suspended ?? false,
    state: card.state ?? 'new',
    sessionEncounterCount: card.sessionEncounterCount ?? 0,
  } as Card
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      decks: allDecks.map(deck => ({
        ...deck,
        cards: deck.cards.map(migrateCard)
      })),
      currentDeckId: undefined,
      sessionCards: [], // Will be populated when deck is selected
      originalSessionSize: 0, // Track original size
      learningBatch: [], // Current 5 cards being learned
      testingBatch: [], // Cards ready to test
      idx: 0,
      score: 0,
      phase: 'learn',
      eliminatedCorners: [],
      attempts: 0,
      feedback: null,
      settings: {
        newCardsPerDay: 10,
        reviewsPerDay: 50,
        examDate: (() => {
          const date = new Date()
          date.setDate(date.getDate() + 21) // 21 days from now
          return date
        })(),
      },
      studiedToday: {
        date: new Date().toDateString(),
        newCards: 0,
        reviews: 0,
      },
      gold: 0,
      ownedCosmetics: ['color-orange', 'accessory-none', 'pet-none'], // Start with the free default color, no accessory, and no pet
      equippedCosmetics: { color: 'color-orange' },
      statistics: {
        totalCardsStudied: 0,
        totalReviews: 0,
        perfectAnswers: 0,
        streak: 0,
        longestStreak: 0,
        totalGoldEarned: 0,
        studyHistory: [],
      },
  
  getDeck: () => {
    const state = get()
    return state.decks.find(d => d.id === state.currentDeckId)?.cards ?? []
  },

  getSessionCard: () => {
    const state = get()
    return state.sessionCards[state.idx]
  },

  getDueCards: () => {
    const state = get()
    const deck = state.getDeck()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Reset daily counter if it's a new day
    const storedDate = new Date(state.studiedToday.date)
    if (storedDate.toDateString() !== today.toDateString()) {
      set({
        studiedToday: {
          date: today.toDateString(),
          newCards: 0,
          reviews: 0,
        },
      })
    }
    
    // Filter cards based on settings and what's been studied today
    const newCards = deck
      .filter(c => c.seenCount === 0 && !c.suspended)
      .slice(0, state.settings.newCardsPerDay - state.studiedToday.newCards)
    
    const dueReviews = deck
      .filter(c => {
        if (c.suspended || c.seenCount === 0) return false
        // Use dueDate if available, otherwise fall back to nextReview
        const dueDate = c.dueDate ? new Date(c.dueDate) : new Date(c.nextReview)
        dueDate.setHours(0, 0, 0, 0)
        return dueDate <= today
      })
      .slice(0, state.settings.reviewsPerDay - state.studiedToday.reviews)
    
    return [...newCards, ...dueReviews]
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }))
  },

  selectDeck: (id) => {
    set({ currentDeckId: id, idx: 0, score: 0, phase: 'learn', eliminatedCorners: [], attempts: 0 })
    // Get due cards for this session and store as snapshot
    const dueCards = get().getDueCards()
    
    // Reset sessionEncounterCount for all due cards
    const resetCards = dueCards.map(c => ({ ...c, sessionEncounterCount: 0 }))
    
    if (resetCards.length === 0) {
      // No cards due today, go straight to complete
      set({ 
        sessionCards: resetCards,
        originalSessionSize: 0,
        learningBatch: [],
        testingBatch: [],
        phase: 'complete' 
      })
      return
    }
    
    // Use ALL cards as the learning batch (no more batches of 5)
    set({ 
      sessionCards: resetCards,
      originalSessionSize: resetCards.length,
      learningBatch: resetCards,
      testingBatch: [],
      idx: 0
    })
  },
  
  resetEliminated: () => set({ eliminatedCorners: [], attempts: 0 }),
  
  next: () => {
    const state = get()
    const currentCard = state.learningBatch[state.idx]
    
    if (!currentCard) {
      // All cards in learning batch seen, move to testing phase
      set({ 
        phase: 'drag',
        testingBatch: [...state.learningBatch],
        idx: 0,
        eliminatedCorners: [],
        attempts: 0
      })
      return
    }
    
    // Mark card as seen once (learning phase complete for this card)
    const updatedDecks = state.decks.map(d => {
      if (d.id === state.currentDeckId) {
        return {
          ...d,
          cards: d.cards.map(c => 
            c.id === currentCard.id ? { ...c, seenCount: 1 } : c
          )
        }
      }
      return d
    })
    
    // Also update the sessionCards and learningBatch snapshots
    const updatedSessionCards = state.sessionCards.map(c => 
      c.id === currentCard.id ? { ...c, seenCount: 1 } : c
    )
    
    const updatedLearningBatch = state.learningBatch.map(c => 
      c.id === currentCard.id ? { ...c, seenCount: 1 } : c
    )
    
    // Move to next card in learning batch
    const nextIdx = state.idx + 1
    
    if (nextIdx >= state.learningBatch.length) {
      // Finished learning all cards in batch, start testing
      set({ 
        decks: updatedDecks,
        sessionCards: updatedSessionCards,
        learningBatch: updatedLearningBatch,
        testingBatch: updatedLearningBatch,
        phase: 'drag',
        idx: 0,
        eliminatedCorners: [],
        attempts: 0
      })
    } else {
      // Continue learning next card in batch
      set({
        decks: updatedDecks,
        sessionCards: updatedSessionCards,
        learningBatch: updatedLearningBatch,
        idx: nextIdx,
        eliminatedCorners: [],
        attempts: 0
      })
    }
  },
  
  submitDrag: (corner, selectedOption?: 'A' | 'B' | 'C' | 'D') => {
    const state = get()
    const currentCard = state.testingBatch[state.idx]
    
    if (!currentCard) {
      set({ phase: 'complete' })
      return
    }
    
    // Use provided selectedOption or fall back to hardcoded mapping (for backward compatibility)
    const option = selectedOption || (() => {
      const cornerToOption: Record<Corner, 'A' | 'B' | 'C' | 'D'> = {
        'top-left': 'A',
        'top-right': 'B',
        'bottom-left': 'C',
        'bottom-right': 'D',
      }
      return cornerToOption[corner]
    })()
    
    const isCorrect = option === currentCard.correctOption
    
    if (isCorrect) {
      let updatedDecks = state.decks
      
      // Increment sessionEncounterCount for this card
      const newEncounterCount = (currentCard.sessionEncounterCount ?? 0) + 1
      
      // Determine result based on how many times card was seen in session (NOT attempts in current viewing)
      const result: Result = 
        newEncounterCount === 1 && state.attempts === 0 ? 'perfect' :      // First viewing, no mistakes
        newEncounterCount === 2 ? 'one_miss' :                              // Second viewing (got wrong once before)
        newEncounterCount === 3 ? 'two_miss' :                              // Third viewing (got wrong twice before)
        'three_plus_miss'                                                   // 4+ viewings (auto-graduate with lapse)
      
      // Set correct feedback briefly, then move to next card
      set({ feedback: 'correct' })
      
      setTimeout(() => {
        let updatedTestingBatch = [...state.testingBatch]
        let updatedSessionCards = [...state.sessionCards]
        let nextIdx = state.idx
        
        // Check if card has been encountered enough times (threshold: 3 viewings, auto-graduate at 4+)
        const shouldGraduate = newEncounterCount >= 3
        
        // Re-insert card into the current testing batch and session snapshot
        // based on how many wrong attempts happened *before* the correct answer.
        // We insert into `updatedTestingBatch` so the card will reappear within the
        // current pass at the requested offset (end / middle / near-front). We also
        // update `updatedSessionCards` so the card persists correctly for the next
        // round if the current pass completes.
        if (!shouldGraduate && state.attempts >= 1) {
          // Prepare a copy with updated encounter count
          const currentCardCopy = { ...updatedTestingBatch[state.idx], sessionEncounterCount: newEncounterCount }

          // Remove current card from the remaining testing batch
          updatedTestingBatch.splice(state.idx, 1)

          // Calculate insertion index for the *current* testing batch
          const rem = updatedTestingBatch.length
          let insertIndexForTesting = rem // default: end

          if (state.attempts === 1) {
            // 1 wrong: re-insert at end of remaining cards (will appear after the rest)
            insertIndexForTesting = rem
          } else if (state.attempts === 2) {
            // 2 wrong: re-insert in middle of remaining cards
            insertIndexForTesting = Math.floor(rem / 2)
          } else {
            // 3+ wrong: re-insert soon (after 1 card)
            insertIndexForTesting = Math.min(1, rem)
          }

          // Insert into current testing batch at calculated position
          updatedTestingBatch.splice(insertIndexForTesting, 0, currentCardCopy)

          // Also update updatedSessionCards so the session snapshot reflects the reposition
          // (use similar heuristics but operate on the full session array)
          // Remove any existing instance of this card in session snapshot
          const existingIdx = updatedSessionCards.findIndex(c => c.id === currentCard.id)
          if (existingIdx !== -1) updatedSessionCards.splice(existingIdx, 1)

          if (state.attempts === 1) {
            // push to end of session snapshot
            updatedSessionCards.push(currentCardCopy)
          } else if (state.attempts === 2) {
            // insert in middle of session snapshot
            const middle = Math.floor(updatedSessionCards.length / 2)
            const insertPosition = Math.min(middle, updatedSessionCards.length)
            updatedSessionCards.splice(insertPosition, 0, currentCardCopy)
          } else {
            // insert near front (after 0 or 1 cards)
            updatedSessionCards.splice(Math.min(1, updatedSessionCards.length), 0, currentCardCopy)
          }
        } else {
          // Card is mastered (either perfect first try OR has been encountered enough times)
          // Remove from testing batch and session, card is graduated
          updatedTestingBatch.splice(state.idx, 1)
          
          // Apply NEW SRS scheduling system
          const today = new Date()
          const srsUpdates = scheduleCard(currentCard, result, today, state.settings.examDate)
          
          updatedDecks = state.decks.map(d => {
            if (d.id === state.currentDeckId) {
              return {
                ...d,
                cards: d.cards.map(c => 
                  c.id === currentCard.id 
                    ? {
                        ...c,
                        ...srsUpdates,
                        lastReviewed: today,
                        nextReview: srsUpdates.dueDate!, // Compatibility
                        seenCount: c.seenCount + 1,
                        sessionEncounterCount: newEncounterCount,
                      }
                    : c
                )
              }
            }
            return d
          })
          
          // Remove from sessionCards (card is graduated)
          updatedSessionCards = updatedSessionCards.filter(c => c.id !== currentCard.id)

          // Award gold and update statistics for perfect answer
          const goldEarned = state.attempts === 0 ? 10 : 0 // 10 gold for perfect answers
          const isNewCard = currentCard.seenCount === 0
          
          set({
            gold: state.gold + goldEarned,
            statistics: {
              ...state.statistics,
              perfectAnswers: state.attempts === 0 ? state.statistics.perfectAnswers + 1 : state.statistics.perfectAnswers,
              totalReviews: state.statistics.totalReviews + 1,
              totalGoldEarned: state.statistics.totalGoldEarned + goldEarned,
            },
            studiedToday: {
              ...state.studiedToday,
              newCards: isNewCard ? state.studiedToday.newCards + 1 : state.studiedToday.newCards,
              reviews: !isNewCard ? state.studiedToday.reviews + 1 : state.studiedToday.reviews,
            },
          })
        }
        
        // Check if testing is complete
        if (nextIdx >= updatedTestingBatch.length) {
          // All cards tested! Check if session is complete
          if (updatedSessionCards.length === 0) {
            // All cards mastered!
            set({
              decks: updatedDecks,
              score: state.score + 1,
              phase: 'complete',
              sessionCards: [],
              testingBatch: [],
              learningBatch: [],
              eliminatedCorners: [],
              attempts: 0,
              feedback: null,
            })
          } else {
            // There are still cards with mistakes, test them again
            set({
              decks: updatedDecks,
              sessionCards: updatedSessionCards,
              learningBatch: updatedSessionCards,
              testingBatch: updatedSessionCards,
              score: state.score + 1,
              idx: 0,
              phase: 'drag',
              eliminatedCorners: [],
              attempts: 0,
              feedback: null,
            })
          }
        } else {
          // Continue testing current batch
          set({
            decks: updatedDecks,
            sessionCards: updatedSessionCards,
            testingBatch: updatedTestingBatch,
            score: state.score + 1,
            idx: nextIdx,
            phase: 'drag',
            eliminatedCorners: [],
            attempts: 0,
            feedback: null,
          })
        }
      }, 800) // Show feedback for 800ms
    } else {
      // Wrong answer - eliminate this corner and show feedback
      set({
        eliminatedCorners: [...state.eliminatedCorners, corner],
        attempts: state.attempts + 1,
        feedback: 'wrong',
      })
      
      // Clear wrong feedback after a moment
      setTimeout(() => {
        set({ feedback: null })
      }, 600)
    }
  },
  
  submitDifficulty: (difficulty) => {
    const state = get()
    const deck = state.getDueCards()
    const currentCard = deck[state.idx]
    
    // Map difficulty to Anki quality (0-5 scale)
    const qualityMap = {
      again: 0,  // Complete blackout, incorrect
      hard: 3,   // Correct with serious difficulty
      good: 4,   // Correct with hesitation
      easy: 5,   // Perfect response
    }
    
    const quality = qualityMap[difficulty]
    const srsUpdate = calculateNextReview(currentCard, quality)
    
    // Update card with SRS data
    const updatedDecks = state.decks.map(d => {
      if (d.id === state.currentDeckId) {
        return {
          ...d,
          cards: d.cards.map(c => 
            c.id === currentCard.id 
              ? {
                  ...c,
                  ...srsUpdate,
                  lastReviewed: new Date(),
                  nextReview: new Date(Date.now() + srsUpdate.interval * 24 * 60 * 60 * 1000),
                  seenCount: c.seenCount + 1,
                }
              : c
          )
        }
      }
      return d
    })
    
    // Update studied today counter
    const isNewCard = currentCard.seenCount === 0
    set({
      decks: updatedDecks,
      studiedToday: {
        ...state.studiedToday,
        newCards: isNewCard ? state.studiedToday.newCards + 1 : state.studiedToday.newCards,
        reviews: !isNewCard ? state.studiedToday.reviews + 1 : state.studiedToday.reviews,
      },
    })
    
    // Move to next card or complete session
    const nextIdx = state.idx + 1
    const dueCards = state.getDueCards()
    
    if (nextIdx >= dueCards.length) {
      set({ phase: 'complete' })
    } else {
      set({
        idx: nextIdx,
        phase: 'learn',
        eliminatedCorners: [],
        attempts: 0,
      })
    }
  },
  
  restartSession: () => {
    set({ idx: 0, score: 0, phase: 'learn', eliminatedCorners: [], attempts: 0, feedback: null })
  },
  
  updateCard: (deckId, cardId, updates) => {
    const state = get()
    const updatedDecks = state.decks.map(d => {
      if (d.id === deckId) {
        return {
          ...d,
          cards: d.cards.map(c => 
            c.id === cardId ? { ...c, ...updates } : c
          )
        }
      }
      return d
    })
    set({ decks: updatedDecks })
  },
  
  toggleSuspend: (deckId, cardId) => {
    const state = get()
    const updatedDecks = state.decks.map(d => {
      if (d.id === deckId) {
        return {
          ...d,
          cards: d.cards.map(c => 
            c.id === cardId ? { ...c, suspended: !c.suspended } : c
          )
        }
      }
      return d
    })
    set({ decks: updatedDecks })
  },

  buyCosmetic: (cosmeticId) => {
    const state = get()
    const cosmetic = BRAIN_COSMETICS.find(c => c.id === cosmeticId)
    
    if (!cosmetic) return false
    if (state.ownedCosmetics.includes(cosmeticId)) return false
    if (state.gold < cosmetic.cost) return false
    
    set({
      gold: state.gold - cosmetic.cost,
      ownedCosmetics: [...state.ownedCosmetics, cosmeticId]
    })
    return true
  },

  equipCosmetic: (cosmeticId) => {
    const state = get()
    const cosmetic = BRAIN_COSMETICS.find(c => c.id === cosmeticId)
    
    if (!cosmetic || !state.ownedCosmetics.includes(cosmeticId)) return
    
    set({
      equippedCosmetics: {
        ...state.equippedCosmetics,
        [cosmetic.type]: cosmeticId
      }
    })
  },

  // Admin functions for testing
  addGold: (amount) => {
    const state = get()
    set({ gold: state.gold + amount })
  },
}),
    {
      name: 'pharmacology-game-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        decks: state.decks,
        settings: state.settings,
        studiedToday: state.studiedToday,
        score: state.score,
        gold: state.gold,
        ownedCosmetics: state.ownedCosmetics,
        equippedCosmetics: state.equippedCosmetics,
        statistics: state.statistics,
      }),
      // Handle rehydration to convert date strings back to Date objects
      onRehydrateStorage: () => (state) => {
        if (state) {
          // IMPORTANT: Preserve user progress fields (gold, statistics, etc.)
          // These should already be loaded from localStorage, but we ensure they're not lost
          const preservedGold = state.gold ?? 0
          const preservedOwnedCosmetics = state.ownedCosmetics ?? ['color-orange', 'accessory-none', 'pet-none']
          const preservedEquippedCosmetics = state.equippedCosmetics ?? { color: 'color-orange' }
          const preservedStatistics = state.statistics ?? {
            totalCardsStudied: 0,
            totalReviews: 0,
            perfectAnswers: 0,
            streak: 0,
            longestStreak: 0,
            totalGoldEarned: 0,
            studyHistory: [],
          }
          
          // Merge decks: preserve user progress but add new cards from source
          state.decks = allDecks.map(sourceDeck => {
            const savedDeck = state.decks.find(d => d.id === sourceDeck.id)
            
            if (!savedDeck) {
              // New deck, use source as-is
              return {
                ...sourceDeck,
                cards: sourceDeck.cards.map(migrateCard)
              }
            }
            
            // Merge cards: keep user progress for existing cards, add new cards
            const mergedCards = sourceDeck.cards.map(sourceCard => {
              const savedCard = savedDeck.cards.find(c => c.id === sourceCard.id)
              
              if (savedCard) {
                // Existing card - preserve user progress
                return {
                  ...savedCard,
                  // Update these fields from source in case they changed
                  prompt: sourceCard.prompt,
                  answer: sourceCard.answer,
                  options: sourceCard.options,
                  correctOption: sourceCard.correctOption,
                  // Convert dates
                  nextReview: new Date(savedCard.nextReview),
                  dueDate: savedCard.dueDate ? new Date(savedCard.dueDate) : new Date(),
                  lastReviewed: savedCard.lastReviewed ? new Date(savedCard.lastReviewed) : undefined,
                }
              } else {
                // New card - use source with defaults
                return migrateCard(sourceCard)
              }
            })
            
            return {
              ...sourceDeck,
              cards: mergedCards
            }
          })
          
          // Restore preserved user progress (ensure they're not lost during migration)
          state.gold = preservedGold
          state.ownedCosmetics = preservedOwnedCosmetics
          state.equippedCosmetics = preservedEquippedCosmetics
          state.statistics = preservedStatistics
          
          // Ensure 'accessory-none' is owned by all users (migration)
          if (!state.ownedCosmetics.includes('accessory-none')) {
            state.ownedCosmetics.push('accessory-none')
          }
          
          // Ensure 'pet-none' is owned by all users (migration)
          if (!state.ownedCosmetics.includes('pet-none')) {
            state.ownedCosmetics.push('pet-none')
          }
          
          if (state.settings?.examDate) {
            state.settings.examDate = new Date(state.settings.examDate)
          }
        }
      },
    }
  )
)
