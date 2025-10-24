import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame, BRAIN_COSMETICS } from '../store'
import { useState } from 'react'
import BrainIcon from '../components/BrainIcon'

export default function Cosmetics() {
  const { gold, ownedCosmetics, equippedCosmetics, buyCosmetic, equipCosmetic } = useGame()
  const [selectedType, setSelectedType] = useState<'color' | 'accessory' | 'pet'>('color')
  const [previewId, setPreviewId] = useState<string | null>(null)

  const filteredCosmetics = BRAIN_COSMETICS.filter(c => c.type === selectedType)
  
  // Get preview cosmetics (use preview if hovering, otherwise use equipped)
  const previewCosmetics = previewId ? {
    ...equippedCosmetics,
    [BRAIN_COSMETICS.find(c => c.id === previewId)?.type || 'color']: previewId
  } : equippedCosmetics

  const handleBuy = (cosmeticId: string) => {
    const success = buyCosmetic(cosmeticId)
    if (success) {
      // Optionally show success message
      console.log('Purchase successful!')
    } else {
      // Optionally show error message
      console.log('Not enough gold or already owned')
    }
  }

  return (
    <div className="page" style={{ 
      padding: 'clamp(10px, 3vw, 20px)', 
      overflow: 'hidden', 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
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
        marginBottom: 'clamp(12px, 3vw, 20px)',
        maxWidth: '1200px',
        margin: '0 auto clamp(12px, 3vw, 20px)',
        gap: 'clamp(10px, 3vw, 20px)',
        flexWrap: 'wrap',
        flexShrink: 0,
        padding: '0 10px'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
          color: 'var(--text)' 
        }}>
          Brain Cosmetics
        </h1>
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 193, 7, 0.3))',
          border: '2px solid rgba(255, 215, 0, 0.5)',
          borderRadius: 'clamp(10px, 2vw, 12px)',
          padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(6px, 1.5vw, 8px)',
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          fontWeight: 'bold',
          color: '#FFD700'
        }}>
          💰 {gold}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 768 ? 'clamp(250px, 30vw, 300px) 1fr' : '1fr',
        gap: 'clamp(15px, 4vw, 30px)',
        height: window.innerWidth > 768 ? 'calc(100vh - clamp(100px, 20vw, 120px))' : 'auto',
        overflow: 'hidden',
        flex: 1,
        padding: '0 10px'
      }}>
        {/* Left Side - Brain Preview */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
          border: '2px solid rgba(139, 92, 246, 0.3)',
          borderRadius: 'clamp(12px, 3vw, 20px)',
          padding: 'clamp(20px, 5vw, 30px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(12px, 3vw, 20px)',
          height: 'fit-content',
          overflow: 'hidden'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
            color: 'var(--text)',
            textAlign: 'center'
          }}>
            {previewId ? '👀 Preview' : '✨ Your Brain'}
          </h2>
          
          <div style={{
            transform: window.innerWidth > 768 ? 'scale(1.5)' : 'scale(1.2)',
            marginTop: 'clamp(10px, 3vw, 20px)',
            marginBottom: 'clamp(10px, 3vw, 20px)'
          }}>
            <BrainIcon previewCosmetics={previewCosmetics} />
          </div>

          <p style={{
            margin: 0,
            fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center'
          }}>
            {previewId ? 'Hover over items to preview them!' : 'Hover over items to see how they look!'}
          </p>
        </div>

        {/* Right Side - Cosmetics */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden'
        }}>
          {/* Type Selector */}
          <div style={{
            marginBottom: 'clamp(12px, 3vw, 20px)',
            display: 'flex',
            gap: 'clamp(8px, 2vw, 12px)',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {(['color', 'accessory', 'pet'] as const).map(type => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType(type)}
                style={{
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 24px)',
                  background: selectedType === type
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(59, 130, 246, 0.5))'
                    : 'rgba(139, 92, 246, 0.1)',
                  border: selectedType === type
                    ? '2px solid rgba(139, 92, 246, 0.8)'
                    : '2px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: 'clamp(12px, 3vw, 16px)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                  fontWeight: selectedType === type ? 'bold' : 'normal',
                  textTransform: 'capitalize',
                  transition: 'all 0.3s ease'
                }}
              >
                {type === 'color' && '🎨'} {type === 'accessory' && '🕶️'} {type === 'pet' && '🐾'} {type}s
              </motion.button>
            ))}
          </div>

          {/* Cosmetics Grid with Hint */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            paddingRight: '10px',
            gap: 'clamp(12px, 3vw, 20px)',
            flex: 1
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 25vw, 180px), 1fr))',
              gap: 'clamp(12px, 3vw, 20px)'
            }}>
        {filteredCosmetics.map(cosmetic => {
          const isOwned = ownedCosmetics.includes(cosmetic.id)
          const isEquipped = equippedCosmetics[cosmetic.type] === cosmetic.id
          const canAfford = gold >= cosmetic.cost

          return (
            <motion.div
              key={cosmetic.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setPreviewId(cosmetic.id)}
              onHoverEnd={() => setPreviewId(null)}
              style={{
                background: isEquipped
                  ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 193, 7, 0.2))'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
                border: isEquipped
                  ? '3px solid rgba(255, 215, 0, 0.6)'
                  : '2px solid rgba(139, 92, 246, 0.3)',
                borderRadius: 'clamp(12px, 3vw, 16px)',
                padding: 'clamp(14px, 4vw, 20px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'clamp(8px, 2vw, 12px)',
                position: 'relative',
                cursor: isOwned ? 'pointer' : 'default'
              }}
              onClick={() => isOwned && !isEquipped && equipCosmetic(cosmetic.id)}
            >
              {isEquipped && (
                <div style={{
                  position: 'absolute',
                  top: 'clamp(6px, 1.5vw, 8px)',
                  right: 'clamp(6px, 1.5vw, 8px)',
                  background: 'rgba(255, 215, 0, 0.9)',
                  borderRadius: 'clamp(6px, 1.5vw, 8px)',
                  padding: 'clamp(3px, 1vw, 4px) clamp(6px, 1.5vw, 8px)',
                  fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)',
                  fontWeight: 'bold',
                  color: '#000'
                }}>
                  EQUIPPED
                </div>
              )}

              {/* Preview Image or Emoji */}
              <div style={{ 
                fontSize: 'clamp(2rem, 6vw, 3rem)',
                width: cosmetic.image ? 'clamp(60px, 15vw, 80px)' : 'auto',
                height: cosmetic.image ? 'clamp(60px, 15vw, 80px)' : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cosmetic.image ? (
                  <img 
                    src={cosmetic.image} 
                    alt={cosmetic.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  cosmetic.emoji || '🎨'
                )}
              </div>
              
              <h3 style={{
                margin: 0,
                fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                color: 'var(--text)',
                textAlign: 'center'
              }}>
                {cosmetic.name}
              </h3>

              <p style={{
                margin: 0,
                fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                color: 'rgba(255, 255, 255, 0.6)',
                textAlign: 'center'
              }}>
                {cosmetic.description}
              </p>

              {cosmetic.color && (
                <div style={{
                  width: 'clamp(30px, 8vw, 40px)',
                  height: 'clamp(30px, 8vw, 40px)',
                  borderRadius: '50%',
                  background: cosmetic.color,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: `0 0 20px ${cosmetic.color}`
                }} />
              )}

              {!isOwned && (
                <motion.button
                  whileHover={canAfford ? { scale: 1.1 } : {}}
                  whileTap={canAfford ? { scale: 0.95 } : {}}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (canAfford) handleBuy(cosmetic.id)
                  }}
                  style={{
                    width: '100%',
                    padding: 'clamp(8px, 2vw, 10px)',
                    background: canAfford
                      ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.3), rgba(34, 197, 94, 0.3))'
                      : 'rgba(100, 100, 100, 0.2)',
                    border: canAfford
                      ? '2px solid rgba(74, 222, 128, 0.5)'
                      : '2px solid rgba(100, 100, 100, 0.3)',
                    borderRadius: 'clamp(10px, 2vw, 12px)',
                    color: canAfford ? '#4ADE80' : 'rgba(255, 255, 255, 0.3)',
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'clamp(6px, 1.5vw, 8px)'
                  }}
                  disabled={!canAfford}
                >
                  💰 {cosmetic.cost}
                </motion.button>
              )}

              {isOwned && !isEquipped && (
                <div style={{
                  width: '100%',
                  padding: 'clamp(8px, 2vw, 10px)',
                  background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(59, 130, 246, 0.3))',
                  border: '2px solid rgba(96, 165, 250, 0.5)',
                  borderRadius: 'clamp(10px, 2vw, 12px)',
                  color: '#60A5FA',
                  fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  Click to Equip
                </div>
              )}
            </motion.div>
          )
        })}
            </div>

            {/* Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                paddingBottom: 'clamp(12px, 3vw, 20px)'
              }}
            >
              💡 Earn 10 gold for each card you answer perfectly on the first try!
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
