"use client";

import React from 'react';
import { motion } from 'framer-motion';
import BookmarksList from '@/components/community/BookmarksList';

export default function BookmarksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white dark:text-white mb-4">
              My Bookmarks
            </h1>
            <p className="text-lg text-slate-300 dark:text-slate-300">
              Your saved articles and favorite content
            </p>
          </div>

          {/* Bookmarks List */}
          <BookmarksList />
        </motion.div>
      </div>
    </div>
  );
} 