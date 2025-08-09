"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Crown, Zap } from 'lucide-react';
import BadgeDisplay from '@/components/badges/BadgeDisplay';
import ProgressTracker from '@/components/badges/ProgressTracker';
import { BadgeEngine, BADGES } from '@/lib/badges';

export default function BadgeDemoPage() {
  const [demoMode, setDemoMode] = useState<'view' | 'interactive'>('view');
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const demoBadges = BADGES.slice(0, 6); // Show first 6 badges for demo

  const rarityStats = {
    common: demoBadges.filter(b => b.rarity === 'common').length,
    rare: demoBadges.filter(b => b.rarity === 'rare').length,
    epic: demoBadges.filter(b => b.rarity === 'epic').length,
    legendary: demoBadges.filter(b => b.rarity === 'legendary').length
  };

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
            <h1 className="text-4xl font-bold mb-4">Badge System Demo</h1>
            <p className="text-xl text-mastroCyan-100 max-w-2xl mx-auto">
              Explore the badge system functionality with interactive examples and mock data.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Controls */}
        <div className="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Demo Controls</h2>
              <p className="text-slate-300">Switch between view modes to explore different aspects of the badge system.</p>
            </div>
            
            <div className="flex space-x-1 bg-slate-700/50 rounded-lg p-1">
              <button
                onClick={() => setDemoMode('view')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  demoMode === 'view'
                    ? 'bg-mastroCyan-500 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                View Mode
              </button>
              <button
                onClick={() => setDemoMode('interactive')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  demoMode === 'interactive'
                    ? 'bg-mastroCyan-500 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Interactive
              </button>
            </div>
          </div>
        </div>

        {/* Badge System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Badge Types</h3>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Common:</span>
                <span className="font-medium">{rarityStats.common}</span>
              </div>
              <div className="flex justify-between">
                <span>Rare:</span>
                <span className="font-medium">{rarityStats.rare}</span>
              </div>
              <div className="flex justify-between">
                <span>Epic:</span>
                <span className="font-medium">{rarityStats.epic}</span>
              </div>
              <div className="flex justify-between">
                <span>Legendary:</span>
                <span className="font-medium">{rarityStats.legendary}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">Categories</h3>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Content:</span>
                <span className="font-medium">{demoBadges.filter(b => b.category === 'content').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Engagement:</span>
                <span className="font-medium">{demoBadges.filter(b => b.category === 'engagement').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Community:</span>
                <span className="font-medium">{demoBadges.filter(b => b.category === 'community').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Special:</span>
                <span className="font-medium">{demoBadges.filter(b => b.category === 'special').length}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Features</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Progress tracking</li>
              <li>• Level system</li>
              <li>• Achievement notifications</li>
              <li>• Gamification</li>
              <li>• Community engagement</li>
            </ul>
          </div>
        </div>

        {/* Interactive Demo */}
        {demoMode === 'interactive' && (
          <div className="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50 mb-8">
            <h2 className="text-xl font-bold mb-4">Interactive Badge Explorer</h2>
            <p className="text-slate-300 mb-6">
              Click on badges to see detailed information and requirements.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoBadges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.05 }}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${selectedBadge === badge.id 
                      ? 'border-mastroCyan-500 bg-mastroCyan-50' 
                      : 'border-slate-700/50 bg-slate-700/50'
                    }
                  `}
                  onClick={() => setSelectedBadge(selectedBadge === badge.id ? null : badge.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl">{badge.icon}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      badge.rarity === 'common' ? 'bg-slate-700/50 text-slate-300' :
                      badge.rarity === 'rare' ? 'bg-blue-100 text-blue-600' :
                      badge.rarity === 'epic' ? 'bg-purple-100 text-purple-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {badge.rarity}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-sm mb-2">{badge.name}</h3>
                  <p className="text-xs text-slate-300 mb-3">{badge.description}</p>
                  
                  <div className="text-xs text-slate-400">
                    <div className="flex justify-between mb-1">
                      <span>Points:</span>
                      <span>+{badge.points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="capitalize">{badge.category}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedBadge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-mastroCyan-50 rounded-lg border border-mastroCyan-200"
              >
                <h3 className="font-semibold mb-2">Badge Requirements</h3>
                <div className="space-y-2 text-sm">
                  {BADGES.find(b => b.id === selectedBadge)?.requirements.map((req, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="capitalize">{req.type}:</span>
                      <span>{req.count} {req.condition || 'at least'}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Badge Display Demo */}
        <div className="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50 mb-8">
          <h2 className="text-xl font-bold mb-4">Badge Display Component</h2>
          <p className="text-slate-300 mb-6">
            This shows how badges appear in the actual application with progress tracking and unlock status.
          </p>
          
          <BadgeDisplay 
            showProgress={true}
            showUnlockedOnly={false}
            className=""
          />
        </div>

        {/* Progress Tracker Demo */}
        <div className="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50 mb-8">
          <h2 className="text-xl font-bold mb-4">Progress Tracker Component</h2>
          <p className="text-slate-300 mb-6">
            Track user progress, levels, and achievements with visual indicators and statistics.
          </p>
          
          <ProgressTracker className="" />
        </div>

        {/* Code Examples */}
        <div className="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50">
          <h2 className="text-xl font-bold mb-4">Implementation Examples</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Badge Engine Usage</h3>
              <pre className="bg-slate-700/50 p-4 rounded-lg text-sm overflow-x-auto">
{`// Check and award badges
const newBadges = await BadgeEngine.checkBadges(userId);

// Get user progress
const progress = await BadgeEngine.getUserProgress(userId);

// Calculate level
const level = BadgeEngine.calculateLevel(progress.total_points);`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Component Integration</h3>
              <pre className="bg-slate-700/50 p-4 rounded-lg text-sm overflow-x-auto">
{`// Display badges
<BadgeDisplay 
  showProgress={true}
  showUnlockedOnly={false}
/>

// Track progress
<ProgressTracker 
  userId={user.id}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 