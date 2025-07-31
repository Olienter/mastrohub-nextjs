'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Building, Clock, Palette, Camera, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AvatarUpload from '@/components/profile/AvatarUpload';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
  restaurant: string;
  experience: string;
  background: 'gradient' | 'solid' | 'pattern' | 'image';
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.user_metadata?.full_name || 'John Doe',
    email: user?.email || 'john@example.com',
    role: 'Restaurant Manager',
    avatar: user?.user_metadata?.avatar_url || '/api/placeholder/150/150',
    bio: 'Passionate restaurant manager with 10+ years of experience in the hospitality industry.',
    restaurant: 'The Grand Bistro',
    experience: '10+ years',
    background: 'gradient'
  });

  const updateProfile = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const backgroundOptions = [
    { id: 'gradient', name: 'Gradient', class: 'bg-gradient-to-r from-blue-500 to-purple-600' },
    { id: 'solid', name: 'Solid', class: 'bg-gray-900' },
    { id: 'pattern', name: 'Pattern', class: 'bg-gray-100' },
    { id: 'image', name: 'Image', class: 'bg-cover bg-center' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-white/70">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Basic Info */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <AvatarUpload
                      currentAvatar={profile.avatar}
                      onUpload={async (file) => {
                        // Handle avatar upload
                        console.log('Avatar uploaded:', file);
                      }}
                      size="lg"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => updateProfile('name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Full Name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <input
                        type="text"
                        value={profile.role}
                        onChange={(e) => updateProfile('role', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your Role"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => updateProfile('bio', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant</label>
                    <input
                      type="text"
                      value={profile.restaurant}
                      onChange={(e) => updateProfile('restaurant', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Restaurant Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    <input
                      type="text"
                      value={profile.experience}
                      onChange={(e) => updateProfile('experience', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Years of Experience"
                    />
                  </div>
                </div>
              </div>

              {/* Background Options */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Background Settings</h3>
                <div className="space-y-3">
                  {backgroundOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() => updateProfile('background', option.id as any)}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        profile.background === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">{option.name}</span>
                        <div className={`w-8 h-8 rounded ${option.class}`}></div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <motion.button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </motion.button>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Account Info */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Plan</span>
                    <span className="font-semibold text-gray-900 dark:text-white">Free</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Role</span>
                    <span className="font-semibold text-gray-900 dark:text-white">Reader</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a
                    href="/dashboard"
                    className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    Go to Dashboard
                  </a>
                  <a
                    href="/settings"
                    className="block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-center"
                  >
                    Settings
                  </a>
                  <a
                    href="/blog"
                    className="block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-center"
                  >
                    Read Blog
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage; 