'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Shield, 
  FileText, 
  BarChart3, 
  Users, 
  Settings, 
  CreditCard, 
  Palette,
  Activity,
  Eye,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  Database,
  Lock,
  Globe,
  Zap
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'cancelled';
  settings: {
    branding: {
      logo_url?: string;
      primary_color: string;
      secondary_color: string;
      custom_domain?: string;
    };
    features: {
      ai_assistant: boolean;
      advanced_analytics: boolean;
      multi_location: boolean;
      white_label: boolean;
      api_access: boolean;
      custom_integrations: boolean;
    };
    compliance: {
      gdpr_enabled: boolean;
      data_retention_days: number;
      audit_logging: boolean;
      encryption_level: 'standard' | 'enhanced' | 'enterprise';
    };
  };
  limits: {
    users: number;
    menu_items: number;
    storage_gb: number;
    api_calls_per_month: number;
    ai_requests_per_month: number;
    custom_integrations: number;
  };
}

interface AuditLog {
  id: string;
  tenant_id: string;
  user_id: string;
  action: string;
  resource: string;
  resource_id?: string;
  details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  timestamp: string;
}

interface ComplianceReport {
  id: string;
  tenant_id: string;
  report_type: 'gdpr' | 'security' | 'data_retention' | 'access_logs';
  status: 'pending' | 'completed' | 'failed';
  data: Record<string, any>;
  generated_at: string;
  expires_at: string;
}

interface EnterpriseAnalytics {
  tenant_id: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  metrics: {
    revenue: number;
    orders: number;
    customers: number;
    menu_items: number;
    ai_usage: number;
    api_calls: number;
    storage_used: number;
  };
  trends: {
    revenue_growth: number;
    customer_growth: number;
    order_growth: number;
  };
  insights: string[];
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  limits: {
    users: number;
    menu_items: number;
    storage_gb: number;
    api_calls_per_month: number;
    ai_requests_per_month: number;
    custom_integrations: number;
  };
  support_level: 'basic' | 'priority' | 'dedicated';
}

interface EnterpriseData {
  tenant: Tenant;
  analytics: EnterpriseAnalytics;
  available_plans: SubscriptionPlan[];
  features: {
    multi_tenant: boolean;
    audit_logging: boolean;
    compliance_reports: boolean;
    advanced_analytics: boolean;
    white_label: boolean;
    custom_integrations: boolean;
  };
}

