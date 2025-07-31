import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  Menu, 
  Search, 
  Sun, 
  Moon,
  BookOpen,
  TrendingUp,
  Users,
  Settings,
  BarChart3,
  Target,
  Award,
  Home,
  Copy,
  Check
} from 'lucide-react';

const BlogLayout = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Copy to clipboard
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Optimized Categories for Monetization
  const categories = [
    { id: 'all', name: 'All', count: 106, active: true },
    { id: 'menu-engineering', name: 'Menu Engineering', count: 25 },
    { id: 'revenue-optimization', name: 'Revenue Optimization', count: 18 },
    { id: 'staff-management', name: 'Staff Management', count: 15 },
    { id: 'success-stories', name: 'Success Stories', count: 12 },
    { id: 'tips', name: 'Tips & Tricks', count: 30 }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-neutral-200 dark:bg-neutral-700 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-mastroCyan-400 to-teal-500"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-neutral-900 dark:text-white">Mastro</span>
              <span className="text-2xl font-bold text-mastroCyan-400">Hub</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/blog" className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors">
                Blog
              </Link>
              <Link to="/about-editors" className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors">
                About Editors
              </Link>
              <Link to="/tools" className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors">
                Tools
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Mobile Menu */}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-white dark:bg-neutral-900">
        {children}
      </main>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Copy Button Component */}
      <CopyButton onCopy={handleCopy} copied={copied} />
    </div>
  );
};

// Copy Button Component
const CopyButton = ({ onCopy, copied }) => {
  return (
    <button
      onClick={() => onCopy('Copied text')}
      className="fixed bottom-4 right-4 p-3 bg-mastroCyan-400 text-white rounded-full shadow-lg hover:bg-mastroCyan-500 transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={20} /> : <Copy size={20} />}
    </button>
  );
};

export default BlogLayout; 