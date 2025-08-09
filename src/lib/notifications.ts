import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
  category: 'inventory' | 'orders' | 'suppliers' | 'analytics' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  userId?: string;
  workspaceId?: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  categories: {
    inventory: boolean;
    orders: boolean;
    suppliers: boolean;
    analytics: boolean;
    system: boolean;
  };
  frequency: 'immediate' | 'hourly' | 'daily';
}

export class NotificationService {
  private notifications: Notification[] = [];
  private subscribers: ((notification: Notification) => void)[] = [];

  // Mock notification data
  private mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'Chicken Breast stock is below minimum threshold (15kg remaining)',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      action: {
        label: 'View Inventory',
        url: '/supply-chain?tab=inventory'
      },
      category: 'inventory',
      priority: 'high'
    },
    {
      id: '2',
      type: 'success',
      title: 'Order Confirmed',
      message: 'Order ORD-002 has been confirmed by Premium Meat Co.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      action: {
        label: 'View Order',
        url: '/supply-chain?tab=orders'
      },
      category: 'orders',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'info',
      title: 'New Supplier Added',
      message: 'Premium Pantry Co. has been added to your supplier list',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      read: true,
      category: 'suppliers',
      priority: 'low'
    },
    {
      id: '4',
      type: 'critical',
      title: 'System Maintenance',
      message: 'Scheduled maintenance in 30 minutes. Some features may be temporarily unavailable.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: false,
      category: 'system',
      priority: 'urgent'
    },
    {
      id: '5',
      type: 'success',
      title: 'Analytics Updated',
      message: 'Monthly cost analysis has been updated with new data',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      read: true,
      action: {
        label: 'View Analytics',
        url: '/advanced-analytics'
      },
      category: 'analytics',
      priority: 'medium'
    }
  ];

  constructor() {
    this.notifications = [...this.mockNotifications];
  }

  // Get all notifications
  async getNotifications(userId?: string): Promise<Notification[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.notifications.filter(n => !userId || n.userId === userId);
  }

  // Get unread notifications count
  async getUnreadCount(userId?: string): Promise<number> {
    const notifications = await this.getNotifications(userId);
    return notifications.filter(n => !n.read).length;
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifySubscribers(notification);
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId?: string): Promise<void> {
    this.notifications
      .filter(n => !n.read && (!userId || n.userId === userId))
      .forEach(n => n.read = true);
  }

  // Create new notification
  async createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.notifySubscribers(newNotification);
    
    // Simulate real-time notification
    this.simulateRealTimeNotification(newNotification);
    
    return newNotification;
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }

  // Subscribe to real-time notifications
  subscribe(callback: (notification: Notification) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify subscribers
  private notifySubscribers(notification: Notification): void {
    this.subscribers.forEach(callback => callback(notification));
  }

  // Simulate real-time notifications
  private simulateRealTimeNotification(notification: Notification): void {
    // Simulate different types of real-time events
    setTimeout(() => {
      const realTimeNotifications = [
        {
          type: 'warning' as const,
          title: 'Inventory Update',
          message: 'Fresh Tomatoes stock updated to 42kg',
          category: 'inventory' as const,
          priority: 'medium' as const
        },
        {
          type: 'success' as const,
          title: 'Order Status Changed',
          message: 'Order ORD-001 is now in transit',
          category: 'orders' as const,
          priority: 'medium' as const
        },
        {
          type: 'info' as const,
          title: 'Supplier Rating Updated',
          message: 'Fresh Market Supplies rating updated to 4.9',
          category: 'suppliers' as const,
          priority: 'low' as const
        }
      ];

      const randomNotification = realTimeNotifications[Math.floor(Math.random() * realTimeNotifications.length)];
      
      this.createNotification({
        ...randomNotification,
        userId: 'current-user',
        workspaceId: 'current-workspace'
      });
    }, Math.random() * 30000 + 10000); // Random time between 10-40 seconds
  }

  // Get notification settings
  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    return {
      email: true,
      push: true,
      inApp: true,
      categories: {
        inventory: true,
        orders: true,
        suppliers: true,
        analytics: true,
        system: true
      },
      frequency: 'immediate'
    };
  }

  // Update notification settings
  async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<void> {
    // Mock implementation - in real app would save to database
    console.log('Updating notification settings:', settings);
  }

  // Get notifications by category
  async getNotificationsByCategory(category: Notification['category'], userId?: string): Promise<Notification[]> {
    const notifications = await this.getNotifications(userId);
    return notifications.filter(n => n.category === category);
  }

  // Get notifications by priority
  async getNotificationsByPriority(priority: Notification['priority'], userId?: string): Promise<Notification[]> {
    const notifications = await this.getNotifications(userId);
    return notifications.filter(n => n.priority === priority);
  }

  // Get recent notifications (last 24 hours)
  async getRecentNotifications(userId?: string): Promise<Notification[]> {
    const notifications = await this.getNotifications(userId);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return notifications.filter(n => n.timestamp > twentyFourHoursAgo);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Helper functions
export const formatNotificationTime = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return timestamp.toLocaleDateString();
};

export const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success': return '✅';
    case 'warning': return '⚠️';
    case 'error': return '❌';
    case 'critical': return '🚨';
    default: return 'ℹ️';
  }
};

export const getPriorityColor = (priority: Notification['priority']) => {
  switch (priority) {
    case 'urgent': return 'text-red-600 bg-red-50';
    case 'high': return 'text-orange-600 bg-orange-50';
    case 'medium': return 'text-yellow-600 bg-yellow-50';
    case 'low': return 'text-gray-600 bg-gray-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}; 