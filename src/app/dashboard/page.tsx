"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  BarChart3, 
  Settings,
  ArrowRight,
  Calendar,
  Target,
  Award
} from "lucide-react";

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  customerSatisfaction: number;
  pendingTasks: number;
  monthlyGrowth: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    customerSatisfaction: 0,
    pendingTasks: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    // Simulate real-time data loading
    const loadMetrics = () => {
      setMetrics({
        totalRevenue: 45280,
        totalOrders: 1247,
        avgOrderValue: 36.31,
        customerSatisfaction: 94.2,
        pendingTasks: 8,
        monthlyGrowth: 12.5
      });
    };

    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    {
      title: "Menu Maker",
      description: "Create & optimize your menu",
      icon: <BarChart3 className="w-6 h-6" />,
      href: "/menu-maker",
      color: "from-orange-400 to-yellow-400"
    },
    {
      title: "Forecast Planner",
      description: "Predict demand & plan inventory",
      icon: <TrendingUp className="w-6 h-6" />,
      href: "/forecast-planner",
      color: "from-blue-400 to-cyan-400"
    },
    {
      title: "Restaurant Curator",
      description: "Manage your restaurant profile",
      icon: <Settings className="w-6 h-6" />,
      href: "/restaurant-curator",
      color: "from-purple-400 to-pink-400"
    },
    {
      title: "Marketing Assistant",
      description: "Grow your customer base",
      icon: <Users className="w-6 h-6" />,
      href: "/marketing-assistant",
      color: "from-green-400 to-emerald-400"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Menu updated",
      description: "Added 3 new seasonal dishes",
      time: "2 hours ago",
      type: "menu"
    },
    {
      id: 2,
      action: "Order completed",
      description: "Table 5 - $124.50",
      time: "4 hours ago",
      type: "order"
    },
    {
      id: 3,
      action: "Review received",
      description: "5-star rating from customer",
      time: "6 hours ago",
      type: "review"
    },
    {
      id: 4,
      action: "Inventory alert",
      description: "Low stock on salmon fillets",
      time: "1 day ago",
      type: "alert"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'menu':
        return <BarChart3 className="w-4 h-4 text-blue-500" />;
      case 'order':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'review':
        return <Award className="w-4 h-4 text-yellow-500" />;
      case 'alert':
        return <Clock className="w-4 h-4 text-red-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-blue-900 to-cyan-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {loading ? (
              'Loading...'
            ) : (
              `Welcome back, ${user?.email?.split('@')[0] ? 
                user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : 
                user?.user_metadata?.full_name || 'Chef'}! 👋`
            )}
          </h1>
          <p className="text-white/70">
            Here's what's happening with your restaurant today
          </p>
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 text-xs text-white/50">
              Debug: {loading ? 'Loading' : 'Loaded'} | User: {user ? 'Yes' : 'No'} | Email: {user?.email || 'None'}
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">${metrics.totalRevenue.toLocaleString()}</p>
                <p className="text-green-400 text-sm">+{metrics.monthlyGrowth}% this month</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-white">{metrics.totalOrders.toLocaleString()}</p>
                <p className="text-blue-400 text-sm">+8.2% vs last month</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Avg Order Value</p>
                <p className="text-2xl font-bold text-white">${metrics.avgOrderValue}</p>
                <p className="text-purple-400 text-sm">+5.1% vs last month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Satisfaction</p>
                <p className="text-2xl font-bold text-white">{metrics.customerSatisfaction}%</p>
                <p className="text-yellow-400 text-sm">+2.3% vs last month</p>
              </div>
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <div className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-4 transition-all duration-300 cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-white`}>
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white group-hover:text-white/90 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-white/60 text-sm">{action.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-white/60 text-sm">{activity.description}</p>
                    <p className="text-white/40 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        {metrics.pendingTasks > 0 && (
          <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-yellow-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Pending Tasks</h3>
                  <p className="text-white/60">You have {metrics.pendingTasks} tasks that need attention</p>
                </div>
              </div>
              <Link href="/dashboard/moderate">
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                  View Tasks
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 