"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Target, Award, Star } from 'lucide-react';
import { UserProgress, BadgeEngine } from '@/lib/badges';
import { useAuth } from '@/contexts/AuthContext';

interface ProgressTrackerProps {
  userId?: string;
  className?: string;
}

export default function ProgressTracker({ userId, className = '' }: ProgressTrackerProps) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [levelProgress, setLevelProgress] = useState({ current: 1, next: 2, progress: 0 });

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (!targetUserId) return;

    const loadProgress = async () => {
      try {
        const userProgress = await BadgeEngine.getUserProgress(targetUserId);
        if (userProgress) {
          setProgress(userProgress);
          const levelData = BadgeEngine.getLevelProgress(userProgress.total_points);
          setLevelProgress(levelData);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [targetUserId]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mastroCyan-400"></div>
      </div>
    );
  }

  if (!targetUserId) {
    return (
      <div className={`text-center p-8 text-slate-400 ${className}`}>
        Please log in to view progress
      </div>
    );
  }

  if (!progress) {
    return (
      <div className={`text-center p-8 text-slate-400 ${className}`}>
        No progress data available
      </div>
    );
  }

  const stats = [
    {
      label: 'Articles',
      value: progress.articles_count,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Comments',
      value: progress.comments_count,
      icon: <Target className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Reactions',
      value: progress.reactions_given,
      icon: <Award className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Bookmarks',
      value: progress.bookmarks_count,
      icon: <Star className="w-5 h-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Level Progress */}
      <div className="bg-gradient-to-r from-mastroCyan-500 to-mastroCyan-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Level {levelProgress.current}</h2>
            <p className="text-slate-200">Progress to Level {levelProgress.next}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{progress.total_points}</div>
            <div className="text-sm text-slate-200">Total Points</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(levelProgress.progress)}%</span>
          </div>
          <div className="w-full bg-mastroCyan-300 bg-opacity-30 rounded-full h-3">
            <motion.div
              className="bg-slate-700 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/80 rounded-lg p-4 border border-slate-700/50 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Activity Summary */}
      <div className="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold mb-4">Activity Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Days Active</span>
            <span className="font-medium">{progress.days_active} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Reactions Received</span>
            <span className="font-medium">{progress.reactions_received}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Profile Complete</span>
            <span className={`font-medium ${progress.profile_complete ? 'text-green-600' : 'text-slate-400'}`}>
              {progress.profile_complete ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Last Activity</span>
            <span className="font-medium text-sm">
              {new Date(progress.last_activity).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Achievement Preview */}
      <div className="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
        <div className="space-y-3">
          {progress.articles_count >= 1 && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="text-2xl">📝</div>
              <div>
                <div className="font-medium text-green-800">First Steps</div>
                <div className="text-sm text-green-600">Published your first article</div>
              </div>
            </div>
          )}
          {progress.articles_count >= 5 && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl">✍️</div>
              <div>
                <div className="font-medium text-blue-800">Regular Writer</div>
                <div className="text-sm text-blue-600">Published 5 articles</div>
              </div>
            </div>
          )}
          {progress.comments_count >= 10 && (
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl">💬</div>
              <div>
                <div className="font-medium text-orange-800">Engaged Reader</div>
                <div className="text-sm text-orange-600">Left 10 comments</div>
              </div>
            </div>
          )}
          {progress.reactions_given >= 50 && (
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <div className="text-2xl">❤️</div>
              <div>
                <div className="font-medium text-red-800">Reactive</div>
                <div className="text-sm text-red-600">Given 50 reactions</div>
              </div>
            </div>
          )}
          {progress.articles_count === 0 && progress.comments_count === 0 && (
            <div className="text-center py-8 text-slate-400">
              <div className="text-4xl mb-2">🎯</div>
              <div className="font-medium">No achievements yet</div>
              <div className="text-sm">Start engaging with the community to earn badges!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 