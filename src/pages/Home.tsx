import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import BrainIcon from '../components/BrainIcon'

export default function Home() {
  return (
    <div className="page" style={{ 
      position: 'relative',
      padding: 'clamp(10px, 3vw, 20px)',
      paddingBottom: 'clamp(40px, 10vh, 60px)',
      boxSizing: 'border-box',
      overflow: 'auto',
      minHeight: '100svh'
    }}>
      {/* Home Icon in top left */}
      <Link to="/" style={{ 
        position: 'absolute',
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
        zIndex: 10
      }}>
        🏠
      </Link>

      <div className="hero">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="stack"
        >
          {/* Brain Icon */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              filter: [
                'drop-shadow(0 0 40px rgba(255,138,61,0.6))',
                'drop-shadow(0 0 60px rgba(255,138,61,0.8))',
                'drop-shadow(0 0 40px rgba(255,138,61,0.6))',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <BrainIcon size={Math.min(140, window.innerWidth * 0.25)} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: 'clamp(1.8rem, 6vw, 3rem)',
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.1,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #FF8A3D 0%, #FF3D3D 50%, #FF347A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px',
              padding: '0 10px'
            }}
          >
            Coventry Pharmacology
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              margin: 0,
              color: 'var(--muted)',
              lineHeight: 1.5,
              textAlign: 'center',
              padding: '0 10px'
            }}
          >
            Master pharmacology with spaced repetition
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="stack"
            style={{ 
              marginTop: 'clamp(12px, 3vw, 16px)',
              width: '100%',
              maxWidth: '400px',
              padding: '0 10px',
              boxSizing: 'border-box'
            }}
          >
            <Link to="/play" style={{ textDecoration: 'none', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button className="btn" style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF347A)' }}>
                <span style={{ fontSize: 20 }}>▶</span> Play
              </button>
            </Link>
            
            <Link to="/lists" style={{ textDecoration: 'none', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button className="btn" style={{ background: 'linear-gradient(135deg, #9A40FF, #7D2AFF)' }}>
                <span style={{ fontSize: 20 }}>☰</span> My Lists
              </button>
            </Link>
            
            <Link to="/stats" style={{ textDecoration: 'none', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button className="btn" style={{ background: 'linear-gradient(135deg, #4587FF, #3FB6FF)' }}>
                <span style={{ fontSize: 20 }}>📊</span> Statistics
              </button>
            </Link>
            
            <Link to="/cosmetics" style={{ textDecoration: 'none', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button className="btn" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>
                <span style={{ fontSize: 20 }}>👑</span> Cosmetics Shop
              </button>
            </Link>
            
            <Link to="/settings" style={{ textDecoration: 'none', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button className="btn" style={{ background: 'linear-gradient(135deg, #4587FF, #3FB6FF)' }}>
                <span style={{ fontSize: 20 }}>⚙</span> Settings
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
