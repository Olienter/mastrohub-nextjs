'use client';

import { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Target, 
  BarChart3, 
  Activity, 
  Settings, 
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  PieChart,
  LineChart,
  Calendar,
  Star,
  MessageSquare,
  Mail,
  Smartphone,
  Share2
} from 'lucide-react';

interface SalesPrediction {
  date: string;
  predictedSales: number;
  confidence: number;
  factors: string[];
}

interface CustomerBehavior {
  customerId: string;
  preferences: string[];
  spendingPattern: number;
  visitFrequency: number;
  favoriteItems: string[];
  lifetimeValue: number;
}

interface MenuOptimization {
  itemId: string;
  currentPrice: number;
  recommendedPrice: number;
  priceElasticity: number;
  demandForecast: number;
  optimizationReason: string;
}

interface MarketingCampaign {
  id: string;
  type: 'email' | 'sms' | 'social' | 'push';
  targetAudience: string[];
  message: string;
  predictedResponse: number;
  cost: number;
  roi: number;
}

interface AdvancedAIData {
  salesPredictions: SalesPrediction[];
  customerBehavior: CustomerBehavior[];
  menuOptimization: MenuOptimization[];
  marketingCampaigns: MarketingCampaign[];
  inventoryOptimization: {
    recommendations: any[];
    reorderPoints: Record<string, number>;
    wasteReduction: number;
    costSavings: number;
  };
  customerSegmentation: {
    segments: Array<{
      name: string;
      customers: string[];
      characteristics: string[];
      value: number;
      recommendations: string[];
    }>;
    insights: string[];
  };
}

