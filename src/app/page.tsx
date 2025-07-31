'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import HorizontalTools from '@/components/HorizontalTools';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, left: string, top: string}>>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Generate stable particle positions
    const particlePositions = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${(i * 7.3) % 100}%`,
      top: `${(i * 11.7) % 100}%`,
    }));
    setParticles(particlePositions);

    return () => clearTimeout(timer);
  }, []);

  const handleLetsTalkClick = () => {
    console.log('Let\'s Talk clicked!');
  };

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
      <section className="relative z-10 min-h-screen flex flex-col justify-between">
        {/* Top Bar */}
        <header className="w-full px-8 py-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white tracking-tight" style={{fontFamily: 'Inter, sans-serif'}}>Mastro</span>
            <span className="text-2xl font-bold text-mastroCyan-400 tracking-tight ml-1" style={{fontFamily: 'Inter, sans-serif'}}>Hub</span>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex items-center gap-8">
            <a href="#" className="text-white/70 hover:text-white transition-colors font-medium uppercase tracking-wide text-sm">
              Products
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors font-medium uppercase tracking-wide text-sm">
              Solutions
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors font-medium uppercase tracking-wide text-sm">
              Learn
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors font-medium uppercase tracking-wide text-sm">
              Community
            </a>
            <Link href="/blog" className="text-white/70 hover:text-white transition-colors font-medium uppercase tracking-wide text-sm">
              Blog
            </Link>
          </nav>
          
          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            <Link href="/login">
              <button className="text-white/70 hover:text-white transition-colors font-medium">
                Log In
              </button>
            </Link>
            <Link href="/join">
              <button className="bg-mastroCyan-400 hover:bg-mastroCyan-500 text-neutral-900 px-4 py-2 rounded-lg font-medium transition-colors">
                Join
              </button>
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <main className="flex flex-col items-center justify-center text-center px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <h1 
              className={`text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight tracking-tight transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} 
              style={{fontFamily: 'Inter, sans-serif'}}
            >
              <span className={`inline-block transition-all duration-700 delay-200 ${
                isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}>
                Culinary
              </span>
              <br />
              <span className={`inline-block text-mastroCyan-400 transition-all duration-700 delay-400 ${
                isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}>
                Intelligence
              </span>
            </h1>
            <p 
              className={`text-xl md:text-2xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed mb-8 transition-all duration-1000 delay-600 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`} 
              style={{fontFamily: 'Inter, sans-serif'}}
            >
              Menu, forecast & profit tools. All in one brain.
            </p>
            
            {/* Let's Talk Button */}
            <div className={`transition-all duration-700 delay-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <motion.div 
                className="group relative inline-block cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLetsTalkClick}
              >
                <motion.button 
                  className="relative bg-cyan-500/20 backdrop-blur-xl border border-cyan-400/30 px-12 py-6 rounded-3xl text-white font-bold text-xl shadow-2xl"
                  whileHover={{ 
                    backgroundColor: "rgba(6, 182, 212, 0.3)",
                    borderColor: "rgba(34, 211, 238, 0.5)",
                    boxShadow: "0 25px 50px rgba(34, 211, 238, 0.3)"
                  }}
                >
                  <span className="relative z-10">Let's Talk</span>
                </motion.button>
                <motion.div 
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"
                  whileHover={{ opacity: 1 }}
                />
                <motion.div 
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/20 to-teal-400/20 animate-pulse -z-20"
                  animate={{ 
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>
          </div>
        </main>

        {/* Bottom Bar */}
        <div className="w-full px-12 py-8">
          <div className="w-full flex justify-between items-center">
            <div className={`flex items-center gap-4 transition-all duration-700 delay-1000 ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              <span className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider drop-shadow-lg" style={{fontFamily: 'Inter, sans-serif'}}>MINIMUM WASTE.</span>
              <div className="w-6 h-6 bg-mastroCyan-400 rounded-full opacity-80 animate-pulse shadow-lg shadow-mastroCyan-400/50 hover:scale-125 hover:shadow-xl hover:shadow-mastroCyan-400/80 hover:opacity-100 transition-all duration-300 cursor-pointer"></div>
            </div>
            <div className={`flex items-center gap-4 transition-all duration-700 delay-1000 ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}>
              <div className="w-6 h-6 bg-mastroCyan-400 rounded-full opacity-80 animate-pulse shadow-lg shadow-mastroCyan-400/50 hover:scale-125 hover:shadow-xl hover:shadow-mastroCyan-400/80 hover:opacity-100 transition-all duration-300 cursor-pointer"></div>
              <span className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider drop-shadow-lg" style={{fontFamily: 'Inter, sans-serif'}}>MAXIMUM PROFIT.</span>
            </div>
          </div>
        </div>

        {/* HorizontalTools */}
        <HorizontalTools />
      </section>
    </div>
  );
}