export default function EnterprisePage() {
  const [enterpriseData, setEnterpriseData] = useState<EnterpriseData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [actionResults, setActionResults] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchEnterpriseData();
  }, []);

  const fetchEnterpriseData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/enterprise');
      if (response.ok) {
        const data = await response.json();
        setEnterpriseData(data);
      }
    } catch (error) {
      console.error('Error fetching enterprise data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('/api/enterprise?type=audit_logs');
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.audit_logs);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const fetchComplianceReports = async () => {
    try {
      const response = await fetch('/api/enterprise?type=compliance_report&report_type=gdpr');
      if (response.ok) {
        const data = await response.json();
        setComplianceReports([data.report]);
      }
    } catch (error) {
      console.error('Error fetching compliance reports:', error);
    }
  };

  const executeAction = async (action: string, data: any) => {
    try {
      const response = await fetch('/api/enterprise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...data,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setActionResults(prev => ({
          ...prev,
          [action]: { success: true, data: result }
        }));
        return result;
      } else {
        const error = await response.json();
        setActionResults(prev => ({
          ...prev,
          [action]: { success: false, error: error.error }
        }));
      }
    } catch (error) {
      console.error(`Error executing ${action}:`, error);
      setActionResults(prev => ({
        ...prev,
        [action]: { success: false, error: 'Network error' }
      }));
    }
  };

  const generateComplianceReport = async (reportType: string) => {
    await executeAction('generate_compliance_report', { report_type: reportType });
  };

  const logAuditEvent = async () => {
    await executeAction('log_audit_event', {
      user_id: 'user_1',
      action: 'test_audit_event',
      resource: 'enterprise',
      details: { test: true, timestamp: new Date().toISOString() },
      ip_address: '127.0.0.1',
      user_agent: 'Enterprise Test'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading enterprise data...</p>
        </div>
      </div>
    );
  }

  if (!enterpriseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load enterprise data</p>
        </div>
      </div>
    );
  }

  const { tenant, analytics, available_plans, features } = enterpriseData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enterprise Management</h1>
        <p className="text-gray-600">Advanced features for enterprise customers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tenant</p>
              <p className="text-2xl font-bold text-gray-900">{tenant.name}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">€{analytics.metrics.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.metrics.customers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Plan</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{tenant.plan}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'tenant', name: 'Tenant Management', icon: Building2 },
              { id: 'audit', name: 'Audit Logs', icon: Activity },
              { id: 'compliance', name: 'Compliance', icon: Shield },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp },
              { id: 'subscriptions', name: 'Subscriptions', icon: CreditCard },
              { id: 'white-label', name: 'White Label', icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tenant Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{tenant.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Domain:</span>
                      <span className="font-medium">{tenant.domain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium capitalize">{tenant.plan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        tenant.status === 'active' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tenant.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue Growth:</span>
                      <span className="font-medium text-green-600">+{analytics.trends.revenue_growth}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer Growth:</span>
                      <span className="font-medium text-green-600">+{analytics.trends.customer_growth}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Growth:</span>
                      <span className="font-medium text-green-600">+{analytics.trends.order_growth}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">AI Usage:</span>
                      <span className="font-medium">{analytics.metrics.ai_usage} requests</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Insights</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <ul className="space-y-2">
                    {analytics.insights.map((insight, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-800">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tenant Management Tab */}
          {activeTab === 'tenant' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Branding Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: tenant.settings.branding.primary_color }}
                        />
                        <span className="text-sm text-gray-600">{tenant.settings.branding.primary_color}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: tenant.settings.branding.secondary_color }}
                        />
                        <span className="text-sm text-gray-600">{tenant.settings.branding.secondary_color}</span>
                      </div>
                    </div>
                    {tenant.settings.branding.custom_domain && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom Domain
                        </label>
                        <span className="text-sm text-gray-600">{tenant.settings.branding.custom_domain}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Feature Flags</h3>
                  <div className="space-y-3">
                    {Object.entries(tenant.settings.features).map(([feature, enabled]) => (
                      <div key={feature} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">
                          {feature.replace(/_/g, ' ')}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Usage Limits</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(tenant.limits).map(([limit, value]) => (
                    <div key={limit} className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-600 capitalize">
                        {limit.replace(/_/g, ' ')}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {value === -1 ? 'Unlimited' : value.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Audit Logs Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Audit Logs</h3>
                <button
                  onClick={logAuditEvent}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Test Audit Event
                </button>
              </div>

              {actionResults.log_audit_event && (
                <div className={`p-4 rounded-lg ${
                  actionResults.log_audit_event.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center">
                    {actionResults.log_audit_event.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    )}
                    <span className={actionResults.log_audit_event.success ? 'text-green-800' : 'text-red-800'}>
                      {actionResults.log_audit_event.success 
                        ? 'Audit event logged successfully' 
                        : `Error: ${actionResults.log_audit_event.error}`
                      }
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="text-lg font-medium">Recent Activity</h4>
                </div>
                <div className="divide-y divide-gray-200">
                  {auditLogs.length > 0 ? (
                    auditLogs.map((log) => (
                      <div key={log.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{log.action}</span>
                              <span className="text-sm text-gray-500">on</span>
                              <span className="text-sm font-medium">{log.resource}</span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {new Date(log.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {log.ip_address}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center text-gray-500">
                      No audit logs available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Compliance Reports</h3>
                <div className="flex space-x-2">
                  {['gdpr', 'security', 'data_retention', 'access_logs'].map((reportType) => (
                    <button
                      key={reportType}
                      onClick={() => generateComplianceReport(reportType)}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                    >
                      {reportType.replace(/_/g, ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {actionResults.generate_compliance_report && (
                <div className={`p-4 rounded-lg ${
                  actionResults.generate_compliance_report.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center">
                    {actionResults.generate_compliance_report.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    )}
                    <span className={actionResults.generate_compliance_report.success ? 'text-green-800' : 'text-red-800'}>
                      {actionResults.generate_compliance_report.success 
                        ? 'Compliance report generated successfully' 
                        : `Error: ${actionResults.generate_compliance_report.error}`
                      }
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">GDPR Compliance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data Subjects:</span>
                      <span className="font-medium">1,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data Breaches:</span>
                      <span className="font-medium text-green-600">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Consents:</span>
                      <span className="font-medium">1,200</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Security Status</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Security Incidents:</span>
                      <span className="font-medium text-green-600">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Failed Logins:</span>
                      <span className="font-medium">15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Encryption:</span>
                      <span className="font-medium text-green-600">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Revenue Analytics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue:</span>
                      <span className="font-medium">€{analytics.metrics.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth:</span>
                      <span className="font-medium text-green-600">+{analytics.trends.revenue_growth}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Orders:</span>
                      <span className="font-medium">{analytics.metrics.orders}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Customer Analytics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Customers:</span>
                      <span className="font-medium">{analytics.metrics.customers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth:</span>
                      <span className="font-medium text-green-600">+{analytics.trends.customer_growth}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Retention Rate:</span>
                      <span className="font-medium">85%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">System Usage</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">AI Requests:</span>
                      <span className="font-medium">{analytics.metrics.ai_usage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">API Calls:</span>
                      <span className="font-medium">{analytics.metrics.api_calls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Storage Used:</span>
                      <span className="font-medium">{analytics.metrics.storage_used} GB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Subscription Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {available_plans.map((plan) => (
                  <div key={plan.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="text-center">
                      <h4 className="text-xl font-semibold mb-2">{plan.name}</h4>
                      <div className="mb-4">
                        <span className="text-3xl font-bold">€{plan.price_monthly}</span>
                        <span className="text-gray-600">/month</span>
                      </div>
                      <div className="mb-6">
                        <span className="text-lg text-gray-600">€{plan.price_yearly}</span>
                        <span className="text-gray-600">/year</span>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Select Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* White Label Tab */}
          {activeTab === 'white-label' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">White Label Configuration</h3>
                <button
                  onClick={() => executeAction('get_white_label_config', {})}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Generate Config
                </button>
              </div>

              {actionResults.get_white_label_config && actionResults.get_white_label_config.success && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Generated Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CSS Variables</label>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                        {actionResults.get_white_label_config.data.config.css}
                      </pre>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Branding Settings</label>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                        {JSON.stringify(actionResults.get_white_label_config.data.config.branding, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Branding Preview</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                      {tenant.settings.branding.logo_url ? (
                        <img 
                          src={tenant.settings.branding.logo_url} 
                          alt="Logo" 
                          className="h-12 object-contain"
                        />
                      ) : (
                        <div className="h-12 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                          No logo uploaded
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                      <div className="flex space-x-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: tenant.settings.branding.primary_color }}
                          title="Primary Color"
                        />
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: tenant.settings.branding.secondary_color }}
                          title="Secondary Color"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Custom Domain</h4>
                  <div className="space-y-4">
                    {tenant.settings.branding.custom_domain ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                        <span className="text-sm text-gray-600">{tenant.settings.branding.custom_domain}</span>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <Globe className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p>No custom domain configured</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
