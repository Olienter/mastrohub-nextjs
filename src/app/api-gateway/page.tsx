'use client';

import { useState, useEffect } from 'react';
import { 
  Server, 
  Webhook, 
  Zap, 
  Shield, 
  Activity, 
  Settings, 
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react';

interface Integration {
  enabled: boolean;
  name: string;
}

interface Webhook {
  url: string;
  events: string[];
}

interface GatewayStatus {
  name: string;
  version: string;
  status: string;
  integrations: Record<string, Integration>;
  webhooks: Record<string, Webhook>;
  rateLimits: Record<string, any>;
}

export default function APIGatewayPage() {
  const [gatewayStatus, setGatewayStatus] = useState<GatewayStatus | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchGatewayStatus();
  }, []);

  const fetchGatewayStatus = async () => {
    try {
      const response = await fetch('/api/gateway');
      const data = await response.json();
      setGatewayStatus(data.gateway);
    } catch (error) {
      console.error('Failed to fetch gateway status:', error);
    } finally {
      setLoading(false);
    }
  };

  const testIntegration = async (integration: string) => {
    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_connection',
          integration,
          endpoint: '/',
          options: { method: 'GET' }
        })
      });
      
      const result = await response.json();
      setTestResults(prev => ({ ...prev, [integration]: result }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [integration]: { success: false, error: 'Test failed' } 
      }));
    }
  };

  const testWebhook = async (webhookId: string) => {
    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          webhookId,
          event: 'test.event',
          payload: { message: 'Test webhook from MastroHub' }
        })
      });
      
      const result = await response.json();
      setTestResults(prev => ({ ...prev, [`webhook_${webhookId}`]: result }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [`webhook_${webhookId}`]: { success: false, error: 'Test failed' } 
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!gatewayStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Gateway Unavailable</h2>
            <p className="text-slate-300">Failed to load API Gateway status</p>
          </div>
        </div>
      </div>
    );
  }

  const enabledIntegrations = Object.values(gatewayStatus.integrations).filter(i => i.enabled).length;
  const totalIntegrations = Object.keys(gatewayStatus.integrations).length;
  const activeWebhooks = Object.keys(gatewayStatus.webhooks).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Server className="h-8 w-8 text-blue-600" />
                API Gateway
              </h1>
              <p className="text-slate-300 mt-2">
                Manage integrations, webhooks, and API configurations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${gatewayStatus.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-slate-300 capitalize">{gatewayStatus.status}</span>
              </div>
              <button
                onClick={fetchGatewayStatus}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700/70"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/80 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Integrations</p>
                <p className="text-2xl font-bold text-white">{enabledIntegrations}/{totalIntegrations}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Webhooks</p>
                <p className="text-2xl font-bold text-white">{activeWebhooks}</p>
              </div>
              <Webhook className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Rate Limits</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Version</p>
                <p className="text-2xl font-bold text-white">{gatewayStatus.version}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800/80 rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'integrations', label: 'Integrations', icon: Zap },
                { id: 'webhooks', label: 'Webhooks', icon: Webhook },
                { id: 'rate-limits', label: 'Rate Limits', icon: Shield }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
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
                    <h3 className="text-lg font-semibold text-white mb-4">Integration Status</h3>
                    <div className="space-y-3">
                      {Object.entries(gatewayStatus.integrations).map(([key, integration]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {integration.enabled ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <span className="font-medium">{integration.name}</span>
                          </div>
                          <button
                            onClick={() => testIntegration(key)}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            <TestTube className="h-3 w-3" />
                            Test
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Webhook Status</h3>
                    <div className="space-y-3">
                      {Object.entries(gatewayStatus.webhooks).map(([key, webhook]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                              <span className="font-medium">{key}</span>
                              <p className="text-xs text-slate-400">{webhook.events.length} events</p>
                            </div>
                          </div>
                          <button
                            onClick={() => testWebhook(key)}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                          >
                            <TestTube className="h-3 w-3" />
                            Test
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Test Results */}
                {Object.keys(testResults).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Test Results</h3>
                    <div className="space-y-2">
                      {Object.entries(testResults).map(([key, result]) => (
                        <div key={key} className={`p-3 rounded-lg ${
                          result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            {result.success ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="font-medium">{key}</span>
                          </div>
                          <p className="text-sm mt-1">
                            {result.success ? result.message : result.error}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(gatewayStatus.integrations).map(([key, integration]) => (
                    <div key={key} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {integration.enabled ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-500" />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                            <p className="text-sm text-slate-400">API Integration</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          integration.enabled 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {integration.enabled ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Status:</span>
                          <span className="text-slate-300">
                            {integration.enabled ? 'Connected' : 'Not configured'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">API Key:</span>
                          <span className="text-slate-300">
                            {integration.enabled ? 'Configured' : 'Missing'}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex gap-2">
                            <button
                              onClick={() => testIntegration(key)}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              <TestTube className="h-4 w-4" />
                              Test Connection
                            </button>
                            <button className="flex items-center gap-1 px-3 py-2 border border-slate-600/50 rounded-lg hover:bg-slate-700/50">
                              <ExternalLink className="h-4 w-4" />
                              Docs
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Webhooks Tab */}
            {activeTab === 'webhooks' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Active Webhooks</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Add Webhook
                  </button>
                </div>

                <div className="space-y-4">
                  {Object.entries(gatewayStatus.webhooks).map(([key, webhook]) => (
                    <div key={key} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{key}</h4>
                          <p className="text-sm text-slate-400">{webhook.url}</p>
                        </div>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Active
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-slate-300">Events:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {webhook.events.map(event => (
                              <span key={event} className="px-2 py-1 text-xs bg-slate-600/50 text-slate-200 rounded">
                                {event}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => testWebhook(key)}
                            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            <TestTube className="h-4 w-4" />
                            Test Webhook
                          </button>
                          <button className="flex items-center gap-2 px-3 py-2 border border-slate-600/50 rounded-lg hover:bg-slate-700/50">
                            <Copy className="h-4 w-4" />
                            Copy URL
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rate Limits Tab */}
            {activeTab === 'rate-limits' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(gatewayStatus.rateLimits).map(([key, config]) => (
                    <div key={key} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold capitalize text-white">{key}</h3>
                        <Shield className="h-6 w-6 text-orange-600" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Window:</span>
                          <span>{config.windowMs / 1000}s</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Max Requests:</span>
                          <span>{config.maxRequests}</span>
                        </div>

                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-600/50 rounded-full h-2">
                              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <span className="text-sm text-slate-300">75%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
