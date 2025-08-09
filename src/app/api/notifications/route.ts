import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId') || 'current-user';
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');

    switch (action) {
      case 'all':
        const notifications = await notificationService.getNotifications(userId);
        return NextResponse.json({ success: true, data: notifications });
      
      case 'unread-count':
        const unreadCount = await notificationService.getUnreadCount(userId);
        return NextResponse.json({ success: true, data: { unreadCount } });
      
      case 'by-category':
        if (!category) {
          return NextResponse.json({ success: false, error: 'Category parameter required' }, { status: 400 });
        }
        const categoryNotifications = await notificationService.getNotificationsByCategory(
          category as any, 
          userId
        );
        return NextResponse.json({ success: true, data: categoryNotifications });
      
      case 'by-priority':
        if (!priority) {
          return NextResponse.json({ success: false, error: 'Priority parameter required' }, { status: 400 });
        }
        const priorityNotifications = await notificationService.getNotificationsByPriority(
          priority as any, 
          userId
        );
        return NextResponse.json({ success: true, data: priorityNotifications });
      
      case 'recent':
        const recentNotifications = await notificationService.getRecentNotifications(userId);
        return NextResponse.json({ success: true, data: recentNotifications });
      
      case 'settings':
        const settings = await notificationService.getNotificationSettings(userId);
        return NextResponse.json({ success: true, data: settings });
      
      default:
        return NextResponse.json({ success: false, error: 'Invalid action parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Notifications API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'create':
        const newNotification = await notificationService.createNotification(data);
        return NextResponse.json({ success: true, data: newNotification });
      
      case 'mark-as-read':
        await notificationService.markAsRead(data.notificationId);
        return NextResponse.json({ success: true, message: 'Notification marked as read' });
      
      case 'mark-all-as-read':
        await notificationService.markAllAsRead(data.userId);
        return NextResponse.json({ success: true, message: 'All notifications marked as read' });
      
      case 'delete':
        await notificationService.deleteNotification(data.notificationId);
        return NextResponse.json({ success: true, message: 'Notification deleted' });
      
      case 'update-settings':
        await notificationService.updateNotificationSettings(data.userId, data.settings);
        return NextResponse.json({ success: true, message: 'Settings updated' });
      
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Notifications POST Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
