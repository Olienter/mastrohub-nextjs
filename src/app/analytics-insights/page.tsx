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
  EyeOff
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
      title: 'Celkový príjem',
      value: '€45,230',
      change: 12.5,
      trend: 'up',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-green-600'
    },
    {
      title: 'Objednávky',
      value: '1,247',
      change: 8.2,
      trend: 'up',
      icon: <ShoppingCart className="w-5 h-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Priemerná objednávka',
      value: '€36.35',
      change: -2.1,
      trend: 'down',
      icon: <Target className="w-5 h-5" />,
      color: 'text-purple-600'
    },
    {
      title: 'Spokojnosť zákazníkov',
      value: '4.8/5',
      change: 0.3,
      trend: 'up',
      icon: <Star className="w-5 h-5" />,
      color: 'text-yellow-600'
    }
  ];

  const revenueData: ChartData = {
    labels: ['Pond', 'Uto', 'Str', 'Štv', 'Pia', 'Sob', 'Ne'],
    datasets: [
      {
        label: 'Príjem',
        data: [3200, 4100, 3800, 5200, 6100, 7800, 6500],
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)'
      }
    ]
  };

  const orderData: ChartData = {
    labels: ['Pond', 'Uto', 'Str', 'Štv', 'Pia', 'Sob', 'Ne'],
    datasets: [
      {
        label: 'Objednávky',
        data: [45, 52, 48, 67, 78, 95, 82],
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 1)'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Analytics & Insights
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Posledných 7 dní</option>
                <option value="30d">Posledných 30 dní</option>
                <option value="90d">Posledných 90 dní</option>
                <option value="1y">Posledný rok</option>
              </select>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
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
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-gray-100 ${metric.color}`}>
                  {metric.icon}
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : metric.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                  <span>{metric.change > 0 ? '+' : ''}{metric.change}%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-gray-600 text-sm">{metric.title}</p>
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
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Príjem v čase</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Graf príjmov sa načítava...</p>
              </div>
            </div>
          </motion.div>

          {/* Orders Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Objednávky v čase</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Graf objednávok sa načítava...</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">AI Insights</h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium">Zobraziť všetko</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Vrcholové hodiny',
                description: 'Najvyšší príjem je medzi 18:00-20:00',
                icon: <Clock className="w-6 h-6" />,
                color: 'text-blue-600',
                bgColor: 'bg-blue-100'
              },
              {
                title: 'Populárne jedlá',
                description: 'Truffle Pasta Carbonara je najobľúbenejšie',
                icon: <Star className="w-6 h-6" />,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-100'
              },
              {
                title: 'Zákazníci',
                description: '85% zákazníkov sú veku 25-45 rokov',
                icon: <Users className="w-6 h-6" />,
                color: 'text-green-600',
                bgColor: 'bg-green-100'
              }
            ].map((insight, index) => (
              <div key={index} className="p-4 bg-gray-50/50 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${insight.bgColor} ${insight.color}`}>
                    {insight.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                </div>
                <p className="text-gray-600 text-sm">{insight.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
