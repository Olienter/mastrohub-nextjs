'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Eye, 
  Heart, 
  MessageSquare,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Target
} from 'lucide-react';

interface InteractiveChartsProps {
  className?: string;
}

const InteractiveCharts: React.FC<InteractiveChartsProps> = ({ className = '' }) => {
  const [activeChart, setActiveChart] = useState('engagement');

  // Mock data for charts
  const weeklyData = [
    { day: 'Mon', views: 120, engagement: 15, posts: 2, comments: 8 },
    { day: 'Tue', views: 180, engagement: 22, posts: 3, comments: 12 },
    { day: 'Wed', views: 150, engagement: 18, posts: 1, comments: 6 },
    { day: 'Thu', views: 200, engagement: 25, posts: 4, comments: 15 },
    { day: 'Fri', views: 160, engagement: 20, posts: 2, comments: 10 },
    { day: 'Sat', views: 140, engagement: 16, posts: 1, comments: 7 },
    { day: 'Sun', views: 190, engagement: 23, posts: 3, comments: 14 }
  ];

  const monthlyData = [
    { month: 'Jan', views: 1200, engagement: 150, posts: 25, comments: 80 },
    { month: 'Feb', views: 1800, engagement: 220, posts: 30, comments: 120 },
    { month: 'Mar', views: 1500, engagement: 180, posts: 22, comments: 95 },
    { month: 'Apr', views: 2000, engagement: 250, posts: 35, comments: 140 },
    { month: 'May', views: 1600, engagement: 200, posts: 28, comments: 110 },
    { month: 'Jun', views: 1400, engagement: 160, posts: 20, comments: 85 }
  ];

  const contentPerformance = [
    { name: 'Menu Engineering', views: 234, likes: 18, comments: 12, value: 234 },
    { name: 'Restaurant Analytics', views: 189, likes: 12, comments: 8, value: 189 },
    { name: 'Customer Insights', views: 156, likes: 9, comments: 6, value: 156 },
    { name: 'Profit Optimization', views: 123, likes: 7, comments: 4, value: 123 },
    { name: 'Staff Management', views: 98, likes: 5, comments: 3, value: 98 }
  ];

  const engagementData = [
    { name: 'Views', value: 1247, color: '#3B82F6' },
    { name: 'Likes', value: 89, color: '#EF4444' },
    { name: 'Comments', value: 47, color: '#10B981' },
    { name: 'Shares', value: 23, color: '#F59E0B' }
  ];

  const skillRadarData = [
    { subject: 'Menu Engineering', A: 90, B: 85, fullMark: 100 },
    { subject: 'Analytics', A: 85, B: 80, fullMark: 100 },
    { subject: 'Marketing', A: 75, B: 70, fullMark: 100 },
    { subject: 'Operations', A: 95, B: 90, fullMark: 100 },
    { subject: 'Customer Service', A: 80, B: 75, fullMark: 100 },
    { subject: 'Innovation', A: 70, B: 65, fullMark: 100 }
  ];

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-lg">
          <p className="text-gray-900 font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'engagement':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="day" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorViews)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="engagement" 
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#colorEngagement)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'content':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contentPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="views" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="likes" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'distribution':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={engagementData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {engagementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'skills':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={skillRadarData}>
              <PolarGrid stroke="#374151" opacity={0.3} />
              <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" fontSize={12} />
              <PolarRadiusAxis stroke="#374151" opacity={0.3} />
              <Radar
                name="Current Level"
                dataKey="A"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Target Level"
                dataKey="B"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const chartOptions = [
    { id: 'engagement', name: 'Engagement', icon: TrendingUp, color: 'from-blue-400 to-cyan-400' },
    { id: 'content', name: 'Content Performance', icon: BarChart3, color: 'from-purple-400 to-pink-400' },
    { id: 'distribution', name: 'Activity Distribution', icon: PieChartIcon, color: 'from-green-400 to-emerald-400' },
    { id: 'skills', name: 'Skills Radar', icon: Target, color: 'from-orange-400 to-yellow-400' }
  ];

  return (
    <div className={`bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 ${className}`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h2>
          <p className="text-white/60">Track your performance and engagement</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-white/60 hover:text-white transition-colors">
            <Calendar className="w-4 h-4" />
          </button>
          <button className="text-white/60 hover:text-white transition-colors">
            <Activity className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-3 mb-8">
        {chartOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setActiveChart(option.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              activeChart === option.id
                ? `bg-gradient-to-r ${option.color} text-white`
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            }`}
          >
            <option.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{option.name}</span>
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        {renderChart()}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-4 text-center border border-white/10">
          <div className="text-2xl font-bold text-white">1,247</div>
          <div className="text-white/60 text-sm">Total Views</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 text-center border border-white/10">
          <div className="text-2xl font-bold text-white">89</div>
          <div className="text-white/60 text-sm">Total Likes</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 text-center border border-white/10">
          <div className="text-2xl font-bold text-white">47</div>
          <div className="text-white/60 text-sm">Total Comments</div>
        </div>
        <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl p-4 text-center border border-white/10">
          <div className="text-2xl font-bold text-white">23</div>
          <div className="text-white/60 text-sm">Total Shares</div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCharts; 