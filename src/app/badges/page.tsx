"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Star, Award } from 'lucide-react';
import BadgeDisplay from '@/components/badges/BadgeDisplay';
import ProgressTracker from '@/components/badges/ProgressTracker';
import { BadgeCategory } from '@/lib/badges';

export default function BadgesPage() {
  const [activeTab, setActiveTab] = useState<'badges' | 'progress'>('badges');
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all');

  const categories: { value: BadgeCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All Badges', icon: <Trophy className="w-4 h-4" /> },
    { value: 'content', label: 'Content', icon: <Target className="w-4 h-4" /> },
    { value: 'engagement', label: 'Engagement', icon: <Star className="w-4 h-4" /> },
    { value: 'community', label: 'Community', icon: <Award className="w-4 h-4" /> },
    { value: 'achievement', label: 'Achievement', icon: <Trophy className="w-4 h-4" /> },
    { value: 'special', label: 'Special', icon: <Star className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-mastroCyan-500 to-mastroCyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Badge System</h1>
            <p className="text-xl text-mastroCyan-100 max-w-2xl mx-auto">
              Earn badges by engaging with the community. Track your progress and unlock achievements as you contribute.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex space-x-1 bg-slate-700/50 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'badges'
                  ? 'bg-mastroCyan-500 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Badges
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'progress'
                  ? 'bg-mastroCyan-500 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Progress
            </button>
          </div>

          {activeTab === 'badges' && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-mastroCyan-500 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:text-white border border-slate-600/50'
                  }`}
                >
                  {category.icon}
                  {category.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'badges' ? (
            <div className="space-y-8">
              {/* Badge Overview */}
              <div className="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50">
                <h2 className="text-2xl font-bold mb-4">Badge Collection</h2>
                <p className="text-slate-300 mb-6">
                  {selectedCategory === 'all' 
                    ? 'Browse all available badges and track your progress towards unlocking them.'
                    : `Browse ${selectedCategory} badges and track your progress towards unlocking them.`
                  }
                </p>
                
                <BadgeDisplay 
                  showProgress={true}
                  showUnlockedOnly={false}
                  className=""
                />
              </div>

              {/* Badge Categories Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Content Badges</h3>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Earn badges by creating and publishing articles. From your first article to becoming a prolific writer.
                  </p>
                </div>

                <div className="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Star className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Engagement Badges</h3>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Show your engagement by commenting, reacting, and bookmarking content from the community.
                  </p>
                </div>

                <div className="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Community Badges</h3>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Contribute significantly to the community and earn recognition for your valuable contributions.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <ProgressTracker />
              
              {/* Tips Section */}
              <div className="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50">
                <h2 className="text-2xl font-bold mb-4">How to Earn Badges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-mastroCyan-600">Content Creation</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• Write and publish your first article</li>
                      <li>• Reach 5 published articles</li>
                      <li>• Achieve 10 published articles</li>
                      <li>• Complete your profile information</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-mastroCyan-600">Community Engagement</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• Leave thoughtful comments</li>
                      <li>• React to articles and comments</li>
                      <li>• Bookmark interesting content</li>
                      <li>• Stay active for consecutive days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 