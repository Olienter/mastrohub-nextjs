'use client';
import React, { useState, useEffect } from 'react';
import {
  Shield, Code, BarChart3, Activity, Settings, RefreshCw,
  CheckCircle, XCircle, AlertTriangle, Clock, Download, Eye, Zap,
  Database, Brain, Server, TrendingUp, Target, Layers, FileText,
  Lock, Bug, Lightbulb, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';

interface CodeQualityMetrics {
  complexity: number;
  maintainability: number;
  reliability: number;
  security: number;
  performance: number;
  overall: number;
}

interface LintingResult {
  file: string;
  errors: LintingError[];
  warnings: LintingWarning[];
  score: number;
}

interface LintingError {
  line: number;
  column: number;
  message: string;
  rule: string;
  severity: 'error' | 'warning';
}

interface LintingWarning {
  line: number;
  column: number;
  message: string;
  rule: string;
  severity: 'warning';
}

interface SecurityVulnerability {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cve?: string;
  affected: string[];
  recommendation: string;
}

interface DependencyCheck {
  name: string;
  version: string;
  latestVersion: string;
  vulnerabilities: number;
  outdated: boolean;
  license: string;
}

interface QualityDashboard {
  overallQuality: number;
  securityScore: number;
  performanceScore: number;
  maintainabilityScore: number;
  recentIssues: any[];
  recommendations: string[];
}

interface QualityTrends {
  averageScore: number;
  trend: 'improving' | 'declining' | 'stable';
  topIssues: string[];
}

export default function QualityAssurancePage() {
  const [dashboardData, setDashboardData] = useState<QualityDashboard | null>(null);
  const [securityScan, setSecurityScan] = useState<any>(null);
  const [qualityTrends, setQualityTrends] = useState<QualityTrends | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashboardRes, securityRes, trendsRes] = await Promise.all([
        fetch('/api/quality?type=dashboard'),
        fetch('/api/quality?type=security_scan'),
        fetch('/api/quality?type=quality_trends')
      ]);

      if (dashboardRes.ok) {
        const data = await dashboardRes.json();
        setDashboardData(data.dashboard);
      }

      if (securityRes.ok) {
        const data = await securityRes.json();
        setSecurityScan(data.security);
      }

      if (trendsRes.ok) {
        const data = await trendsRes.json();
        setQualityTrends(data.trends);
      }
    } catch (error) {
      console.error('Error fetching quality data:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeCode = async () => {
    if (!codeInput.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/quality', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'analyze_code',
          code: codeInput,
          file_path: 'user-input.ts'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResults(data);
      }
    } catch (error) {
      console.error('Error analyzing code:', error);
    } finally {
      setLoading(false);
    }
  };

  const performCodeReview = async () => {
    if (!codeInput.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/quality', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'code_review',
          code: codeInput,
          context: 'User-provided code for review'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResults(data.review);
      }
    } catch (error) {
      console.error('Error performing code review:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading quality dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quality Assurance</h1>
              <p className="text-gray-600 mt-2">Code quality analysis, security scanning, and quality monitoring</p>
            </div>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Overall Quality</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.overallQuality.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Security Score</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardData.securityScore.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Performance</p>
                  <p className="text-2xl font-bold text-purple-600">{dashboardData.performanceScore.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Code className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Maintainability</p>
                  <p className="text-2xl font-bold text-orange-600">{dashboardData.maintainabilityScore.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'security', 'code-analysis', 'trends', 'dependencies'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quality Trends */}
                {qualityTrends && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Quality Trends</h3>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(qualityTrends.trend)}
                        <span className="text-sm text-gray-600 capitalize">{qualityTrends.trend}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Average Score</p>
                        <p className="text-2xl font-bold text-gray-900">{qualityTrends.averageScore.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Top Issues</p>
                        <ul className="text-sm text-gray-700 mt-1">
                          {qualityTrends.topIssues.slice(0, 3).map((issue, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-yellow-500" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {dashboardData && (
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                    <div className="space-y-2">
                      {dashboardData.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded">
                          <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                          <p className="text-sm text-blue-800">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code Analysis Tool */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Analysis Tool</h3>
                  <div className="space-y-4">
                    <textarea
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      placeholder="Paste your code here for analysis..."
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={analyzeCode}
                        disabled={loading || !codeInput.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        Analyze Code
                      </button>
                      <button
                        onClick={performCodeReview}
                        disabled={loading || !codeInput.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Code Review
                      </button>
                    </div>
                  </div>
                </div>

                {/* Analysis Results */}
                {analysisResults && (
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded">
                      {JSON.stringify(analysisResults, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && securityScan && (
              <div className="space-y-6">
                {/* Security Overview */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Security Overview</h3>
                    <span className={`px-3 py-1 rounded text-sm ${getSeverityColor(securityScan.overallRisk)}`}>
                      {securityScan.overallRisk.toUpperCase()} RISK
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Vulnerabilities</p>
                      <p className="text-2xl font-bold text-red-600">{securityScan.vulnerabilities.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dependencies</p>
                      <p className="text-2xl font-bold text-gray-900">{securityScan.dependencies.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Outdated</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {securityScan.dependencies.filter(d => d.outdated).length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vulnerabilities */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vulnerabilities</h3>
                  <div className="space-y-4">
                    {securityScan.vulnerabilities.map((vuln: SecurityVulnerability) => (
                      <div key={vuln.id} className="border-l-4 border-red-500 pl-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{vuln.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{vuln.description}</p>
                            <p className="text-sm text-blue-600 mt-2">{vuln.recommendation}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(vuln.severity)}`}>
                            {vuln.severity.toUpperCase()}
                          </span>
                        </div>
                        {vuln.affected.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">Affected files:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {vuln.affected.map((file, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded">
                                  {file}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dependencies */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dependencies</h3>
                  <div className="space-y-3">
                    {securityScan.dependencies.map((dep: DependencyCheck) => (
                      <div key={dep.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <h4 className="font-medium text-gray-900">{dep.name}</h4>
                          <p className="text-sm text-gray-600">
                            {dep.version} → {dep.latestVersion}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {dep.outdated && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                              Outdated
                            </span>
                          )}
                          {dep.vulnerabilities > 0 && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              {dep.vulnerabilities} vulns
                            </span>
                          )}
                          <span className="text-xs text-gray-500">{dep.license}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Code Analysis Tab */}
            {activeTab === 'code-analysis' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Use the Overview tab to analyze your code</p>
                  <p className="text-sm text-gray-400 mt-2">Paste your code and run analysis</p>
                </div>
              </div>
            )}

            {/* Trends Tab */}
            {activeTab === 'trends' && qualityTrends && (
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Trends</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Trend Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Current Trend</span>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(qualityTrends.trend)}
                            <span className="text-sm font-medium capitalize">{qualityTrends.trend}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Average Score</span>
                          <span className="text-sm font-medium">{qualityTrends.averageScore.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Top Issues</h4>
                      <ul className="space-y-1">
                        {qualityTrends.topIssues.map((issue, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                            <AlertTriangle className="w-3 h-3 text-yellow-500" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dependencies Tab */}
            {activeTab === 'dependencies' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Dependency analysis available in Security tab</p>
                  <p className="text-sm text-gray-400 mt-2">View security vulnerabilities and outdated packages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
