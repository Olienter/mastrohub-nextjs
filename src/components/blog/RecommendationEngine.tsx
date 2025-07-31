"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, TrendingUp, BookOpen } from 'lucide-react';
import { useBlogStore } from '@/lib/store';

interface Recommendation {
  id: string;
  title: string;
  reason: string;
  type: 'trending' | 'personalized' | 'related' | 'popular';
  score: number;
}

export default function RecommendationEngine() {
  const { articles, searchQuery, selectedCategory } = useBlogStore();
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([]);

  React.useEffect(() => {
    generateRecommendations();
  }, [articles, searchQuery, selectedCategory]);

  const generateRecommendations = () => {
    const recs: Recommendation[] = [];

    // Trending articles (based on view count)
    const trending = articles
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 3)
      .map(article => ({
        id: article.id,
        title: article.title,
        reason: 'Trending in your industry',
        type: 'trending' as const,
        score: article.viewCount
      }));

    // Personalized based on search query
    const personalized = searchQuery 
      ? articles
          .filter(article => 
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          )
          .slice(0, 2)
          .map(article => ({
            id: article.id,
            title: article.title,
            reason: `Based on your interest in "${searchQuery}"`,
            type: 'personalized' as const,
            score: 100
          }))
      : [];

    // Related to selected category
    const related = selectedCategory !== 'all'
      ? articles
          .filter(article => article.category === selectedCategory)
          .slice(0, 2)
          .map(article => ({
            id: article.id,
            title: article.title,
            reason: `More from ${selectedCategory}`,
            type: 'related' as const,
            score: 90
          }))
      : [];

    // Popular in similar categories
    const popular = articles
      .filter(article => article.featured)
      .slice(0, 2)
      .map(article => ({
        id: article.id,
        title: article.title,
        reason: 'Popular among restaurant owners',
        type: 'popular' as const,
        score: article.likeCount
      }));

    setRecommendations([...trending, ...personalized, ...related, ...popular]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="w-4 h-4" />;
      case 'personalized':
        return <Sparkles className="w-4 h-4" />;
      case 'related':
        return <BookOpen className="w-4 h-4" />;
      case 'popular':
        return <Clock className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trending':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'personalized':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'related':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'popular':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Recommended for You
        </h3>
      </div>

      <div className="space-y-4">
        {recommendations.slice(0, 5).map((rec, index) => (
          <motion.div
            key={rec.id}
            className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
          >
            <div className={`p-2 rounded-full ${getTypeColor(rec.type)}`}>
              {getTypeIcon(rec.type)}
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                {rec.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {rec.reason}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 