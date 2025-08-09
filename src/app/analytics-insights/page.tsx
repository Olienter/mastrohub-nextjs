'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Users,
  Package,
  Target,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  Info,
  Zap,
  Brain,
  Lightbulb,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Grid,
  List,
  Menu,
  Leaf,
  ArrowLeft,
  UtensilsCrossed,
  DollarSign as DollarSignIcon,
  Clock as ClockIcon,
  Star as StarIcon,
  Tag,
  Hash,
  Eye as EyeIcon,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Sparkles,
  Brain as BrainIcon,
  Zap as ZapIcon,
  Target as TargetIcon,
  BarChart3 as BarChart3Icon,
  Lightbulb as LightbulbIcon,
  Wand2,
  Camera,
  Users as UsersIcon,
  BookOpen,
  GraduationCap,
  Settings as SettingsIcon,
  Bell,
  User,
  Crown,
  Trophy,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Percent,
  Package as PackageIcon,
  FileText,
  Printer,
  Share2,
  Upload,
  RotateCcw,
  Calculator,
  Image as ImageIcon,
  FileText as FileTextIcon,
  Hash as HashIcon,
  PenTool,
  Folder as FolderIcon,
  AlertCircle as AlertCircleIcon,
  Mail,
  Smartphone,
  QrCode,
  Megaphone,
  Users as UsersIcon2,
  BarChart3 as BarChart3Icon2,
  Lightbulb as LightbulbIcon2,
  Target as TargetIcon2,
  TrendingUp as TrendingUpIcon2,
  DollarSign as DollarSignIcon2,
  MessageCircle as MessageCircleIcon,
  Share2 as Share2Icon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  Plus as PlusIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  RefreshCw as RefreshCwIcon,
  Settings as SettingsIcon2,
  Eye as EyeIcon2,
  EyeOff as EyeOffIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Clock as ClockIcon2,
  Star as StarIcon2,
  AlertCircle as AlertCircleIcon2,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Zap as ZapIcon2,
  Brain as BrainIcon2,
  Lightbulb as LightbulbIcon3,
  ArrowRight as ArrowRightIcon,
  Save as SaveIcon,
  X as XIcon,
  Grid as GridIcon,
  List as ListIcon,
  Menu as MenuIcon,
  Leaf as LeafIcon,
  ArrowLeft as ArrowLeftIcon,
  UtensilsCrossed as UtensilsCrossedIcon,
  Tag as TagIcon,
  Hash as HashIcon2,
  Heart as HeartIcon,
  MoreHorizontal as MoreHorizontalIcon,
  Sparkles as SparklesIcon,
  Wand2 as Wand2Icon,
  Camera as CameraIcon,
  BookOpen as BookOpenIcon,
  GraduationCap as GraduationCapIcon,
  Bell as BellIcon,
  User as UserIcon,
  Crown as CrownIcon,
  Trophy as TrophyIcon,
  Percent as PercentIcon,
  Printer as PrinterIcon,
  RotateCcw as RotateCcwIcon,
  Calculator as CalculatorIcon,
  Image as ImageIcon2,
  FileText as FileTextIcon2,
  Hash as HashIcon3,
  PenTool as PenToolIcon,
  Folder as FolderIcon2,
  Play,
  Video,
  BookOpen as BookOpenIcon2,
  Award,
  Clock as ClockIcon3,
  Users as UsersIcon3,
  Target as TargetIcon3,
  TrendingUp as TrendingUpIcon3,
  BarChart3 as BarChart3Icon3,
  Lightbulb as LightbulbIcon4,
  Brain as BrainIcon3,
  Zap as ZapIcon3,
  Star as StarIcon3,
  CheckCircle as CheckCircleIcon2,
  AlertCircle as AlertCircleIcon3,
  Info as InfoIcon2,
  Plus as PlusIcon2,
  Edit as EditIcon2,
  Trash2 as Trash2Icon2,
  Save as SaveIcon2,
  X as XIcon2,
  Search as SearchIcon2,
  Filter as FilterIcon2,
  RefreshCw as RefreshCwIcon2,
  Settings as SettingsIcon3,
  Eye as EyeIcon3,
  EyeOff as EyeOffIcon2,
  ChevronDown as ChevronDownIcon2,
  ChevronUp as ChevronUpIcon2,
  Clock as ClockIcon4,
  Star as StarIcon4,
  AlertCircle as AlertCircleIcon4,
  CheckCircle as CheckCircleIcon3,
  Info as InfoIcon3,
  Zap as ZapIcon4,
  Brain as BrainIcon4,
  Lightbulb as LightbulbIcon5,
  ArrowRight as ArrowRightIcon2,
  Save as SaveIcon3,
  X as XIcon3,
  Grid as GridIcon2,
  List as ListIcon2,
  Menu as MenuIcon2,
  Leaf as LeafIcon2,
  ArrowLeft as ArrowLeftIcon2,
  UtensilsCrossed as UtensilsCrossedIcon2,
  Tag as TagIcon2,
  Hash as HashIcon4,
  Heart as HeartIcon2,
  MoreHorizontal as MoreHorizontalIcon2,
  Sparkles as SparklesIcon2,
  Wand2 as Wand2Icon2,
  Camera as CameraIcon2,
  BookOpen as BookOpenIcon3,
  GraduationCap as GraduationCapIcon2,
  Bell as BellIcon2,
  User as UserIcon2,
  Crown as CrownIcon2,
  Trophy as TrophyIcon2,
  Percent as PercentIcon2,
  Printer as PrinterIcon2,
  RotateCcw as RotateCcwIcon2,
  Calculator as CalculatorIcon2,
  Image as ImageIcon3,
  PenTool as PenToolIcon2,
  Folder as FolderIcon3
} from 'lucide-react';

