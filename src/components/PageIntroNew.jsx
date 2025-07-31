import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PageIntroNew = ({ isVisible, onComplete }) => {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const welcomeTimer = setTimeout(() => setShowWelcome(true), 500);
      const completeTimer = setTimeout(() => onComplete(), 4000);

      return () => {
        clearTimeout(welcomeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, onComplete]);

  const text = "WELCOME TO MASTROHUB";
  const letters = text.split('');

  return (
    <AnimatePresence>
      {isVisible && showWelcome && (
        <motion.div
          className="fixed inset-0 bg-neutral-900 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.5 } }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold text-white text-center"
            style={{ fontFamily: 'Inter, sans-serif' }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.5,
                  ease: "easeOut"
                }}
                className="inline-block"
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageIntroNew; 