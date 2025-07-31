"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { useBlogStore, Article } from '@/lib/store';
import BlogEditor from '@/components/blog/BlogEditor';

export default function AdminPage() {
  const { articles, getPublishedArticles, setSearchQuery, searchQuery } = useBlogStore();
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'pending'>('all');

  const handleCreateArticle = () => {
    setEditingArticle(null);
    setShowEditor(true);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingArticle(null);
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || article.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Admin</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your blog articles</p>
            </div>
            <button
              onClick={handleCreateArticle}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Article
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {articles.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Articles</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-green-600">
              {articles.filter(a => a.status === 'published').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-yellow-600">
              {articles.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-gray-600">
              {articles.filter(a => a.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Drafts</div>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredArticles.map((article) => (
                  <motion.tr
                    key={article.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={article.image || 'https://via.placeholder.com/40x40'}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {article.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {article.excerpt.substring(0, 60)}...
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            by {article.author}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(article.status)}`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {article.viewCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditArticle(article)}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 p-1"
                          title="Edit article"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <a
                          href={`/blog/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400 p-1"
                          title="View article"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                {searchQuery || filterStatus !== 'all' ? 'No articles match your filters.' : 'No articles yet. Create your first article!'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <BlogEditor
          article={editingArticle || undefined}
          onClose={handleCloseEditor}
          mode={editingArticle ? 'edit' : 'create'}
        />
      )}
    </div>
  );
} 