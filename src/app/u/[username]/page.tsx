"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Edit3,
  MapPin,
  Calendar,
  Award,
  Users,
  BookOpen,
  Heart,
  Settings
} from 'lucide-react';
import AvatarUpload from '@/components/profile/AvatarUpload';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { useAuthStore } from '@/lib/auth';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  role: string;
  subscription_status: string;
  created_at: string;
  articles_count: number;
  followers_count: number;
  following_count: number;
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user } = useAuthStore();
  const { uploadAvatar } = useAvatarUpload();

  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    username: username,
    full_name: 'John Smith',
    email: 'john.smith@restaurant.com',
    avatar_url: undefined,
    bio: 'Experienced restaurant manager with 8+ years in the industry. Passionate about optimizing operations and maximizing profitability through data-driven decisions.',
    location: 'New York, NY',
    role: 'Restaurant Manager',
    subscription_status: 'free',
    created_at: '2023-01-15',
    articles_count: 12,
    followers_count: 156,
    following_count: 89
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    // Check if this is the current user's profile
    setIsOwnProfile(user?.id === profile.id);
  }, [user, profile.id]);

  const handleAvatarUpload = async (file: File) => {
    try {
      const result = await uploadAvatar(file);
      if (result.success && result.url) {
        setProfile(prev => ({
          ...prev,
          avatar_url: result.url
        }));
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
    }
  };

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Mastro</span>
              <span className="text-2xl font-bold text-blue-600">Hub</span>
            </Link>

            <div className="flex items-center space-x-4">
              {isOwnProfile && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 size={16} />
                  <span>{isEditing ? 'Save' : 'Edit Profile'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="relative">
                {isOwnProfile && isEditing ? (
                  <AvatarUpload
                    currentAvatar={profile.avatar_url}
                    onUpload={handleAvatarUpload}
                    size="lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      profile.full_name.charAt(0)
                    )}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {profile.full_name}
                  </h1>
                  <span className="text-gray-500 dark:text-gray-400">@{profile.username}</span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                    {profile.role}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {profile.subscription_status === 'premium' ? 'Premium Member' : 'Free Member'}
                </p>

                <p className="text-gray-700 dark:text-gray-200 mb-4">
                  {profile.bio}
                </p>

                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MapPin size={16} />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award size={16} />
                    <span>{profile.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="flex space-x-8 justify-center">
            <div className="flex items-center space-x-2">
              <BookOpen size={18} className="text-blue-500" />
              <span className="font-semibold">{profile.articles_count}</span>
              <span className="text-gray-500 dark:text-gray-400">Articles</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={18} className="text-blue-500" />
              <span className="font-semibold">{profile.followers_count}</span>
              <span className="text-gray-500 dark:text-gray-400">Followers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart size={18} className="text-blue-500" />
              <span className="font-semibold">{profile.following_count}</span>
              <span className="text-gray-500 dark:text-gray-400">Following</span>
            </div>
          </div>

          {/* Bio Editor */}
          {isOwnProfile && isEditing && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Bio
              </label>
              <textarea
                value={profile.bio || ''}
                onChange={e => updateProfile('bio', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          )}

          {/* Settings Link */}
          {isOwnProfile && (
            <div className="text-center">
              <Link
                href="/settings"
                className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Settings size={16} />
                <span>Account Settings</span>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 