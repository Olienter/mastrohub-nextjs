import { useState, useEffect, useCallback } from 'react';
import { Badge, UserBadge, UserProgress, BadgeEngine } from '@/lib/badges';
import { useAuth } from '@/contexts/AuthContext';

interface UseBadgesReturn {
  badges: Badge[];
  userBadges: UserBadge[];
  userProgress: UserProgress | null;
  loading: boolean;
  error: string | null;
  checkBadges: () => Promise<Badge[]>;
  updateProgress: (updates: Partial<UserProgress>) => Promise<void>;
  refreshBadges: () => Promise<void>;
  refreshProgress: () => Promise<void>;
}

export function useBadges(userId?: string): UseBadgesReturn {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;

  const loadBadges = useCallback(async () => {
    if (!targetUserId) return;

    try {
      setLoading(true);
      setError(null);

      const [allBadges, userUnlockedBadges, progress] = await Promise.all([
        BadgeEngine.getBadges(),
        BadgeEngine.getUserBadges(targetUserId),
        BadgeEngine.getUserProgress(targetUserId)
      ]);

      setBadges(allBadges);
      setUserBadges(userUnlockedBadges);
      setUserProgress(progress);
    } catch (err) {
      console.error('Error loading badges:', err);
      setError('Failed to load badges');
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  const checkBadges = useCallback(async (): Promise<Badge[]> => {
    if (!targetUserId) return [];

    try {
      const newlyUnlocked = await BadgeEngine.checkBadges(targetUserId);
      
      if (newlyUnlocked.length > 0) {
        // Refresh user badges after new unlocks
        const updatedUserBadges = await BadgeEngine.getUserBadges(targetUserId);
        setUserBadges(updatedUserBadges);
      }

      return newlyUnlocked;
    } catch (err) {
      console.error('Error checking badges:', err);
      setError('Failed to check badges');
      return [];
    }
  }, [targetUserId]);

  const updateProgress = useCallback(async (updates: Partial<UserProgress>): Promise<void> => {
    if (!targetUserId) return;

    try {
      await BadgeEngine.updateUserProgress(targetUserId, updates);
      
      // Refresh progress data
      const updatedProgress = await BadgeEngine.getUserProgress(targetUserId);
      setUserProgress(updatedProgress);
    } catch (err) {
      console.error('Error updating progress:', err);
      setError('Failed to update progress');
    }
  }, [targetUserId]);

  const refreshBadges = useCallback(async (): Promise<void> => {
    if (!targetUserId) return;

    try {
      const userUnlockedBadges = await BadgeEngine.getUserBadges(targetUserId);
      setUserBadges(userUnlockedBadges);
    } catch (err) {
      console.error('Error refreshing badges:', err);
      setError('Failed to refresh badges');
    }
  }, [targetUserId]);

  const refreshProgress = useCallback(async (): Promise<void> => {
    if (!targetUserId) return;

    try {
      const progress = await BadgeEngine.getUserProgress(targetUserId);
      setUserProgress(progress);
    } catch (err) {
      console.error('Error refreshing progress:', err);
      setError('Failed to refresh progress');
    }
  }, [targetUserId]);

  useEffect(() => {
    loadBadges();
  }, [loadBadges]);

  return {
    badges,
    userBadges,
    userProgress,
    loading,
    error,
    checkBadges,
    updateProgress,
    refreshBadges,
    refreshProgress
  };
}

// Hook for badge notifications
export function useBadgeNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    badge: Badge;
    timestamp: Date;
  }>>([]);

  const addNotification = useCallback((badge: Badge) => {
    const notification = {
      id: Date.now().toString(),
      badge,
      timestamp: new Date()
    };

    setNotifications(prev => [notification, ...prev]);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification
  };
}

// Hook for badge progress tracking
export function useBadgeProgress(userId?: string) {
  const { userProgress, updateProgress } = useBadges(userId);

  const incrementProgress = useCallback(async (
    type: 'articles' | 'comments' | 'reactions' | 'bookmarks',
    amount: number = 1
  ) => {
    if (!userProgress) return;

    const updates: Partial<UserProgress> = {};
    
    switch (type) {
      case 'articles':
        updates.articles_count = userProgress.articles_count + amount;
        break;
      case 'comments':
        updates.comments_count = userProgress.comments_count + amount;
        break;
      case 'reactions':
        updates.reactions_given = userProgress.reactions_given + amount;
        break;
      case 'bookmarks':
        updates.bookmarks_count = userProgress.bookmarks_count + amount;
        break;
    }

    await updateProgress(updates);
  }, [userProgress, updateProgress]);

  const setProfileComplete = useCallback(async (complete: boolean) => {
    await updateProgress({ profile_complete: complete });
  }, [updateProgress]);

  return {
    userProgress,
    incrementProgress,
    setProfileComplete
  };
} 