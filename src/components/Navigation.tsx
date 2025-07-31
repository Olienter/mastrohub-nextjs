'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/profile/UserMenu';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Menu Maker', href: '/menu-maker' },
    { name: 'Forecast Planner', href: '/forecast-planner' },
    { name: 'Restaurant Curator', href: '/restaurant-curator' },
    { name: 'Marketing Assistant', href: '/marketing-assistant' },
    { name: 'Blog', href: '/blog' }
  ];

  const dashboardItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Analytics', href: '/dashboard/analytics' },
    { name: 'Data Management', href: '/dashboard/data-management' },
    { name: 'Moderate', href: '/dashboard/moderate' },
    { name: 'Users', href: '/dashboard/users' },
    { name: 'Bookmarks', href: '/bookmarks' },
    { name: 'Badges', href: '/badges' }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/10 backdrop-blur-md border-b border-green-500/20 shadow-lg' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-white font-bold text-xl">MastroHub</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-green-400'
                      : 'text-white/80 hover:text-green-400'
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400"
                      layoutId="activeTab"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
            
            {/* Dashboard Dropdown for authenticated users */}
            {user && (
              <div className="relative group">
                <button className="relative px-3 py-2 text-sm font-medium text-white/80 hover:text-green-400 transition-colors duration-200">
                  Dashboard
                  <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    {dashboardItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block px-4 py-2 text-sm text-white/80 hover:text-green-400 hover:bg-white/10 transition-colors ${
                          isActive(item.href) ? 'text-green-400 bg-white/10' : ''
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            <ThemeToggle size="sm" />
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link href="/login">
                  <button className="text-white/70 hover:text-white transition-colors font-medium">
                    Log In
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-mastroCyan-400 hover:bg-mastroCyan-500 text-neutral-900 px-4 py-2 rounded-lg font-medium transition-colors">
                    Join
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              className="text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''
                }`} />
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 mt-1 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`} />
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 mt-1 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''
                }`} />
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white/10 backdrop-blur-md border-t border-green-500/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-green-400'
                        : 'text-white/80 hover:text-green-400'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <button className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl">
                  Get Started
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation; 