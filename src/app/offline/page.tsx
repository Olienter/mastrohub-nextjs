'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw, Home, Menu, BarChart3, ShoppingCart, FileText, Users } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastOnline, setLastOnline] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnline(new Date());
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Check initial state
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const offlineFeatures = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'View cached data and recent metrics',
      icon: <Home className="w-6 h-6" />,
      color: 'bg-blue-500',
      href: '/restaurant-curator'
    },
    {
      id: 'menu-maker',
      title: 'Menu Maker',
      description: 'View and edit cached menus',
      icon: <Menu className="w-6 h-6" />,
      color: 'bg-green-500',
      href: '/menu-maker'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'View cached analytics data',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-purple-500',
      href: '/advanced-analytics'
    },
    {
      id: 'supply-chain',
      title: 'Supply Chain',
      description: 'View cached inventory data',
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-red-500',
      href: '/supply-chain'
    },
    {
      id: 'training',
      title: 'Training',
      description: 'Access cached training materials',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-indigo-500',
      href: '/training-education'
    },
    {
      id: 'user-management',
      title: 'Team Management',
      description: 'View cached team information',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-pink-500',
      href: '/user-management'
    }
  ];

  const handleRefresh = () => {
    window.location.reload();
  };

  if (isOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Back Online!</h1>
          <p className="text-slate-300 mb-6">You're connected to the internet again.</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">You're Offline</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Don't worry! MastroHub works offline too. You can still access cached data and use many features.
          </p>
          {lastOnline && (
            <p className="text-sm text-slate-400 mt-2">
              Last online: {lastOnline.toLocaleString()}
            </p>
          )}
        </motion.div>

        {/* Offline Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Available Offline Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offlineFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-slate-800/80 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <Link href={feature.href} className="block">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color} text-white`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-slate-300">{feature.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Offline Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 rounded-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Offline Tips</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-blue-800">
                Data is cached locally, so you can view recent information even without internet.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-blue-800">
                Changes made offline will sync automatically when you're back online.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-blue-800">
                Push notifications and real-time updates will resume when connected.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">No Internet Connection</span>
          </div>
          <p className="text-sm text-slate-400 mt-2">
            Check your network connection and try refreshing the page
          </p>
        </motion.div>
      </div>
    </div>
  );
}
