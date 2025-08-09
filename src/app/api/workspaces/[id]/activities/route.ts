import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/workspaces/[id]/activities - Add activity
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: workspaceId } = await params;
    const body = await request.json();
    const { activity_type, description, data } = body;

    // Validation
    if (!activity_type || !description) {
      return NextResponse.json(
        { error: 'Activity type and description are required' },
        { status: 400 }
      );
    }

    // Verify user has access to this workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', workspaceId)
      .eq('user_id', session.user.id)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: 'Workspace not found or access denied' },
        { status: 404 }
      );
    }

    // Add activity
    const { data: activity, error: insertError } = await supabase
      .from('workspace_activities')
      .insert({
        workspace_id: workspaceId,
        user_id: session.user.id,
        activity_type,
        description,
        data: data || {}
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error adding activity:', insertError);
      return NextResponse.json({ error: 'Failed to add activity' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Activity added successfully',
      activity
    }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
