"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Award, Crown } from 'lucide-react';
import { Badge, UserBadge, BadgeEngine } from '@/lib/badges';
import { useAuth } from '@/contexts/AuthContext';

interface BadgeDisplayProps {
  userId?: string;
  showProgress?: boolean;
  showUnlockedOnly?: boolean;
  className?: string;
}

const rarityIcons = {
  common: <Star className="w-4 h-4 text-slate-400" />,
  rare: <Award className="w-4 h-4 text-blue-400" />,
  epic: <Trophy className="w-4 h-4 text-purple-400" />,
  legendary: <Crown className="w-4 h-4 text-yellow-400" />
};

const rarityColors = {
  common: 'border-slate-600/50 bg-slate-700/50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50',
  legendary: 'border-yellow-300 bg-yellow-50'
};

export default function BadgeDisplay({ 
  userId, 
  showProgress = true, 
  showUnlockedOnly = false,
  className = '' 
}: BadgeDisplayProps) {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (!targetUserId) return;

    const loadBadges = async () => {
      try {
        const [allBadges, userUnlockedBadges] = await Promise.all([
          BadgeEngine.getBadges(),
          BadgeEngine.getUserBadges(targetUserId)
        ]);

        setBadges(allBadges);
        setUserBadges(userUnlockedBadges);
      } catch (error) {
        console.error('Error loading badges:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBadges();
  }, [targetUserId]);

  const getUnlockedBadge = (badgeId: string) => {
    return userBadges.find(ub => ub.badge_id === badgeId);
  };

  const isUnlocked = (badgeId: string) => {
    return userBadges.some(ub => ub.badge_id === badgeId);
  };

  const filteredBadges = showUnlockedOnly 
    ? badges.filter(badge => isUnlocked(badge.id))
    : badges;

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
        Please log in to view badges
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredBadges.map((badge) => {
            const unlockedBadge = getUnlockedBadge(badge.id);
            const unlocked = isUnlocked(badge.id);

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                className={`
                  relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${unlocked ? rarityColors[badge.rarity] : 'border-slate-700/50 bg-slate-700/50 opacity-60'}
                  ${unlocked ? 'hover:shadow-lg' : 'hover:opacity-80'}
                `}
                onClick={() => setSelectedBadge(badge)}
              >
                {/* Badge Icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl">{badge.icon}</div>
                  {rarityIcons[badge.rarity]}
                </div>

                {/* Badge Info */}
                <div className="space-y-2">
                  <h3 className={`font-semibold text-sm ${unlocked ? 'text-white' : 'text-slate-400'}`}>
                    {badge.name}
                  </h3>
                  <p className={`text-xs ${unlocked ? 'text-slate-200' : 'text-slate-400'}`}>
                    {badge.description}
                  </p>
                </div>

                {/* Progress Bar */}
                {showProgress && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{unlockedBadge?.progress || 0}/{badge.requirements[0]?.count || 1}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <motion.div
                        className="bg-mastroCyan-400 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: unlocked 
                            ? '100%' 
                            : `${Math.min((unlockedBadge?.progress || 0) / (badge.requirements[0]?.count || 1) * 100, 100)}%` 
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}

                {/* Unlocked Indicator */}
                {unlocked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}

                {/* Points */}
                <div className="absolute top-2 left-2">
                  <span className="bg-mastroCyan-100 text-mastroCyan-800 text-xs px-2 py-1 rounded-full">
                    +{badge.points}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800/80 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{selectedBadge.icon}</div>
                <h2 className="text-xl font-bold mb-2">{selectedBadge.name}</h2>
                <p className="text-slate-300 mb-4">{selectedBadge.description}</p>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  {rarityIcons[selectedBadge.rarity]}
                  <span className="text-sm font-medium capitalize">{selectedBadge.rarity}</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="capitalize">{selectedBadge.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Points:</span>
                    <span>+{selectedBadge.points}</span>
                  </div>
                  {getUnlockedBadge(selectedBadge.id) && (
                    <div className="flex justify-between">
                      <span>Unlocked:</span>
                      <span>{new Date(getUnlockedBadge(selectedBadge.id)!.unlocked_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedBadge(null)}
                  className="mt-6 px-4 py-2 bg-slate-700/50 text-slate-200 rounded-lg hover:bg-slate-700/70 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 