import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsData {
  overview: {
    summary: {
      total_revenue: number;
      total_orders: number;
      average_order_value: number;
      total_customers: number;
      repeat_customer_rate: number;
      menu_items_count: number;
      active_qr_codes: number;
      marketing_campaigns: number;
    };
    trends: {
      revenue_growth: number;
      order_growth: number;
      customer_growth: number;
      menu_popularity_growth: number;
    };
    top_performers: {
      best_selling_item: string;
      highest_revenue_item: string;
      most_viewed_qr: string;
      best_campaign: string;
    };
    alerts: Array<{
      type: string;
      message: string;
      priority: string;
    }>;
  };
  menu: {
    performance: {
      total_items: number;
      active_items: number;
      featured_items: number;
      seasonal_items: number;
    };
    popularity_ranking: Array<{
      name: string;
      orders: number;
      revenue: number;
      views: number;
      likes: number;
      rating: number;
    }>;
    category_performance: Array<{
      category: string;
      items: number;
      orders: number;
      revenue: number;
      avg_rating: number;
    }>;
  };
  revenue: {
    overview: {
      total_revenue: number;
      total_orders: number;
      average_order_value: number;
      revenue_growth: number;
      order_growth: number;
    };
    daily_revenue: Array<{
      date: string;
      revenue: number;
      orders: number;
    }>;
    revenue_by_category: Array<{
      category: string;
      revenue: number;
      percentage: number;
    }>;
  };
  qr: {
    overview: {
      total_qr_codes: number;
      active_qr_codes: number;
      total_scans: number;
      unique_scanners: number;
      conversion_rate: number;
    };
    qr_performance: Array<{
      name: string;
      scans: number;
      unique_scanners: number;
      conversions: number;
      conversion_rate: number;
      revenue_generated: number;
    }>;
  };
  marketing: {
    overview: {
      total_campaigns: number;
      active_campaigns: number;
      total_reach: number;
      total_engagement: number;
      total_conversions: number;
      roi: number;
    };
    campaign_performance: Array<{
      name: string;
      type: string;
      reach: number;
      engagement: number;
      conversions: number;
      revenue: number;
      cost: number;
      roi: number;
    }>;
  };
}

