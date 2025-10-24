import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { DragEndEvent } from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame, type Corner } from './store'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BrainIcon from './components/BrainIcon'
import SessionComplete from './components/SessionComplete'
import { Home, Trophy, Fire } from 'lucide-react'

function DraggableCard({ children, id }: { children: React.ReactNode; id: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })
  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  )
}

function BrainDropZone() {
  const { setNodeRef, isOver } = useDroppable({ id: 'brain-zone' })
  
  return (
    <div
      ref={setNodeRef}
      className="brainZone"
    >
      <motion.div
        animate={{
          scale: isOver ? 1.15 : 1,
          filter: isOver
            ? 'drop-shadow(0 0 50px rgba(255,138,61,0.9))'
            : 'drop-shadow(0 0 40px rgba(255,138,61,0.6))',
        }}
        transition={{ duration: 0.2 }}
      >
        <BrainIcon size={160} />
      </motion.div>
      
      <motion.p
        animate={{ opacity: isOver ? 1 : 0.6 }}
      >
        Drop here to memorize
      </motion.p>
    </div>
  )
}

function CornerOption({ corner, option, isEliminated }: { corner: Corner; option: string; isEliminated: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: corner })
  
  const cornerClass = corner === 'top-left' ? 'tl' : corner === 'top-right' ? 'tr' : corner === 'bottom-left' ? 'bl' : 'br'

  if (isEliminated) return null

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.5, 
        rotate: -15,
        transition: { duration: 0.3 }
      }}
      className={`corner ${cornerClass} ${isOver ? 'hover' : ''}`}
    >
      {option}
    </motion.div>
  )
}

