import { useGame, type Deck } from '../store'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function SelectDeck() {
  const { decks, selectDeck, settings } = useGame()
  const nav = useNavigate()
  
  // Calculate due cards for each deck
  const getDueCardsCount = (deck: typeof decks[0]) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const newCards = deck.cards.filter(c => c.seenCount === 0 && !c.suspended).length
    const newCardsToShow = Math.min(newCards, settings.newCardsPerDay)
    
    const dueReviews = deck.cards.filter(c => {
      if (c.suspended || c.seenCount === 0) return false
      const nextReview = new Date(c.nextReview)
      nextReview.setHours(0, 0, 0, 0)
      return nextReview <= today
    }).length
    const reviewsToShow = Math.min(dueReviews, settings.reviewsPerDay)
    
    return { newCards: newCardsToShow, reviews: reviewsToShow, total: newCardsToShow + reviewsToShow }
  }

  // Render deck icon (either emoji or SVG image)
  const renderDeckIcon = (deck: Deck) => {
    const icon = deck.icon || '📝' // Default icon if none specified
    
    // If icon is a path (starts with /), render as image
    if (icon.startsWith('/')) {
      return (
        <img 
          src={icon} 
          alt={deck.name}
          style={{
            width: '50px',
            height: '50px',
            objectFit: 'contain'
          }}
        />
      )
    }
    
    // Otherwise render as emoji
    return icon
  }
  
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
          Select a List
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
        {decks.map(d => {
          const dueCount = getDueCardsCount(d)
          return (
            <motion.div
              key={d.id}
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
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '80px'
              }}
              onClick={() => { selectDeck(d.id); nav('/game'); }}
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
                {renderDeckIcon(d)}
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
                  {d.name}
                </h3>
                <div style={{ 
                  fontSize: 'clamp(0.75rem, 2vw, 0.95rem)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  display: 'flex',
                  gap: 'clamp(8px, 2vw, 16px)',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  {dueCount.newCards > 0 && (
                    <span style={{
                      background: 'rgba(74, 222, 128, 0.2)',
                      border: '1px solid rgba(74, 222, 128, 0.4)',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      color: 'rgb(74, 222, 128)',
                      fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
                      whiteSpace: 'nowrap'
                    }}>
                      📚 {dueCount.newCards} new
                    </span>
                  )}
                  {dueCount.reviews > 0 && (
                    <span style={{
                      background: 'rgba(96, 165, 250, 0.2)',
                      border: '1px solid rgba(96, 165, 250, 0.4)',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      color: 'rgb(96, 165, 250)',
                      fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
                      whiteSpace: 'nowrap'
                    }}>
                      🔄 {dueCount.reviews} due
                    </span>
                  )}
                  {dueCount.total === 0 && (
                    <span style={{ 
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)'
                    }}>
                      All caught up! ✓
                    </span>
                  )}
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
                  {d.cards.length}
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

              {/* Play Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  selectDeck(d.id)
                  nav('/game')
                }}
                style={{
                  width: 'clamp(50px, 10vw, 60px)',
                  height: 'clamp(50px, 10vw, 60px)',
                  background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(255, 61, 87, 0.3))',
                  border: '2px solid rgba(255, 107, 107, 0.5)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(255, 107, 107, 0.2)',
                  flexShrink: 0
                }}
              >
                ▶
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

