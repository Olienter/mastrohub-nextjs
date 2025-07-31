'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RestaurantCurator() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, left: string, top: string}>>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    const particlePositions = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${(i * 8.1) % 100}%`,
      top: `${(i * 12.3) % 100}%`,
    }));
    setParticles(particlePositions);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-blue-950 to-cyan-950" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-mastroCyan-400/30 rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + (particle.id % 3),
              repeat: Infinity,
              delay: particle.id * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <section className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full px-8 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white tracking-tight" style={{fontFamily: 'Inter, sans-serif'}}>Mastro</span>
            <span className="text-2xl font-bold text-mastroCyan-400 tracking-tight ml-1" style={{fontFamily: 'Inter, sans-serif'}}>Hub</span>
          </Link>
          
          <nav className="flex items-center gap-8">
            <Link href="/" className="text-white/70 hover:text-white transition-colors font-medium">
              ← Back to Home
            </Link>
          </nav>
        </header>

        {/* Content */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl font-bold text-white mb-6" style={{fontFamily: 'Inter, sans-serif'}}>
                <span className="text-white">Restaurant</span>
                <span className="text-mastroCyan-400"> Curator</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto" style={{fontFamily: 'Inter, sans-serif'}}>
                Manage your restaurant profile & operations. Streamline your restaurant management with our comprehensive tools.
              </p>
              
              <motion.button 
                className="bg-mastroCyan-400 hover:bg-mastroCyan-500 text-neutral-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Manage Restaurant
              </motion.button>
            </motion.div>
          </div>
        </main>
      </section>
    </div>
  );
}
