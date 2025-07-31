"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Calculator, ArrowRight } from 'lucide-react';

interface SubtleCTAProps {
  type: 'menu-analysis' | 'newsletter' | 'consultation';
}

export default function SubtleCTA({ type }: SubtleCTAProps) {
  const ctaConfig = {
    'menu-analysis': {
      title: 'Want to analyze your menu?',
      subtitle: 'Get your free analysis',
      button: 'Start Analysis',
      color: 'blue',
      icon: Calculator
    },
    'newsletter': {
      title: 'Stay updated with insights',
      subtitle: 'Get weekly strategies',
      button: 'Subscribe',
      color: 'purple',
      icon: Target
    },
    'consultation': {
      title: 'Need expert advice?',
      subtitle: 'Free 30-min consultation',
      button: 'Book Call',
      color: 'green',
      icon: Target
    }
  };

  const config = ctaConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-l-4 border-${config.color}-500 bg-${config.color}-50 dark:bg-${config.color}-900/20 p-4 my-6 rounded-r-lg`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 text-${config.color}-600 dark:text-${config.color}-400 mt-0.5`} />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            {config.title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
            {config.subtitle}
          </p>
          <button className={`text-${config.color}-600 dark:text-${config.color}-400 text-sm font-medium hover:underline flex items-center gap-1`}>
            {config.button}
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
} 