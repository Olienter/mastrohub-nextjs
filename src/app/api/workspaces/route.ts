import { NextRequest, NextResponse } from 'next/server';

// Mock data for development
const mockWorkspaces = [
  {
    id: '1',
    user_id: 'mock-user-id',
    name: 'Mastro Restaurant',
    type: 'restaurant',
    location: 'Bratislava, Slovakia',
    status: 'active',
    description: 'Fine dining restaurant in the heart of Bratislava',
    address: 'Hlavná 123, 811 01 Bratislava',
    phone: '+421 2 123 456 789',
    email: 'info@mastro-restaurant.sk',
    website: 'www.mastro-restaurant.sk',
    capacity: 120,
    cuisine: 'International',
    rating: 4.8,
    last_active: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    workspace_metrics: [
      {
        metric_type: 'daily_revenue',
        value: 2847,
        change_percentage: 12.5,
        trend: 'up'
      },
      {
        metric_type: 'staff_productivity',
        value: 87,
        change_percentage: 3.2,
        trend: 'up'
      },
      {
        metric_type: 'menu_performance',
        value: 94,
        change_percentage: -1.8,
        trend: 'down'
      },
      {
        metric_type: 'customer_satisfaction',
        value: 4.8,
        change_percentage: 0.3,
        trend: 'up'
      }
    ],
    workspace_alerts: [
      {
        id: '1',
        type: 'warning',
        message: 'Low stock alert: Tomatoes (5kg remaining)',
        priority: 'high',
        is_read: false,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'info',
        message: 'Staff schedule updated for weekend',
        priority: 'medium',
        is_read: false,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: '2',
    user_id: 'mock-user-id',
    name: 'Mastro Café',
    type: 'cafe',
    location: 'Bratislava, Slovakia',
    status: 'active',
    description: 'Cozy café with specialty coffee and pastries',
    address: 'Námestie SNP 45, 811 01 Bratislava',
    phone: '+421 2 987 654 321',
    email: 'info@mastro-cafe.sk',
    website: 'www.mastro-cafe.sk',
    capacity: 50,
    cuisine: 'Café & Pastries',
    rating: 4.6,
    last_active: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    workspace_metrics: [
      {
        metric_type: 'daily_revenue',
        value: 1250,
        change_percentage: 8.2,
        trend: 'up'
      },
      {
        metric_type: 'staff_productivity',
        value: 92,
        change_percentage: 1.5,
        trend: 'up'
      },
      {
        metric_type: 'menu_performance',
        value: 88,
        change_percentage: 2.1,
        trend: 'up'
      },
      {
        metric_type: 'customer_satisfaction',
        value: 4.6,
        change_percentage: 0.1,
        trend: 'neutral'
      }
    ],
    workspace_alerts: [
      {
        id: '3',
        type: 'success',
        message: 'Marketing campaign launched successfully',
        priority: 'low',
        is_read: false,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: '3',
    user_id: 'mock-user-id',
    name: 'Mastro Catering',
    type: 'catering',
    location: 'Bratislava, Slovakia',
    status: 'inactive',
    description: 'Professional catering services for events',
    address: 'Vajnorská 78, 831 04 Bratislava',
    phone: '+421 2 555 123 456',
    email: 'info@mastro-catering.sk',
    website: 'www.mastro-catering.sk',
    capacity: 500,
    cuisine: 'Event Catering',
    rating: 4.9,
    last_active: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    workspace_metrics: [
      {
        metric_type: 'daily_revenue',
        value: 0,
        change_percentage: 0,
        trend: 'neutral'
      },
      {
        metric_type: 'staff_productivity',
        value: 0,
        change_percentage: 0,
        trend: 'neutral'
      },
      {
        metric_type: 'menu_performance',
        value: 0,
        change_percentage: 0,
        trend: 'neutral'
      },
      {
        metric_type: 'customer_satisfaction',
        value: 4.9,
        change_percentage: 0,
        trend: 'neutral'
      }
    ],
    workspace_alerts: []
  }
];

// GET /api/workspaces - Get all workspaces for current user
export async function GET(request: NextRequest) {
  try {
    // Return mock data for development
    return NextResponse.json({ workspaces: mockWorkspaces });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/workspaces - Create new workspace
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, location, description, address, phone, email, website, capacity, cuisine } = body;

    // Validation
    if (!name || !type || !location) {
      return NextResponse.json(
        { error: 'Name, type, and location are required' },
        { status: 400 }
      );
    }

    // Create new workspace with mock data
    const newWorkspace = {
      id: Date.now().toString(),
      user_id: 'mock-user-id',
      name,
      type,
      location,
      status: 'active',
      description,
      address,
      phone,
      email,
      website,
      capacity: capacity ? parseInt(capacity) : 0,
      cuisine,
      rating: 0,
      last_active: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      workspace_metrics: [
        {
          metric_type: 'daily_revenue',
          value: 0,
          change_percentage: 0,
          trend: 'neutral'
        },
        {
          metric_type: 'staff_productivity',
          value: 0,
          change_percentage: 0,
          trend: 'neutral'
        },
        {
          metric_type: 'menu_performance',
          value: 0,
          change_percentage: 0,
          trend: 'neutral'
        },
        {
          metric_type: 'customer_satisfaction',
          value: 0,
          change_percentage: 0,
          trend: 'neutral'
        }
      ],
      workspace_alerts: []
    };

    // Add to mock data (in real app, this would be saved to database)
    mockWorkspaces.unshift(newWorkspace);

    return NextResponse.json({ workspace: newWorkspace }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 