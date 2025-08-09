'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UltraModernBackgroundProps {
  isVisible: boolean;
  variant?: 'cyberpunk' | 'neon' | 'glassmorphism' | 'holographic';
}

const UltraModernBackground: React.FC<UltraModernBackgroundProps> = ({ 
  isVisible, 
  variant = 'cyberpunk' 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsClient(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    requestAnimationFrame(() => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX - innerWidth / 2) / innerWidth,
        y: (clientY - innerHeight / 2) / innerHeight
      });
    });
  }, []);

  if (!isClient) {
    return null;
  }

  const renderCyberpunkBackground = () => (
    <>
      {/* Base gradient - dark blue like in screenshot */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
      
      {/* Subtle white particles scattered like stars */}
      <div className="absolute inset-0">
        {[...Array(200)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-slate-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/20" />
    </>
  );

  const renderNeonBackground = () => (
    <>
      {/* Dark base */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Neon gradient lines */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"
            style={{
              top: `${20 + i * 20}%`,
              left: '0%',
              right: '0%',
              filter: 'blur(1px)'
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scaleX: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Neon orbs */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${80 + i * 30}px`,
              height: `${80 + i * 30}px`,
              left: `${15 + i * 15}%`,
              top: `${10 + i * 20}%`,
              background: `radial-gradient(circle, rgba(34, 197, 94, 0.6) 0%, transparent 70%)`,
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.8, 0.4],
              rotate: [0, 360]
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </>
  );

  const renderGlassmorphismBackground = () => (
    <>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900" />
      
      {/* Glass panels */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-3xl backdrop-blur-xl border border-white/10"
            style={{
              width: `${300 + i * 100}px`,
              height: `${200 + i * 80}px`,
              left: `${10 + i * 20}%`,
              top: `${5 + i * 25}%`,
              background: 'rgba(255, 255, 255, 0.05)',
              transform: `rotate(${i * 15}deg)`
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [i * 15, i * 15 + 5, i * 15],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full backdrop-blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </>
  );

  const renderHolographicBackground = () => (
    <>
      {/* Holographic base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-cyan-900" />
      
      {/* Holographic interference pattern */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(34, 197, 94, 0.1) 10px,
              rgba(34, 197, 94, 0.1) 20px
            )
          `
        }}
        animate={{
          backgroundPosition: ['0px 0px', '20px 20px', '0px 0px']
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Holographic orbs */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${200 + i * 80}px`,
              height: `${200 + i * 80}px`,
              left: `${15 + i * 18}%`,
              top: `${10 + i * 22}%`,
              background: `
                conic-gradient(
                  from ${i * 72}deg,
                  rgba(34, 197, 94, 0.3),
                  rgba(147, 51, 234, 0.3),
                  rgba(59, 130, 246, 0.3),
                  rgba(34, 197, 94, 0.3)
                )
              `
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 12 + i * 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </>
  );

  const getBackgroundContent = () => {
    switch (variant) {
      case 'neon':
        return renderNeonBackground();
      case 'glassmorphism':
        return renderGlassmorphismBackground();
      case 'holographic':
        return renderHolographicBackground();
      default:
        return renderCyberpunkBackground();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1 }}
      onMouseMove={handleMouseMove}
      style={{
        transform: `translateY(${scrollY * 0.1}px)`
      }}
    >
      {getBackgroundContent()}
      
      {/* Interactive cursor trail */}
      <motion.div
        className="absolute w-8 h-8 rounded-full pointer-events-none"
        style={{
          x: mousePosition.x * 100,
          y: mousePosition.y * 100,
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)',
          filter: 'blur(2px)'
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
      />
    </motion.div>
  );
};

export default UltraModernBackground; 