function Particles({ show }: { show: boolean }) {
  if (!show) return null
  
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: window.innerWidth / 2 + (Math.random() - 0.5) * 300,
            y: window.innerHeight / 2 + (Math.random() - 0.5) * 300,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: 1 + Math.random() * 0.5,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            width: 8 + Math.random() * 8,
            height: 8 + Math.random() * 8,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${
              Math.random() > 0.5 ? '#ff6a6a' : '#ff8a3d'
            }, transparent)`,
          }}
        />
      ))}
    </div>
  )
}

export default function GameBoard() {
  const { learningBatch, testingBatch, originalSessionSize, idx, phase, next, submitDrag, eliminatedCorners, feedback, statistics, gold } = useGame()
  
  // Use correct batch based on phase
  const deck = phase === 'learn' ? learningBatch : testingBatch
  const card = deck[idx]
  const [showParticles, setShowParticles] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  
  // Generate new random shuffle for EACH card appearance
  // This ensures same card gets different positions each time
  const [shuffledCorners, setShuffledCorners] = useState<Corner[]>([])
  
  // Re-shuffle whenever card changes
  useEffect(() => {
    if (card) {
      const corners: Corner[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
      // Fisher-Yates shuffle for true randomness
      const shuffled = [...corners]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      setShuffledCorners(shuffled)
    }
  }, [card?.id, idx]) // Re-shuffle when card changes
  
  const getShuffledCorners = (): Corner[] => {
    return shuffledCorners.length > 0 ? shuffledCorners : ['top-left', 'top-right', 'bottom-left', 'bottom-right']
  }

  // Show session complete screen
  if (phase === 'complete') {
    return <SessionComplete />
  }

  if (!card) {
    return (
      <div className="page">
        <div className="panel">
          <p>No cards available in this deck.</p>
        </div>
      </div>
    )
  }

  // Determine the actual phase (learn = drag to brain, drag = test with corners)
  const actualPhase = phase

  // Get shuffled corners for this card and map to options
  const shuffled = getShuffledCorners()
  const cornerToOption = {
    [shuffled[0]]: card.options[0],
    [shuffled[1]]: card.options[1],
    [shuffled[2]]: card.options[2],
    [shuffled[3]]: card.options[3],
  } as Record<Corner, string>
  
  // Create reverse mapping: corner -> original option letter (A, B, C, D)
  const cornerToOptionLetter: Record<Corner, 'A' | 'B' | 'C' | 'D'> = {
    [shuffled[0]]: 'A',
    [shuffled[1]]: 'B',
    [shuffled[2]]: 'C',
    [shuffled[3]]: 'D',
  } as Record<Corner, 'A' | 'B' | 'C' | 'D'>

  const onDragEnd = (e: DragEndEvent) => {
    setIsDragging(false)
    
    if (actualPhase === 'learn' && e.over?.id === 'brain-zone') {
      // Dragged card to brain - trigger particles and move to next
      setShowParticles(true)
      setTimeout(() => {
        setShowParticles(false)
        next()
      }, 1000)
    } else if (actualPhase === 'drag' && e.over?.id) {
      // Dragged to a corner - need to map back to original option letter
      const corner = e.over.id as Corner
      if (!eliminatedCorners.includes(corner)) {
        // Pass the correct option letter to submitDrag
        const selectedOptionLetter = cornerToOptionLetter[corner]
        submitDrag(corner, selectedOptionLetter)
      }
    }
  }

  const onDragStart = () => {
    setIsDragging(true)
  }

  return (
    <DndContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <div className="page">
        {/* Navigation */}
        <div className="nav">
          <Link to="/" className="nav-icon" aria-label="Home">
            <Home size={20} />
          </Link>
        </div>

        {/* HUD */}
        <div className="hud">
          <div className="hud-item" aria-hidden={false}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Trophy size={16} />
              <span>{gold}</span>
            </span>
          </div>
          <div className="hud-item flame" aria-hidden={false}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Fire size={16} />
              <span>{statistics.streak}</span>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ 
              width: originalSessionSize > 0 
                ? `${((originalSessionSize - (learningBatch.length + testingBatch.length)) / originalSessionSize) * 100}%` 
                : '0%'
            }}
            transition={{ duration: 0.5 }}
            style={{ 
              background: 'linear-gradient(90deg, #9A40FF, #C77DFF)',
              transformOrigin: 'left'
            }}
          />
        </div>
        <div className="progress-label">
          {phase === 'learn' ? (
            <span style={{ color: '#FFF', fontWeight: 600 }}>
              Learning: {idx + 1} of {deck.length} cards
            </span>
          ) : (
            <span style={{ color: '#FFF', fontWeight: 600 }}>
              Testing: {deck.length} remaining in batch
            </span>
          )}
        </div>

        {/* Center Game Area */}
        <div className={`game-center ${actualPhase === 'learn' ? 'learn-mode' : 'test-mode'} ${isDragging && actualPhase === 'drag' ? 'dragging' : ''}`}>
          {/* Main card */}
          <DraggableCard id="flashcard">
            <motion.div
              key={card.id + actualPhase}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3 }}
              className="card"
            >
              <h2>{card.prompt}</h2>

              {actualPhase === 'learn' ? (
                <>
                  <div className="answer-box">
                    <p>{card.answer}</p>
                  </div>
                  <p className="helper-text">
                    Drag this card to the brain to memorize
                  </p>
                </>
              ) : (
                <p className="helper-text">
                  Drag to the correct answer corner
                </p>
              )}
            </motion.div>
          </DraggableCard>

          {/* Feedback Indicator - Below card */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -20 }}
                transition={{ duration: 0.3, type: 'spring' }}
                style={{
                  position: 'absolute',
                  top: 'calc(50% + 180px)',
                  fontSize: '4rem',
                  textShadow: feedback === 'correct' 
                    ? '0 0 30px rgba(255, 140, 0, 0.9), 0 0 60px rgba(255, 140, 0, 0.6)' 
                    : '0 0 30px rgba(168, 85, 247, 0.9), 0 0 60px rgba(168, 85, 247, 0.6)',
                  filter: feedback === 'correct'
                    ? 'drop-shadow(0 0 20px rgba(255, 140, 0, 0.8))'
                    : 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))',
                  zIndex: 100,
                }}
              >
                {feedback === 'correct' ? '✓' : '✗'}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Brain drop zone in learn phase */}
          {actualPhase === 'learn' && <BrainDropZone />}
        </div>

        {/* Corner options in drag phase */}
        {actualPhase === 'drag' && (
          <AnimatePresence>
            {(Object.keys(cornerToOption) as Corner[]).map((corner) => (
              <CornerOption
                key={corner}
                corner={corner}
                option={cornerToOption[corner]}
                isEliminated={eliminatedCorners.includes(corner)}
              />
            ))}
          </AnimatePresence>
        )}

        {/* Particles effect */}
        <Particles show={showParticles} />
      </div>
    </DndContext>
  )
}
