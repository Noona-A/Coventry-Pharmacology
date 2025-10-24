import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../store'

export default function SessionComplete() {
  const navigate = useNavigate()
  const { originalSessionSize, getDueCards, studiedToday } = useGame()
  
  // Get fresh due cards count (should be 0 or very low after session)
  const remainingDue = getDueCards()
  
  return (
    <div className="page">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          maxWidth: 500,
          width: '100%',
        }}
      >
        {/* Trophy Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{
            fontSize: 120,
            marginBottom: 24,
          }}
        >
          🏆
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: 42,
            fontWeight: 800,
            margin: '0 0 16px 0',
            color: 'white',
          }}
        >
          Session Complete!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: 18,
            marginBottom: 40,
            color: 'var(--muted)',
          }}
        >
          You mastered {originalSessionSize} cards today!
        </motion.p>

        {/* Stats Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: 'var(--surface)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20,
            padding: 32,
            marginBottom: 32,
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
              New cards studied today
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#4ADE80' }}>
              {studiedToday.newCards}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
              Reviews completed today
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#60A5FA' }}>
              {studiedToday.reviews}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
              Cards still due
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#9A40FF' }}>
              {remainingDue.length}
            </div>
          </div>
        </motion.div>

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() => navigate('/')}
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #9A40FF, #C77DFF)',
              margin: '0 auto',
            }}
          >
            Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
