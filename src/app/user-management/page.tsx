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
          joined_at: '2024-01-01T00:00:00Z',
          last_active: '2024-01-15T10:30:00Z',
          permissions: ['all'],
          avatar: '/avatars/john.jpg'
        },
        {
          id: '2',
          email: 'sarah.manager@restaurant.com',
          name: 'Sarah Johnson',
          role: 'manager',
          status: 'active',
          joined_at: '2024-01-05T00:00:00Z',
          last_active: '2024-01-15T09:15:00Z',
          permissions: ['menu', 'qr', 'analytics', 'marketing'],
          avatar: '/avatars/sarah.jpg'
        },
        {
          id: '3',
          email: 'mike.staff@restaurant.com',
          name: 'Mike Wilson',
          role: 'staff',
          status: 'active',
          joined_at: '2024-01-10T00:00:00Z',
          last_active: '2024-01-14T16:45:00Z',
          permissions: ['menu', 'qr'],
          avatar: '/avatars/mike.jpg'
        },
        {
          id: '4',
          email: 'lisa.viewer@restaurant.com',
          name: 'Lisa Chen',
          role: 'viewer',
          status: 'pending',
          joined_at: '2024-01-12T00:00:00Z',
          last_active: '2024-01-12T14:20:00Z',
          permissions: ['menu', 'qr'],
          avatar: '/avatars/lisa.jpg'
        }
      ];
      
      setUsers(mockUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when workspace changes
  useEffect(() => {
    if (currentWorkspace) {
      loadUsers();
    }
  }, [currentWorkspace]);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle invite user
  const handleInviteUser = async (data: InviteUserData) => {
    try {
      // Mock API call
      console.log('Inviting user:', data);
      
      // Add to users list
      const newUser: WorkspaceUser = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: data.role,
        status: 'pending',
        joined_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
        permissions: createRBAC(data.role).getPermissions().map(p => `${p.resource}:${p.action}`)
      };
      
      setUsers(prev => [...prev, newUser]);
      setShowInviteModal(false);
      setInviteData({ email: '', name: '', role: 'staff', message: '' });
    } catch (err) {
      setError('Failed to invite user');
    }
  };

  // Handle update user role
  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, role: newRole, permissions: createRBAC(newRole).getPermissions().map(p => `${p.resource}:${p.action}`) }
          : user
      ));
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  // Handle remove user
  const handleRemoveUser = async (userId: string) => {
    try {
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to remove user');
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Workspace Selected</h2>
            <p className="text-gray-500">Please select a workspace to manage users.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/restaurant-curator" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Restaurant Curator
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-600">{currentWorkspace.name}</p>
              </div>
            </div>
            
            <RoleGuard userRole="owner" resource="users" action="create">
              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite User
              </button>
            </RoleGuard>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Users Data */}
        {!loading && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    {Object.entries(ROLES).map(([key, role]) => (
                      <option key={key} value={key}>{role.name}</option>
                    ))}
                  </select>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'pending')}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Users ({filteredUsers.length})
                </h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                            ) : (
                              <User className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' :
                              user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {ROLES[user.role].name}
                            </span>
                            <span className="text-xs text-gray-500">
                              Joined {new Date(user.joined_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RoleGuard userRole="owner" resource="users" action="update">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditModal(true);
                            }}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                        </RoleGuard>
                        
                        <RoleGuard userRole="owner" resource="users" action="delete">
                          <button
                            onClick={() => handleRemoveUser(user.id)}
                            className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </RoleGuard>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite New User</h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleInviteUser(inviteData);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={inviteData.email}
                      onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteData.name}
                      onChange={(e) => setInviteData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={inviteData.role}
                      onChange={(e) => setInviteData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(ROLES).map(([key, role]) => (
                        <option key={key} value={key}>{role.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message (Optional)
                    </label>
                    <textarea
                      value={inviteData.message}
                      onChange={(e) => setInviteData(prev => ({ ...prev, message: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a personal message to the invitation..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit User Role</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User
                  </label>
                  <p className="text-sm text-gray-900">{selectedUser.name} ({selectedUser.email})</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => {
                      const newRole = e.target.value as UserRole;
                      handleUpdateUserRole(selectedUser.id, newRole);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(ROLES).map(([key, role]) => (
                      <option key={key} value={key}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
