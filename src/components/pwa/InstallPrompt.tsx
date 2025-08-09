'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Wifi, Zap } from 'lucide-react';
import pwaManager from '@/lib/pwa-manager';

interface InstallPromptProps {
  onClose?: () => void;
}

export default function InstallPrompt({ onClose }: InstallPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [features, setFeatures] = useState(pwaManager.getFeatures());

  useEffect(() => {
    const handleCanInstallChanged = () => {
      const newFeatures = pwaManager.getFeatures();
      setFeatures(newFeatures);
      setIsVisible(newFeatures.canInstall && !newFeatures.isInstalled);
    };

    const handleInstalled = () => {
      setIsVisible(false);
      setFeatures(pwaManager.getFeatures());
    };

    pwaManager.addEventListener('canInstallChanged', handleCanInstallChanged);
    pwaManager.addEventListener('installed', handleInstalled);

    // Check initial state
    const initialFeatures = pwaManager.getFeatures();
    setFeatures(initialFeatures);
    setIsVisible(initialFeatures.canInstall && !initialFeatures.isInstalled);

    return () => {
      pwaManager.removeEventListener('canInstallChanged', handleCanInstallChanged);
      pwaManager.removeEventListener('installed', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await pwaManager.installApp();
      if (success) {
        setIsVisible(false);
        onClose?.();
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50"
      >
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Install MastroHub</h3>
                <p className="text-sm text-gray-600">Get the full app experience</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">Access from your home screen</span>
            </div>
            <div className="flex items-center space-x-3">
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">Works offline</span>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">Faster loading times</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isInstalling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Installing...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Install</span>
                </>
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
