"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Tag, Eye, Heart } from 'lucide-react';
import { Article } from '@/lib/store';

interface BlogCardProps extends Omit<Article, 'featured'> {
  featured?: boolean;
}

export default function BlogCard({
  id,
  title,
  excerpt,
  image,
  category,
  readTime,
  author,
  authorTitle,
  publishedAt,
  slug,
  tags,
  viewCount,
  likeCount,
  factChecked,
  featured = false
}: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.article
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
        featured ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <Link href={`/blog/${slug}`}>
        {/* Image */}
        {image && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
            {featured && (
              <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                Featured
              </div>
            )}
            {factChecked && (
              <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                ✓ Verified
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Category */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
              {category}
            </span>
            {featured && (
              <span className="inline-flex px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{author}</span>
              {authorTitle && (
                <span className="text-gray-400">• {authorTitle}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{readTime}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{viewCount.toLocaleString()}</span>
              </div>
              {likeCount > 0 && (
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{likeCount}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {tags.slice(0, 2).join(', ')}
                  {tags.length > 2 && ` +${tags.length - 2}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
} 