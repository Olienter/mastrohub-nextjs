'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { notificationService } from '@/lib/notifications';
import NotificationCenter from './NotificationCenter';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  // Load unread count
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const count = await notificationService.getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    };

    loadUnreadCount();

    // Subscribe to real-time notifications
    const unsubscribe = notificationService.subscribe((newNotification) => {
      if (!newNotification.read) {
        setUnreadCount(prev => prev + 1);
        setHasNewNotifications(true);
        
        // Reset the new notification indicator after 3 seconds
        setTimeout(() => setHasNewNotifications(false), 3000);
      }
    });

    return unsubscribe;
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewNotifications(false);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={handleToggle}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          
          {/* Unread count badge */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
          
          {/* New notification indicator */}
          <AnimatePresence>
            {hasNewNotifications && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"
              />
            )}
          </AnimatePresence>
        </button>
      </div>

      <NotificationCenter isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