export default function AnalyticsInsights() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  
  // State
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'revenue' | 'qr' | 'marketing'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [showExportModal, setShowExportModal] = useState(false);

  // Load analytics data
  const loadAnalyticsData = async () => {
    if (!currentWorkspace) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/analytics?workspace_id=${currentWorkspace.id}&period=${selectedPeriod}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load analytics data');
      }
      
      setAnalyticsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when workspace or period changes
  useEffect(() => {
    if (currentWorkspace) {
      loadAnalyticsData();
    }
  }, [currentWorkspace, selectedPeriod]);

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Workspace Selected</h2>
            <p className="text-gray-500">Please select a workspace to view analytics data.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/restaurant-curator" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Restaurant Curator
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
                <p className="text-sm text-gray-600">{currentWorkspace.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              
              <button
                onClick={() => setShowExportModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <RefreshCwIcon className="mx-auto h-8 w-8 text-gray-400 animate-spin mb-4" />
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex">
              <AlertCircleIcon className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error loading analytics data</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Data */}
        {analyticsData && !loading && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSignIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ${analyticsData.overview.summary.total_revenue.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">
                        +{Math.round(analyticsData.overview.trends.revenue_growth * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <PackageIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analyticsData.overview.summary.total_orders.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">
                        +{Math.round(analyticsData.overview.trends.order_growth * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UsersIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Customers</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analyticsData.overview.summary.total_customers.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">
                        +{Math.round(analyticsData.overview.trends.customer_growth * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <QrCode className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active QR Codes</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analyticsData.overview.summary.active_qr_codes}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {analyticsData.qr.overview.total_scans.toLocaleString()} total scans
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {[
                    { id: 'overview', name: 'Overview', icon: BarChart3Icon },
                    { id: 'menu', name: 'Menu Analytics', icon: MenuIcon },
                    { id: 'revenue', name: 'Revenue', icon: DollarSignIcon },
                    { id: 'qr', name: 'QR Analytics', icon: QrCode },
                    { id: 'marketing', name: 'Marketing', icon: Megaphone }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Top Performers */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Best Selling Item</h4>
                      <p className="text-lg font-semibold text-gray-900">{analyticsData.overview.top_performers.best_selling_item}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Highest Revenue Item</h4>
                      <p className="text-lg font-semibold text-gray-900">{analyticsData.overview.top_performers.highest_revenue_item}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Most Viewed QR</h4>
                      <p className="text-lg font-semibold text-gray-900">{analyticsData.overview.top_performers.most_viewed_qr}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Best Campaign</h4>
                      <p className="text-lg font-semibold text-gray-900">{analyticsData.overview.top_performers.best_campaign}</p>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
                  <div className="space-y-3">
                    {analyticsData.overview.alerts.map((alert, index) => (
                      <div key={index} className={`flex items-center p-3 rounded-lg ${
                        alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                        alert.type === 'success' ? 'bg-green-50 border border-green-200' :
                        'bg-blue-50 border border-blue-200'
                      }`}>
                        <div className="flex-shrink-0">
                          {alert.type === 'warning' && <AlertCircleIcon className="h-5 w-5 text-yellow-500" />}
                          {alert.type === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                          {alert.type === 'info' && <InfoIcon className="h-5 w-5 text-blue-500" />}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                          <p className="text-xs text-gray-500 capitalize">{alert.priority} priority</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="space-y-6">
                {/* Menu Performance */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{analyticsData.menu.performance.total_items}</p>
                      <p className="text-sm text-gray-500">Total Items</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{analyticsData.menu.performance.active_items}</p>
                      <p className="text-sm text-gray-500">Active Items</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{analyticsData.menu.performance.featured_items}</p>
                      <p className="text-sm text-gray-500">Featured Items</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{analyticsData.menu.performance.seasonal_items}</p>
                      <p className="text-sm text-gray-500">Seasonal Items</p>
                    </div>
                  </div>
                </div>

                {/* Popularity Ranking */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Popularity Ranking</h3>
                  <div className="space-y-4">
                    {analyticsData.menu.popularity_ranking.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.orders} orders • ${item.revenue} revenue</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900">{item.rating}</p>
                            <p className="text-xs text-gray-500">Rating</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900">{item.likes}</p>
                            <p className="text-xs text-gray-500">Likes</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'revenue' && (
              <div className="space-y-6">
                {/* Revenue Overview */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">
                        ${analyticsData.revenue.overview.total_revenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">Total Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">
                        ${analyticsData.revenue.overview.average_order_value}
                      </p>
                      <p className="text-sm text-gray-500">Average Order Value</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">
                        +{Math.round(analyticsData.revenue.overview.revenue_growth * 100)}%
                      </p>
                      <p className="text-sm text-gray-500">Revenue Growth</p>
                    </div>
                  </div>
                </div>

                {/* Revenue by Category */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
                  <div className="space-y-3">
                    {analyticsData.revenue.revenue_by_category.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <span className="text-sm font-medium text-gray-900">{category.category}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">${category.revenue.toLocaleString()}</span>
                          <span className="text-sm text-gray-400">{category.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'qr' && (
              <div className="space-y-6">
                {/* QR Overview */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{analyticsData.qr.overview.total_qr_codes}</p>
                      <p className="text-sm text-gray-500">Total QR Codes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{analyticsData.qr.overview.total_scans.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Total Scans</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{analyticsData.qr.overview.unique_scanners.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Unique Scanners</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">
                        {Math.round(analyticsData.qr.overview.conversion_rate * 100)}%
                      </p>
                      <p className="text-sm text-gray-500">Conversion Rate</p>
                    </div>
                  </div>
                </div>

                {/* QR Performance */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code Performance</h3>
                  <div className="space-y-4">
                    {analyticsData.qr.qr_performance.map((qr, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{qr.name}</p>
                          <p className="text-xs text-gray-500">{qr.scans.toLocaleString()} scans • {qr.unique_scanners.toLocaleString()} unique</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900">{qr.conversions}</p>
                            <p className="text-xs text-gray-500">Conversions</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900">
                              {Math.round(qr.conversion_rate * 100)}%
                            </p>
                            <p className="text-xs text-gray-500">Rate</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900">
                              ${qr.revenue_generated.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">Revenue</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'marketing' && (
              <div className="space-y-6">
                {/* Marketing Overview */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{analyticsData.marketing.overview.total_campaigns}</p>
                      <p className="text-sm text-gray-500">Total Campaigns</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{analyticsData.marketing.overview.total_reach.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Total Reach</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{analyticsData.marketing.overview.total_conversions}</p>
                      <p className="text-sm text-gray-500">Total Conversions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{analyticsData.marketing.overview.roi}</p>
                      <p className="text-sm text-gray-500">ROI</p>
                    </div>
                  </div>
                </div>

                {/* Campaign Performance */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
                  <div className="space-y-4">
                    {analyticsData.marketing.campaign_performance.map((campaign, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                          <p className="text-xs text-gray-500">{campaign.type} • {campaign.reach.toLocaleString()} reach</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900">{campaign.conversions}</p>
                            <p className="text-xs text-gray-500">Conversions</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900">
                              ${campaign.revenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">Revenue</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900">{campaign.roi}</p>
                            <p className="text-xs text-gray-500">ROI</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
