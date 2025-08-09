'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  Filter, 
  Settings, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Clock
} from 'lucide-react';
import { 
  Notification, 
  notificationService, 
  formatNotificationTime, 
  getNotificationIcon, 
  getPriorityColor 
} from '@/lib/notifications';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Notification['category'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Notification['priority'] | 'all'>('all');

  // Load notifications
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const [notificationsData, unreadCountData] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getUnreadCount()
      ]);
      setNotifications(notificationsData);
      setUnreadCount(unreadCountData);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to real-time notifications
  useEffect(() => {
    const unsubscribe = notificationService.subscribe((newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
      if (!newNotification.read) {
        setUnreadCount(prev => prev + 1);
      }
    });

    loadNotifications();

    return unsubscribe;
  }, [loadNotifications]);

  // Mark notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete notification
  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Reset notifications (delete all)
  const handleResetNotifications = async () => {
    if (confirm('Are you sure you want to reset all notifications? This action cannot be undone.')) {
      try {
        await notificationService.resetNotifications();
        await loadNotifications();
        alert('All notifications have been reset.');
      } catch (error) {
        console.error('Error resetting notifications:', error);
        alert('Failed to reset notifications.');
      }
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'read' && !notification.read) return false;
    if (categoryFilter !== 'all' && notification.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && notification.priority !== priorityFilter) return false;
    return true;
  });

  const categories: { value: Notification['category'] | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'orders', label: 'Orders' },
    { value: 'suppliers', label: 'Suppliers' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'system', label: 'System' }
  ];

  const priorities: { value: Notification['priority'] | 'all'; label: string }[] = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-end p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  title="Mark all as read"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetNotifications}
                  disabled={loading}
                  className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50"
                  title="Reset notifications"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={loadNotifications}
                  disabled={loading}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-gray-200 space-y-3">
              <div className="flex space-x-2">
                {['all', 'unread', 'read'].map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption as any)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filter === filterOption
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading notifications...
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No notifications found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-xs text-gray-400 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatNotificationTime(notification.timestamp)}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                                  {notification.priority}
                                </span>
                                <span className="text-xs text-gray-500 capitalize">
                                  {notification.category}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-2">
                              {notification.action && (
                                <button
                                  onClick={() => window.location.href = notification.action!.url}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title={notification.action.label}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  title="Mark as read"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="p-1 text-gray-400 hover:text-red-600"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}</span>
                <span>{unreadCount} unread</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
