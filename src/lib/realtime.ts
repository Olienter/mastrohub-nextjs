import { create } from 'zustand';

interface CollaborationUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  currentPage: string;
}

interface RealtimeState {
  users: CollaborationUser[];
  isConnected: boolean;
  addUser: (user: CollaborationUser) => void;
  removeUser: (userId: string) => void;
  updateUserStatus: (userId: string, status: Partial<CollaborationUser>) => void;
  connect: () => void;
  disconnect: () => void;
}

export const useRealtimeStore = create<RealtimeState>((set, get) => ({
  users: [],
  isConnected: false,
  
  addUser: (user) => set((state) => ({
    users: [...state.users.filter(u => u.id !== user.id), user]
  })),
  
  removeUser: (userId) => set((state) => ({
    users: state.users.filter(u => u.id !== userId)
  })),
  
  updateUserStatus: (userId, status) => set((state) => ({
    users: state.users.map(u => u.id === userId ? { ...u, ...status } : u)
  })),
  
  connect: () => {
    set({ isConnected: true });
    // Simulate WebSocket connection
    const mockUsers: CollaborationUser[] = [
      { id: '1', name: 'John Doe', avatar: '👨‍🍳', isOnline: true, currentPage: 'menu-maker' },
      { id: '2', name: 'Jane Smith', avatar: '👩‍💼', isOnline: true, currentPage: 'analytics' },
      { id: '3', name: 'Mike Johnson', avatar: '👨‍��', isOnline: false, currentPage: 'marketing' }
    ];
    mockUsers.forEach(user => get().addUser(user));
  },
  
  disconnect: () => set({ isConnected: false, users: [] })
})); 