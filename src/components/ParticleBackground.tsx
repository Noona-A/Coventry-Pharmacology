import { motion } from 'framer-motion'

export default function ParticleBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: i % 3 === 0 ? '#ff6b35' : i % 3 === 1 ? '#a855f7' : '#3b82f6',
            boxShadow: `0 0 ${Math.random() * 6 + 2}px currentColor`,
          }}
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
