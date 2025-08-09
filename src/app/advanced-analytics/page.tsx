'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ChefHat, 
  DollarSign, 
  Target, 
  Calendar, 
  PieChart, 
  Activity, 
  Clock, 
  Star, 
  Award,
  Download,
  Filter,
  RefreshCw,
  Eye,
  TrendingDown,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  DollarSign as DollarIcon
} from 'lucide-react';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  avgOrder: number;
}

interface CustomerSegment {
  segment: string;
  count: number;
  revenue: number;
  avgOrder: number;
}

interface MenuItem {
  item: string;
  sales: number;
  revenue: number;
  margin: number;
}

interface StaffPerformance {
  name: string;
  orders: number;
  avgRating: number;
  efficiency: number;
}

interface FinancialData {
  profitMargins: {
    food: number;
    beverages: number;
    desserts: number;
    overall: number;
  };
  costAnalysis: Array<{
    category: string;
    cost: number;
    percentage: number;
  }>;
  revenueStreams: Array<{
    stream: string;
    revenue: number;
    percentage: number;
  }>;
}

interface PredictiveData {
  demandForecast: Array<{
    date: string;
    predictedOrders: number;
    confidence: number;
  }>;
  seasonalPredictions: Array<{
    season: string;
    expectedGrowth: number;
    topItems: string[];
  }>;
}

