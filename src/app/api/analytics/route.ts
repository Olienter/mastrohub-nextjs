import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get workspace_id from query params
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspace_id');
    const type = searchParams.get('type'); // overview, menu, revenue, qr, marketing
    const period = searchParams.get('period') || '30'; // days
    
    if (!workspaceId) {
      return NextResponse.json({ error: 'workspace_id is required' }, { status: 400 });
    }

    // Verify user has access to this workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', workspaceId)
      .eq('user_id', session.user.id)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 403 });
    }

    // Get data based on type
    let data;
    switch (type) {
      case 'overview':
        data = await getOverviewAnalytics(workspaceId, parseInt(period));
        break;
      case 'menu':
        data = await getMenuAnalytics(workspaceId, parseInt(period));
        break;
      case 'revenue':
        data = await getRevenueAnalytics(workspaceId, parseInt(period));
        break;
      case 'qr':
        data = await getQRAnalytics(workspaceId, parseInt(period));
        break;
      case 'marketing':
        data = await getMarketingAnalytics(workspaceId, parseInt(period));
        break;
      default:
        // Return all analytics data
        const [overview, menu, revenue, qr, marketing] = await Promise.all([
          getOverviewAnalytics(workspaceId, parseInt(period)),
          getMenuAnalytics(workspaceId, parseInt(period)),
          getRevenueAnalytics(workspaceId, parseInt(period)),
          getQRAnalytics(workspaceId, parseInt(period)),
          getMarketingAnalytics(workspaceId, parseInt(period))
        ]);
        data = { overview, menu, revenue, qr, marketing };
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
async function getOverviewAnalytics(workspaceId: string, days: number) {
  // Mock overview analytics data
  return {
    summary: {
      total_revenue: 45250,
      total_orders: 1247,
      average_order_value: 36.28,
      total_customers: 892,
      repeat_customer_rate: 0.68,
      menu_items_count: 24,
      active_qr_codes: 8,
      marketing_campaigns: 3
    },
    trends: {
      revenue_growth: 0.15,
      order_growth: 0.12,
      customer_growth: 0.08,
      menu_popularity_growth: 0.22
    },
    top_performers: {
      best_selling_item: 'Truffle Pasta Carbonara',
      highest_revenue_item: 'Grilled Salmon with Herbs',
      most_viewed_qr: 'Main Menu QR',
      best_campaign: 'Summer Special Campaign'
    },
    alerts: [
      {
        type: 'warning',
        message: 'Low stock on premium ingredients',
        priority: 'medium'
      },
      {
        type: 'success',
        message: 'QR menu adoption increased by 25%',
        priority: 'low'
      },
      {
        type: 'info',
        message: 'New customer acquisition rate improving',
        priority: 'low'
      }
    ]
  };
}

async function getMenuAnalytics(workspaceId: string, days: number) {
  // Mock menu analytics data
  return {
    performance: {
      total_items: 24,
      active_items: 22,
      featured_items: 8,
      seasonal_items: 4
    },
    popularity_ranking: [
      {
        name: 'Truffle Pasta Carbonara',
        orders: 156,
        revenue: 3822,
        views: 1247,
        likes: 89,
        rating: 4.8
      },
      {
        name: 'Grilled Salmon with Herbs',
        orders: 142,
        revenue: 3976,
        views: 1189,
        likes: 76,
        rating: 4.7
      },
      {
        name: 'Caesar Salad',
        orders: 134,
        revenue: 2010,
        views: 892,
        likes: 45,
        rating: 4.5
      },
      {
        name: 'Tiramisu',
        orders: 98,
        revenue: 1470,
        views: 567,
        likes: 67,
        rating: 4.9
      },
      {
        name: 'Margherita Pizza',
        orders: 87,
        revenue: 1740,
        views: 445,
        likes: 34,
        rating: 4.6
      }
    ],
    category_performance: [
      {
        category: 'Main Courses',
        items: 12,
        orders: 456,
        revenue: 18240,
        avg_rating: 4.6
      },
      {
        category: 'Appetizers',
        items: 6,
        orders: 234,
        revenue: 4680,
        avg_rating: 4.4
      },
      {
        category: 'Desserts',
        items: 4,
        orders: 156,
        revenue: 2340,
        avg_rating: 4.8
      },
      {
        category: 'Beverages',
        items: 2,
        orders: 401,
        revenue: 1990,
        avg_rating: 4.3
      }
    ],
    trends: {
      seasonal_changes: [
        { month: 'Jan', orders: 120, revenue: 4320 },
        { month: 'Feb', orders: 135, revenue: 4860 },
        { month: 'Mar', orders: 142, revenue: 5112 },
        { month: 'Apr', orders: 158, revenue: 5688 }
      ],
      time_of_day: [
        { hour: '11-14', orders: 45, revenue: 1620 },
        { hour: '14-17', orders: 23, revenue: 828 },
        { hour: '17-20', orders: 67, revenue: 2412 },
        { hour: '20-23', orders: 23, revenue: 828 }
      ]
    }
  };
}

async function getRevenueAnalytics(workspaceId: string, days: number) {
  // Mock revenue analytics data
  return {
    overview: {
      total_revenue: 45250,
      total_orders: 1247,
      average_order_value: 36.28,
      revenue_growth: 0.15,
      order_growth: 0.12
    },
    daily_revenue: [
      { date: '2024-01-01', revenue: 1250, orders: 34 },
      { date: '2024-01-02', revenue: 1380, orders: 38 },
      { date: '2024-01-03', revenue: 1420, orders: 39 },
      { date: '2024-01-04', revenue: 1560, orders: 43 },
      { date: '2024-01-05', revenue: 1680, orders: 46 },
      { date: '2024-01-06', revenue: 1890, orders: 52 },
      { date: '2024-01-07', revenue: 1750, orders: 48 }
    ],
    revenue_by_category: [
      { category: 'Main Courses', revenue: 18240, percentage: 40.3 },
      { category: 'Appetizers', revenue: 4680, percentage: 10.3 },
      { category: 'Desserts', revenue: 2340, percentage: 5.2 },
      { category: 'Beverages', revenue: 1990, percentage: 4.4 },
      { category: 'Other', revenue: 18000, percentage: 39.8 }
    ],
    customer_metrics: {
      new_customers: 234,
      returning_customers: 658,
      customer_lifetime_value: 125.50,
      repeat_purchase_rate: 0.68
    },
    profitability: {
      gross_margin: 0.65,
      net_margin: 0.22,
      cost_of_goods: 15837.50,
      operating_expenses: 19855,
      net_profit: 9957.50
    }
  };
}

async function getQRAnalytics(workspaceId: string, days: number) {
  // Mock QR analytics data
  return {
    overview: {
      total_qr_codes: 8,
      active_qr_codes: 7,
      total_scans: 2847,
      unique_scanners: 1892,
      conversion_rate: 0.23
    },
    qr_performance: [
      {
        name: 'Main Menu QR',
        scans: 1247,
        unique_scanners: 892,
        conversions: 312,
        conversion_rate: 0.25,
        revenue_generated: 11320
      },
      {
        name: 'Wine List QR',
        scans: 567,
        unique_scanners: 445,
        conversions: 89,
        conversion_rate: 0.16,
        revenue_generated: 3560
      },
      {
        name: 'Dessert Menu QR',
        scans: 445,
        unique_scanners: 334,
        conversions: 78,
        conversion_rate: 0.18,
        revenue_generated: 1170
      },
      {
        name: 'Special Offers QR',
        scans: 588,
        unique_scanners: 221,
        conversions: 145,
        conversion_rate: 0.31,
        revenue_generated: 4350
      }
    ],
    scan_trends: [
      { date: '2024-01-01', scans: 45, conversions: 12 },
      { date: '2024-01-02', scans: 52, conversions: 15 },
      { date: '2024-01-03', scans: 48, conversions: 11 },
      { date: '2024-01-04', scans: 67, conversions: 18 },
      { date: '2024-01-05', scans: 73, conversions: 22 },
      { date: '2024-01-06', scans: 89, conversions: 28 },
      { date: '2024-01-07', scans: 76, conversions: 24 }
    ],
    device_analytics: {
      mobile: 0.78,
      tablet: 0.15,
      desktop: 0.07
    },
    time_analytics: {
      peak_hours: ['12:00-14:00', '18:00-20:00'],
      average_session_duration: 2.5, // minutes
      bounce_rate: 0.34
    }
  };
}

async function getMarketingAnalytics(workspaceId: string, days: number) {
  // Mock marketing analytics data
  return {
    overview: {
      total_campaigns: 3,
      active_campaigns: 2,
      total_reach: 4500,
      total_engagement: 2340,
      total_conversions: 567,
      roi: 2.8
    },
    campaign_performance: [
      {
        name: 'Summer Special Campaign',
        type: 'email',
        reach: 1250,
        engagement: 850,
        conversions: 234,
        revenue: 8424,
        cost: 320,
        roi: 26.3
      },
      {
        name: 'QR Menu Promotion',
        type: 'qr',
        reach: 850,
        engagement: 765,
        conversions: 212,
        revenue: 6360,
        cost: 180,
        roi: 35.3
      },
      {
        name: 'New Menu Launch',
        type: 'social',
        reach: 2400,
        engagement: 725,
        conversions: 121,
        revenue: 3630,
        cost: 150,
        roi: 24.2
      }
    ],
    channel_performance: [
      {
        channel: 'Email',
        reach: 1250,
        engagement: 0.68,
        conversion: 0.19,
        revenue: 8424
      },
      {
        channel: 'QR Menu',
        reach: 850,
        engagement: 0.90,
        conversion: 0.25,
        revenue: 6360
      },
      {
        channel: 'Social Media',
        reach: 2400,
        engagement: 0.30,
        conversion: 0.05,
        revenue: 3630
      }
    ],
    audience_insights: {
      demographics: {
        age_18_25: 0.15,
        age_26_35: 0.35,
        age_36_45: 0.28,
        age_46_55: 0.16,
        age_55_plus: 0.06
      },
      preferences: {
        italian_cuisine: 0.45,
        seafood: 0.28,
        vegetarian: 0.18,
        desserts: 0.09
      },
      behavior: {
        weekday_customers: 0.65,
        weekend_customers: 0.35,
        lunch_customers: 0.42,
        dinner_customers: 0.58
      }
    },
    trends: {
      email_open_rate: 0.68,
      qr_scan_growth: 0.25,
      social_engagement_growth: 0.12,
      customer_acquisition_cost: 15.50
    }
  };
}
