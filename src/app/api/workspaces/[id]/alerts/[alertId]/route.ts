import { NextRequest, NextResponse } from 'next/server';

// Mock data for alerts (in real app, this would be in database)
let mockAlerts = [
  {
    id: '1',
    workspace_id: '1',
    type: 'warning',
    message: 'Low stock alert: Tomatoes (5kg remaining)',
    priority: 'high',
    is_read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    workspace_id: '1',
    type: 'info',
    message: 'Staff schedule updated for weekend',
    priority: 'medium',
    is_read: false,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    workspace_id: '2',
    type: 'success',
    message: 'Marketing campaign launched successfully',
    priority: 'low',
    is_read: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

// PUT /api/workspaces/[id]/alerts/[alertId] - Dismiss alert
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; alertId: string }> }
) {
  try {
    const { id: workspaceId, alertId } = await params;
    const body = await request.json();
    const { is_read } = body;

    // Find and update alert
    const alertIndex = mockAlerts.findIndex(
      alert => alert.id === alertId && alert.workspace_id === workspaceId
    );

    if (alertIndex === -1) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    // Update alert
    mockAlerts[alertIndex] = {
      ...mockAlerts[alertIndex],
      is_read: is_read
    };

    return NextResponse.json({ 
      message: 'Alert dismissed successfully',
      alert: mockAlerts[alertIndex]
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 