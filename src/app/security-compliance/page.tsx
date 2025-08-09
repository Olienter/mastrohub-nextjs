'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Settings, 
  FileText, 
  Database, 
  Users,
  Activity,
  BarChart3,
  Key,
  Fingerprint,
  ShieldCheck,
  AlertCircle,
  Clock,
  RefreshCw,
  Code
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { RoleGuard } from '@/components/auth/RoleGuard';

interface SecurityAnalytics {
  totalEvents: number;
  recentEvents: number;
  totalThreats: number;
  recentThreats: number;
  threatsBySeverity: Record<string, number>;
  eventsByType: Record<string, number>;
  complianceStatus: any;
  encryptionStatus: any[];
}

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  category: string;
  rules: any[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ThreatDetection {
  id: string;
  timestamp: Date;
  threatType: string;
  severity: string;
  source: string;
  details: Record<string, any>;
  mitigated: boolean;
  mitigationAction?: string;
}

interface GDPRConsent {
  id: string;
  userId: string;
  consentType: string;
  granted: boolean;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

export default function SecurityCompliancePage() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<SecurityAnalytics | null>(null);
  const [policies, setPolicies] = useState<SecurityPolicy[]>([]);
  const [threats, setThreats] = useState<ThreatDetection[]>([]);
  const [consents, setConsents] = useState<GDPRConsent[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<SecurityPolicy | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Prehľad', icon: Shield },
    { id: 'policies', name: 'Bezpečnostné politiky', icon: Lock },
    { id: 'threats', name: 'Detekcia hrozieb', icon: AlertTriangle },
    { id: 'audit', name: 'Auditné záznamy', icon: FileText },
    { id: 'gdpr', name: 'GDPR súlad', icon: Users },
    { id: 'encryption', name: 'Šifrovanie', icon: Key }
  ];

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analyticsRes, policiesRes, threatsRes] = await Promise.all([
        fetch('/api/security?type=analytics'),
        fetch('/api/security?type=policies'),
        fetch('/api/security?type=threats')
      ]);

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }

      if (policiesRes.ok) {
        const policiesData = await policiesRes.json();
        setPolicies(policiesData);
      }

      if (threatsRes.ok) {
        const threatsData = await threatsRes.json();
        setThreats(threatsData);
      }
    } catch (error) {
      console.error('Error fetching security data:', error);
      setError('Chyba pri načítaní bezpečnostných údajov');
    } finally {
      setLoading(false);
    }
  };

  const handleMitigateThreat = async (threatId: string, action: string) => {
    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mitigate_threat',
          data: { threatId, action }
        })
      });

      if (response.ok) {
        fetchSecurityData();
      }
    } catch (error) {
      console.error('Error mitigating threat:', error);
    }
  };

  const handleTogglePolicy = async (policyId: string, enabled: boolean) => {
    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_policy',
          data: { id: policyId, updates: { enabled } }
        })
      });

      if (response.ok) {
        fetchSecurityData();
      }
    } catch (error) {
      console.error('Error updating policy:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getThreatTypeIcon = (type: string) => {
    switch (type) {
      case 'brute_force': return <AlertTriangle className="w-4 h-4" />;
      case 'sql_injection': return <Database className="w-4 h-4" />;
      case 'xss': return <Code className="w-4 h-4" />;
      case 'csrf': return <RefreshCw className="w-4 h-4" />;
      case 'ddos': return <Activity className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bezpečnosť a súlad</h1>
              <p className="text-gray-600 mt-2">
                Správa bezpečnostných politík, detekcia hrozieb a GDPR súlad
              </p>
            </div>
            <RoleGuard requiredPermission="security-compliance" action="write">
              <button
                onClick={fetchSecurityData}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Aktualizovať
              </button>
            </RoleGuard>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
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
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Security Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Celkové udalosti</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics?.totalEvents || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Aktívne politiky</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {policies.filter(p => p.enabled).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Aktívne hrozby</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {threats.filter(t => !t.mitigated).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Fingerprint className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Šifrované dáta</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics?.encryptionStatus?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compliance Status */}
                {analytics?.complianceStatus && (
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Stav súladu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">GDPR</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Súlad</span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Súhlasy</span>
                            <span className="text-sm font-medium">
                              {analytics.complianceStatus.gdpr.userConsents}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Bezpečnosť</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Politiky</span>
                            <span className="text-sm font-medium">
                              {analytics.complianceStatus.security.policiesActive}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Šifrovanie</span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Prístup</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">RBAC</span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Sessions</span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Threats */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Najnovšie hrozby</h3>
                  <div className="space-y-3">
                    {threats.slice(0, 5).map((threat) => (
                      <div
                        key={threat.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          {getThreatTypeIcon(threat.threatType)}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {threat.threatType.replace('_', ' ').toUpperCase()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(threat.timestamp).toLocaleString('sk')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                            {threat.severity}
                          </span>
                          {threat.mitigated ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'policies' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Bezpečnostné politiky</h3>
                  <RoleGuard requiredPermission="security-compliance" action="write">
                    <button
                      onClick={() => setShowPolicyModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Pridať politiku
                    </button>
                  </RoleGuard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {policies.map((policy) => (
                    <div
                      key={policy.id}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{policy.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{policy.description}</p>
                          <div className="mt-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {policy.category}
                            </span>
                          </div>
                          <div className="mt-3 text-sm text-gray-500">
                            Pravidlá: {policy.rules.length}
                          </div>
                        </div>
                        <RoleGuard requiredPermission="security-compliance" action="write">
                          <button
                            onClick={() => handleTogglePolicy(policy.id, !policy.enabled)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              policy.enabled
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {policy.enabled ? 'Aktívna' : 'Neaktívna'}
                          </button>
                        </RoleGuard>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'threats' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Detekcia hrozieb</h3>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Typ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Závažnosť
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Zdroj
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Čas
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stav
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Akcie
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {threats.map((threat) => (
                          <tr key={threat.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getThreatTypeIcon(threat.threatType)}
                                <span className="ml-2 text-sm font-medium text-gray-900">
                                  {threat.threatType.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                                {threat.severity}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {threat.source}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(threat.timestamp).toLocaleString('sk')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {threat.mitigated ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Vyriešené
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Aktívne
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {!threat.mitigated && (
                                <RoleGuard requiredPermission="security-compliance" action="write">
                                  <button
                                    onClick={() => handleMitigateThreat(threat.id, 'Block IP')}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    Vyriešiť
                                  </button>
                                </RoleGuard>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Auditné záznamy</h3>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-gray-600">
                    Auditné záznamy sa automaticky generujú pre všetky bezpečnostné udalosti.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'gdpr' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">GDPR súlad</h3>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Správa súhlasov</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Zber dát</span>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Marketing</span>
                          <XCircle className="w-4 h-4 text-red-500" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Analytika</span>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Práva používateľov</h4>
                      <div className="space-y-2">
                        <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                          <span className="text-sm font-medium text-blue-900">Právo na vymazanie</span>
                        </button>
                        <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                          <span className="text-sm font-medium text-blue-900">Právo na prístup</span>
                        </button>
                        <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                          <span className="text-sm font-medium text-blue-900">Právo na prenosnosť</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'encryption' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Šifrovanie dát</h3>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {analytics?.encryptionStatus?.map((encryption: any) => (
                      <div
                        key={encryption.id}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {encryption.dataType.replace('_', ' ').toUpperCase()}
                          </h4>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {encryption.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Metóda: {encryption.encryptionMethod}</p>
                          <p>Šifrované: {new Date(encryption.encryptedAt).toLocaleDateString('sk')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
