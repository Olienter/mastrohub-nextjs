"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Filter, TrendingUp, Users, Award } from 'lucide-react';
import AdvancedSearch from './AdvancedSearch';

export default function EnhancedHero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-24">
      {/* Animated Background */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl" />
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-400/30 rounded-full blur-xl" />
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-8 mb-8 text-sm"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>10,000+ Restaurant Owners</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>45% Average Revenue Increase</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Expert Insights Weekly</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Restaurant Insights
            <br />
            <span className="text-blue-200">& Strategies</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            Expert analysis, industry trends, and actionable strategies for restaurant professionals
          </motion.p>
          
          {/* Enhanced Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <AdvancedSearch />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-4 mt-8"
          >
            <button className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors">
              <Search className="w-4 h-4" />
              Browse Articles
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-full transition-colors font-medium">
              <Filter className="w-4 h-4" />
              Get Free Analysis
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 