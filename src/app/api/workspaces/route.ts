import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mock workspaces data for development
const mockWorkspaces = [
  {
    id: '1',
    name: 'La Trattoria',
    type: 'restaurant',
    location: 'Bratislava, Slovakia',
    status: 'active',
    description: 'Authentic Italian restaurant in the heart of Bratislava',
    address: 'Hlavná 123, 811 01 Bratislava',
    phone: '+421 2 1234 5678',
    email: 'info@latrattoria.sk',
    website: 'https://latrattoria.sk',
    capacity: 80,
    cuisine: 'Italian',
    rating: 4.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    workspace_metrics: [
      { id: '1', workspace_id: '1', metric_type: 'daily_revenue', value: 2500, change_percentage: 12, trend: 'up' },
      { id: '2', workspace_id: '1', metric_type: 'staff_productivity', value: 85, change_percentage: 5, trend: 'up' },
      { id: '3', workspace_id: '1', metric_type: 'menu_performance', value: 92, change_percentage: 8, trend: 'up' },
      { id: '4', workspace_id: '1', metric_type: 'customer_satisfaction', value: 4.5, change_percentage: 2, trend: 'up' }
    ],
    workspace_alerts: [
      { id: '1', workspace_id: '1', type: 'warning', title: 'Low Stock Alert', message: 'Pasta inventory is running low', created_at: new Date().toISOString() }
    ],
    workspace_activities: [
      { id: '1', workspace_id: '1', type: 'order', title: 'New Order', message: 'Order #1234 received', created_at: new Date().toISOString() }
    ]
  },
  {
    id: '2',
    name: 'Sushi Master',
    type: 'restaurant',
    location: 'Košice, Slovakia',
    status: 'active',
    description: 'Premium Japanese sushi restaurant',
    address: 'Hlavná 456, 040 01 Košice',
    phone: '+421 55 9876 5432',
    email: 'info@sushimaster.sk',
    website: 'https://sushimaster.sk',
    capacity: 60,
    cuisine: 'Japanese',
    rating: 4.8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    workspace_metrics: [
      { id: '5', workspace_id: '2', metric_type: 'daily_revenue', value: 3200, change_percentage: 15, trend: 'up' },
      { id: '6', workspace_id: '2', metric_type: 'staff_productivity', value: 90, change_percentage: 3, trend: 'up' },
      { id: '7', workspace_id: '2', metric_type: 'menu_performance', value: 88, change_percentage: 6, trend: 'up' },
      { id: '8', workspace_id: '2', metric_type: 'customer_satisfaction', value: 4.8, change_percentage: 1, trend: 'up' }
    ],
    workspace_alerts: [],
    workspace_activities: [
      { id: '2', workspace_id: '2', type: 'review', title: 'New Review', message: '5-star review received', created_at: new Date().toISOString() }
    ]
  }
];

// GET /api/workspaces - Get all workspaces for current user
export async function GET(request: NextRequest) {
  try {
    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // If no session or error, return mock data for development
    if (sessionError || !session?.user) {
      console.log('No authenticated user, returning mock workspaces');
      return NextResponse.json({ workspaces: mockWorkspaces });
    }

    // Get workspaces for current user
    const { data: workspaces, error: workspacesError } = await supabase
      .from('workspaces')
      .select(`
        *,
        workspace_metrics(*),
        workspace_alerts(*),
        workspace_activities(*)
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (workspacesError) {
      console.error('Error fetching workspaces:', workspacesError);
      // Return mock data if database error occurs
      return NextResponse.json({ workspaces: mockWorkspaces });
    }

    return NextResponse.json({ workspaces: workspaces || mockWorkspaces });
  } catch (error) {
    console.error('Unexpected error:', error);
    // Return mock data on any error
    return NextResponse.json({ workspaces: mockWorkspaces });
  }
}

// POST /api/workspaces - Create new workspace
export async function POST(request: NextRequest) {
  try {
    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, location, description, address, phone, email, website, capacity, cuisine } = body;

    // Validation
    if (!name || !type || !location) {
      return NextResponse.json(
        { error: 'Name, type, and location are required' },
        { status: 400 }
      );
    }

    // Create new workspace
    const { data: workspace, error: insertError } = await supabase
      .from('workspaces')
      .insert({
        user_id: session.user.id,
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
        rating: 0
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating workspace:', insertError);
      return NextResponse.json({ error: 'Failed to create workspace' }, { status: 500 });
    }

    // Create default metrics for new workspace
    const defaultMetrics = [
      { workspace_id: workspace.id, metric_type: 'daily_revenue', value: 0, change_percentage: 0, trend: 'neutral' },
      { workspace_id: workspace.id, metric_type: 'staff_productivity', value: 0, change_percentage: 0, trend: 'neutral' },
      { workspace_id: workspace.id, metric_type: 'menu_performance', value: 0, change_percentage: 0, trend: 'neutral' },
      { workspace_id: workspace.id, metric_type: 'customer_satisfaction', value: 0, change_percentage: 0, trend: 'neutral' }
    ];

    const { error: metricsError } = await supabase
      .from('workspace_metrics')
      .insert(defaultMetrics);

    if (metricsError) {
      console.error('Error creating default metrics:', metricsError);
      // Don't fail the request if metrics creation fails
    }

    return NextResponse.json({ workspace }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 