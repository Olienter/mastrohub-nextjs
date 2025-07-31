"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  Share2, 
  Clock, 
  Users, 
  Globe, 
  Target,
  BarChart3,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  bounceRate: number;
  topArticles: Array<{
    title: string;
    views: number;
    likes: number;
    shares: number;
  }>;
  trafficSources: Array<{
    source: string;
    percentage: number;
    color: string;
  }>;
  engagementMetrics: {
    likes: number;
    shares: number;
    comments: number;
    bookmarks: number;
  };
  realTimeVisitors: number;
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = React.useState<AnalyticsData>({
    pageViews: 15420,
    uniqueVisitors: 8234,
    averageTimeOnPage: 4.5,
    bounceRate: 32.5,
    topArticles: [
      { title: "Menu Engineering: How Top Restaurants Increase Revenue by 45%", views: 3240, likes: 156, shares: 89 },
      { title: "AI in Restaurants: 5 Technologies That Will Transform Your Kitchen", views: 2890, likes: 134, shares: 67 },
      { title: "Cost Management Strategies for Restaurant Owners", views: 2156, likes: 98, shares: 45 },
      { title: "Sustainability in Hospitality: A Complete Guide", views: 1890, likes: 87, shares: 34 }
    ],
    trafficSources: [
      { source: 'Google Search', percentage: 45, color: '#3B82F6' },
      { source: 'Direct Traffic', percentage: 25, color: '#10B981' },
      { source: 'Social Media', percentage: 20, color: '#F59E0B' },
      { source: 'Referrals', percentage: 10, color: '#EF4444' }
    ],
    engagementMetrics: {
      likes: 2340,
      shares: 890,
      comments: 456,
      bookmarks: 1234
    },
    realTimeVisitors: 23
  });

  const [isRealTime, setIsRealTime] = React.useState(true);

  // Simulate real-time updates
  React.useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setAnalytics(prev => ({
        ...prev,
        realTimeVisitors: Math.floor(Math.random() * 50) + 10,
        pageViews: prev.pageViews + Math.floor(Math.random() * 5)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h3>
        </div>
        
        <motion.button
          onClick={() => setIsRealTime(!isRealTime)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            isRealTime 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Activity className="w-4 h-4 inline mr-1" />
          {isRealTime ? 'Live' : 'Paused'}
        </motion.button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Page Views</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {analytics.pageViews.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            +12% from last week
          </p>
        </motion.div>

        <motion.div
          className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Unique Visitors</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {analytics.uniqueVisitors.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            +8% from last week
          </p>
        </motion.div>

        <motion.div
          className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Avg. Time</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {analytics.averageTimeOnPage}m
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            +2.3% from last week
          </p>
        </motion.div>

        <motion.div
          className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Live Visitors</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {analytics.realTimeVisitors}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Currently online
          </p>
        </motion.div>
      </div>

      {/* Top Articles */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Performing Articles
        </h4>
        <div className="space-y-3">
          {analytics.topArticles.map((article, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                  {article.title}
                </p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {article.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {article.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3 h-3" />
                    {article.shares}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Traffic Sources
        </h4>
        <div className="space-y-3">
          {analytics.trafficSources.map((source, index) => (
            <motion.div
              key={source.source}
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: source.color }}
                />
                <span className="text-gray-700 dark:text-gray-300">{source.source}</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {source.percentage}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Engagement Metrics */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Engagement Metrics
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(analytics.engagementMetrics).map(([metric, value], index) => (
            <motion.div
              key={metric}
              className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {value.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {metric}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 