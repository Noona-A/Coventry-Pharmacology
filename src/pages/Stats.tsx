import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../store'
import { Home, Crown } from 'lucide-react'

export default function Stats() {
  const { statistics, gold, studiedToday } = useGame()

  const totalCards = statistics.totalCardsStudied + studiedToday.newCards
  const accuracy = statistics.totalReviews > 0 
    ? Math.round((statistics.perfectAnswers / statistics.totalReviews) * 100) 
    : 0

  return (
    <div className="page" style={{ 
      padding: 'clamp(10px, 3vw, 20px)',
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
        top: 'clamp(10px, 2vw, 20px)',
        left: 'clamp(10px, 2vw, 20px)',
        width: 'clamp(35px, 8vw, 40px)',
        height: 'clamp(35px, 8vw, 40px)',
        background: 'rgba(139, 92, 246, 0.2)',
        border: '2px solid rgba(139, 92, 246, 0.4)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        zIndex: 100
      }}>
        <Home size={20} />
      </Link>

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '20px',
        maxWidth: '800px',
        margin: '0 auto 20px',
        padding: '0 10px',
        flexShrink: 0
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
          color: 'var(--text)' 
        }}>
          Statistics
        </h1>
      </div>

      {/* Stats Grid - Scrollable */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        overflowY: 'auto',
        flex: 1,
        padding: '0 10px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(150px, 30vw, 200px), 1fr))',
          gap: 'clamp(12px, 2.5vw, 20px)'
        }}>
        {/* Gold */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 193, 7, 0.2))',
            border: '2px solid rgba(255, 215, 0, 0.4)',
            borderRadius: 'clamp(12px, 2.5vw, 16px)',
            padding: 'clamp(16px, 4vw, 24px)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '8px' }}>💰</div>
          <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', color: '#FFD700', marginBottom: '4px' }}>
            {gold}
          </div>
          <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: 'rgba(255, 255, 255, 0.6)' }}>
            Gold
          </div>
        </motion.div>

        {/* Total Cards Studied */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
            border: '2px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 'clamp(12px, 2.5vw, 16px)',
            padding: 'clamp(16px, 4vw, 24px)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '8px' }}>📚</div>
          <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', color: 'var(--text)', marginBottom: '4px' }}>
            {totalCards}
          </div>
          <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: 'rgba(255, 255, 255, 0.6)' }}>
            Cards Studied
          </div>
        </motion.div>

        {/* Perfect Answers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(34, 197, 94, 0.2))',
            border: '2px solid rgba(74, 222, 128, 0.4)',
            borderRadius: 'clamp(12px, 2.5vw, 16px)',
            padding: 'clamp(16px, 4vw, 24px)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '8px' }}>✨</div>
          <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', color: '#4ADE80', marginBottom: '4px' }}>
            {statistics.perfectAnswers}
          </div>
          <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: 'rgba(255, 255, 255, 0.6)' }}>
            Perfect Answers
          </div>
        </motion.div>

        {/* Accuracy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(255, 61, 87, 0.2))',
            border: '2px solid rgba(255, 107, 107, 0.4)',
            borderRadius: 'clamp(12px, 2.5vw, 16px)',
            padding: 'clamp(16px, 4vw, 24px)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '8px' }}>🎯</div>
          <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', color: '#FF6B6B', marginBottom: '4px' }}>
            {accuracy}%
          </div>
          <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: 'rgba(255, 255, 255, 0.6)' }}>
            Accuracy
          </div>
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'linear-gradient(135deg, rgba(255, 138, 61, 0.2), rgba(255, 184, 77, 0.2))',
            border: '2px solid rgba(255, 138, 61, 0.4)',
            borderRadius: 'clamp(12px, 2.5vw, 16px)',
            padding: 'clamp(16px, 4vw, 24px)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '8px' }}>🔥</div>
          <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', color: '#FF8A3D', marginBottom: '4px' }}>
            {statistics.streak}
          </div>
          <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: 'rgba(255, 255, 255, 0.6)' }}>
            Day Streak
          </div>
        </motion.div>

        {/* Total Gold Earned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(139, 92, 246, 0.2))',
            border: '2px solid rgba(168, 85, 247, 0.4)',
            borderRadius: 'clamp(12px, 2.5vw, 16px)',
            padding: 'clamp(16px, 4vw, 24px)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '8px' }}>
            <Crown size={48} fill="#FFD700" color="#A855F7" />
          </div>
          <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', color: '#A855F7', marginBottom: '4px' }}>
            {statistics.totalGoldEarned}
          </div>
          <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: 'rgba(255, 255, 255, 0.6)' }}>
            Total Gold Earned
          </div>
        </motion.div>
      </div>

      {/* Today's Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          maxWidth: '800px',
          margin: 'clamp(16px, 4vw, 30px) auto 0',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
          border: '2px solid rgba(139, 92, 246, 0.3)',
          borderRadius: 'clamp(12px, 2.5vw, 16px)',
          padding: 'clamp(20px, 5vw, 30px)',
          flexShrink: 0
        }}
      >
        <h2 style={{ 
          marginTop: 0, 
          marginBottom: 'clamp(12px, 3vw, 20px)',
          color: 'var(--text)',
          fontSize: 'clamp(1.1rem, 3vw, 1.4rem)'
        }}>
          📅 Today's Progress
        </h2>
        <div style={{ display: 'flex', gap: 'clamp(20px, 5vw, 40px)', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', fontWeight: 'bold', color: '#4ADE80' }}>
              {studiedToday.newCards}
            </div>
            <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: 'rgba(255, 255, 255, 0.6)' }}>
              New cards today
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', fontWeight: 'bold', color: '#60A5FA' }}>
              {studiedToday.reviews}
            </div>
            <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: 'rgba(255, 255, 255, 0.6)' }}>
              Reviews today
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  )
}


