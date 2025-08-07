"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, Award, Utensils, Users, Megaphone, Building2, Leaf, Zap, TrendingUp, Settings } from 'lucide-react';

// Core Components
import ErrorBoundary from '@/components/ErrorBoundary';
import BlogCard from '@/components/blog/BlogCard';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ScrollToTop from '@/components/blog/ScrollToTop';
import ReadingProgress from '@/components/blog/ReadingProgress';
import BlogHero from '@/components/blog/BlogHero';
import CompactNewsletter from '@/components/blog/CompactNewsletter';
import AuthorCard from '@/components/blog/AuthorCard';
import { useBlogStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';

export default function BlogContent() {
  const { user } = useAuth();
  const { 
    selectedCategory,
    setSelectedCategory,
    getPublishedArticles,
    getFeaturedArticles,
    getFilteredArticles
  } = useBlogStore();

  const articles = getPublishedArticles();
  const featuredArticles = getFeaturedArticles();
  const regularArticles = articles.filter(article => !article.featured);

  const categories = [
    { id: 'all', name: 'All', icon: Target, count: articles.length },
    { id: 'Menu Engineering', name: 'Menu Engineering', icon: Utensils, count: articles.filter(a => a.category === 'Menu Engineering').length },
    { id: 'Cost Management', name: 'Cost Management', icon: Award, count: articles.filter(a => a.category === 'Cost Management').length },
    { id: 'Technology', name: 'Technology', icon: Zap, count: articles.filter(a => a.category === 'Technology').length },
    { id: 'Sustainability', name: 'Sustainability', icon: Leaf, count: articles.filter(a => a.category === 'Sustainability').length },
    { id: 'Operations', name: 'Operations', icon: Building2, count: articles.filter(a => a.category === 'Operations').length },
    { id: 'Marketing', name: 'Marketing', icon: Megaphone, count: articles.filter(a => a.category === 'Marketing').length },
    { id: 'Staff Management', name: 'Staff Management', icon: Users, count: articles.filter(a => a.category === 'Staff Management').length },
    { id: 'Analytics', name: 'Analytics', icon: TrendingUp, count: articles.filter(a => a.category === 'Analytics').length }
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <ReadingProgress />
        
        {/* Simple Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                MastroHub Blog
              </Link>
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <Link href="/admin" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                      <Settings className="w-4 h-4" />
                      Admin
                    </Link>
                                    <Link href="/restaurant-curator" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Restaurant Curator
                    </Link>
                  </>
                ) : (
                  <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Login
                  </Link>
                )}
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Compact Blog Hero */}
        <BlogHero />

        {/* Categories */}
        <section className="py-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Categories" className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-colors ${
                      isSelected 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{category.name}</span>
                    <span className="text-xs bg-white/20 dark:bg-slate-600 px-1.5 py-0.5 rounded-full">
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </section>

        {/* Main Content - BLOG FIRST */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content - 3/4 width */}
            <main className="lg:col-span-3">
              {/* Featured Articles */}
              {featuredArticles.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Featured Articles
                  </h2>
                  <div className="space-y-4">
                    {featuredArticles.map((article, index) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <BlogCard {...article} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Articles */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Latest Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {regularArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <BlogCard {...article} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {articles.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 dark:text-gray-400 mb-4">
                    No articles published yet.
                  </div>
                  {user && (
                    <Link 
                      href="/admin"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Settings className="w-4 h-4" />
                      Create Your First Article
                    </Link>
                  )}
                </div>
              )}
            </main>

            {/* Sidebar - 1/4 width */}
            <aside className="lg:col-span-1 space-y-4">
              <div className="sticky top-20">
                {/* Compact Newsletter */}
                <CompactNewsletter />
                
                {/* Author Card */}
                <div className="mt-4">
                  <AuthorCard
                    name="MastroHub Team"
                    bio="Expert restaurant consultants with over 15 years of experience in menu engineering, cost management, and operational optimization."
                    avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    linkedin="https://linkedin.com/company/mastrohub"
                    website="https://mastrohub.com"
                    expertise={['Menu Engineering', 'Cost Management', 'Analytics', 'Operations']}
                    factChecked={true}
                  />
                </div>
                
                {/* Popular Topics */}
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Popular Topics</h3>
                  <div className="space-y-1">
                    {categories.slice(0, 6).map((category) => (
                      <Link
                        key={category.id}
                        href={`/blog/category/${category.id}`}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700 rounded text-sm hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{category.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <ScrollToTop />
      </div>
    </ErrorBoundary>
  );
} 