"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ThemeToggle({ 
  variant = 'button', 
  size = 'md',
  className = '' 
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme, isSystem } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    if (variant === 'dropdown') {
      setIsOpen(false);
    }
  };

  const getCurrentIcon = () => {
    if (isSystem) {
      return <Monitor size={iconSizes[size]} />;
    }
    return resolvedTheme === 'dark' ? 
      <Moon size={iconSizes[size]} /> : 
      <Sun size={iconSizes[size]} />;
  };

  if (variant === 'button') {
    return (
      <motion.button
        onClick={() => {
          if (isSystem) {
            handleThemeChange('light');
          } else if (resolvedTheme === 'light') {
            handleThemeChange('dark');
          } else {
            handleThemeChange('system');
          }
        }}
        className={`${sizeClasses[size]} ${className} rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-700 dark:text-gray-300`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={`Current: ${isSystem ? 'System' : resolvedTheme === 'dark' ? 'Dark' : 'Light'}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {getCurrentIcon()}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`${sizeClasses[size]} rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-700 dark:text-gray-300`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {getCurrentIcon()}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
          >
            <div className="px-2 py-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-1">
                Theme
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleThemeChange('light')}
                className={`w-full px-3 py-2 text-left flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  theme === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Sun size={16} />
                <span className="text-sm">Light</span>
                {theme === 'light' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
                  />
                )}
              </button>

              <button
                onClick={() => handleThemeChange('dark')}
                className={`w-full px-3 py-2 text-left flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  theme === 'dark' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Moon size={16} />
                <span className="text-sm">Dark</span>
                {theme === 'dark' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
                  />
                )}
              </button>

              <button
                onClick={() => handleThemeChange('system')}
                className={`w-full px-3 py-2 text-left flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  theme === 'system' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Monitor size={16} />
                <span className="text-sm">System</span>
                {theme === 'system' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
                  />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 