"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Eye, Calendar, User, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface BookmarkedArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  published_at: string;
  category: string;
  read_time: string;
  view_count: number;
  like_count: number;
  created_at: string;
}

interface BookmarksListProps {
  className?: string;
}

export default function BookmarksList({ className = '' }: BookmarksListProps) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'recent' | 'popular'>('all');

  useEffect(() => {
    if (user) {
      loadBookmarks();
    }
  }, [user, filter]);

  const loadBookmarks = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      let query = supabase
        .from('bookmarks')
        .select(`
          created_at,
          article:articles(
            id,
            title,
            excerpt,
            image,
            author,
            published_at,
            category,
            read_time,
            view_count,
            like_count
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      const bookmarkedArticles = (data as any[])
        .map(item => ({
          ...item.article,
          created_at: item.created_at
        }))
        .filter(Boolean) as BookmarkedArticle[];

      // Apply filters
      let filteredBookmarks = bookmarkedArticles;
      if (filter === 'recent') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filteredBookmarks = bookmarkedArticles.filter(
          article => new Date(article.created_at) > oneWeekAgo
        );
      } else if (filter === 'popular') {
        filteredBookmarks = bookmarkedArticles.sort((a, b) => b.view_count - a.view_count);
      }

      setBookmarks(filteredBookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBookmark = async (articleId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', articleId);

      if (error) throw error;

      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== articleId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatReadTime = (readTime: string) => {
    return readTime || '5 min read';
  };

  if (!user) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Bookmark className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Sign in to view your bookmarks
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Save articles you love and access them anytime
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bookmark className="text-blue-600 dark:text-blue-400" size={24} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Bookmarks
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({bookmarks.length})
          </span>
        </div>

        {/* Filter */}
        <div className="flex space-x-2">
          {(['all', 'recent', 'popular'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bookmarks List */}
      <AnimatePresence>
        {bookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bookmark className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No bookmarks yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start saving articles you love by clicking the bookmark icon
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Bookmark size={16} />
              <span>Explore Articles</span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {bookmarks.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex">
                  {/* Image */}
                  <div className="flex-shrink-0 w-48 h-32">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
                            {article.category}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatReadTime(article.read_time)}
                          </span>
                        </div>

                        <Link href={`/blog/${article.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {article.title}
                          </h3>
                        </Link>

                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <User size={14} />
                              <span>{article.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>{formatDate(article.published_at)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye size={14} />
                              <span>{article.view_count} views</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveBookmark(article.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title="Remove bookmark"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 