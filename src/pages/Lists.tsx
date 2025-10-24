import { useState } from 'react'
import { useGame, type Deck } from '../store'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getAssetPath } from '../utils/assets'

type FilterType = 'all' | 'new' | 'learning' | 'review' | 'suspended'

export default function Lists() {
  const { decks, selectDeck, toggleSuspend } = useGame()
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const navigate = useNavigate()

  const selectedDeck = decks.find(d => d.id === selectedDeckId)

  // Render deck icon (either emoji or SVG image)
  const renderDeckIcon = (deck: Deck) => {
    const icon = deck.icon || '📝' // Default icon if none specified
    
    // If icon is a path (starts with /), render as image
    if (icon.startsWith('/')) {
      return (
        <img 
          src={getAssetPath(icon)} 
          alt={deck.name}
          style={{
            width: '35px',
            height: '35px',
            objectFit: 'contain'
          }}
        />
      )
    }
    
    // Otherwise render as emoji
    return icon
  }

  // Filter cards based on search and filter type
  const getFilteredCards = () => {
    if (!selectedDeck) return []
    
    let filtered = selectedDeck.cards

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(card => 
        card.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply filter
    switch (filter) {
      case 'new':
        filtered = filtered.filter(c => c.seenCount === 0)
        break
      case 'learning':
        filtered = filtered.filter(c => c.seenCount > 0 && c.repetitions < 3)
        break
      case 'review':
        filtered = filtered.filter(c => c.repetitions >= 3)
        break
      case 'suspended':
        filtered = filtered.filter(c => c.suspended)
        break
    }

    return filtered
  }

  const handlePlayDeck = (deckId: string) => {
    selectDeck(deckId)
    navigate('/game')
  }

  // Deck List View
  if (!selectedDeckId) {
    return (
      <div className="page" style={{ 
        padding: '20px',
        paddingBottom: '40px',
        minHeight: '100vh',
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        {/* Home Button - Top Left Corner */}
        <Link to="/" style={{ 
          position: 'fixed',
          top: '20px',
          left: '20px',
          width: '40px',
          height: '40px',
          background: 'rgba(139, 92, 246, 0.2)',
          border: '2px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          zIndex: 100
        }}>
          🏠
        </Link>

        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '20px',
          maxWidth: '1400px',
          margin: '0 auto 20px',
          width: '100%',
          padding: '0 10px',
          flexShrink: 0
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
            color: 'var(--text)' 
          }}>
            Browse Lists
          </h1>
        </div>

        {/* Deck List - Scrollable */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          padding: '0 10px',
          overflowY: 'auto',
          flex: 1
        }}>
          {decks.map(deck => {
            const newCount = deck.cards.filter(c => c.seenCount === 0).length
            const masteredPercent = Math.round((deck.cards.filter(c => c.repetitions >= 3).length / deck.cards.length) * 100)

            return (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '20px',
                  padding: 'clamp(12px, 3vw, 24px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(12px, 3vw, 24px)',
                  transition: 'all 0.3s ease',
                  minHeight: '80px'
                }}
              >
                {/* Deck Icon */}
                <div style={{
                  width: 'clamp(50px, 10vw, 70px)',
                  height: 'clamp(50px, 10vw, 70px)',
                  background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(255, 61, 87, 0.3))',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  flexShrink: 0,
                  boxShadow: '0 4px 20px rgba(255, 107, 107, 0.2)'
                }}>
                  {renderDeckIcon(deck)}
                </div>

                {/* Deck Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: 'clamp(1rem, 3vw, 1.4rem)',
                    color: 'var(--text)',
                    marginBottom: '8px',
                    fontWeight: 600
                  }}>
                    {deck.name}
                  </h3>
                  <div style={{ 
                    fontSize: 'clamp(0.75rem, 2vw, 0.95rem)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    gap: 'clamp(8px, 2vw, 16px)',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}>
                    {newCount > 0 && (
                      <span style={{
                        background: 'rgba(74, 222, 128, 0.2)',
                        border: '1px solid rgba(74, 222, 128, 0.4)',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        color: 'rgb(74, 222, 128)',
                        fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
                        whiteSpace: 'nowrap'
                      }}>
                        📚 {newCount} new
                      </span>
                    )}
                    <span style={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)'
                    }}>
                      {masteredPercent}% mastered
                    </span>
                  </div>
                </div>

                {/* Card Count Badge */}
                <div style={{
                  background: 'rgba(139, 92, 246, 0.3)',
                  border: '2px solid rgba(139, 92, 246, 0.5)',
                  borderRadius: '16px',
                  padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
                  textAlign: 'center',
                  minWidth: 'clamp(60px, 12vw, 80px)',
                  flexShrink: 0
                }}>
                  <div style={{
                    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: '2px'
                  }}>
                    {deck.cards.length}
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                    color: 'rgba(255, 255, 255, 0.6)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    cards
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: 'clamp(8px, 2vw, 12px)',
                  flexShrink: 0
                }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlayDeck(deck.id)
                    }}
                    style={{
                      width: 'clamp(50px, 10vw, 60px)',
                      height: 'clamp(50px, 10vw, 60px)',
                      background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.3), rgba(34, 197, 94, 0.3))',
                      border: '2px solid rgba(74, 222, 128, 0.5)',
                      borderRadius: '16px',
                      color: 'rgb(74, 222, 128)',
                      fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(74, 222, 128, 0.2)'
                    }}
                  >
                    ▶
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedDeckId(deck.id)
                    }}
                    style={{
                      width: 'clamp(50px, 10vw, 60px)',
                      height: 'clamp(50px, 10vw, 60px)',
                      background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(59, 130, 246, 0.3))',
                      border: '2px solid rgba(96, 165, 250, 0.5)',
                      borderRadius: '16px',
                      color: 'rgb(96, 165, 250)',
                      fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(96, 165, 250, 0.2)'
                    }}
                  >
                    ✎
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  // Card Management View
  const filteredCards = getFilteredCards()

  return (
    <div className="page" style={{ 
      padding: '20px', 
      paddingBottom: '40px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Home Button - Top Left Corner */}
      <Link to="/" style={{ 
        position: 'fixed',
        top: '20px',
        left: '20px',
        width: '40px',
        height: '40px',
        background: 'rgba(139, 92, 246, 0.2)',
        border: '2px solid rgba(139, 92, 246, 0.4)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        zIndex: 100
      }}>
        🏠
      </Link>

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '20px',
        maxWidth: '1400px',
        margin: '0 auto 20px',
        width: '100%',
        paddingLeft: '60px'
      }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedDeckId(null)}
          style={{ 
            width: '40px',
            height: '40px',
            background: 'rgba(139, 92, 246, 0.2)',
            border: '2px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: 'white',
            transition: 'all 0.3s ease'
          }}
        >
          ←
        </motion.button>
        <h2 style={{ 
          margin: 0, 
          fontSize: '1.5rem',
          color: 'var(--text)' 
        }}>
          {selectedDeck?.name}
        </h2>
        <div style={{ width: '40px' }} />
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px', maxWidth: '1400px', margin: '0 auto 20px', width: '100%' }}>
        <input
          type="text"
          placeholder="🔍 Search cards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 20px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '2px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            color: 'var(--text)',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(139, 92, 246, 0.6)'
            e.target.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.3)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'
            e.target.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* Filter Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '10px',
        marginBottom: '30px',
        maxWidth: '1400px',
        margin: '0 auto 30px',
        width: '100%',
        flexWrap: 'wrap'
      }}>
        {(['all', 'new', 'learning', 'review', 'suspended'] as FilterType[]).map(filterType => (
          <motion.button
            key={filterType}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(filterType)}
            style={{
              padding: '8px 20px',
              background: filter === filterType 
                ? 'rgba(139, 92, 246, 0.5)' 
                : 'rgba(139, 92, 246, 0.1)',
              border: filter === filterType
                ? '2px solid rgba(139, 92, 246, 0.8)'
                : '2px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '20px',
              color: 'var(--text)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textTransform: 'capitalize',
              transition: 'all 0.3s ease'
            }}
          >
            {filterType}
          </motion.button>
        ))}
      </div>

      {/* Card List */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        overflowY: 'auto',
        flex: 1,
        paddingRight: '8px'
      }}>
        <AnimatePresence>
          {filteredCards.map(card => {
            const isDue = card.nextReview && new Date(card.nextReview) <= new Date()
            const statusBadge = card.seenCount === 0 ? 'new' : card.suspended ? 'suspended' : 'learning'

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  background: card.suspended 
                    ? 'rgba(100, 100, 100, 0.2)' 
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
                  border: card.suspended
                    ? '2px solid rgba(100, 100, 100, 0.4)'
                    : '2px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  opacity: card.suspended ? 0.6 : 1
                }}
              >
                {/* Card Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      margin: '0 0 8px 0',
                      fontSize: '1.1rem',
                      color: 'var(--text)'
                    }}>
                      {card.prompt}
                    </h4>
                    <p style={{ 
                      margin: 0,
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.95rem'
                    }}>
                      {card.answer}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    background: statusBadge === 'new' 
                      ? 'rgba(59, 130, 246, 0.3)' 
                      : statusBadge === 'suspended'
                      ? 'rgba(100, 100, 100, 0.3)'
                      : 'rgba(168, 85, 247, 0.3)',
                    border: statusBadge === 'new'
                      ? '1px solid rgba(59, 130, 246, 0.5)'
                      : statusBadge === 'suspended'
                      ? '1px solid rgba(100, 100, 100, 0.5)'
                      : '1px solid rgba(168, 85, 247, 0.5)',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    color: 'var(--text)',
                    textTransform: 'lowercase',
                    whiteSpace: 'nowrap',
                    marginLeft: '10px'
                  }}>
                    {statusBadge}
                  </span>
                </div>

                {/* Card Meta Info */}
                <div style={{ 
                  display: 'flex',
                  gap: '15px',
                  fontSize: '0.85rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '12px'
                }}>
                  {isDue && !card.suspended && (
                    <span style={{ color: 'rgba(239, 68, 68, 0.8)' }}>Due: Overdue</span>
                  )}
                  <span>Ease: {card.ease.toFixed(1)}</span>
                  <span>Lapses: {card.seenCount > 0 ? (card.seenCount - card.repetitions) : 0}</span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSuspend(selectedDeck!.id, card.id)}
                    style={{
                      padding: '6px 16px',
                      background: card.suspended 
                        ? 'rgba(34, 197, 94, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                      border: card.suspended
                        ? '2px solid rgba(34, 197, 94, 0.5)'
                        : '2px solid rgba(239, 68, 68, 0.5)',
                      borderRadius: '8px',
                      color: card.suspended ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {card.suspended ? '🔄 Resume' : '⏸ Suspend'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Reset card progress
                      const { updateCard } = useGame.getState()
                      updateCard(selectedDeck!.id, card.id, {
                        ease: 2.5,
                        interval: 0,
                        repetitions: 0,
                        seenCount: 0,
                        nextReview: new Date()
                      })
                    }}
                    style={{
                      padding: '6px 16px',
                      background: 'rgba(168, 85, 247, 0.2)',
                      border: '2px solid rgba(168, 85, 247, 0.5)',
                      borderRadius: '8px',
                      color: 'rgb(168, 85, 247)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    🔄 Reset
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredCards.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            No cards found
          </div>
        )}
      </div>
    </div>
  )
}
