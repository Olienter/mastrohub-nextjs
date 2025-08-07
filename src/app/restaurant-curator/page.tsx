'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { 
  UtensilsCrossed, 
  TrendingUp, 
  Megaphone, 
  BarChart3, 
  Users, 
  DollarSign,
  Calendar,
  Target,
  Zap,
  Building2,
  ChefHat,
  Clock,
  Star,
  TrendingDown
} from 'lucide-react';

export default function RestaurantCurator() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Mock data pre podnik - v budúcnosti bude načítané z privátnej databázy používateľa
  const restaurantData = {
    name: "Restaurant Demo",
    type: "Fine Dining",
    location: "Bratislava, Slovakia",
    employees: 12,
    monthlyRevenue: 45000,
    monthlyOrders: 1247,
    avgOrderValue: 36.31,
    customerSatisfaction: 94.2,
    menuItems: 45,
    activePromotions: 3,
    kitchenEfficiency: 87.5
  };

  // Micro tools dostupné v Restaurant Curator - každý používateľ má svoje vlastné dáta
  const microTools = [
    {
      id: 'menu-maker',
      name: 'Menu Maker',
      description: 'Create and manage your menu with OCR import, categories, and performance tracking',
      icon: UtensilsCrossed,
      href: '/menu-maker',
      color: 'bg-blue-500',
      stats: {
        items: restaurantData.menuItems,
        categories: 8,
        lastUpdated: '2 hours ago'
      }
    },
    {
      id: 'forecast-planner',
      name: 'Forecast Planner',
      description: 'Plan inventory, predict demand, and optimize your operations',
      icon: TrendingUp,
      href: '/forecast-planner',
      color: 'bg-green-500',
      stats: {
        accuracy: '92%',
        predictions: 15,
        savings: '€2,400/month'
      }
    },
    {
      id: 'marketing-assistant',
      name: 'Marketing Assistant',
      description: 'Create campaigns, track performance, and grow your customer base',
      icon: Megaphone,
      href: '/marketing-assistant',
      color: 'bg-purple-500',
      stats: {
        campaigns: restaurantData.activePromotions,
        reach: '15,200',
        conversion: '8.5%'
      }
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Wrapper komponent pre autentifikáciu
  const RestaurantCuratorContent = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your restaurant dashboard...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.email?.split('@')[0]}!
              </h1>
              <p className="text-gray-600">
                Manage your restaurant operations and track performance
              </p>
            </motion.div>
          </div>

          {/* Restaurant Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{restaurantData.name}</h2>
                <p className="text-gray-600">{restaurantData.type} • {restaurantData.location}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">{restaurantData.employees} employees</span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">€{restaurantData.monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{restaurantData.monthlyOrders}</p>
                <p className="text-sm text-gray-600">Monthly Orders</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Star className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{restaurantData.customerSatisfaction}%</p>
                <p className="text-sm text-gray-600">Satisfaction</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Zap className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{restaurantData.kitchenEfficiency}%</p>
                <p className="text-sm text-gray-600">Efficiency</p>
              </div>
            </div>
          </motion.div>

          {/* Micro Tools Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Tools</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {microTools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <Link href={tool.href} className="block">
                      <div className="flex items-center mb-4">
                        <div className={`${tool.color} p-3 rounded-lg mr-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                          <p className="text-sm text-gray-600">{tool.description}</p>
                        </div>
                      </div>

                      {/* Tool Stats */}
                      <div className="border-t border-gray-100 pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {Object.entries(tool.stats).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <p className="font-semibold text-gray-900">{value}</p>
                              <p className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                        <span className="text-sm font-medium">Open {tool.name}</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <button className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <ChefHat className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-sm font-medium">Add Menu Item</span>
              </button>
              <button className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Calendar className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-sm font-medium">Schedule Promotion</span>
              </button>
              <button className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Target className="w-5 h-5 text-purple-600 mr-3" />
                <span className="text-sm font-medium">View Analytics</span>
              </button>
              <button className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Users className="w-5 h-5 text-orange-600 mr-3" />
                <span className="text-sm font-medium">Manage Staff</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  // Použijeme AuthGuard pre ochranu stránky
  return (
    <AuthGuard>
      <RestaurantCuratorContent />
    </AuthGuard>
  );
}
