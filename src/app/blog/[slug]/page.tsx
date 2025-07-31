"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Tag, Eye, Heart } from 'lucide-react';
import Link from 'next/link';
import { useBlogStore } from '@/lib/store';
import { notFound } from 'next/navigation';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { articles } = useBlogStore();
  
  const article = articles.find(a => a.slug === slug && a.status === 'published');
  
  if (!article) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Featured Image */}
          {article.image && (
            <div className="mb-6">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
              {article.authorTitle && (
                <span className="text-gray-500">• {article.authorTitle}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.viewCount.toLocaleString()} views</span>
            </div>
            {article.likeCount > 0 && (
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{article.likeCount} likes</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Fact Check Badge */}
          {article.factChecked && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Fact Checked
            </div>
          )}
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <div 
            className="text-gray-800 dark:text-gray-200 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: article.content.replace(/\n/g, '<br>') 
            }}
          />
        </motion.div>

        {/* Article Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: {formatDate(article.lastUpdated)}
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <Heart className="w-4 h-4" />
                Like
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                Share
              </button>
            </div>
          </div>
        </motion.div>
      </article>
    </div>
  );
} 