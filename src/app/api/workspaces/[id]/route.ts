import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/workspaces/[id] - Get specific workspace
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get workspace with all related data
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select(`
        *,
        workspace_metrics(*),
        workspace_alerts(*),
        workspace_activities(*)
      `)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ workspace });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/workspaces/[id] - Update workspace
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, type, location, status, description, address, phone, email, website, capacity, cuisine, rating } = body;

    // Validation
    if (!name || !type || !location) {
      return NextResponse.json(
        { error: 'Name, type, and location are required' },
        { status: 400 }
      );
    }

    // Verify user has access to this workspace
    const { data: existingWorkspace, error: fetchError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (fetchError || !existingWorkspace) {
      return NextResponse.json(
        { error: 'Workspace not found or access denied' },
        { status: 404 }
      );
    }

    // Update workspace
    const { data: workspace, error: updateError } = await supabase
      .from('workspaces')
      .update({
        name,
        type,
        location,
        status,
        description,
        address,
        phone,
        email,
        website,
        capacity: capacity ? parseInt(capacity) : 0,
        cuisine,
        rating: rating ? parseFloat(rating) : 0
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating workspace:', updateError);
      return NextResponse.json({ error: 'Failed to update workspace' }, { status: 500 });
    }

    return NextResponse.json({ workspace });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/workspaces/[id] - Delete workspace
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify user has access to this workspace
    const { data: existingWorkspace, error: fetchError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (fetchError || !existingWorkspace) {
      return NextResponse.json(
        { error: 'Workspace not found or access denied' },
        { status: 404 }
      );
    }

    // Delete workspace (this will cascade delete related data due to foreign keys)
    const { error: deleteError } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting workspace:', deleteError);
      return NextResponse.json({ error: 'Failed to delete workspace' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 