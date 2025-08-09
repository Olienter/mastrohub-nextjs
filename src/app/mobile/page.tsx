'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import {
  Home,
  Menu,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  Plus,
  Smartphone,
  Wifi,
  Zap,
  Download,
  ArrowLeft,
  ChevronRight,
  Star,
  Clock,
  TrendingUp,
  ShoppingCart,
  FileText,
  MessageSquare
} from 'lucide-react';
import pwaManager from '@/lib/pwa-manager';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import OfflineIndicator from '@/components/pwa/OfflineIndicator';

interface MobileMenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  href: string;
  badge?: string;
}

export default function MobilePage() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  const [activeTab, setActiveTab] = useState('home');
  const [features, setFeatures] = useState(pwaManager.getFeatures());
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const updateFeatures = () => {
      setFeatures(pwaManager.getFeatures());
    };

    pwaManager.addEventListener('canInstallChanged', updateFeatures);
    pwaManager.addEventListener('installed', updateFeatures);

    return () => {
      pwaManager.removeEventListener('canInstallChanged', updateFeatures);
      pwaManager.removeEventListener('installed', updateFeatures);
    };
  }, []);

  const mobileMenuItems: MobileMenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <Home className="w-6 h-6" />,
      description: 'Overview and key metrics',
      color: 'bg-blue-500',
      href: '/restaurant-curator'
    },
    {
      id: 'menu-maker',
      title: 'Menu Maker',
      icon: <Menu className="w-6 h-6" />,
      description: 'Create and manage menus',
      color: 'bg-green-500',
      href: '/menu-maker'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'Advanced insights and reports',
      color: 'bg-purple-500',
      href: '/advanced-analytics'
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      icon: <MessageSquare className="w-6 h-6" />,
      description: 'Smart recommendations and chat',
      color: 'bg-orange-500',
      href: '/ai-assistant'
    },
    {
      id: 'supply-chain',
      title: 'Supply Chain',
      icon: <ShoppingCart className="w-6 h-6" />,
      description: 'Inventory and supplier management',
      color: 'bg-red-500',
      href: '/supply-chain'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="w-6 h-6" />,
      description: 'Real-time updates and alerts',
      color: 'bg-yellow-500',
      href: '/notifications',
      badge: '3'
    },
    {
      id: 'training',
      title: 'Training',
      icon: <FileText className="w-6 h-6" />,
      description: 'Staff training and education',
      color: 'bg-indigo-500',
      href: '/training-education'
    },
    {
      id: 'user-management',
      title: 'Team Management',
      icon: <Users className="w-6 h-6" />,
      description: 'Manage team members and roles',
      color: 'bg-pink-500',
      href: '/user-management'
    }
  ];

  const quickActions = [
    {
      id: 'new-menu',
      title: 'Create Menu',
      icon: <Plus className="w-5 h-5" />,
      color: 'bg-green-100 text-green-700'
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'check-inventory',
      title: 'Check Inventory',
      icon: <ShoppingCart className="w-5 h-5" />,
      color: 'bg-orange-100 text-orange-700'
    },
    {
      id: 'ai-chat',
      title: 'AI Chat',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-700'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      title: 'Menu updated',
      description: 'Italian Specials menu was updated',
      time: '2 minutes ago',
      icon: <Menu className="w-4 h-4" />,
      color: 'text-green-600'
    },
    {
      id: '2',
      title: 'New order received',
      description: 'Order #1234 for delivery',
      time: '5 minutes ago',
      icon: <ShoppingCart className="w-4 h-4" />,
      color: 'text-blue-600'
    },
    {
      id: '3',
      title: 'Analytics report ready',
      description: 'Weekly sales report is available',
      time: '10 minutes ago',
      icon: <BarChart3 className="w-4 h-4" />,
      color: 'text-purple-600'
    }
  ];

  const renderHomeTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">MastroHub</h1>
          <p className="text-slate-300">Mobile Dashboard</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PWA Status */}
      {!features.isInstalled && features.canInstall && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Install App</h3>
                <p className="text-sm opacity-90">Get the full mobile experience</p>
              </div>
            </div>
            <button
              onClick={() => setShowInstallPrompt(true)}
              className="bg-slate-700/50 text-blue-400 px-3 py-1 rounded-lg text-sm font-medium"
            >
              Install
            </button>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/80 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-slate-300">Today's Sales</span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">€2,847</p>
          <p className="text-sm text-green-600">+12% from yesterday</p>
        </div>
        <div className="bg-slate-800/80 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-slate-300">Active Orders</span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">8</p>
          <p className="text-sm text-blue-600">3 pending</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg flex items-center space-x-3 ${action.color}`}
            >
              {action.icon}
              <span className="font-medium">{action.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Recent Activities</h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <motion.div
              key={activity.id}
              whileHover={{ scale: 1.01 }}
              className="bg-slate-800/80 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-1 ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{activity.title}</h4>
                  <p className="text-sm text-slate-300">{activity.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">{activity.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMenuTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">All Features</h2>
        <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg">
          <Search className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {mobileMenuItems.map((item) => (
          <motion.a
            key={item.id}
            href={item.href}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="block bg-slate-800/80 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.color} text-white`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">App Settings</h2>

      {/* PWA Features */}
      <div className="bg-slate-800/80 rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-white mb-3">Progressive Web App</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-slate-300">App Installation</span>
            </div>
            <span className={`text-sm ${features.isInstalled ? 'text-green-600' : 'text-slate-400'}`}>
              {features.isInstalled ? 'Installed' : 'Not installed'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wifi className="w-5 h-5 text-green-600" />
              <span className="text-sm text-slate-300">Offline Support</span>
            </div>
            <span className={`text-sm ${features.hasServiceWorker ? 'text-green-600' : 'text-slate-400'}`}>
              {features.hasServiceWorker ? 'Available' : 'Not available'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-slate-300">Push Notifications</span>
            </div>
            <span className={`text-sm ${features.hasPushSupport ? 'text-green-600' : 'text-slate-400'}`}>
              {features.hasPushSupport ? 'Available' : 'Not available'}
            </span>
          </div>
        </div>
      </div>

      {/* App Actions */}
      <div className="space-y-3">
        <button className="w-full bg-slate-700/50 text-slate-200 py-3 px-4 rounded-lg font-medium hover:bg-slate-700/70 transition-colors">
          Request Push Notifications
        </button>
        <button className="w-full bg-slate-700/50 text-slate-200 py-3 px-4 rounded-lg font-medium hover:bg-slate-700/70 transition-colors">
          Clear Cache
        </button>
        <button className="w-full bg-slate-700/50 text-slate-200 py-3 px-4 rounded-lg font-medium hover:bg-slate-700/70 transition-colors">
          Check for Updates
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <OfflineIndicator />
      
      {/* Main Content */}
      <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
        <div className="p-4">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderHomeTab()}
              </motion.div>
            )}
            
            {activeTab === 'menu' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderMenuTab()}
              </motion.div>
            )}
            
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderSettingsTab()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-800/80 border-t border-slate-700/50">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              activeTab === 'home' ? 'text-blue-400 bg-blue-900/20' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              activeTab === 'menu' ? 'text-blue-400 bg-blue-900/20' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs">Menu</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              activeTab === 'settings' ? 'text-blue-400 bg-blue-900/20' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>

      {/* Install Prompt */}
      {showInstallPrompt && (
        <InstallPrompt onClose={() => setShowInstallPrompt(false)} />
      )}
    </div>
  );
}
