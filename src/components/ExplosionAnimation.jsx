'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Brain, 
  Users, 
  Rocket, 
  TrendingUp, 
  BarChart3, 
  Target, 
  Award, 
  Shield, 
  Zap,
  Building2,
  DollarSign,
  CheckCircle
} from 'lucide-react';

const ExplosionAnimation = ({ isVisible, onComplete }) => {
  const [phase, setPhase] = useState('idle'); // idle, button-fade, icons-appear
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Professional business phase management
  const handlePhaseChange = useCallback((newPhase) => {
    console.log('Business phase changing to:', newPhase);
    setPhase(newPhase);
  }, []);

  // Mouse tracking for reactive effects
  const handleMouseMove = useCallback((e) => {
    requestAnimationFrame(() => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX - innerWidth / 2) / innerWidth,
        y: (clientY - innerHeight / 2) / innerHeight
      });
    });
  }, []);

  // Simple smooth animation sequence
  useEffect(() => {
    if (isVisible) {
      // Button fades out
      handlePhaseChange('button-fade');
      
      // Icons appear smoothly
      setTimeout(() => {
        handlePhaseChange('icons-appear');
      }, 300);

      return () => {
        // Cleanup
      };
    } else {
      handlePhaseChange('idle');
    }
  }, [isVisible, handlePhaseChange]);

  // Simple smooth transitions
  const smoothTransitions = useMemo(() => ({
    fadeOut: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: "easeOut" } },
    fadeIn: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  }), []);

  // Simple professional services
  const services = [
    {
      id: 'ai-assistant',
      title: 'AI Restaurant Assistant',
      description: 'Get instant restaurant advice and insights.',
      icon: <Brain size={48} strokeWidth={2} className="text-emerald-500" />,
      action: 'Start Chat',
      path: '/dashboard',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'community',
      title: 'Restaurant Owners Network',
      description: 'Connect with successful restaurant owners.',
      icon: <Users size={48} strokeWidth={2} className="text-blue-500" />,
      action: 'Join Network',
      path: '/dashboard',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'business-tools',
      title: 'Professional Restaurant Tools',
      description: 'Access our complete suite of management tools.',
      icon: <Building2 size={48} strokeWidth={2} className="text-purple-500" />,
      action: 'Get Started',
      path: '/register',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  // Simple smooth animations
  const smoothAnimations = {
    fadeOut: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    fadeIn: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: "easeOut"
      }
    })
  };

  // Simple card variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: i * 0.1,
        ease: "easeOut"
      }
    })
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Simple overlay */}
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Simple services display */}
          <AnimatePresence>
            {phase === 'icons-appear' && (
              <motion.div
                key="services"
                className="relative z-10 flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <motion.h2 
                  className="text-4xl font-bold text-white mb-8 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Choose Your Path
                </motion.h2>
                
                {/* Close button */}
                <motion.button
                  className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl"
                  onClick={() => onComplete && onComplete()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                >
                  ✕
                </motion.button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                  {services.map((service, index) => (
                    <Link key={service.id} href={service.path}>
                      <motion.div
                        className="group cursor-pointer"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="relative">
                          {/* Simple card */}
                          <motion.div 
                            className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 h-72 flex flex-col items-center justify-center group-hover:bg-white/15 transition-all duration-300"
                            whileHover={{ 
                              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                            }}
                          >
                            {/* Icon container */}
                            <motion.div 
                              className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              {service.icon}
                            </motion.div>
                            
                            {/* Title */}
                            <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">
                              {service.title}
                            </h3>
                            
                            {/* Description */}
                            <p className="text-white/70 text-center text-sm mb-6 leading-relaxed">
                              {service.description}
                            </p>

                            {/* Action button */}
                            <motion.button
                              className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 border-0 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300`}
                              whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {service.action}
                            </motion.button>
                          </motion.div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* Simple close button */}
                <motion.button
                  className="mt-8 px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => onComplete && onComplete()}
                  whileHover={{ scale: 1.05 }}
                >
                  Close
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExplosionAnimation;
