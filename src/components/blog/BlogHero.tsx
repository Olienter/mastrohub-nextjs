"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import AdvancedSearch from './AdvancedSearch';

export default function BlogHero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold mb-3"
          >
            Restaurant Insights & Strategies
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base text-blue-100 mb-4 max-w-xl mx-auto"
          >
            Expert analysis, industry trends, and actionable strategies for restaurant professionals
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-lg mx-auto"
          >
            <AdvancedSearch />
          </motion.div>
        </div>
      </div>
    </section>
  );
} 