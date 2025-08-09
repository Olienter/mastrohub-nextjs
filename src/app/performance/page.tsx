'use client';

import { useState, useEffect } from 'react';
import { 
  Zap, 
  Database, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Settings, 
  RefreshCw,
  Clock,
  HardDrive,
  Gauge,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface CacheStats {
  totalEntries: number;
  totalHits: number;
  totalMisses: number;
  memoryUsage: number;
  hitRate: number;
  averageResponseTime: number;
}

interface QueryOptimization {
  query: string;
  executionTime: number;
  optimization: string;
  improvement: number;
}

interface PerformanceData {
  cache: CacheStats;
  queries: QueryOptimization[];
  recommendations: string[];
  analytics: {
    topKeys: Array<{ key: string; hits: number; lastAccessed: number }>;
    sizeDistribution: Record<string, number>;
    hitRateByHour: number[];
  };
}

export default function PerformancePage() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [actionResults, setActionResults] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch('/api/performance');
      const data = await response.json();
      setPerformanceData(data.performance);
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (action: string, data: any) => {
    try {
      const response = await fetch('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data })
      });
      
      const result = await response.json();
      setActionResults(prev => ({ ...prev, [action]: result }));
      
      // Refresh data after action
      setTimeout(fetchPerformanceData, 1000);
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

  if (!performanceData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Performance Data Unavailable</h2>
            <p className="text-gray-600">Failed to load performance metrics</p>
          </div>
        </div>
      </div>
    );
  }

  const { cache, queries, recommendations, analytics } = performanceData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Zap className="h-8 w-8 text-yellow-600" />
                Performance Monitor
              </h1>
              <p className="text-gray-600 mt-2">
                Monitor cache performance, query optimization, and system metrics
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">System Healthy</span>
              </div>
              <button
                onClick={fetchPerformanceData}
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
                <p className="text-sm font-medium text-gray-600">Cache Hit Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(cache.hitRate * 100).toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1">
                {cache.hitRate > 0.8 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${cache.hitRate > 0.8 ? 'text-green-600' : 'text-red-600'}`}>
                  {cache.hitRate > 0.8 ? 'Good' : 'Needs improvement'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {cache.averageResponseTime.toFixed(1)}ms
                </p>
              </div>
              <Gauge className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1">
                {cache.averageResponseTime < 100 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${cache.averageResponseTime < 100 ? 'text-green-600' : 'text-red-600'}`}>
                  {cache.averageResponseTime < 100 ? 'Fast' : 'Slow'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cache Entries</p>
                <p className="text-2xl font-bold text-gray-900">{cache.totalEntries}</p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1">
                <HardDrive className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {(cache.memoryUsage / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Slow Queries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {queries.filter(q => q.executionTime > 1000).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {queries.length} total queries
                </span>
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
                { id: 'cache', label: 'Cache Analytics', icon: BarChart3 },
                { id: 'queries', label: 'Query Optimization', icon: Database },
                { id: 'recommendations', label: 'Recommendations', icon: TrendingUp }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cache Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Total Hits</span>
                        <span className="font-medium">{cache.totalHits.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Total Misses</span>
                        <span className="font-medium">{cache.totalMisses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Memory Usage</span>
                        <span className="font-medium">{(cache.memoryUsage / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Query Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Total Queries</span>
                        <span className="font-medium">{queries.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Slow Queries</span>
                        <span className="font-medium text-orange-600">
                          {queries.filter(q => q.executionTime > 1000).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Avg Execution Time</span>
                        <span className="font-medium">
                          {(queries.reduce((sum, q) => sum + q.executionTime, 0) / queries.length || 0).toFixed(1)}ms
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => executeAction('evict_expired', {})}
                      className="flex items-center gap-2 p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                      <Settings className="h-4 w-4" />
                      Evict Expired
                    </button>
                    <button
                      onClick={() => executeAction('evict_lru', { maxEntries: 500 })}
                      className="flex items-center gap-2 p-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200"
                    >
                      <HardDrive className="h-4 w-4" />
                      Evict LRU
                    </button>
                    <button
                      onClick={() => executeAction('clear_cache', {})}
                      className="flex items-center gap-2 p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      <XCircle className="h-4 w-4" />
                      Clear Cache
                    </button>
                  </div>
                </div>

                {/* Action Results */}
                {Object.keys(actionResults).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Results</h3>
                    <div className="space-y-2">
                      {Object.entries(actionResults).map(([action, result]) => (
                        <div key={action} className={`p-3 rounded-lg ${
                          result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            {result.success ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="font-medium capitalize">{action.replace('_', ' ')}</span>
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

            {/* Cache Analytics Tab */}
            {activeTab === 'cache' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Cache Keys</h3>
                    <div className="space-y-2">
                      {analytics.topKeys.slice(0, 5).map((key, index) => (
                        <div key={key.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium text-sm">{key.key}</span>
                            <p className="text-xs text-gray-500">
                              {new Date(key.lastAccessed).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">{key.hits} hits</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Size Distribution</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Small (&lt; 1KB)</span>
                        <span className="font-medium">{analytics.sizeDistribution.small}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Medium (1-10KB)</span>
                        <span className="font-medium">{analytics.sizeDistribution.medium}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Large (&gt; 10KB)</span>
                        <span className="font-medium">{analytics.sizeDistribution.large}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Hit Rate</h3>
                  <div className="grid grid-cols-12 gap-2">
                    {analytics.hitRateByHour.map((rate, hour) => (
                      <div key={hour} className="text-center">
                        <div className="text-xs text-gray-500 mb-1">{hour}:00</div>
                        <div className="h-20 bg-gray-200 rounded relative">
                          <div 
                            className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-b"
                            style={{ height: `${rate * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {(rate * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Query Optimization Tab */}
            {activeTab === 'queries' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Query Optimizations</h3>
                  <div className="text-sm text-gray-600">
                    {queries.length} queries analyzed
                  </div>
                </div>

                <div className="space-y-4">
                  {queries.map((query, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {query.executionTime > 1000 ? (
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          <span className="font-medium">
                            {query.executionTime.toFixed(1)}ms
                          </span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          query.improvement > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {query.improvement > 0 ? `+${query.improvement.toFixed(1)}ms` : 'Optimized'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-gray-600">Query:</span>
                          <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                            {query.query.substring(0, 100)}...
                          </code>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Optimization:</span>
                          <span className="ml-2">{query.optimization}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Performance Recommendations</h3>
                  <div className="text-sm text-gray-600">
                    {recommendations.length} recommendations
                  </div>
                </div>

                <div className="space-y-4">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{recommendation}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          This optimization can improve performance by reducing response times and increasing cache efficiency.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {recommendations.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">All Systems Optimized</h3>
                    <p className="text-gray-600">No performance recommendations at this time.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
