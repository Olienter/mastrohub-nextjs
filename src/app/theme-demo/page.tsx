"use client";

import React from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Theme Toggle Demo
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Test the theme toggle functionality with different variants and sizes
            </p>
          </div>

          {/* Theme Toggle Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Button Variant */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Button Variant
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Simple toggle button that cycles through light → dark → system
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Small</p>
                  <ThemeToggle variant="button" size="sm" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Medium</p>
                  <ThemeToggle variant="button" size="md" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Large</p>
                  <ThemeToggle variant="button" size="lg" />
                </div>
              </div>
            </div>

            {/* Dropdown Variant */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Dropdown Variant
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Dropdown menu with all theme options
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Small</p>
                  <ThemeToggle variant="dropdown" size="sm" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Medium</p>
                  <ThemeToggle variant="dropdown" size="md" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Large</p>
                  <ThemeToggle variant="dropdown" size="lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Examples */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Card Example
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                This card demonstrates how content looks in different themes.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Colored Card
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                Cards with custom colors also adapt to theme changes.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Gradient Card
              </h3>
              <p className="text-white/90">
                Gradient backgrounds maintain their appearance across themes.
              </p>
            </div>
          </div>

          {/* Form Elements */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Form Elements
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Input Field
                </label>
                <input
                  type="text"
                  placeholder="Type something..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Dropdown
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div className="bg-gray-900 dark:bg-gray-950 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Code Example
            </h2>
            <pre className="text-green-400 overflow-x-auto">
              <code>{`// Theme Toggle Usage
import ThemeToggle from '@/components/ui/ThemeToggle';

// Button variant
<ThemeToggle variant="button" size="md" />

// Dropdown variant
<ThemeToggle variant="dropdown" size="lg" />

// With custom className
<ThemeToggle className="custom-styles" />`}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 