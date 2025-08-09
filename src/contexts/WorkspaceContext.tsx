'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWorkspaces, WorkspaceWithDetails } from '@/hooks/useWorkspaces';

interface WorkspaceContextType {
  selectedWorkspace: string;
  setSelectedWorkspace: (id: string) => void;
  currentWorkspace: WorkspaceWithDetails | null;
  workspaces: WorkspaceWithDetails[];
  loading: boolean;
  error: string | null;
  createWorkspace: (workspaceData: any) => Promise<any>;
  updateWorkspace: (id: string, workspaceData: any) => Promise<any>;
  deleteWorkspace: (id: string) => Promise<void>;
  dismissAlert: (workspaceId: string, alertId: string) => Promise<void>;
  addActivity: (workspaceId: string, activityData: any) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const { 
    workspaces, 
    loading, 
    error, 
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    dismissAlert,
    addActivity
  } = useWorkspaces();
  
  const currentWorkspace = selectedWorkspace ? workspaces.find(w => w.id === selectedWorkspace) || null : null;

  // Auto-select first workspace if none selected
  useEffect(() => {
    if (workspaces.length > 0 && !selectedWorkspace) {
      setSelectedWorkspace(workspaces[0].id);
    }
  }, [workspaces, selectedWorkspace]);

  return (
    <WorkspaceContext.Provider value={{
      selectedWorkspace,
      setSelectedWorkspace,
      currentWorkspace,
      workspaces,
      loading,
      error,
      createWorkspace,
      updateWorkspace,
      deleteWorkspace,
      dismissAlert,
      addActivity
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  }
  return context;
} 