import { motion } from 'framer-motion'
import { useGame, BRAIN_COSMETICS } from '../store'
import { getAssetPath } from '../utils/assets'

interface BrainIconProps {
  size?: number
  className?: string
  previewCosmetics?: { color?: string; pattern?: string; accessory?: string; pet?: string }
}

export default function BrainIcon({ size = 120, className = '', previewCosmetics }: BrainIconProps) {
  const storeEquippedCosmetics = useGame((state) => state.equippedCosmetics)
  
  // Use preview cosmetics if provided, otherwise use equipped from store
  const equippedCosmetics = previewCosmetics || storeEquippedCosmetics
  
  // Get the equipped color (default to orange)
  const colorCosmeticId = equippedCosmetics?.color || 'color-orange'
  const colorCosmetic = BRAIN_COSMETICS.find(c => c.id === colorCosmeticId)
  const brainImage = getAssetPath(colorCosmetic?.image || '/Brain.png')
  
  const colorMap: Record<string, { primary: string; secondary: string; glow: string }> = {
    'color-orange': { primary: 'rgba(255, 152, 0, 0.6)', secondary: 'rgba(255, 87, 34, 0.4)', glow: 'rgba(255, 152, 0, 0.8)' },
    'color-blue': { primary: 'rgba(33, 150, 243, 0.6)', secondary: 'rgba(25, 118, 210, 0.4)', glow: 'rgba(33, 150, 243, 0.8)' },
    'color-pink': { primary: 'rgba(233, 30, 99, 0.6)', secondary: 'rgba(194, 24, 91, 0.4)', glow: 'rgba(233, 30, 99, 0.8)' },
    'color-yellow': { primary: 'rgba(255, 215, 0, 0.6)', secondary: 'rgba(255, 193, 7, 0.4)', glow: 'rgba(255, 215, 0, 0.8)' },
  }
  
  const colors = colorMap[colorCosmeticId] || colorMap['color-orange']
  
  // Get accessory
  const accessory = equippedCosmetics?.accessory
  
  // Find the accessory cosmetic to get its image (don't show if it's 'accessory-none')
  const accessoryCosmetic = accessory && accessory !== 'accessory-none' 
    ? BRAIN_COSMETICS.find(c => c.id === accessory) 
    : null
  
  // Get pet
  const pet = equippedCosmetics?.pet
  
  // Find the pet cosmetic to get its image (don't show if it's 'pet-none')
  const petCosmetic = pet && pet !== 'pet-none' 
    ? BRAIN_COSMETICS.find(c => c.id === pet) 
    : null
  
  return (
    <div
      style={{
        position: 'relative',
        width: size * 2,
        height: size * 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className={className}
    >
      {/* Outer soft glow ring - dynamic color */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          width: size * 3.6,
          height: size * 3.6,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.secondary.replace('0.4', '0.4')} 0%, ${colors.secondary.replace('0.4', '0.3')} 40%, transparent 70%)`,
          filter: 'blur(25px)',
        }}
      />

      {/* Middle ring - dynamic color */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.3,
        }}
        style={{
          position: 'absolute',
          width: size * 3,
          height: size * 3,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.primary.replace('0.6', '0.5')} 0%, ${colors.secondary.replace('0.4', '0.35')} 40%, transparent 70%)`,
        }}
      />

      {/* Inner bright ring - dynamic color */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.6,
        }}
        style={{
          position: 'absolute',
          width: size * 2.6,
          height: size * 2.6,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.primary} 0%, ${colors.secondary} 40%, transparent 65%)`,
        }}
      />

      {/* Floating brain image with dynamic glow */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'relative',
          width: size * 2,
          height: size * 2,
        }}
      >
        <img
          src={brainImage}
          alt="Brain"
          style={{
            width: size * 2,
            height: size * 2,
            objectFit: 'contain',
            filter: `brightness(1.3) saturate(1.2) drop-shadow(0 0 30px ${colors.glow}) drop-shadow(0 0 60px ${colors.secondary})`,
            position: 'relative',
            zIndex: 1,
          }}
        />
        
        {/* Accessory overlay - moves with brain */}
        {accessory && accessoryCosmetic && accessoryCosmetic.image && (
          <img 
            src={getAssetPath(accessoryCosmetic.image)} 
            alt={accessoryCosmetic.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: size * 2,
              height: size * 2,
              objectFit: 'contain',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Pet overlay - moves with the brain (same animated container to keep perfect sync) */}
        {pet && petCosmetic && petCosmetic.image && (
          <img
            src={getAssetPath(petCosmetic.image)}
            alt={petCosmetic.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: size * 2,
              height: size * 2,
              objectFit: 'contain',
              zIndex: 4,
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
              pointerEvents: 'none',
            }}
          />
        )}
      </motion.div>
      
    </div>
  )
}
