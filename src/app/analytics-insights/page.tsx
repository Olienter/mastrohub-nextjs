'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Star,
  Clock,
  Target,
  Activity,
  PieChart,
  LineChart,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Brain
} from 'lucide-react';

interface AnalyticsMetric {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export default function AnalyticsInsights() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [isLoading, setIsLoading] = useState(false);

  const metrics: AnalyticsMetric[] = [
    {
      title: 'Total Revenue',
      value: '€45,230',
      change: 12.5,
      trend: 'up',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-green-400'
    },
    {
      title: 'Orders',
      value: '1,247',
      change: 8.2,
      trend: 'up',
      icon: <ShoppingCart className="w-5 h-5" />,
      color: 'text-blue-400'
    },
    {
      title: 'Average Order',
      value: '€36.35',
      change: -2.1,
      trend: 'down',
      icon: <Target className="w-5 h-5" />,
      color: 'text-purple-400'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: 0.3,
      trend: 'up',
      icon: <Star className="w-5 h-5" />,
      color: 'text-yellow-400'
    }
  ];

  const revenueData: ChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: [3200, 4100, 3800, 5200, 6100, 7800, 6500],
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)'
      }
    ]
  };

  const orderData: ChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [120, 150, 140, 180, 220, 280, 240],
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 1)'
      }
    ]
  };

  const aiInsights = [
    {
      title: 'Revenue Optimization',
      description: 'Based on current trends, consider increasing prices by 5-8% during peak hours.',
      type: 'recommendation',
      impact: 'high'
    },
    {
      title: 'Customer Behavior',
      description: 'Customers prefer ordering between 6-8 PM. Consider special promotions during off-peak hours.',
      type: 'insight',
      impact: 'medium'
    },
    {
      title: 'Menu Performance',
      description: 'Pasta dishes show 23% higher profitability. Consider expanding pasta menu section.',
      type: 'analysis',
      impact: 'high'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-md shadow-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-blue-400" />
                <h1 className="ml-3 text-2xl font-bold text-white">Analytics & Insights</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-slate-700/50 border border-slate-600/50 text-white rounded-lg px-3 py-2 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700/50 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-slate-700/50 ${metric.color}`}>
                  {metric.icon}
              </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : metric.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                  <span>{metric.change > 0 ? '+' : ''}{metric.change}%</span>
                        </div>
                      </div>
              <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
              <p className="text-slate-300 text-sm">{metric.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Revenue Trend</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                  </div>
                </div>

            <div className="h-64 flex items-center justify-center">
                          <div className="text-center">
                <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Chart component will be implemented here</p>
                <p className="text-slate-500 text-sm">Using Chart.js or Recharts</p>
                          </div>
                        </div>
          </motion.div>

          {/* Orders Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Order Volume</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                  </div>
                </div>

            <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                <LineChart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Chart component will be implemented here</p>
                <p className="text-slate-500 text-sm">Using Chart.js or Recharts</p>
                    </div>
                  </div>
          </motion.div>
                </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">AI Insights</h3>
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-400" />
              <span className="text-slate-400 text-sm">Powered by AI</span>
                  </div>
                </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiInsights.map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{insight.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    insight.impact === 'high' 
                      ? 'bg-red-900/50 text-red-300 border border-red-700/50'
                      : 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/50'
                  }`}>
                    {insight.impact} impact
                  </span>
                        </div>
                <p className="text-slate-300 text-sm">{insight.description}</p>
              </motion.div>
                    ))}
                  </div>
        </motion.div>
      </main>
    </div>
  );
}