export default function AdvancedAIPage() {
  const [aiData, setAiData] = useState<AdvancedAIData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [actionResults, setActionResults] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchAdvancedAIData();
  }, []);

  const fetchAdvancedAIData = async () => {
    try {
      const [predictions, behavior, optimization, campaigns, inventory, segmentation] = await Promise.all([
        fetch('/api/advanced-ai?type=sales-predictions').then(r => r.json()),
        fetch('/api/advanced-ai?type=customer-behavior').then(r => r.json()),
        fetch('/api/advanced-ai?type=menu-optimization').then(r => r.json()),
        fetch('/api/advanced-ai?type=marketing-campaigns').then(r => r.json()),
        fetch('/api/advanced-ai?type=inventory-optimization').then(r => r.json()),
        fetch('/api/advanced-ai?type=customer-segmentation').then(r => r.json())
      ]);

      setAiData({
        salesPredictions: predictions.predictions,
        customerBehavior: behavior.behavior,
        menuOptimization: optimization.optimization,
        marketingCampaigns: campaigns.campaigns,
        inventoryOptimization: inventory.inventory,
        customerSegmentation: segmentation.segmentation
      });
    } catch (error) {
      console.error('Failed to fetch Advanced AI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (action: string, data: any) => {
    try {
      const response = await fetch('/api/advanced-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data })
      });
      
      const result = await response.json();
      setActionResults(prev => ({ ...prev, [action]: result }));
      
      // Refresh data after action
      setTimeout(fetchAdvancedAIData, 1000);
    } catch (error) {
      setActionResults(prev => ({ 
        ...prev, 
        [action]: { success: false, error: 'Action failed' } 
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!aiData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Advanced AI Data Unavailable</h2>
            <p className="text-gray-600">Failed to load AI insights and predictions</p>
          </div>
        </div>
      </div>
    );
  }

  const { salesPredictions, customerBehavior, menuOptimization, marketingCampaigns, inventoryOptimization, customerSegmentation } = aiData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Brain className="h-8 w-8 text-purple-600" />
                Advanced AI Insights
              </h1>
              <p className="text-gray-600 mt-2">
                Predictive analytics, smart pricing, and AI-powered business optimization
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">AI Active</span>
              </div>
              <button
                onClick={fetchAdvancedAIData}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Predicted Sales</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${salesPredictions.reduce((sum, p) => sum + p.predictedSales, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">+12.5% vs last month</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Segments</p>
                <p className="text-2xl font-bold text-gray-900">{customerSegmentation.segments.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-600">High-value focus</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Menu Optimizations</p>
                <p className="text-2xl font-bold text-gray-900">{menuOptimization.length}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">+8.3% revenue potential</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Marketing ROI</p>
                <p className="text-2xl font-bold text-gray-900">
                  {marketingCampaigns.reduce((sum, c) => sum + c.roi, 0).toFixed(1)}x
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">High performing campaigns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'predictions', label: 'Sales Predictions', icon: TrendingUp },
                { id: 'customers', label: 'Customer Insights', icon: Users },
                { id: 'menu', label: 'Menu Optimization', icon: ShoppingCart },
                { id: 'marketing', label: 'Marketing AI', icon: Target },
                { id: 'inventory', label: 'Inventory AI', icon: BarChart3 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Predictions</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Next 30 Days</span>
                        <span className="font-medium">
                          ${salesPredictions.reduce((sum, p) => sum + p.predictedSales, 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Avg Confidence</span>
                        <span className="font-medium">
                          {(salesPredictions.reduce((sum, p) => sum + p.confidence, 0) / salesPredictions.length * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Key Factors</span>
                        <span className="font-medium text-sm">Seasonal trends, Events</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Behavior</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Avg Lifetime Value</span>
                        <span className="font-medium">
                          ${(customerBehavior.reduce((sum, c) => sum + c.lifetimeValue, 0) / customerBehavior.length).toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Avg Visit Frequency</span>
                        <span className="font-medium">
                          {(customerBehavior.reduce((sum, c) => sum + c.visitFrequency, 0) / customerBehavior.length).toFixed(1)} visits/month
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Top Preferences</span>
                        <span className="font-medium text-sm">Italian, Seafood</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Optimization</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Items Optimized</span>
                        <span className="font-medium">{menuOptimization.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Avg Price Change</span>
                        <span className="font-medium text-green-600">
                          +${(menuOptimization.reduce((sum, m) => sum + (m.recommendedPrice - m.currentPrice), 0) / menuOptimization.length).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Demand Forecast</span>
                        <span className="font-medium">
                          +{(menuOptimization.reduce((sum, m) => sum + m.demandForecast, 0) / menuOptimization.length).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Campaigns</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Active Campaigns</span>
                        <span className="font-medium">{marketingCampaigns.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Avg ROI</span>
                        <span className="font-medium text-green-600">
                          {(marketingCampaigns.reduce((sum, c) => sum + c.roi, 0) / marketingCampaigns.length).toFixed(1)}x
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Predicted Response</span>
                        <span className="font-medium">
                          {(marketingCampaigns.reduce((sum, c) => sum + c.predictedResponse, 0) / marketingCampaigns.length * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sales Predictions Tab */}
            {activeTab === 'predictions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Sales Predictions (Next 30 Days)</h3>
                  <button
                    onClick={() => executeAction('predict_sales', { historicalData: [], days: 30 })}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Update Predictions
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {salesPredictions.slice(0, 9).map((prediction, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          {new Date(prediction.date).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          prediction.confidence > 0.8 ? 'bg-green-100 text-green-800' : 
                          prediction.confidence > 0.6 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {(prediction.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        ${prediction.predictedSales.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Factors: {prediction.factors.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Prediction Insights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Predicted Revenue:</span>
                      <span className="font-medium ml-2">
                        ${salesPredictions.reduce((sum, p) => sum + p.predictedSales, 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Average Confidence:</span>
                      <span className="font-medium ml-2">
                        {(salesPredictions.reduce((sum, p) => sum + p.confidence, 0) / salesPredictions.length * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Peak Day:</span>
                      <span className="font-medium ml-2">
                        {salesPredictions.reduce((max, p) => p.predictedSales > max.predictedSales ? p : max).date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Insights Tab */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments</h3>
                    <div className="space-y-3">
                      {customerSegmentation.segments.map((segment, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{segment.name}</h4>
                            <span className="text-sm text-gray-600">{segment.customers.length} customers</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {segment.characteristics.join(', ')}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Value:</span>
                            <span className="font-medium">${segment.value.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Behavior Analysis</h3>
                    <div className="space-y-3">
                      {customerBehavior.slice(0, 5).map((customer, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{customer.customerId}</span>
                            <span className="text-sm text-gray-600">${customer.lifetimeValue.toFixed(0)}</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {customer.visitFrequency} visits/month • ${customer.spendingPattern.toFixed(0)} avg spend
                          </div>
                          <div className="text-xs text-gray-500">
                            Favorites: {customer.favoriteItems.slice(0, 2).join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Key Insights</h4>
                  <div className="space-y-2">
                    {customerSegmentation.insights.map((insight, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Menu Optimization Tab */}
            {activeTab === 'menu' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Menu Optimization</h3>
                  <button
                    onClick={() => executeAction('optimize_menu', { menuItems: [], salesData: [] })}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    <Settings className="h-4 w-4" />
                    Re-optimize
                  </button>
                </div>

                <div className="space-y-4">
                  {menuOptimization.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.itemId}</h4>
                          <p className="text-sm text-gray-600">{item.optimizationReason}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Price Change</div>
                          <div className={`font-medium ${
                            item.recommendedPrice > item.currentPrice ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${item.currentPrice.toFixed(2)} → ${item.recommendedPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Price Elasticity:</span>
                          <span className="font-medium ml-2">{item.priceElasticity.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Demand Forecast:</span>
                          <span className="font-medium ml-2">+{item.demandForecast.toFixed(0)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Revenue Impact:</span>
                          <span className="font-medium text-green-600 ml-2">
                            +${((item.recommendedPrice - item.currentPrice) * item.demandForecast / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Marketing AI Tab */}
            {activeTab === 'marketing' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">AI-Generated Marketing Campaigns</h3>
                  <button
                    onClick={() => executeAction('generate_campaigns', { customerSegments: [], salesGoals: {} })}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Target className="h-4 w-4" />
                    Generate New Campaigns
                  </button>
                </div>

                <div className="space-y-4">
                  {marketingCampaigns.map((campaign, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {campaign.type === 'email' && <Mail className="h-5 w-5 text-blue-600" />}
                          {campaign.type === 'sms' && <Smartphone className="h-5 w-5 text-green-600" />}
                          {campaign.type === 'social' && <Share2 className="h-5 w-5 text-purple-600" />}
                          {campaign.type === 'push' && <MessageSquare className="h-5 w-5 text-orange-600" />}
                          <div>
                            <h4 className="font-medium text-gray-900">{campaign.type.toUpperCase()} Campaign</h4>
                            <p className="text-sm text-gray-600">Target: {campaign.targetAudience.join(', ')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">ROI</div>
                          <div className="font-medium text-green-600">{campaign.roi.toFixed(1)}x</div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-600 mb-1">Message:</div>
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{campaign.message}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Predicted Response:</span>
                          <span className="font-medium ml-2">{(campaign.predictedResponse * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Cost:</span>
                          <span className="font-medium ml-2">${campaign.cost}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Expected Revenue:</span>
                          <span className="font-medium text-green-600 ml-2">${(campaign.cost * campaign.roi).toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory AI Tab */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Recommendations</h3>
                    <div className="space-y-3">
                      {inventoryOptimization.recommendations.map((rec, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{rec.item}</span>
                            <span className="text-sm text-blue-600">{rec.action}</span>
                          </div>
                          <p className="text-sm text-gray-600">{rec.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Reorder Points</h3>
                    <div className="space-y-3">
                      {Object.entries(inventoryOptimization.reorderPoints).map(([item, quantity]) => (
                        <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-900">{item}</span>
                          <span className="text-sm text-gray-600">{quantity} units</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Optimization Impact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Waste Reduction:</span>
                      <span className="font-medium ml-2">{(inventoryOptimization.wasteReduction * 100).toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Cost Savings:</span>
                      <span className="font-medium text-green-600 ml-2">${inventoryOptimization.costSavings.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Recommendations:</span>
                      <span className="font-medium ml-2">{inventoryOptimization.recommendations.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
