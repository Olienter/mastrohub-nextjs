"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  Zap,
  Clock,
  BarChart3
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'trend' | 'opportunity' | 'warning' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  action?: string;
  data?: any;
}

export default function AIInsights() {
  const [insights, setInsights] = React.useState<AIInsight[]>([
    {
      id: '1',
      type: 'trend',
      title: 'Menu Engineering Content Surge',
      description: 'Articles about menu engineering are performing 45% better than average. Consider creating more content in this category.',
      confidence: 92,
      impact: 'high',
      action: 'Create 3 new menu engineering articles this month'
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'AI Technology Interest Peak',
      description: 'Search queries for "AI restaurant technology" increased by 180% in the last 30 days.',
      confidence: 87,
      impact: 'high',
      action: 'Publish AI-focused content series'
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Video Content Opportunity',
      description: 'Your audience engages 3x longer with video content. Consider adding video tutorials.',
      confidence: 78,
      impact: 'medium',
      action: 'Add video sections to top articles'
    },
    {
      id: '4',
      type: 'warning',
      title: 'Mobile Engagement Drop',
      description: 'Mobile users spend 23% less time on your blog compared to desktop users.',
      confidence: 85,
      impact: 'medium',
      action: 'Optimize mobile experience'
    }
  ]);

  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const analyzeInsights = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-5 h-5" />;
      case 'opportunity':
        return <Target className="w-5 h-5" />;
      case 'warning':
        return <Zap className="w-5 h-5" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trend':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'opportunity':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'warning':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'recommendation':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900">
            AI-Powered Insights
          </h3>
        </div>
        
        <motion.button
          onClick={analyzeInsights}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-purple-600 text-gray-900 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAnalyzing ? (
            <div className="flex items-center gap-2">
              <motion.div
                className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Analyzing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analyze
            </div>
          )}
        </motion.button>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            className="border border-gray-200 rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`p-2 rounded-full ${getTypeColor(insight.type)}`}>
                {getTypeIcon(insight.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">
                    {insight.title}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                    {insight.impact} impact
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">
                  {insight.description}
                </p>
                
                {insight.action && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-700 mb-1">
                      Recommended Action:
                    </p>
                    <p className="text-sm text-blue-600">
                      {insight.action}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">
                  Confidence
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {insight.confidence}%
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Analysis Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            className="text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-2xl font-bold text-gray-900">
              {insights.length}
            </p>
            <p className="text-sm text-gray-600">
              Active Insights
            </p>
          </motion.div>
          
          <motion.div
            className="text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-2xl font-bold text-gray-900">
              {insights.filter(i => i.impact === 'high').length}
            </p>
            <p className="text-sm text-gray-600">
              High Impact
            </p>
          </motion.div>
          
          <motion.div
            className="text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length)}%
            </p>
            <p className="text-sm text-gray-600">
              Avg Confidence
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 