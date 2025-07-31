"use client";

import React from 'react';
import { motion } from 'framer-motion';
import ArticleReactions from '@/components/community/ArticleReactions';
import CommentSection from '@/components/community/CommentSection';

interface ArticleWithCommunityProps {
  article: {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    image: string;
    author: string;
    published_at: string;
    category: string;
    read_time: string;
    view_count: number;
    like_count: number;
  };
  className?: string;
}

export default function ArticleWithCommunity({ article, className = '' }: ArticleWithCommunityProps) {
  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Article Header */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                {article.category}
              </span>
              <span>•</span>
              <span>{article.read_time}</span>
              <span>•</span>
              <span>{new Date(article.published_at).toLocaleDateString()}</span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{article.author}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Author</p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div 
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Article Reactions */}
        <ArticleReactions
          articleId={article.id}
          initialStats={{
            likes: article.like_count,
            loves: 0,
            bookmarks: 0,
            comments: 0,
            views: article.view_count
          }}
        />

        {/* Comments Section */}
        <CommentSection articleId={article.id} />
      </motion.div>
    </div>
  );
} 