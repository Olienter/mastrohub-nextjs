"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogCard from './BlogCard';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  readTime: string;
  author: string;
  authorTitle?: string;
  publishedAt: string;
  slug: string;
  featured?: boolean;
  tags: string[];
  viewCount: number;
  likeCount: number;
  status?: "published" | "draft" | "pending";
  lastUpdated?: string;
  factChecked?: boolean;
}

interface SmartArticlesGridProps {
  articles: Article[];
  featuredArticles: Article[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function SmartArticlesGrid({ 
  articles, 
  featuredArticles, 
  onLoadMore, 
  hasMore, 
  isLoading 
}: SmartArticlesGridProps) {
  const [loadMoreRef, setLoadMoreRef] = React.useState<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!loadMoreRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !isLoading) {
            onLoadMore();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef);

    return () => {
      if (loadMoreRef) {
        observer.unobserve(loadMoreRef);
      }
    };
  }, [loadMoreRef, hasMore, isLoading, onLoadMore]);

  return (
    <div className="space-y-12">
      {/* Featured Articles */}
      <AnimatePresence>
        {featuredArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-8"
          >
            <BlogCard {...article} status={article.status || "published"} lastUpdated={article.lastUpdated || ""} factChecked={article.factChecked || false} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Regular Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence>
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="transition-transform duration-300"
            >
              <BlogCard {...article} status={article.status || "published"} lastUpdated={article.lastUpdated || ""} factChecked={article.factChecked || false} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Trigger */}
      <div ref={setLoadMoreRef} className="text-center py-8">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </motion.div>
        )}
        
        {!isLoading && hasMore && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLoadMore}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Load More Articles
          </motion.button>
        )}
      </div>
    </div>
  );
} 