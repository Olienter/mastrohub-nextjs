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
  PenTool as PenToolIcon,
  Folder as FolderIcon2
} from 'lucide-react';

import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/contexts/AuthContext';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'qr';
  status: 'draft' | 'active' | 'paused' | 'completed';
  created_at: string;
  sent_count: number;
  open_rate: number;
  click_rate: number;
  conversion_rate: number;
  subject: string;
  content: string;
  target_audience: string;
  budget: number;
  spent: number;
}

interface Contact {
  id: string;
  email: string;
  name: string;
  phone: string;
  segment: 'vip' | 'regular' | 'new';
  status: 'active' | 'inactive';
  created_at: string;
  last_visit: string | null;
  total_orders: number;
  total_spent: number;
  preferences: string[];
  tags: string[];
}

interface MarketingAnalytics {
  overview: {
    total_campaigns: number;
    active_campaigns: number;
    total_contacts: number;
    active_contacts: number;
    total_revenue: number;
    marketing_revenue: number;
    roi: number;
  };
  campaigns_performance: Array<{
    name: string;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    cost: number;
    roi: number;
  }>;
  audience_segments: Array<{
    name: string;
    count: number;
    avg_order_value: number;
    retention_rate: number;
    lifetime_value: number;
  }>;
  channels_performance: Array<{
    channel: string;
    reach: number;
    engagement: number;
    conversion: number;
    revenue: number;
  }>;
}

export default function MarketingAssistant() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  
  // State
  const [marketingData, setMarketingData] = useState<{
    campaigns: Campaign[];
    contacts: Contact[];
    analytics: MarketingAnalytics;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'contacts' | 'analytics' | 'ai'>('overview');
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showCreateContact, setShowCreateContact] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);

  // Load marketing data
  const loadMarketingData = async () => {
    if (!currentWorkspace) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/marketing?workspace_id=${currentWorkspace.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load marketing data');
      }
      
      setMarketingData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load marketing data');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when workspace changes
  useEffect(() => {
    if (currentWorkspace) {
      loadMarketingData();
    }
  }, [currentWorkspace]);

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Workspace Selected</h2>
            <p className="text-gray-500">Please select a workspace to view marketing data.</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Marketing Assistant</h1>
                <p className="text-sm text-gray-600">{currentWorkspace.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAIRecommendations(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <BrainIcon className="h-4 w-4 mr-2" />
                AI Recommendations
              </button>
              
              <button
                onClick={() => setShowCreateCampaign(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Campaign
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
            <p className="text-gray-600">Loading marketing data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex">
              <AlertCircleIcon className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error loading marketing data</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Marketing Data */}
        {marketingData && !loading && (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {[
                    { id: 'overview', name: 'Overview', icon: BarChart3Icon },
                    { id: 'campaigns', name: 'Campaigns', icon: Megaphone },
                    { id: 'contacts', name: 'Contacts', icon: UsersIcon },
                    { id: 'analytics', name: 'Analytics', icon: BarChart3Icon2 },
                    { id: 'ai', name: 'AI Assistant', icon: BrainIcon }
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
              <div className="text-center py-12">
                <BarChart3Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Marketing Overview</h3>
                <p className="text-gray-600">Overview content will be implemented here</p>
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="text-center py-12">
                <Megaphone className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Campaigns</h3>
                <p className="text-gray-600">Campaigns content will be implemented here</p>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="text-center py-12">
                <UsersIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Contacts</h3>
                <p className="text-gray-600">Contacts content will be implemented here</p>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <BarChart3Icon2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics</h3>
                <p className="text-gray-600">Analytics content will be implemented here</p>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="text-center py-12">
                <BrainIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">AI Assistant</h3>
                <p className="text-gray-600">AI Assistant content will be implemented here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 