'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth/AuthGuard';
import RoleGuard from '@/components/auth/RoleGuard';
import UserRoleInfo from '@/components/auth/UserRoleInfo';
import { UserRole, createRBAC } from '@/lib/rbac';
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
  TrendingDown,
  Plus,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Settings,
  Shield,
  Bot,
  Activity,
  Truck,
  Server,
  Brain,
  Palette,
  TestTube
} from 'lucide-react';

export default function RestaurantCurator() {
  const { user } = useAuth();
  const { 
    workspaces, 
    loading, 
    error, 
    currentWorkspace,
    selectedWorkspace,
    setSelectedWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    dismissAlert,
    addActivity
  } = useWorkspaceContext();
  
  // Mock user role - in real implementation, this would come from user context
  const userRole: UserRole = 'owner'; // Default to owner for demo
  const rbac = createRBAC(userRole);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspaceData, setNewWorkspaceData] = useState({
    name: '',
    type: 'restaurant' as const,
    location: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    capacity: '',
    cuisine: ''
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWorkspace(newWorkspaceData);
      setShowCreateModal(false);
      setNewWorkspaceData({
        name: '',
        type: 'restaurant',
        location: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        capacity: '',
        cuisine: ''
      });
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  const handleDismissAlert = async (workspaceId: string, alertId: string) => {
    try {
      await dismissAlert(workspaceId, alertId);
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  const handleWorkspaceSelect = (workspaceId: string) => {
    setSelectedWorkspace(workspaceId);
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
        items: currentWorkspace?.workspace_metrics?.find(m => m.metric_type === 'menu_performance')?.value || 0,
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
        campaigns: 3,
        reach: '15,200',
        conversion: '8.5%'
      }
    },
    {
      id: 'ai-assistant',
      name: 'AI Assistant',
      description: 'Get intelligent insights and smart recommendations for your restaurant',
      icon: Bot,
      href: '/ai-assistant',
      color: 'bg-indigo-500',
      stats: {
        insights: 12,
        recommendations: 5,
        accuracy: '95%'
      }
    },
    {
      id: 'advanced-analytics',
      name: 'Advanced Analytics',
      description: 'Comprehensive insights and detailed reporting for your restaurant',
      icon: Activity,
      href: '/advanced-analytics',
      color: 'bg-emerald-500',
      stats: {
        reports: 8,
        insights: 24,
        accuracy: '98%'
      }
    },
    {
      id: 'supply-chain',
      name: 'Supply Chain',
      description: 'Manage suppliers, inventory, and orders for optimal operations',
      icon: Truck,
      href: '/supply-chain',
      color: 'bg-orange-500',
      stats: {
        suppliers: 4,
        orders: 3,
        savings: '€1,250'
      }
    },
    {
      id: 'security-compliance',
      name: 'Security & Compliance',
      description: 'Manage security policies, threat detection, and GDPR compliance',
      icon: Shield,
      href: '/security-compliance',
      color: 'bg-red-500',
      stats: {
        policies: 3,
        threats: 2,
        compliance: '100%'
      }
    },
    {
      id: 'api-gateway',
      name: 'API Gateway',
      description: 'Manage integrations, webhooks, and API configurations',
      icon: Server,
      href: '/api-gateway',
      color: 'bg-blue-500',
      stats: {
        integrations: 5,
        webhooks: 10,
        uptime: '99.9%'
      }
    },
    {
      id: 'performance',
      name: 'Performance Monitor',
      description: 'Monitor cache performance, query optimization, and system metrics',
      icon: Zap,
      href: '/performance',
      color: 'bg-yellow-500',
      stats: {
        cacheHits: 98,
        queryOptimizations: 12,
        uptime: '99.99%'
      }
    },
    {
      id: 'advanced-ai',
      name: 'Advanced AI Insights',
      description: 'Predictive analytics, smart pricing, and AI-powered business optimization',
      icon: Brain,
      href: '/advanced-ai',
      color: 'bg-purple-500',
      stats: {
        insights: 12,
        recommendations: 5,
        accuracy: '95%'
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise Management',
      description: 'Multi-tenant architecture, compliance reports, and advanced analytics',
      icon: Building2,
      href: '/enterprise',
      color: 'bg-indigo-500',
      stats: {
        tenants: 1,
        compliance: '100%',
        features: 8
      }
    },
    {
      id: 'testing',
      name: 'Testing & QA',
      description: 'Comprehensive testing framework and quality assurance tools',
      icon: TestTube,
      href: '/testing',
      color: 'bg-indigo-500',
      stats: {
        tests: 24,
        coverage: '85%',
        quality: '92%'
      }
    },
    {
      id: 'quality-assurance',
      name: 'Quality Assurance',
      description: 'Code quality analysis, security scanning, and automated reviews',
      icon: Shield,
      href: '/quality-assurance',
      color: 'bg-emerald-500',
      stats: {
        security: '95%',
        performance: '88%',
        maintainability: '90%'
      }
    }
  ];

  // Wrapper komponent pre autentifikáciu
  const RestaurantCuratorContent = () => {
    if (isLoading || loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your restaurant dashboard...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Error loading workspaces: {error}</p>
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
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.email?.split('@')[0]}!
                </h1>
                <p className="text-gray-600">
                  Manage your restaurant operations and track performance
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Restaurant
              </button>
            </motion.div>
          </div>

          {/* Workspace Selection */}
          {workspaces.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Restaurants</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {workspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    onClick={() => handleWorkspaceSelect(workspace.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedWorkspace === workspace.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{workspace.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        workspace.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {workspace.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{workspace.type} • {workspace.location}</p>
                    <p className="text-xs text-gray-500">Last active: {new Date(workspace.last_active || workspace.created_at || '').toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Current Workspace Overview */}
          {currentWorkspace && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
            >
              {/* User Role Info */}
              <div className="mb-6">
                <UserRoleInfo userRole={userRole} />
              </div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{currentWorkspace.name}</h2>
                  <p className="text-gray-600">{currentWorkspace.type} • {currentWorkspace.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{currentWorkspace.capacity || 0} capacity</span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {currentWorkspace.workspace_metrics?.map((metric) => (
                  <div key={metric.metric_type} className="text-center p-4 bg-gray-50 rounded-lg">
                    {metric.metric_type === 'daily_revenue' && <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />}
                    {metric.metric_type === 'staff_productivity' && <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />}
                    {metric.metric_type === 'menu_performance' && <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />}
                    {metric.metric_type === 'customer_satisfaction' && <Star className="w-6 h-6 text-orange-600 mx-auto mb-2" />}
                    <p className="text-2xl font-bold text-gray-900">
                      {metric.metric_type === 'daily_revenue' ? `€${metric.value.toLocaleString()}` : 
                       metric.metric_type === 'customer_satisfaction' ? `${metric.value}` : `${metric.value}%`}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {metric.metric_type.replace('_', ' ')}
                    </p>
                    <div className="flex items-center justify-center mt-1">
                      {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                      <span className={`text-xs ml-1 ${
                        metric.trend === 'up' ? 'text-green-600' : 
                        metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.change_percentage > 0 ? '+' : ''}{metric.change_percentage}%
                      </span>
                    </div>
                  </div>
                )) || (
                  <>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">€0</p>
                      <p className="text-sm text-gray-600">Daily Revenue</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">0%</p>
                      <p className="text-sm text-gray-600">Staff Productivity</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">0%</p>
                      <p className="text-sm text-gray-600">Menu Performance</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Star className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">0</p>
                      <p className="text-sm text-gray-600">Customer Satisfaction</p>
                    </div>
                  </>
                )}
              </div>

              {/* Alerts */}
              {currentWorkspace.workspace_alerts && currentWorkspace.workspace_alerts.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Alerts</h3>
                  <div className="space-y-2">
                    {currentWorkspace.workspace_alerts
                      .filter(alert => !alert.is_read)
                      .slice(0, 3)
                      .map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />}
                            {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500 mr-2" />}
                            {alert.type === 'info' && <Info className="w-4 h-4 text-blue-500 mr-2" />}
                            <span className="text-sm text-gray-700">{alert.message}</span>
                          </div>
                          <button
                            onClick={() => handleDismissAlert(currentWorkspace.id, alert.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Micro Tools Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Tools</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {microTools
                .filter(tool => rbac.canAccessFeature(tool.id))
                .map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
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
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <RoleGuard userRole={userRole} feature="menu-maker">
                <Link href="/menu-maker" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <ChefHat className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium">Add Menu Item</span>
                </Link>
              </RoleGuard>
              
              <RoleGuard userRole={userRole} feature="marketing">
                <Link href="/marketing-assistant" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Calendar className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium">Schedule Promotion</span>
                </Link>
              </RoleGuard>
              
              <RoleGuard userRole={userRole} feature="analytics">
                <Link href="/analytics-insights" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Target className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium">View Analytics</span>
                </Link>
              </RoleGuard>
              
              <RoleGuard userRole={userRole} feature="user-management">
                <Link href="/user-management" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Users className="w-5 h-5 text-orange-600 mr-3" />
                  <span className="text-sm font-medium">Manage Staff</span>
                </Link>
              </RoleGuard>
              
              <RoleGuard userRole={userRole} feature="workspace-settings">
                <Link href="/settings" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Settings className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium">Settings</span>
                </Link>
              </RoleGuard>
              
              <RoleGuard userRole={userRole} feature="ai-assistant">
                <Link href="/ai-assistant" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Bot className="w-5 h-5 text-indigo-600 mr-3" />
                  <span className="text-sm font-medium">AI Assistant</span>
                </Link>
              </RoleGuard>
              
              <RoleGuard userRole={userRole} feature="advanced-analytics">
                <Link href="/advanced-analytics" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Activity className="w-5 h-5 text-emerald-600 mr-3" />
                  <span className="text-sm font-medium">Advanced Analytics</span>
                </Link>
              </RoleGuard>
              
              <RoleGuard userRole={userRole} feature="supply-chain">
                <Link href="/supply-chain" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Truck className="w-5 h-5 text-orange-600 mr-3" />
                  <span className="text-sm font-medium">Supply Chain</span>
                </Link>
              </RoleGuard>
            </div>
          </motion.div>
        </div>

        {/* Create Workspace Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Restaurant</h2>
              <form onSubmit={handleCreateWorkspace}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                    <input
                      type="text"
                      required
                      value={newWorkspaceData.name}
                      onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newWorkspaceData.type}
                      onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="restaurant">Restaurant</option>
                      <option value="cafe">Café</option>
                      <option value="bar">Bar</option>
                      <option value="catering">Catering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={newWorkspaceData.location}
                      onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newWorkspaceData.description}
                      onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Restaurant
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
