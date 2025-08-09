"use client";

import React from 'react';
import { motion } from 'framer-motion';
import ArticleReactions from '@/components/community/ArticleReactions';
import CommentSection from '@/components/community/CommentSection';
import BookmarksList from '@/components/community/BookmarksList';

export default function CommunityDemoPage() {
  const mockArticle = {
    id: 'demo-article-1',
    title: 'The Future of Restaurant Management: AI-Powered Solutions',
    content: `
      <p>In today's rapidly evolving restaurant industry, the integration of artificial intelligence has become not just a trend, but a necessity for survival and growth. This comprehensive guide explores how AI-powered solutions are transforming every aspect of restaurant management.</p>
      
      <h2>The Rise of Smart Restaurant Management</h2>
      <p>Modern restaurants face unprecedented challenges: rising costs, labor shortages, and changing customer expectations. AI solutions offer a way to address these challenges while improving efficiency and profitability.</p>
      
      <h2>Key Areas of AI Integration</h2>
      <ul>
        <li><strong>Inventory Management:</strong> Predictive analytics help optimize stock levels</li>
        <li><strong>Customer Service:</strong> Chatbots and automated ordering systems</li>
        <li><strong>Staff Scheduling:</strong> AI-driven scheduling based on historical data</li>
        <li><strong>Menu Optimization:</strong> Data-driven menu engineering</li>
      </ul>
      
      <h2>Real-World Success Stories</h2>
      <p>Restaurants implementing AI solutions have seen:</p>
      <ul>
        <li>20-30% reduction in food waste</li>
        <li>15-25% increase in operational efficiency</li>
        <li>Improved customer satisfaction scores</li>
        <li>Better staff retention rates</li>
      </ul>
      
      <h2>Getting Started with AI</h2>
      <p>The journey to AI integration doesn't have to be overwhelming. Start with small, manageable implementations and gradually expand as you see results.</p>
    `,
    excerpt: 'Discover how artificial intelligence is revolutionizing restaurant management, from inventory control to customer service optimization.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    author: 'Sarah Johnson',
    published_at: '2024-01-15',
    category: 'Technology',
    read_time: '8 min read',
    view_count: 1247,
    like_count: 89
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white dark:text-white mb-4">
              Community Features Demo
            </h1>
            <p className="text-lg text-slate-300 dark:text-slate-300">
              Test the interactive community features including reactions, comments, and bookmarks
            </p>
          </div>

          {/* Article with Community Features */}
          <div className="bg-slate-800/80 dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-white dark:text-white mb-6">
              Sample Article with Community Features
            </h2>
            
            <div className="space-y-8">
              {/* Article Reactions */}
              <div>
                <h3 className="text-lg font-semibold text-white dark:text-white mb-4">
                  Article Reactions
                </h3>
                <ArticleReactions
                  articleId={mockArticle.id}
                  initialStats={{
                    likes: mockArticle.like_count,
                    loves: 23,
                    bookmarks: 45,
                    comments: 12,
                    views: mockArticle.view_count
                  }}
                />
              </div>

              {/* Comments Section */}
              <div>
                <h3 className="text-lg font-semibold text-white dark:text-white mb-4">
                  Comments Section
                </h3>
                <CommentSection articleId={mockArticle.id} />
              </div>
            </div>
          </div>

          {/* Bookmarks Demo */}
          <div className="bg-slate-800/80 dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-white dark:text-white mb-6">
              Bookmarks Management
            </h2>
            <BookmarksList />
          </div>

          {/* Feature Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-white dark:text-white mb-3">
                Reactions
              </h3>
              <p className="text-slate-300 dark:text-slate-300 text-sm">
                Like, love, and bookmark articles. Track engagement and build community around content.
              </p>
            </div>

            <div className="bg-slate-800/80 dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-white dark:text-white mb-3">
                Comments
              </h3>
              <p className="text-slate-300 dark:text-slate-300 text-sm">
                Nested comments with replies, reactions, and moderation. Real-time updates and user interactions.
              </p>
            </div>

            <div className="bg-slate-800/80 dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-white dark:text-white mb-3">
                Bookmarks
              </h3>
              <p className="text-slate-300 dark:text-slate-300 text-sm">
                Save and organize favorite articles. Filter by recent, popular, or all bookmarks.
              </p>
            </div>
          </div>

          {/* Code Examples */}
          <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Implementation Examples
            </h2>
            <pre className="text-green-400 overflow-x-auto">
              <code>{`// Article Reactions Component
import ArticleReactions from '@/components/community/ArticleReactions';

<ArticleReactions 
  articleId="article-123"
  initialStats={{
    likes: 42,
    loves: 15,
    bookmarks: 8,
    comments: 12,
    views: 1247
  }}
/>

// Comments Section
import CommentSection from '@/components/community/CommentSection';

<CommentSection articleId="article-123" />

// Bookmarks List
import BookmarksList from '@/components/community/BookmarksList';

<BookmarksList />`}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 