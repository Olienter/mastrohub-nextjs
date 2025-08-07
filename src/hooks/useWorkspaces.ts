import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Workspace {
  id: string;
  name: string;
  type: 'restaurant' | 'cafe' | 'bar' | 'catering';
  location: string;
  status: 'active' | 'inactive';
  lastActive?: string;
  last_active?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  capacity?: number;
  cuisine?: string;
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

export interface WorkspaceMetric {
  metric_type: string;
  value: number;
  change_percentage: number;
  trend: 'up' | 'down' | 'neutral';
  date: string;
}

export interface WorkspaceAlert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  message: string;
  priority: 'low' | 'medium' | 'high';
  is_read: boolean;
  created_at: string;
}

export interface WorkspaceActivity {
  id: string;
  activity_type: string;
  description: string;
  data: any;
  created_at: string;
}

export interface WorkspaceWithDetails extends Workspace {
  workspace_metrics?: WorkspaceMetric[];
  workspace_alerts?: WorkspaceAlert[];
  workspace_activities?: WorkspaceActivity[];
}

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<WorkspaceWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all workspaces
  const fetchWorkspaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/workspaces');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch workspaces');
      }

      setWorkspaces(data.workspaces || []);
    } catch (err) {
      console.error('Error fetching workspaces:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch workspaces');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new workspace
  const createWorkspace = useCallback(async (workspaceData: Partial<Workspace>) => {
    try {
      setError(null);

      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workspaceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create workspace');
      }

      // Refresh workspaces list
      await fetchWorkspaces();
      return data.workspace;
    } catch (err) {
      console.error('Error creating workspace:', err);
      setError(err instanceof Error ? err.message : 'Failed to create workspace');
      throw err;
    }
  }, [fetchWorkspaces]);

  // Update workspace
  const updateWorkspace = useCallback(async (id: string, workspaceData: Partial<Workspace>) => {
    try {
      setError(null);

      const response = await fetch(`/api/workspaces/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workspaceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update workspace');
      }

      // Update local state
      setWorkspaces(prev => 
        prev.map(workspace => 
          workspace.id === id ? { ...workspace, ...data.workspace } : workspace
        )
      );

      return data.workspace;
    } catch (err) {
      console.error('Error updating workspace:', err);
      setError(err instanceof Error ? err.message : 'Failed to update workspace');
      throw err;
    }
  }, []);

  // Delete workspace
  const deleteWorkspace = useCallback(async (id: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/workspaces/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete workspace');
      }

      // Remove from local state
      setWorkspaces(prev => prev.filter(workspace => workspace.id !== id));
    } catch (err) {
      console.error('Error deleting workspace:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete workspace');
      throw err;
    }
  }, []);

  // Get specific workspace
  const getWorkspace = useCallback(async (id: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/workspaces/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch workspace');
      }

      return data.workspace;
    } catch (err) {
      console.error('Error fetching workspace:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch workspace');
      throw err;
    }
  }, []);

  // Dismiss alert
  const dismissAlert = useCallback(async (workspaceId: string, alertId: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/workspaces/${workspaceId}/alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to dismiss alert');
      }

      // Update local state - mark alert as read instead of removing
      setWorkspaces(prev => 
        prev.map(workspace => 
          workspace.id === workspaceId 
            ? {
                ...workspace,
                workspace_alerts: workspace.workspace_alerts?.map(alert => 
                  alert.id === alertId ? { ...alert, is_read: true } : alert
                ) || []
              }
            : workspace
        )
      );
    } catch (err) {
      console.error('Error dismissing alert:', err);
      setError(err instanceof Error ? err.message : 'Failed to dismiss alert');
    }
  }, []);

  // Add activity
  const addActivity = useCallback(async (workspaceId: string, activityData: {
    activity_type: string;
    description: string;
    data?: any;
  }) => {
    try {
      setError(null);

      const response = await fetch(`/api/workspaces/${workspaceId}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add activity');
      }

      // Refresh workspaces to get updated activity
      await fetchWorkspaces();
    } catch (err) {
      console.error('Error adding activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to add activity');
    }
  }, [fetchWorkspaces]);

  // Initialize on mount
  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return {
    workspaces,
    loading,
    error,
    fetchWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    getWorkspace,
    dismissAlert,
    addActivity,
  };
} 