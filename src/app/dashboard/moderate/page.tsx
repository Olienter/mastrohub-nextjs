"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, XCircle, Eye, Clock, AlertCircle } from "lucide-react";

interface Article {
  id: string;
  title: string;
  author: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  category: string;
  readTime: number;
}

export default function ModeratePage() {
  const { user } = useAuth();
  const userName = (user as any)?.name || (user as any)?.email || 'Moderator';
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Mock data - v reálnej aplikácii by to bolo z API
  useEffect(() => {
    const mockArticles: Article[] = [
      {
        id: '1',
        title: 'Menu Engineering: Increase Revenue by 45%',
        author: 'Sarah Johnson',
        content: 'Menu engineering is a systematic approach to analyzing a restaurant menu\'s performance to maximize profitability...',
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z',
        category: 'Menu Engineering',
        readTime: 8
      },
      {
        id: '2',
        title: 'Smart Pricing Strategies for Restaurants',
        author: 'Mike Chen',
        content: 'Pricing is one of the most critical decisions in restaurant management...',
        status: 'pending',
        createdAt: '2024-01-14T15:45:00Z',
        category: 'Pricing',
        readTime: 6
      },
      {
        id: '3',
        title: 'Food Waste Reduction Techniques',
        author: 'Emma Davis',
        content: 'Reducing food waste is not only environmentally responsible but also financially beneficial...',
        status: 'pending',
        createdAt: '2024-01-13T09:20:00Z',
        category: 'Sustainability',
        readTime: 10
      }
    ];

    setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = async (articleId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, status: 'approved' as const }
          : article
      ));
    } catch (error) {
      console.error('Error approving article:', error);
    }
  };

  const handleReject = async (articleId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, status: 'rejected' as const }
          : article
      ));
    } catch (error) {
      console.error('Error rejecting article:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const pendingArticles = articles.filter(article => article.status === 'pending');

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Moderation Queue</h1>
          <p className="text-gray-600">
            {pendingArticles.length} articles pending review
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Logged in as: <span className="font-medium">{userName}</span>
          </div>
        </div>
      </div>

      {pendingArticles.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">No articles are currently pending moderation.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{article.title}</h2>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(article.status)}`}>
                      {article.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span>By {article.author}</span>
                    <span>•</span>
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{article.category}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {article.readTime} min read
                    </span>
                  </div>
                  
                  <p className="text-gray-700 line-clamp-3">{article.content}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview Article
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReject(article.id)}
                    className="px-4 py-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50 font-medium transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(article.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Preview Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedArticle.title}</h2>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                <span>By {selectedArticle.author}</span>
                <span>•</span>
                <span>{new Date(selectedArticle.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{selectedArticle.category}</span>
                <span>•</span>
                <span>{selectedArticle.readTime} min read</span>
              </div>
            </div>
            <div className="p-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{selectedArticle.content}</p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    handleReject(selectedArticle.id);
                    setSelectedArticle(null);
                  }}
                  className="px-4 py-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50 font-medium transition-colors"
                >
                  Reject Article
                </button>
                <button
                  onClick={() => {
                    handleApprove(selectedArticle.id);
                    setSelectedArticle(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors"
                >
                  Approve Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 