'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Settings as SettingsIcon,
  ArrowLeft,
  Save,
  X,
  Eye,
  EyeOff,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  User,
  Building,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/contexts/AuthContext';
import RoleGuard from '@/components/auth/RoleGuard';

interface WorkspaceSettings {
  name: string;
  description: string;
  timezone: string;
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    public_menu: boolean;
    show_analytics: boolean;
    allow_reviews: boolean;
  };
  branding: {
    logo_url?: string;
    primary_color: string;
    secondary_color: string;
  };
}

export default function Settings() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  
  // State
  const [settings, setSettings] = useState<WorkspaceSettings>({
    name: '',
    description: '',
    timezone: 'UTC',
    currency: 'USD',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      public_menu: true,
      show_analytics: false,
      allow_reviews: true
    },
    branding: {
      primary_color: '#3B82F6',
      secondary_color: '#1F2937'
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load settings
  const loadSettings = async () => {
    if (!currentWorkspace) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Mock data - in real implementation, this would fetch from API
      const mockSettings: WorkspaceSettings = {
        name: currentWorkspace.name,
        description: 'Fine dining restaurant specializing in Italian cuisine',
        timezone: 'Europe/Bratislava',
        currency: 'EUR',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        privacy: {
          public_menu: true,
          show_analytics: false,
          allow_reviews: true
        },
        branding: {
          logo_url: '/logo.png',
          primary_color: '#3B82F6',
          secondary_color: '#1F2937'
        }
      };
      
      setSettings(mockSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const handleSaveSettings = async () => {
    if (!currentWorkspace) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Mock API call
      console.log('Saving settings:', settings);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Settings saved successfully!');
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    if (currentWorkspace) {
      loadSettings();
    }
  }, [currentWorkspace]);

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Workspace Selected</h2>
            <p className="text-gray-500">Please select a workspace to view settings.</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-600">{currentWorkspace.name}</p>
              </div>
            </div>
            
            <RoleGuard userRole="owner" resource="settings" action="update">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </RoleGuard>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <p className="text-sm text-green-700 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Content */}
        {!loading && (
          <div className="space-y-6">
            {/* General Settings */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  General Settings
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={settings.description}
                    onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="Europe/Bratislava">Europe/Bratislava</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="sk">Slovak</option>
                      <option value="de">German</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ 
                      ...prev, 
                      notifications: { ...prev.notifications, email: !prev.notifications.email }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                    <p className="text-sm text-gray-500">Receive updates in browser</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ 
                      ...prev, 
                      notifications: { ...prev.notifications, push: !prev.notifications.push }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.notifications.push ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.notifications.push ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                    <p className="text-sm text-gray-500">Receive updates via SMS</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ 
                      ...prev, 
                      notifications: { ...prev.notifications, sms: !prev.notifications.sms }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.notifications.sms ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Privacy & Security
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Public Menu</h4>
                    <p className="text-sm text-gray-500">Allow public access to menu</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ 
                      ...prev, 
                      privacy: { ...prev.privacy, public_menu: !prev.privacy.public_menu }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.privacy.public_menu ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.privacy.public_menu ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Show Analytics</h4>
                    <p className="text-sm text-gray-500">Display analytics to staff</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ 
                      ...prev, 
                      privacy: { ...prev.privacy, show_analytics: !prev.privacy.show_analytics }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.privacy.show_analytics ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.privacy.show_analytics ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Allow Reviews</h4>
                    <p className="text-sm text-gray-500">Allow customer reviews</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ 
                      ...prev, 
                      privacy: { ...prev.privacy, allow_reviews: !prev.privacy.allow_reviews }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.privacy.allow_reviews ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.privacy.allow_reviews ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Branding
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={settings.branding.primary_color}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      branding: { ...prev.branding, primary_color: e.target.value }
                    }))}
                    className="h-10 w-20 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    value={settings.branding.secondary_color}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      branding: { ...prev.branding, secondary_color: e.target.value }
                    }))}
                    className="h-10 w-20 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
