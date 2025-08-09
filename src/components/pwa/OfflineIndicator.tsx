'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, CheckCircle } from 'lucide-react';
import pwaManager from '@/lib/pwa-manager';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [features, setFeatures] = useState(pwaManager.getFeatures());

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setIsReconnecting(false);
      setFeatures(pwaManager.getFeatures());
    };

    const handleOffline = () => {
      setIsOffline(true);
      setFeatures(pwaManager.getFeatures());
    };

    pwaManager.addEventListener('online', handleOnline);
    pwaManager.addEventListener('offline', handleOffline);

    // Check initial state
    const initialFeatures = pwaManager.getFeatures();
    setFeatures(initialFeatures);
    setIsOffline(!initialFeatures.isOnline);

    return () => {
      pwaManager.removeEventListener('online', handleOnline);
      pwaManager.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = async () => {
    setIsReconnecting(true);
    try {
      await pwaManager.updateServiceWorker();
      // Simulate reconnection delay
      setTimeout(() => {
        setIsReconnecting(false);
      }, 2000);
    } catch (error) {
      console.error('Refresh failed:', error);
      setIsReconnecting(false);
    }
  };

  if (!isOffline) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-2"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <WifiOff className="w-5 h-5" />
            <span className="text-sm font-medium">
              You're offline. Some features may be limited.
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {features.hasServiceWorker && (
              <div className="flex items-center space-x-1 text-xs">
                <CheckCircle className="w-3 h-3" />
                <span>Offline mode available</span>
              </div>
            )}
            
            <button
              onClick={handleRefresh}
              disabled={isReconnecting}
              className="flex items-center space-x-1 text-xs hover:text-yellow-200 disabled:opacity-50"
            >
              {isReconnecting ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Reconnecting...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
