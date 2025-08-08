'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Bell, 
  Settings, 
  LogOut, 
  User,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import UserMenu from '@/components/profile/UserMenu';

interface UnifiedHeaderProps {
  title?: string;
  subtitle?: string;
  userInfo?: string;
  toolName?: string;
  notifications?: number;
  showBackButton?: boolean;
  backUrl?: string;
  backText?: string;
  rightActions?: React.ReactNode;
}

export default function UnifiedHeader({
  title,
  subtitle,
  userInfo,
  toolName,
  notifications = 0,
  showBackButton = false,
  backUrl,
  backText,
  rightActions
}: UnifiedHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Menu Maker', href: '/menu-maker' },
    { name: 'QR Menu', href: '/qrmenu' },
    { name: 'Restaurant Curator', href: '/restaurant-curator' },
    { name: 'Blog', href: '/blog' }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200/60 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Left - Branding */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-gray-900 font-bold text-xl tracking-tight">MastroHub</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50 border border-blue-200/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-3">
            {rightActions && (
              <div className="hidden sm:flex items-center gap-2">
                {rightActions}
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <ThemeToggle size="sm" />
              
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200">
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {notifications}
                  </span>
                )}
              </button>
              
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200">
                <Settings className="w-4 h-4" />
              </button>
              
              <UserMenu />
            </div>
          </div>
        </div>

        {/* User Info Bar */}
        <div className="border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {userInfo || user?.email || 'admin@test.com'}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">
                {toolName || 'Menu Maker'}
              </span>
            </div>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md">
              Get Started
            </button>
          </div>
        </div>

        {/* Tool-specific header */}
        {(title || showBackButton) && (
          <div className="border-t border-gray-100 bg-white">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center gap-4">
                {showBackButton && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-medium">{backText || 'Back'}</span>
                  </button>
                )}
                
                {title && (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
                    {subtitle && (
                      <p className="text-gray-600 mt-0.5 text-sm">{subtitle}</p>
                    )}
                  </div>
                )}
              </div>

              {rightActions && (
                <div className="flex items-center gap-2">
                  {rightActions}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
