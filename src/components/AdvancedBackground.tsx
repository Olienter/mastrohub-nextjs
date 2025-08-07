'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdvancedBackgroundProps {
  isVisible: boolean;
  hasShownIntro: boolean;
}

interface Particle {
  id: number;
  size: string;
  color: string;
  left: string;
  top: string;
  duration: number;
  delay: number;
  x: number;
  y: number;
  rotate: number[];
}

interface Star {
  id: number;
  left: string;
  top: string;
  duration: number;
  delay: number;
}

const AdvancedBackground: React.FC<AdvancedBackgroundProps> = ({ isVisible, hasShownIntro }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showParticles, setShowParticles] = useState(false);
  const [showNebula, setShowNebula] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Optimized mouse tracking with throttling
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Generate particles client-side only - REDUCED for better performance
      const generatedParticles = Array.from({ length: 50 }, (_, i) => ({ // Reduced from 200 to 50
        id: i,
        size: i % 4 === 0 ? 'w-2 h-2' : i % 4 === 1 ? 'w-1 h-1' : i % 4 === 2 ? 'w-0.5 h-0.5' : 'w-1.5 h-1.5',
        color: i % 4 === 0 ? 'bg-cyan-400' : i % 4 === 1 ? 'bg-teal-400' : i % 4 === 2 ? 'bg-white' : 'bg-blue-400',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 4 + Math.random() * 3,
        delay: Math.random() * 2,
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        rotate: [0, 360, 720]
      }));

      // Generate stars client-side only - REDUCED for better performance
      const generatedStars = Array.from({ length: 100 }, (_, i) => ({ // Reduced from 500 to 100
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 2
      }));

      setParticles(generatedParticles);
      setStars(generatedStars);
    }
  }, [isClient]);

  useEffect(() => {
    if (isVisible) {
      const particlesTimer = setTimeout(() => setShowParticles(true), 200);
      const nebulaTimer = setTimeout(() => setShowNebula(true), 400);

      return () => {
        clearTimeout(particlesTimer);
        clearTimeout(nebulaTimer);
      };
    }
  }, [isVisible]);

  // Don't render anything until client-side
  if (!isClient) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: hasShownIntro ? 1 : 0 }}
      onMouseMove={handleMouseMove}
    >
      {/* Base cosmic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-blue-900 to-cyan-900" />
      
      {/* Animated nebula clouds */}
      <AnimatePresence>
        {showNebula && (
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full opacity-20"
                style={{
                  width: `${200 + i * 100}px`,
                  height: `${200 + i * 100}px`,
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 20}%`,
                  background: `radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)`
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Animated particles */}
      <AnimatePresence>
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className={`absolute ${particle.size} ${particle.color} rounded-full`}
                style={{
                  left: particle.left,
                  top: particle.top,
                }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  rotate: particle.rotate,
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Twinkling stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: star.left,
              top: star.top,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Interactive mouse trail */}
      <motion.div
        className="absolute w-4 h-4 bg-cyan-400/30 rounded-full pointer-events-none"
        style={{
          x: mousePosition.x * 100,
          y: mousePosition.y * 100,
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
      />
    </motion.div>
  );
};

export default AdvancedBackground; 