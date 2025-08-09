'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  Shield,
  Settings,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  MoreHorizontal,
  ArrowLeft,
  Crown,
  User,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Plus,
  Save,
  X
} from 'lucide-react';

import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, ROLES, createRBAC } from '@/lib/rbac';
import RoleGuard from '@/components/auth/RoleGuard';

interface WorkspaceUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending';
  joined_at: string;
  last_active: string;
  permissions: string[];
  avatar?: string;
}

interface InviteUserData {
  email: string;
  name: string;
  role: UserRole;
  message?: string;
}

export default function UserManagement() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  
  // State
  const [users, setUsers] = useState<WorkspaceUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<WorkspaceUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');

  // Invite form state
  const [inviteData, setInviteData] = useState<InviteUserData>({
    email: '',
    name: '',
    role: 'staff',
    message: ''
  });

  // Load users data
  const loadUsers = async () => {
    if (!currentWorkspace) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now - in real implementation, this would fetch from API
      const mockUsers: WorkspaceUser[] = [
        {
          id: '1',
          email: 'john.doe@restaurant.com',
          name: 'John Doe',
          role: 'owner',
          status: 'active',
          joined_at: '2024-01-15',
          last_active: '2024-01-20',
          permissions: ['read', 'write', 'admin'],
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
          id: '2',
          email: 'jane.smith@restaurant.com',
          name: 'Jane Smith',
          role: 'manager',
          status: 'active',
          joined_at: '2024-01-10',
          last_active: '2024-01-19',
          permissions: ['read', 'write'],
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
          id: '3',
          email: 'mike.johnson@restaurant.com',
          name: 'Mike Johnson',
          role: 'staff',
          status: 'active',
          joined_at: '2024-01-05',
          last_active: '2024-01-18',
          permissions: ['read'],
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
      ];
      
      setUsers(mockUsers);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentWorkspace]);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleInviteUser = async (data: InviteUserData) => {
    try {
      // Mock implementation - in real app, this would call API
      const newUser: WorkspaceUser = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: data.role,
        status: 'pending',
        joined_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
        permissions: ROLES[data.role] || []
      };
      
      setUsers(prev => [...prev, newUser]);
      setShowInviteModal(false);
      setInviteData({ email: '', name: '', role: 'staff', message: '' });
    } catch (err) {
      console.error('Error inviting user:', err);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error updating user role:', err);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error removing user:', err);
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h2 className="text-xl font-semibold text-slate-300 mb-2">No Workspace Selected</h2>
          <p className="text-slate-400">Please select a workspace to manage users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/80 shadow-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/restaurant-curator" className="flex items-center text-slate-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Workspace
              </Link>
              <div className="h-6 w-px bg-slate-600" />
              <div>
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <p className="text-sm text-slate-300">{currentWorkspace.name}</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="bg-slate-800/80 rounded-lg shadow-sm border border-slate-700/50 p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading users...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-700/50 rounded-lg p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-300">{error}</p>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="bg-slate-800/80 rounded-lg shadow-sm border border-slate-700/50 p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                  className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="owner">Owner</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'pending')}
                  className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-slate-800/80 rounded-lg shadow-sm border border-slate-700/50">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-white">
                  Users ({filteredUsers.length})
                </h3>
              </div>
              
              <div className="divide-y divide-slate-700/50">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="px-6 py-4 hover:bg-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                          ) : (
                            <User className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                          <span className="text-xs text-slate-500">
                            Joined {new Date(user.joined_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-3 py-1 border border-slate-600/50 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                          {user.role}
                        </span>
                        
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-slate-800/80 border-slate-700/50">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-white mb-4">Invite New User</h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleInviteUser(inviteData);
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteData.email}
                    onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteData.name}
                    onChange={(e) => setInviteData({...inviteData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Role
                  </label>
                  <select
                    value={inviteData.role}
                    onChange={(e) => setInviteData({...inviteData, role: e.target.value as UserRole})}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    value={inviteData.message}
                    onChange={(e) => setInviteData({...inviteData, message: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 border border-slate-600/50 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700/50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Invite User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-slate-800/80 border-slate-700/50">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-white mb-4">Edit User Role</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  User
                </label>
                <p className="text-sm text-white">{selectedUser.name} ({selectedUser.email})</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Role
                </label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => handleUpdateUserRole(selectedUser.id, e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-600/50 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700/50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
