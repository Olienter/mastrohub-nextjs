'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MotionDiv, MotionH1, MotionP, MotionButton, fadeIn, slideUp } from '@/lib/optimizedImports';
import { 
  Search, 
  Menu, 
  X, 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  Heart, 
  Brain, 
  Users, 
  BookOpen, 
  Zap, 
  Target,
  BarChart3,
  TrendingUp,
  Shield,
  Globe,
  UtensilsCrossed,
  Building2,
  Megaphone,
  Play,
  Star,
  Clock,
  DollarSign,
  TrendingDown
} from 'lucide-react';
import HorizontalTools from '@/components/HorizontalTools';
import Footer from '@/components/Footer';

// Analytics tracking function
const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, left: string, top: string}>>([]);
  const [isCTALoading, setIsCTALoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      trackEvent('page_view', { page: 'home' });
    }, 100);

    // Generate stable particle positions - REDUCED for better performance
    const particlePositions = Array.from({ length: 8 }, (_, i) => ({ // Reduced from 15 to 8
      id: i,
      left: `${(i * 12.5) % 100}%`,
      top: `${(i * 12.5) % 100}%`,
    }));
    setParticles(particlePositions);

    // Exit intent detection - OPTIMIZED
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitIntent) {
        setShowExitIntent(true);
        trackEvent('exit_intent_triggered');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []); // Removed showExitIntent dependency to prevent re-runs

  const handleStartFreeClick = useCallback(async () => {
    setIsCTALoading(true);
    setError(null);
    
    try {
      trackEvent('cta_click', { cta: 'start_free' });
      
      // Simulate API call or redirect
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/register');
    } catch (error) {
      console.error('Navigation error:', error);
      setError('Failed to navigate. Please try again.');
      trackEvent('error', { error: 'navigation_failed' });
      router.push('/login');
    } finally {
      setIsCTALoading(false);
    }
  }, [router]);

  const handleNavigationClick = useCallback((path: string) => {
    trackEvent('navigation_click', { destination: path });
    router.push(path);
    setIsMobileMenuOpen(false);
  }, [router]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      trackEvent('search', { query: searchQuery });
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  }, [searchQuery, router]);

  const handleToolClick = useCallback((toolId: string, path: string) => {
    trackEvent('tool_click', { tool: toolId, path });
    router.push(path);
  }, [router]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsMobileMenuOpen(false);
      setIsSearchOpen(false);
    }
  }, []);

  const particleElements = React.useMemo(() => 
    particles.map((particle) => (
      <div
        key={particle.id}
        className="absolute w-1 h-1 bg-blue-200/30 rounded-full"
        style={{
          left: particle.left,
          top: particle.top,
        }}
      />
    )), [particles]);

  return (
    <div className="min-h-screen bg-white">
      {/* Simplified background - no complex animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100" />
      
      {/* Particles - simplified static version */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particleElements}
      </div>

      {/* Main content */}
      <div className="relative z-10 pt-16"> {/* Added pt-16 to account for fixed Navigation */}
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Professional Restaurant Management
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your restaurant operations with our comprehensive suite of tools. 
              Manage menus, track performance, and optimize your business.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleStartFreeClick}
                disabled={isCTALoading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isCTALoading ? 'Loading...' : 'Start Free Trial'}
              </button>
              <button
                onClick={() => router.push('/menu-maker')}
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Try Menu Maker
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Powerful Tools for Your Restaurant
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Menu Maker</h3>
                <p className="text-gray-600 mb-4">
                  Create and manage your menu with our intuitive tools. 
                  Import from images, organize by categories, and track performance.
                </p>
                <button
                  onClick={() => handleToolClick('menu-maker', '/menu-maker')}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Try Menu Maker →
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Restaurant Curator</h3>
                <p className="text-gray-600 mb-4">
                  Manage your restaurant operations, track analytics, 
                  and optimize your business performance.
                </p>
                <button
                  onClick={() => handleToolClick('restaurant-curator', '/restaurant-curator')}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Open Curator →
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Analytics & Insights</h3>
                <p className="text-gray-600 mb-4">
                  Get detailed insights into your restaurant performance 
                  and make data-driven decisions.
                </p>
                <button
                  onClick={() => handleToolClick('analytics', '/restaurant-curator')}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View Analytics →
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
