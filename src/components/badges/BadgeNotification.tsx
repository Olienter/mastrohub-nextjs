"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Star, Award, Crown } from 'lucide-react';
import { Badge } from '@/lib/badges';

interface BadgeNotificationProps {
  badge: Badge;
  onClose: () => void;
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

export default function BadgeNotification({ badge, onClose, className = '' }: BadgeNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`max-w-sm w-full bg-slate-800/80 rounded-lg shadow-lg border-2 ${rarityColors[badge.rarity]} ${className}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{badge.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-white">{badge.name}</h3>
                {rarityIcons[badge.rarity]}
              </div>
              <p className="text-sm text-slate-300 mb-2">{badge.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 capitalize">{badge.rarity}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-400 capitalize">{badge.category}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-mastroCyan-600">+{badge.points} points</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Unlocked!</span>
            <span>100%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className="bg-mastroCyan-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Celebration Animation */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full"
            animate={{
              y: [-10, -30, -50],
              opacity: [1, 1, 0],
              scale: [1, 1.5, 2]
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <motion.div
            className="absolute top-0 left-1/2 w-2 h-2 bg-mastroCyan-400 rounded-full"
            animate={{
              y: [-10, -30, -50],
              opacity: [1, 1, 0],
              scale: [1, 1.5, 2]
            }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          />
          <motion.div
            className="absolute top-0 left-3/4 w-2 h-2 bg-purple-400 rounded-full"
            animate={{
              y: [-10, -30, -50],
              opacity: [1, 1, 0],
              scale: [1, 1.5, 2]
            }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Container component for multiple notifications
interface BadgeNotificationContainerProps {
  notifications: Array<{
    id: string;
    badge: Badge;
    timestamp: Date;
  }>;
  onRemove: (id: string) => void;
  className?: string;
}

export function BadgeNotificationContainer({ 
  notifications, 
  onRemove, 
  className = '' 
}: BadgeNotificationContainerProps) {
  return (
    <div className={`fixed top-4 right-4 z-50 space-y-2 ${className}`}>
      <AnimatePresence>
        {notifications.map((notification) => (
          <BadgeNotification
            key={notification.id}
            badge={notification.badge}
            onClose={() => onRemove(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
} 