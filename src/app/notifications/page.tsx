'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import {
  Bell, 
  Settings, 
  Filter, 
  Search, 
  RefreshCw, 
  Trash2, 
  Check,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Clock,
  Mail,
  Smartphone,
  Volume2
} from 'lucide-react';
import { 
  Notification, 
  notificationService, 
  formatNotificationTime, 
  getNotificationIcon, 
  getPriorityColor,
  NotificationSettings 
} from '@/lib/notifications';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Notification['category'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Notification['priority'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadNotifications();
    loadSettings();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await notificationService.getNotificationSettings('current-user');
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      await notificationService.updateNotificationSettings('current-user', newSettings);
      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'read' && !notification.read) return false;
    if (categoryFilter !== 'all' && notification.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && notification.priority !== priorityFilter) return false;
    if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'orders', label: 'Orders' },
    { value: 'suppliers', label: 'Suppliers' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'system', label: 'System' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/80 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                <p className="text-slate-300 mt-1">Manage your notifications and preferences</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                  title="Notification Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={loadNotifications}
                  disabled={loading}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="bg-slate-800/80 rounded-lg shadow-sm border border-slate-700/50 p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filter buttons */}
                <div className="flex space-x-2">
                  {['all', 'unread', 'read'].map((filterOption) => (
                    <button
                      key={filterOption}
                      onClick={() => setFilter(filterOption as any)}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                        filter === filterOption
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/70'
                      }`}
                    >
                      {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="px-4 py-2 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="px-4 py-2 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark All as Read
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="bg-slate-800/80 rounded-lg shadow-sm border border-slate-700/50">
              {loading ? (
                <div className="p-8 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-400">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-medium text-white mb-2">No notifications found</h3>
                  <p className="text-slate-400">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 hover:bg-slate-700/50 transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-white">
                                {notification.title}
                              </h3>
                              <p className="text-slate-300 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-4 mt-3">
                                <span className="text-sm text-slate-400 flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {formatNotificationTime(notification.timestamp)}
                                </span>
                                <span className={`text-sm px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                                  {notification.priority}
                                </span>
                                <span className="text-sm text-slate-400 capitalize">
                                  {notification.category}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              {notification.action && (
                                <button
                                  onClick={() => window.location.href = notification.action!.url}
                                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                  title={notification.action.label}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors"
                                  title="Mark as read"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
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
          </div>

          {/* Settings Sidebar */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {showSettings && settings && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-slate-800/80 rounded-lg shadow-sm border border-slate-700/50 p-6"
                >
                  <h3 className="text-lg font-medium text-white mb-4">Notification Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Notification Methods</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.email}
                            onChange={(e) => handleUpdateSettings({ email: e.target.checked })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <Mail className="w-4 h-4 ml-2 text-slate-400" />
                          <span className="ml-2 text-sm text-slate-300">Email</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.push}
                            onChange={(e) => handleUpdateSettings({ push: e.target.checked })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <Smartphone className="w-4 h-4 ml-2 text-slate-400" />
                          <span className="ml-2 text-sm text-slate-300">Push</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.inApp}
                            onChange={(e) => handleUpdateSettings({ inApp: e.target.checked })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <Volume2 className="w-4 h-4 ml-2 text-slate-400" />
                          <span className="ml-2 text-sm text-slate-300">In-App</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Categories</h4>
                      <div className="space-y-2">
                        {Object.entries(settings.categories).map(([category, enabled]) => (
                          <label key={category} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={(e) => handleUpdateSettings({
                                categories: {
                                  ...settings.categories,
                                  [category]: e.target.checked
                                }
                              })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-slate-300 capitalize">
                              {category}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Frequency</h4>
                      <select
                        value={settings.frequency}
                        onChange={(e) => handleUpdateSettings({ frequency: e.target.value as any })}
                        className="w-full px-3 py-2 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="immediate">Immediate</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
