import { Link } from 'react-router-dom'
import { useGame } from '../store'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Settings() {
  const { settings, updateSettings } = useGame()
  const [newCards, setNewCards] = useState(settings.newCardsPerDay)
  const [reviews, setReviews] = useState(settings.reviewsPerDay)
  
  // Format exam date for input (YYYY-MM-DD)
  const formatDateForInput = (date: Date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  const [examDate, setExamDate] = useState(formatDateForInput(settings.examDate))

  const handleSave = () => {
    updateSettings({
      newCardsPerDay: newCards,
      reviewsPerDay: reviews,
      examDate: new Date(examDate),
    })
  }

  return (
    <div className="page" style={{ 
      padding: 'clamp(10px, 3vw, 20px)',
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
        top: 'clamp(10px, 2vw, 20px)',
        left: 'clamp(10px, 2vw, 20px)',
        width: 'clamp(35px, 8vw, 40px)',
        height: 'clamp(35px, 8vw, 40px)',
        background: 'rgba(139, 92, 246, 0.2)',
        border: '2px solid rgba(139, 92, 246, 0.4)',
        borderRadius: 'clamp(10px, 2vw, 12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
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
        marginBottom: 'clamp(16px, 4vw, 30px)',
        maxWidth: '600px',
        margin: '0 auto clamp(16px, 4vw, 30px)',
        padding: '0 10px',
        flexShrink: 0
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
          color: 'var(--text)' 
        }}>
          Settings
        </h1>
      </div>

      {/* Settings Panel - Scrollable */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%',
        overflowY: 'auto',
        flex: 1,
        padding: '0 10px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
            border: '2px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 'clamp(12px, 3vw, 16px)',
            padding: 'clamp(20px, 5vw, 30px)',
            marginBottom: '20px'
          }}
        >
        <h2 style={{ 
          marginTop: 0, 
          marginBottom: 'clamp(16px, 4vw, 24px)',
          color: 'var(--text)',
          fontSize: 'clamp(1.2rem, 3.5vw, 1.4rem)'
        }}>
          Daily Limits (Anki-style SRS)
        </h2>

        {/* New Cards Per Day */}
        <div style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 'clamp(6px, 1.5vw, 8px)',
            color: 'var(--text)',
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            fontWeight: '600'
          }}>
            New cards per day
          </label>
          <input
            type="number"
            min="0"
            max="999"
            value={newCards}
            onChange={(e) => setNewCards(Number(e.target.value))}
            style={{
              width: '100%',
              padding: 'clamp(10px, 2.5vw, 12px)',
              background: 'rgba(19, 19, 39, 0.8)',
              border: '2px solid rgba(139, 92, 246, 0.3)',
              borderRadius: 'clamp(6px, 1.5vw, 8px)',
              color: 'var(--text)',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <p style={{ 
            fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
            color: 'rgba(255, 255, 255, 0.6)',
            marginTop: 'clamp(6px, 1.5vw, 8px)',
            marginBottom: 0
          }}>
            Maximum number of new cards to learn each day
          </p>
        </div>

        {/* Reviews Per Day */}
        <div style={{ marginBottom: 'clamp(24px, 5vw, 32px)' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 'clamp(6px, 1.5vw, 8px)',
            color: 'var(--text)',
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            fontWeight: '600'
          }}>
            Reviews per day
          </label>
          <input
            type="number"
            min="0"
            max="9999"
            value={reviews}
            onChange={(e) => setReviews(Number(e.target.value))}
            style={{
              width: '100%',
              padding: 'clamp(10px, 2.5vw, 12px)',
              background: 'rgba(19, 19, 39, 0.8)',
              border: '2px solid rgba(139, 92, 246, 0.3)',
              borderRadius: 'clamp(6px, 1.5vw, 8px)',
              color: 'var(--text)',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <p style={{ 
            fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
            color: 'rgba(255, 255, 255, 0.6)',
            marginTop: 'clamp(6px, 1.5vw, 8px)',
            marginBottom: 0
          }}>
            Maximum number of cards to review each day
          </p>
        </div>

        {/* Target Exam Date */}
        <div style={{ marginBottom: 'clamp(24px, 5vw, 32px)' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 'clamp(6px, 1.5vw, 8px)',
            color: 'var(--text)',
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            fontWeight: '600'
          }}>
            Target Exam Date
          </label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            style={{
              width: '100%',
              padding: 'clamp(10px, 2.5vw, 12px)',
              background: 'rgba(19, 19, 39, 0.8)',
              border: '2px solid rgba(139, 92, 246, 0.3)',
              borderRadius: 'clamp(6px, 1.5vw, 8px)',
              color: 'var(--text)',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              outline: 'none',
              colorScheme: 'dark',
              boxSizing: 'border-box'
            }}
          />
          <p style={{ 
            fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
            color: 'rgba(255, 255, 255, 0.6)',
            marginTop: 'clamp(6px, 1.5vw, 8px)',
            marginBottom: 0
          }}>
            Intervals will be capped to ensure all cards are reviewed before this date. 
            {(() => {
              const today = new Date()
              const exam = new Date(examDate)
              const daysUntil = Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
              return daysUntil > 0 
                ? ` ${daysUntil} days until exam.`
                : daysUntil === 0 
                  ? ' Exam is today!'
                  : ' Exam date has passed.'
            })()}
          </p>
        </div>

        {/* Info Box */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 'clamp(6px, 1.5vw, 8px)',
          padding: 'clamp(12px, 3vw, 16px)',
          marginBottom: 'clamp(16px, 4vw, 24px)'
        }}>
          <p style={{ 
            margin: 0,
            fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.6'
          }}>
            <strong>How it works:</strong> Each day you'll see up to {newCards} new cards and {reviews} reviews. 
            Cards are scheduled using Anki's SM-2 algorithm based on how well you know them.
          </p>
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          style={{
            width: '100%',
            padding: 'clamp(12px, 3vw, 14px)',
            background: 'linear-gradient(135deg, #9A40FF, #C77DFF)',
            border: 'none',
            borderRadius: 'clamp(8px, 2vw, 10px)',
            color: 'white',
            fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: 'clamp(12px, 3vw, 16px)'
          }}
        >
          Save Settings
        </motion.button>

        <Link 
          to="/" 
          style={{
            display: 'block',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.6)',
            textDecoration: 'none',
            fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
          }}
        >
          ← Back to Home
        </Link>
      </motion.div>
      </div>
    </div>
  )
}

