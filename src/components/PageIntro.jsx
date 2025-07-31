import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const PageIntro = ({ isVisible, onComplete }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showHologram, setShowHologram] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  
  // Mouse tracking for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (isVisible) {
      const welcomeTimer = setTimeout(() => setShowWelcome(true), 200);
      const hologramTimer = setTimeout(() => setShowHologram(true), 500);
      const particlesTimer = setTimeout(() => setShowParticles(true), 800);
      const glowTimer = setTimeout(() => setShowGlow(true), 1200);
      const completeTimer = setTimeout(() => onComplete(), 5000);

      return () => {
        clearTimeout(welcomeTimer);
        clearTimeout(hologramTimer);
        clearTimeout(particlesTimer);
        clearTimeout(glowTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, onComplete]);

  // Mouse move handler for interactive effects
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX - innerWidth / 2) / innerWidth);
    mouseY.set((clientY - innerHeight / 2) / innerHeight);
  };

  const text = "WELCOME TO MASTRO";
  const hubText = "HUB";
  const letters = text.split('');
  const hubLetters = hubText.split('');

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-neutral-900 flex items-center justify-center z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, delay: 0.5 } }}
          onMouseMove={handleMouseMove}
        >
          {/* Holographic Background */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(20, 184, 166, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 20%, rgba(34, 211, 238, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)"
              ]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Quantum Field Lines */}
          <AnimatePresence>
            {showHologram && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"
                    style={{
                      left: `${(i + 1) * 12.5}%`,
                      transform: 'translateX(-50%)'
                    }}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scaleY: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Enhanced Particle System */}
          <AnimatePresence>
            {showParticles && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute rounded-full ${
                      i % 3 === 0 ? 'w-2 h-2 bg-cyan-400' :
                      i % 3 === 1 ? 'w-1 h-1 bg-teal-400' :
                      'w-0.5 h-0.5 bg-white'
                    }`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    initial={{
                      scale: 0,
                      opacity: 0,
                      x: 0,
                      y: 0,
                      rotate: 0
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: (Math.random() - 0.5) * 400,
                      y: (Math.random() - 0.5) * 400,
                      rotate: [0, 360, 720]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      delay: Math.random() * 2,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                className="relative z-10 flex flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                {/* Welcome Text */}
                <motion.div
                  className="text-center mb-4"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  {letters.map((letter, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 50, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        delay: index * 0.06,
                        duration: 0.8,
                        ease: [0.6, 0.05, 0.01, 0.99]
                      }}
                      className="inline-block text-4xl md:text-6xl font-bold text-white"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </motion.span>
                  ))}
                </motion.div>

                {/* HUB Text with Gradient */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                >
                  {hubLetters.map((letter, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 30, rotateY: -90 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      transition={{
                        delay: 1.2 + index * 0.1,
                        duration: 0.8,
                        ease: [0.6, 0.05, 0.01, 0.99]
                      }}
                      className="inline-block text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Glow Effect */}
                <AnimatePresence>
                  {showGlow && (
                    <motion.div
                      className="absolute inset-0 -z-10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-teal-400/20 to-cyan-400/20 blur-3xl" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Subtitle */}
                <motion.p
                  className="text-xl md:text-2xl text-cyan-400/90 font-light text-center max-w-2xl mb-8"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5, duration: 0.8, ease: "easeOut" }}
                >
                  Culinary Intelligence Platform
                </motion.p>

                {/* Enhanced Loading Animation */}
                <motion.div
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3, duration: 0.5 }}
                >
                  <motion.div
                    className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="w-4 h-4 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                      rotate: [0, -180, -360]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.3,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.6,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageIntro;