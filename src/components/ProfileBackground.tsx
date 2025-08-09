'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProfileBackgroundProps {
  type: 'gradient' | 'solid' | 'pattern' | 'image';
  className?: string;
}

const ProfileBackground: React.FC<ProfileBackgroundProps> = ({ type, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getBackgroundStyle = () => {
    switch (type) {
      case 'gradient':
        return 'bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500';
      case 'solid':
        return 'bg-slate-900';
      case 'pattern':
        return 'bg-slate-800';
      case 'image':
        return 'bg-cover bg-center';
      default:
        return 'bg-gradient-to-br from-blue-500 to-purple-600';
    }
  };

  const getPatternOverlay = () => {
    if (type === 'pattern') {
      return (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(45deg, #3b82f6 25%, transparent 25%),
              linear-gradient(-45deg, #3b82f6 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #3b82f6 75%),
              linear-gradient(-45deg, transparent 75%, #3b82f6 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }} />
        </div>
      );
    }
    return null;
  };

  const getImageBackground = () => {
    if (type === 'image') {
      return (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
      );
    }
    return null;
  };

  return (
    <motion.div
      className={`relative min-h-screen ${getBackgroundStyle()} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Background */}
      {getImageBackground()}
      
      {/* Pattern Overlay */}
      {getPatternOverlay()}
      
      {/* Gradient Overlay for Image */}
      {type === 'image' && (
        <div className="absolute inset-0 bg-black/30" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {/* Floating Elements */}
        {type === 'gradient' && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full blur-2xl"
                style={{
                  width: `${100 + i * 50}px`,
                  height: `${100 + i * 50}px`,
                  left: `${10 + i * 15}%`,
                  top: `${5 + i * 20}%`,
                  background: `radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)`
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2],
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
        
        {/* Animated Particles for Pattern */}
        {type === 'pattern' && (
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-500 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1, 0.5]
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
        )}
      </div>
    </motion.div>
  );
};

export default ProfileBackground; 