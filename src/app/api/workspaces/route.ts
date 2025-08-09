import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/workspaces - Get all workspaces for current user
export async function GET(request: NextRequest) {
  try {
    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'Failed to fetch workspaces' }, { status: 500 });
    }

    return NextResponse.json({ workspaces: workspaces || [] });
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