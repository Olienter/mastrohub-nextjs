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
      
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in notifications API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'reset':
        await notificationService.resetNotifications();
        return NextResponse.json({ success: true, message: 'Notifications reset successfully' });
      
      case 'mark-all-read':
        const userId = searchParams.get('userId') || 'current-user';
        await notificationService.markAllAsRead(userId);
        return NextResponse.json({ success: true, message: 'All notifications marked as read' });
      
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in notifications API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
