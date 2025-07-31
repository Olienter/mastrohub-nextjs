"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, BookOpen, User as UserIcon, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import NotificationCenter from '@/components/ui/NotificationCenter';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-white/70 hover:text-white transition-colors font-medium"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Notification Center */}
      <NotificationCenter />
      
      {/* User Menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
        >
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
          <span className="hidden md:block text-sm font-medium">
            {(user as any)?.name || user.email?.split('@')[0]}
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 mt-2 w-56 bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20 py-1 z-50"
            >
              <div className="px-4 py-3 border-b border-white/20">
                <p className="text-sm font-medium text-white">
                  {(user as any)?.name || 'User'}
                </p>
                <p className="text-xs text-white/60">
                  {user.email}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/dashboard"
                  className="flex items-center px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4 mr-3" />
                  Dashboard
                </Link>
                
                <Link
                  href="/dashboard/analytics"
                  className="flex items-center px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <BookOpen className="w-4 h-4 mr-3" />
                  Analytics
                </Link>
                
                <Link
                  href="/dashboard/moderate"
                  className="flex items-center px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Bell className="w-4 h-4 mr-3" />
                  Moderate Content
                </Link>
                
                <Link
                  href="/dashboard/users"
                  className="flex items-center px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <UserIcon className="w-4 h-4 mr-3" />
                  User Management
                </Link>
                
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </Link>
              </div>

              <div className="border-t border-white/20 py-1">
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}