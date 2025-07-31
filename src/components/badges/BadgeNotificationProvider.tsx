"use client";
import React, { createContext, useContext, useEffect } from 'react';
import { useBadgeNotifications } from '@/hooks/useBadges';
import { BadgeNotificationContainer } from './BadgeNotification';
import { useAuth } from '@/contexts/AuthContext';
import { BadgeEngine } from '@/lib/badges';

interface BadgeNotificationContextType {
  addNotification: (badge: any) => void;
  removeNotification: (id: string) => void;
}

const BadgeNotificationContext = createContext<BadgeNotificationContextType | undefined>(undefined);

export function useBadgeNotificationContext() {
  const context = useContext(BadgeNotificationContext);
  if (!context) {
    // Return default values instead of throwing error
    return {
      addNotification: () => {},
      removeNotification: () => {},
    };
  }
  return context;
}

interface BadgeNotificationProviderProps {
  children: React.ReactNode;
}

export default function BadgeNotificationProvider({ children }: BadgeNotificationProviderProps) {
  const { user } = useAuth();
  const { notifications, addNotification, removeNotification } = useBadgeNotifications();

  // Check for new badges periodically
  useEffect(() => {
    if (!user?.id) return;

    const checkForNewBadges = async () => {
      try {
        const newBadges = await BadgeEngine.checkBadges(user.id);
        newBadges.forEach(badge => {
          addNotification(badge);
        });
      } catch (error) {
        console.error('Error checking for new badges:', error);
      }
    };

    // Check immediately on mount
    checkForNewBadges();

    // Set up periodic checking (every 30 seconds)
    const interval = setInterval(checkForNewBadges, 30000);

    return () => clearInterval(interval);
  }, [user?.id, addNotification]);

  const contextValue: BadgeNotificationContextType = {
    addNotification,
    removeNotification
  };

  return (
    <BadgeNotificationContext.Provider value={contextValue}>
      {children}
      <BadgeNotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </BadgeNotificationContext.Provider>
  );
} 