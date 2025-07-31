import { NextRequest, NextResponse } from 'next/server';
import { BadgeEngine } from '@/lib/badges';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let result;

    switch (type) {
      case 'user_badges':
        result = await BadgeEngine.getUserBadges(userId);
        break;
      case 'user_progress':
        result = await BadgeEngine.getUserProgress(userId);
        break;
      case 'check_badges':
        result = await BadgeEngine.checkBadges(userId);
        break;
      default:
        result = await BadgeEngine.getBadges();
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Error in badges API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, data } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'update_progress':
        result = await BadgeEngine.updateUserProgress(userId, data);
        break;
      case 'check_badges':
        result = await BadgeEngine.checkBadges(userId);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in badges API POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 