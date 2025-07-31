'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfessionalBackgroundProps {
  isVisible: boolean;
  variant?: 'default' | 'gradient' | 'geometric' | 'particles';
}

const ProfessionalBackground: React.FC<ProfessionalBackgroundProps> = ({ 
  isVisible, 
  variant = 'default' 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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

  const renderDefaultBackground = () => (
    <>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900" />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(45deg, #22c55e, #10b981, #059669, #047857)',
          backgroundSize: '400% 400%'
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>
    </>
  );

  const renderGradientBackground = () => (
    <>
      {/* Multi-layer gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-emerald-900 to-teal-900" />
      
      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${300 + i * 200}px`,
              height: `${300 + i * 200}px`,
              left: `${20 + i * 25}%`,
              top: `${10 + i * 30}%`,
              background: `radial-gradient(circle, rgba(34, 197, 94, ${0.2 - i * 0.05}) 0%, transparent 70%)`
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </>
  );

  const renderGeometricBackground = () => (
    <>
      {/* Base color */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900" />
      
      {/* Geometric shapes */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-green-500/20"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              left: `${10 + i * 15}%`,
              top: `${5 + i * 20}%`,
              transform: `rotate(${i * 30}deg)`
            }}
            animate={{
              rotate: [i * 30, i * 30 + 360],
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Floating dots */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute w-2 h-2 bg-green-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </>
  );

  const renderParticlesBackground = () => (
    <>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900" />
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 200],
              y: [0, (Math.random() - 0.5) * 200],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-xl"
            style={{
              width: `${150 + i * 50}px`,
              height: `${150 + i * 50}px`,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 25}%`,
              background: `radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)`
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2]
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

  const getBackgroundContent = () => {
    switch (variant) {
      case 'gradient':
        return renderGradientBackground();
      case 'geometric':
        return renderGeometricBackground();
      case 'particles':
        return renderParticlesBackground();
      default:
        return renderDefaultBackground();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1 }}
      onMouseMove={handleMouseMove}
    >
      {getBackgroundContent()}
      
      {/* Interactive mouse trail */}
      <motion.div
        className="absolute w-6 h-6 bg-green-400/20 rounded-full pointer-events-none"
        style={{
          x: mousePosition.x * 100,
          y: mousePosition.y * 100,
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
      />
    </motion.div>
  );
};

export default ProfessionalBackground; 