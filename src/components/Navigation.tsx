'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import heavy animations
import { MotionDiv, MotionNav, MotionUl, MotionLi, MotionButton, MotionAnimatePresence, fadeIn, slideIn } from '@/lib/optimizedImports';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import UserMenu from '@/components/profile/UserMenu';
import ThemeToggle from '@/components/ui/ThemeToggle';
import NotificationBell from '@/components/notifications/NotificationBell';
import { LanguageSwitcher, CompactLanguageSwitcher } from '@/components/ui/LanguageSwitcher';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Zjednodušené navigačné položky - len tie ktoré potrebujeme
  const navItems = [
    { name: 'Dashboard', href: '/' },
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

  return (
    <MotionNav
      className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-surface/95 backdrop-blur-md border-b border-border shadow-lg' 
          : 'bg-surface/80 backdrop-blur-sm border-b border-border/60'
      }`}
      variants={slideIn}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - zjednodušené bez zelenej farby */}
          <MotionDiv
            className="flex items-center flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <span className="text-fg font-bold text-xl">MastroHub</span>
            </Link>
          </MotionDiv>

          {/* Desktop Navigation - opravené prekrývanie */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-center max-w-2xl">
            {navItems.map((item) => (
              <MotionDiv
                key={item.name}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <Link
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-fg hover:text-primary'
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <MotionDiv
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeTab"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </MotionDiv>
            ))}
          </div>

          {/* Right Section - opravené prekrývanie */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {/* CTA Button */}
            <MotionButton
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </MotionButton>

            {/* Language Switcher */}
            <LanguageSwitcher className="flex-shrink-0" />
            
            {/* Theme Toggle */}
            <ThemeToggle size="sm" />
            
            {/* Notification Bell */}
            {user && <NotificationBell />}
            
            {/* Auth Section */}
            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <button className="text-fg hover:text-primary transition-colors font-medium whitespace-nowrap">
                    Sign In
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
                    Join
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex-shrink-0">
            <MotionButton
              className="text-fg p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-fg transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''
                }`} />
                <span className={`block w-5 h-0.5 bg-fg transition-all duration-300 mt-1 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`} />
                <span className={`block w-5 h-0.5 bg-fg transition-all duration-300 mt-1 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''
                }`} />
              </div>
            </MotionButton>
          </div>
        </div>
      </div>

      {/* Mobile Menu - zjednodušené */}
      <MotionAnimatePresence>
        {isMobileMenuOpen && (
          <MotionDiv
            className="md:hidden bg-surface/95 backdrop-blur-md border-t border-border"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <MotionDiv
                  key={item.name}
                  variants={slideIn}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-primary'
                        : 'text-fg hover:text-primary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>
        )}
      </MotionAnimatePresence>
    </MotionNav>
  );
};

export default Navigation; 