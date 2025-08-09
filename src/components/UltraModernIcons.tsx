'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface IconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'neon' | 'glass' | 'holographic';
  className?: string;
}

// Ultra-modern icon components with 2026 design trends
export const MenuIcon: React.FC<IconProps> = ({ size = 'md', variant = 'default', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'neon':
        return 'text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]';
      case 'glass':
        return 'text-slate-300 backdrop-blur-sm bg-slate-700/50 rounded-lg p-2';
      case 'holographic':
        return 'text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text';
      default:
        return 'text-green-400';
    }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${getVariantStyles()} ${className}`}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
      </svg>
    </motion.div>
  );
};

export const AnalyticsIcon: React.FC<IconProps> = ({ size = 'md', variant = 'default', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'neon':
        return 'text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]';
      case 'glass':
        return 'text-slate-300 backdrop-blur-sm bg-slate-700/50 rounded-lg p-2';
      case 'holographic':
        return 'text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${getVariantStyles()} ${className}`}
      whileHover={{ scale: 1.1, rotate: -5 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
      </svg>
    </motion.div>
  );
};

export const AIIcon: React.FC<IconProps> = ({ size = 'md', variant = 'default', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'neon':
        return 'text-purple-400 drop-shadow-[0_0_10px_rgba(147,51,234,0.5)]';
      case 'glass':
        return 'text-slate-300 backdrop-blur-sm bg-slate-700/50 rounded-lg p-2';
      case 'holographic':
        return 'text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text';
      default:
        return 'text-purple-400';
    }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${getVariantStyles()} ${className}`}
      whileHover={{ scale: 1.1, rotate: 10 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    </motion.div>
  );
};

export const MarketingIcon: React.FC<IconProps> = ({ size = 'md', variant = 'default', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'neon':
        return 'text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]';
      case 'glass':
        return 'text-slate-300 backdrop-blur-sm bg-slate-700/50 rounded-lg p-2';
      case 'holographic':
        return 'text-transparent bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400 bg-clip-text';
      default:
        return 'text-orange-400';
    }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${getVariantStyles()} ${className}`}
      whileHover={{ scale: 1.1, rotate: -10 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </motion.div>
  );
};

export const RestaurantIcon: React.FC<IconProps> = ({ size = 'md', variant = 'default', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'neon':
        return 'text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]';
      case 'glass':
        return 'text-slate-300 backdrop-blur-sm bg-slate-700/50 rounded-lg p-2';
      case 'holographic':
        return 'text-transparent bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text';
      default:
        return 'text-red-400';
    }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${getVariantStyles()} ${className}`}
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
      </svg>
    </motion.div>
  );
};

export const ForecastIcon: React.FC<IconProps> = ({ size = 'md', variant = 'default', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'neon':
        return 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]';
      case 'glass':
        return 'text-slate-300 backdrop-blur-sm bg-slate-700/50 rounded-lg p-2';
      case 'holographic':
        return 'text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text';
      default:
        return 'text-cyan-400';
    }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${getVariantStyles()} ${className}`}
      whileHover={{ scale: 1.1, rotate: -15 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>
    </motion.div>
  );
};

// Ultra-modern floating icon grid
export const FloatingIconGrid: React.FC = () => {
  const icons = [
    { Icon: MenuIcon, delay: 0 },
    { Icon: AnalyticsIcon, delay: 0.2 },
    { Icon: AIIcon, delay: 0.4 },
    { Icon: MarketingIcon, delay: 0.6 },
    { Icon: RestaurantIcon, delay: 0.8 },
    { Icon: ForecastIcon, delay: 1.0 }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {icons.map(({ Icon, delay }, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: `${20 + (index % 3) * 25}%`,
            top: `${15 + Math.floor(index / 3) * 30}%`
          }}
          initial={{ opacity: 0, y: 50, scale: 0 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay }}
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5
            }}
          >
            <Icon size="lg" variant="holographic" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

// Ultra-modern icon showcase
export const IconShowcase: React.FC = () => {
  const icons = [
    { Icon: MenuIcon, name: 'Menu Engineering', description: 'AI-powered menu optimization' },
    { Icon: AnalyticsIcon, name: 'Analytics', description: 'Real-time data insights' },
    { Icon: AIIcon, name: 'AI Assistant', description: 'Smart recommendations' },
    { Icon: MarketingIcon, name: 'Marketing', description: 'Campaign management' },
    { Icon: RestaurantIcon, name: 'Restaurant', description: 'Operations management' },
    { Icon: ForecastIcon, name: 'Forecasting', description: 'Predictive analytics' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {icons.map(({ Icon, name, description }, index) => (
        <motion.div
          key={index}
          className="group relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-green-500/30 transition-all duration-300 group-hover:bg-white/10"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <Icon size="xl" variant="neon" />
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">{name}</h3>
                <p className="text-white/60 text-sm">{description}</p>
              </div>
            </div>
            
            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ filter: 'blur(20px)' }}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default {
  MenuIcon,
  AnalyticsIcon,
  AIIcon,
  MarketingIcon,
  RestaurantIcon,
  ForecastIcon,
  FloatingIconGrid,
  IconShowcase
}; 