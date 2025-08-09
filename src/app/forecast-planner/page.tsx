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
  Upload as UploadIcon,
  FileText as FileTextIcon,
  Hash as HashIcon,
  PenTool,
  Folder as FolderIcon,
  AlertCircle as AlertCircleIcon
} from 'lucide-react';

import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/contexts/AuthContext';

interface ForecastData {
  date: string;
  predicted_revenue: number;
  predicted_orders: number;
  confidence: number;
  factors: {
    seasonality: number;
    trend: number;
    historical_average: number;
  };
}

interface HistoricalData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
  average_order: number;
  popular_items: string[];
}

interface ForecastResponse {
  historical: HistoricalData[];
  forecast: ForecastData[];
  period: number;
}

interface CustomForecast {
  type: string;
  forecast: any[];
  parameters: any;
  item?: any;
}

export default function ForecastPlanner() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  
  // State
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
  const [customForecast, setCustomForecast] = useState<CustomForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and settings
  const [period, setPeriod] = useState(30);
  const [forecastType, setForecastType] = useState('general');
  const [showHistorical, setShowHistorical] = useState(true);
  const [showForecast, setShowForecast] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'customers'>('revenue');
  
  // Custom forecast
  const [showCustomForecast, setShowCustomForecast] = useState(false);
  const [customForecastType, setCustomForecastType] = useState('demand');
  const [customParameters, setCustomParameters] = useState({
    days: 30,
    growth_rate: 0.05,
    season: 'summer',
    item_id: ''
  });

  // Load forecast data
  const loadForecastData = async () => {
    if (!currentWorkspace) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/forecast?workspace_id=${currentWorkspace.id}&period=${period}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load forecast data');
      }
      
      setForecastData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load forecast data');
    } finally {
      setLoading(false);
    }
  };

  // Generate custom forecast
  const generateCustomForecast = async () => {
    if (!currentWorkspace) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/forecast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspace_id: currentWorkspace.id,
          forecast_type: customForecastType,
          parameters: customParameters
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate custom forecast');
      }
      
      setCustomForecast(data.forecast);
      setShowCustomForecast(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate custom forecast');
    } finally {
      setLoading(false);
    }
  };

  // Export data
  const exportData = (format: 'csv' | 'json') => {
    if (!forecastData) return;
    
    const data = {
      historical: forecastData.historical,
      forecast: forecastData.forecast,
      period: forecastData.period,
      workspace: currentWorkspace?.name,
      generated_at: new Date().toISOString()
    };
    
    if (format === 'csv') {
      // Convert to CSV
      const csvContent = convertToCSV(data);
      downloadFile(csvContent, `forecast_${currentWorkspace?.name}_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    } else {
      // Export as JSON
      const jsonContent = JSON.stringify(data, null, 2);
      downloadFile(jsonContent, `forecast_${currentWorkspace?.name}_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    }
  };

  const convertToCSV = (data: any) => {
    const headers = ['Date', 'Revenue', 'Orders', 'Customers', 'Average Order', 'Type'];
    const rows = [
      ...data.historical.map((item: any) => [
        item.date,
        item.revenue,
        item.orders,
        item.customers,
        item.average_order,
        'Historical'
      ]),
      ...data.forecast.map((item: any) => [
        item.date,
        item.predicted_revenue,
        item.predicted_orders,
        '',
        '',
        'Forecast'
      ])
    ];
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Load data on mount and when workspace changes
  useEffect(() => {
    if (currentWorkspace) {
      loadForecastData();
    }
  }, [currentWorkspace, period]);

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircleIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-semibold text-slate-300 mb-2">No Workspace Selected</h2>
            <p className="text-slate-400">Please select a workspace to view forecast data.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-slate-800/80 shadow-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/restaurant-curator" className="flex items-center text-slate-300 hover:text-white">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Restaurant Curator
              </Link>
              <div className="h-6 w-px bg-slate-600" />
              <div>
                <h1 className="text-2xl font-bold text-white">Forecast Planner</h1>
                <p className="text-sm text-slate-300">{currentWorkspace.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCustomForecast(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Custom Forecast
              </button>
              
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(parseInt(e.target.value))}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-slate-800/80 rounded-lg shadow-sm border border-slate-700/50 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Forecast Controls</h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadForecastData}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-slate-600/50 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-300 bg-slate-700/50 hover:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showHistorical}
                    onChange={(e) => setShowHistorical(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-slate-200">Historical</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showForecast}
                    onChange={(e) => setShowForecast(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-slate-200">Forecast</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Metric</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as any)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="revenue">Revenue</option>
                <option value="orders">Orders</option>
                <option value="customers">Customers</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Forecast Type</label>
              <select
                value={forecastType}
                onChange={(e) => setForecastType(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="general">General Forecast</option>
                <option value="demand">Demand Forecast</option>
                <option value="revenue">Revenue Forecast</option>
                <option value="seasonal">Seasonal Forecast</option>
              </select>
            </div>
            
            <div className="flex items-end space-x-2">
              <button
                onClick={() => exportData('csv')}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-slate-600/50 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-300 bg-slate-700/50 hover:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
              
              <button
                onClick={() => exportData('json')}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-slate-600/50 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-300 bg-slate-700/50 hover:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export JSON
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-slate-800/80 rounded-lg shadow-sm border border-slate-700/50 p-12 text-center">
            <RefreshCw className="mx-auto h-8 w-8 text-slate-400 animate-spin mb-4" />
            <p className="text-slate-300">Loading forecast data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex">
              <AlertCircleIcon className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error loading forecast data</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Forecast Data */}
        {forecastData && !loading && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-800/80 rounded-lg shadow-sm border border-slate-700/50 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSignIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Average Revenue</p>
                    <p className="text-2xl font-semibold text-white">
                      €{Math.round(forecastData.forecast.reduce((sum, item) => sum + item.predicted_revenue, 0) / forecastData.forecast.length)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/80 rounded-lg shadow-sm border border-slate-700/50 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <PackageIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Average Orders</p>
                    <p className="text-2xl font-semibold text-white">
                      {Math.round(forecastData.forecast.reduce((sum, item) => sum + item.predicted_orders, 0) / forecastData.forecast.length)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/80 rounded-lg shadow-sm border border-slate-700/50 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUpIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Growth Rate</p>
                    <p className="text-2xl font-semibold text-white">
                      +{Math.round((forecastData.forecast[forecastData.forecast.length - 1].predicted_revenue / forecastData.forecast[0].predicted_revenue - 1) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/80 rounded-lg shadow-sm border border-slate-700/50 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TargetIcon className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Confidence</p>
                    <p className="text-2xl font-semibold text-white">
                      {Math.round(forecastData.forecast.reduce((sum, item) => sum + item.confidence, 0) / forecastData.forecast.length * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-slate-800/80 rounded-lg shadow-sm border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Forecast Chart</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-400">Historical</span>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-400">Forecast</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="h-64 bg-slate-700/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3Icon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <p className="text-slate-300">Interactive chart will be implemented here</p>
                  <p className="text-sm text-slate-400 mt-2">Showing {selectedMetric} data for {period} days</p>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-slate-800/80 rounded-lg shadow-sm border border-slate-700/50">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-white">Forecast Data</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Confidence</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-800/80 divide-y divide-slate-700/50">
                    {forecastData.historical.slice(-10).map((item, index) => (
                      <tr key={`historical-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">€{item.revenue}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.orders}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Historical
                          </span>
                        </td>
                      </tr>
                    ))}
                    {forecastData.forecast.slice(0, 10).map((item, index) => (
                      <tr key={`forecast-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">€{item.predicted_revenue}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.predicted_orders}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{Math.round(item.confidence * 100)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Forecast
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Custom Forecast Modal */}
        {showCustomForecast && (
          <div className="fixed inset-0 bg-slate-900/50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-slate-800/80 border-slate-700/50">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-white mb-4">Generate Custom Forecast</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Forecast Type</label>
                    <select
                      value={customForecastType}
                      onChange={(e) => setCustomForecastType(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="demand">Demand Forecast</option>
                      <option value="revenue">Revenue Forecast</option>
                      <option value="seasonal">Seasonal Forecast</option>
                      <option value="menu_item">Menu Item Forecast</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Days</label>
                    <input
                      type="number"
                      value={customParameters.days}
                      onChange={(e) => setCustomParameters({...customParameters, days: parseInt(e.target.value)})}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    />
                  </div>
                  
                  {customForecastType === 'revenue' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Growth Rate (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={customParameters.growth_rate * 100}
                        onChange={(e) => setCustomParameters({...customParameters, growth_rate: parseFloat(e.target.value) / 100})}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      />
                    </div>
                  )}
                  
                  {customForecastType === 'seasonal' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Season</label>
                      <select
                        value={customParameters.season}
                        onChange={(e) => setCustomParameters({...customParameters, season: e.target.value})}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="summer">Summer</option>
                        <option value="winter">Winter</option>
                        <option value="spring">Spring</option>
                        <option value="autumn">Autumn</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowCustomForecast(false)}
                    className="inline-flex items-center px-4 py-2 border border-slate-600/50 shadow-sm text-sm font-medium rounded-md text-slate-300 bg-slate-700/50 hover:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={generateCustomForecast}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Generating...' : 'Generate Forecast'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Forecast Results */}
        {customForecast && (
          <div className="bg-slate-800/80 rounded-lg shadow-sm border border-slate-700/50 p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Custom Forecast Results</h3>
              <button
                onClick={() => setCustomForecast(null)}
                className="text-slate-400 hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-400">Type</p>
                  <p className="text-lg font-semibold text-white capitalize">{customForecast.type}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-400">Period</p>
                  <p className="text-lg font-semibold text-white">{customForecast.forecast.length} days</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-400">Average Confidence</p>
                  <p className="text-lg font-semibold text-white">
                    {Math.round(customForecast.forecast.reduce((sum, item) => sum + (item.confidence || 0), 0) / customForecast.forecast.length * 100)}%
                  </p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                      {customForecast.type === 'revenue' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Revenue</th>
                      )}
                      {customForecast.type === 'demand' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Demand</th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-800/80 divide-y divide-slate-700/50">
                    {customForecast.forecast.slice(0, 10).map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {customForecast.type === 'revenue' ? `€${item.predicted_revenue}` : item.predicted_demand}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{Math.round(item.confidence * 100)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 