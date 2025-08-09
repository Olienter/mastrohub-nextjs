'use client';
import React, { useState, useEffect } from 'react';
import {
  TestTube, Play, FileText, BarChart3, Activity, Settings, RefreshCw,
  CheckCircle, XCircle, AlertTriangle, Clock, Download, Eye, Zap,
  Database, Shield, Brain, Server, TrendingUp, Target, Layers
} from 'lucide-react';

interface TestResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  details?: Record<string, any>;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  totalDuration: number;
  passed: number;
  failed: number;
  skipped: number;
}

interface TestReport {
  suites: TestSuite[];
  summary: {
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    totalSkipped: number;
    totalDuration: number;
    coverage: number;
  };
  timestamp: string;
}

interface TestStatus {
  available_tests: string[];
  last_run: string | null;
  coverage: number;
}

export default function TestingPage() {
  const [testReport, setTestReport] = useState<TestReport | null>(null);
  const [testStatus, setTestStatus] = useState<TestStatus | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [runningTests, setRunningTests] = useState<string[]>([]);
  const [actionResults, setActionResults] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchTestStatus();
  }, []);

  const fetchTestStatus = async () => {
    try {
      const response = await fetch('/api/testing?type=status');
      if (response.ok) {
        const data = await response.json();
        setTestStatus(data);
      }
    } catch (error) {
      console.error('Error fetching test status:', error);
    }
  };

  const runTests = async (testType: string) => {
    setLoading(true);
    setRunningTests(prev => [...prev, testType]);

    try {
      const response = await fetch('/api/testing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'run_tests',
          test_type: testType
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setActionResults(prev => ({
          ...prev,
          [testType]: data.results
        }));
      }
    } catch (error) {
      console.error(`Error running ${testType} tests:`, error);
    } finally {
      setLoading(false);
      setRunningTests(prev => prev.filter(t => t !== testType));
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setRunningTests(prev => [...prev, 'all']);

    try {
      const response = await fetch('/api/testing?type=run_all');
      if (response.ok) {
        const data = await response.json();
        setTestReport(data.report);
      }
    } catch (error) {
      console.error('Error running all tests:', error);
    } finally {
      setLoading(false);
      setRunningTests(prev => prev.filter(t => t !== 'all'));
    }
  };

  const generateReport = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/testing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_report'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTestReport(data.report);
        setActionResults(prev => ({
          ...prev,
          report: data.report_text
        }));
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'skipped':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'skipped':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !testReport) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading test dashboard...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Testing & Quality Assurance</h1>
              <p className="text-gray-600 mt-2">Comprehensive testing framework for application quality</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={generateReport}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                Generate Report
              </button>
              <button
                onClick={runAllTests}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                Run All Tests
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {testReport && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TestTube className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tests</p>
                  <p className="text-2xl font-bold text-gray-900">{testReport.summary.totalTests}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Passed</p>
                  <p className="text-2xl font-bold text-green-600">{testReport.summary.totalPassed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{testReport.summary.totalFailed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Coverage</p>
                  <p className="text-2xl font-bold text-purple-600">{testReport.summary.coverage.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'unit', 'integration', 'e2e', 'performance', 'reports'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Tests
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {['unit', 'integration', 'e2e', 'performance'].map((testType) => (
                    <div key={testType} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 capitalize">{testType} Tests</h3>
                        {runningTests.includes(testType) ? (
                          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <button
                        onClick={() => runTests(testType)}
                        disabled={loading}
                        className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                      >
                        Run {testType.charAt(0).toUpperCase() + testType.slice(1)} Tests
                      </button>
                    </div>
                  ))}
                </div>

                {testReport && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Latest Test Results</h3>
                    {testReport.suites.map((suite) => (
                      <div key={suite.name} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{suite.name}</h4>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-green-600">{suite.passed} passed</span>
                            <span className="text-red-600">{suite.failed} failed</span>
                            <span className="text-yellow-600">{suite.skipped} skipped</span>
                            <span className="text-gray-600">{suite.totalDuration}ms</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {suite.tests.map((test) => (
                            <div key={test.testName} className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(test.status)}
                                <span className="text-sm text-gray-700">{test.testName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(test.status)}`}>
                                  {test.status}
                                </span>
                                <span className="text-xs text-gray-500">{test.duration}ms</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Individual Test Type Tabs */}
            {['unit', 'integration', 'e2e', 'performance'].includes(activeTab) && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">{activeTab} Test Results</h3>
                  <button
                    onClick={() => runTests(activeTab)}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" />
                    Run {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tests
                  </button>
                </div>

                {actionResults[activeTab] ? (
                  <div className="space-y-4">
                    {actionResults[activeTab].map((test: TestResult) => (
                      <div key={test.testName} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(test.status)}
                            <span className="font-medium text-gray-900">{test.testName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(test.status)}`}>
                              {test.status}
                            </span>
                            <span className="text-xs text-gray-500">{test.duration}ms</span>
                          </div>
                        </div>
                        {test.error && (
                          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm text-red-800">{test.error}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No {activeTab} test results available</p>
                    <p className="text-sm text-gray-400 mt-2">Run tests to see results</p>
                  </div>
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Test Reports</h3>
                  <button
                    onClick={generateReport}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4" />
                    Generate New Report
                  </button>
                </div>

                {actionResults.report ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Latest Test Report</h4>
                      <button className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">{actionResults.report}</pre>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No test reports available</p>
                    <p className="text-sm text-gray-400 mt-2">Generate a report to see results</p>
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
