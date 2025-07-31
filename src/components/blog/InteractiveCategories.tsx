"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Award, Utensils, Users, Megaphone, Building2, Leaf, Zap, TrendingUp } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: any;
  count: number;
  color: string;
  gradient: string;
}

interface InteractiveCategoriesProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

export default function InteractiveCategories({ categories, selectedCategory, onCategorySelect }: InteractiveCategoriesProps) {
  return (
    <section className="py-8 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Explore Our Content
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Discover insights tailored to your restaurant needs
          </p>
        </motion.div>
        
        <nav aria-label="Categories" className="flex flex-wrap gap-3 justify-center">
          <AnimatePresence>
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCategorySelect(category.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 ${
                    isSelected 
                      ? `${category.gradient} text-white shadow-lg` 
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                  <motion.span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300'
                    }`}
                    animate={{ scale: isSelected ? 1.1 : 1 }}
                  >
                    {category.count}
                  </motion.span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </nav>
      </div>
    </section>
  );
} 