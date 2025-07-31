'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

const StarryBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Generate stars only on client side to avoid hydration mismatch
    const generatedStars = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2
    }));
    
    setStars(generatedStars);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1, 0.5],
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
  );
};

export default StarryBackground; 