export default function AdvancedAnalytics() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  const [activeTab, setActiveTab] = useState<'sales' | 'customers' | 'menu' | 'operations' | 'financial' | 'predictive'>('sales');
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [customerData, setCustomerData] = useState<CustomerSegment[]>([]);
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [staffData, setStaffData] = useState<StaffPerformance[]>([]);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [predictiveData, setPredictiveData] = useState<PredictiveData | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [activeTab]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/advanced-analytics?action=${activeTab}`);
      const result = await response.json();
      
      if (result.success) {
        switch (activeTab) {
          case 'sales':
            setSalesData(result.data.dailySales || []);
            break;
          case 'customers':
            setCustomerData(result.data.customerSegments || []);
            break;
          case 'menu':
            setMenuData(result.data.topPerformers || []);
            break;
          case 'operations':
            setStaffData(result.data.staffPerformance || []);
            break;
          case 'financial':
            setFinancialData(result.data);
            break;
          case 'predictive':
            setPredictiveData(result.data);
            break;
        }
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'sales', name: 'Sales Analytics', icon: TrendingUp },
    { id: 'customers', name: 'Customer Analytics', icon: Users },
    { id: 'menu', name: 'Menu Analytics', icon: ChefHat },
    { id: 'operations', name: 'Operations', icon: Activity },
    { id: 'financial', name: 'Financial Analytics', icon: DollarSign },
    { id: 'predictive', name: 'Predictive Analytics', icon: Target }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? ArrowUpRight : ArrowDownRight;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
                <p className="text-sm text-gray-500">Comprehensive insights and reporting</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              <button 
                onClick={loadAnalyticsData}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
            ) : (
              <>
                {/* Sales Analytics */}
                {activeTab === 'sales' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCurrency(salesData.reduce((sum, item) => sum + item.revenue, 0))}
                            </p>
                          </div>
                          <div className="flex items-center text-green-600">
                            <ArrowUpRight className="w-5 h-5" />
                            <span className="text-sm font-medium">+12.5%</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {salesData.reduce((sum, item) => sum + item.orders, 0)}
                            </p>
                          </div>
                          <div className="flex items-center text-green-600">
                            <ArrowUpRight className="w-5 h-5" />
                            <span className="text-sm font-medium">+8.2%</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCurrency(salesData.reduce((sum, item) => sum + item.avgOrder, 0) / salesData.length)}
                            </p>
                          </div>
                          <div className="flex items-center text-green-600">
                            <ArrowUpRight className="w-5 h-5" />
                            <span className="text-sm font-medium">+3.1%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Sales Trend</h3>
                      <div className="space-y-4">
                        {salesData.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <Calendar className="w-5 h-5 text-gray-400" />
                              <span className="font-medium text-gray-900">{item.date}</span>
                            </div>
                            <div className="flex items-center space-x-6">
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Revenue</p>
                                <p className="font-semibold text-gray-900">{formatCurrency(item.revenue)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Orders</p>
                                <p className="font-semibold text-gray-900">{item.orders}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Avg Order</p>
                                <p className="font-semibold text-gray-900">{formatCurrency(item.avgOrder)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Analytics */}
                {activeTab === 'customers' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {customerData.map((segment, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{segment.segment}</h3>
                            <Users className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-600">Count</p>
                              <p className="text-2xl font-bold text-gray-900">{segment.count}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Revenue</p>
                              <p className="text-lg font-semibold text-gray-900">{formatCurrency(segment.revenue)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Avg Order</p>
                              <p className="text-lg font-semibold text-gray-900">{formatCurrency(segment.avgOrder)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Menu Analytics */}
                {activeTab === 'menu' && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Items</h3>
                      <div className="space-y-4">
                        {menuData.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-indigo-600">{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{item.item}</p>
                                <p className="text-sm text-gray-600">Margin: {formatPercentage(item.margin)}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-6">
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Sales</p>
                                <p className="font-semibold text-gray-900">{item.sales}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Revenue</p>
                                <p className="font-semibold text-gray-900">{formatCurrency(item.revenue)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Operations Analytics */}
                {activeTab === 'operations' && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Performance</h3>
                      <div className="space-y-4">
                        {staffData.map((staff, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <ChefHat className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{staff.name}</p>
                                <p className="text-sm text-gray-600">Orders: {staff.orders}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-6">
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Rating</p>
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="font-semibold text-gray-900 ml-1">{staff.avgRating}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Efficiency</p>
                                <p className="font-semibold text-gray-900">{formatPercentage(staff.efficiency)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Financial Analytics */}
                {activeTab === 'financial' && financialData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Margins</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Food</span>
                            <span className="font-semibold text-gray-900">{formatPercentage(financialData.profitMargins.food)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Beverages</span>
                            <span className="font-semibold text-gray-900">{formatPercentage(financialData.profitMargins.beverages)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Desserts</span>
                            <span className="font-semibold text-gray-900">{formatPercentage(financialData.profitMargins.desserts)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-sm font-medium text-gray-900">Overall</span>
                            <span className="font-bold text-gray-900">{formatPercentage(financialData.profitMargins.overall)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Streams</h3>
                        <div className="space-y-3">
                          {financialData.revenueStreams.map((stream, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-sm text-gray-600">{stream.stream}</span>
                              <span className="font-semibold text-gray-900">{formatCurrency(stream.revenue)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h3>
                        <div className="space-y-3">
                          {financialData.costAnalysis.map((cost, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-sm text-gray-600">{cost.category}</span>
                              <span className="font-semibold text-gray-900">{formatCurrency(cost.cost)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Predictive Analytics */}
                {activeTab === 'predictive' && predictiveData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Demand Forecast</h3>
                        <div className="space-y-3">
                          {predictiveData.demandForecast.slice(0, 5).map((forecast, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{forecast.date}</p>
                                <p className="text-sm text-gray-600">Confidence: {formatPercentage(forecast.confidence)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">{forecast.predictedOrders}</p>
                                <p className="text-sm text-gray-600">orders</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Predictions</h3>
                        <div className="space-y-4">
                          {predictiveData.seasonalPredictions.map((season, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">{season.season}</h4>
                                <div className="flex items-center text-green-600">
                                  <ArrowUpRight className="w-4 h-4" />
                                  <span className="text-sm font-medium">{formatPercentage(season.expectedGrowth)}</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Top Items:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {season.topItems.map((item, itemIndex) => (
                                    <span key={itemIndex} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
