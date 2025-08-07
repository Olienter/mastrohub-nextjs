'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  BarChart3, 
  FileText, 
  Users, 
  BookOpen,
  TrendingUp,
  MessageSquare,
  Star,
  Award,
  Bell,
  Search,
  Plus,
  Menu,
  Target,
  Building2,
  Megaphone,
  Zap,
  Heart,
  Eye,
  Clock,
  Calendar,
  TrendingDown,
  Activity,
  ChevronDown,
  ChevronUp,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Video,
  Phone,
  Mail,
  Brain,
  Share2,
  Home,
  Network,
  Briefcase,
  Bookmark,
  Camera,
  MapPin,
  Globe,
  Users2,
  Crown,
  Trophy,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Clock3,
  CalendarDays,
  BarChart,
  PieChart,
  LineChart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AvatarUpload from './AvatarUpload';
import InteractiveCharts from './InteractiveCharts';
import Link from 'next/link';

interface ProfileHubProps {
  className?: string;
}

const ProfileHub: React.FC<ProfileHubProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Enhanced state for hybrid layout features
  const [isTeamExpanded, setIsTeamExpanded] = useState(false);
  const [isCommunityExpanded, setIsCommunityExpanded] = useState(false);
  const [isAIAgentExpanded, setIsAIAgentExpanded] = useState(false);
  const [isPersonalStatsExpanded, setIsPersonalStatsExpanded] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Enhanced Mock data with more detailed stats
  const userStats = {
    posts: 15,
    comments: 47,
    badges: 3,
    followers: 42,
    following: 23,
    views: 1247,
    likes: 89,
    // New enhanced stats
    revenue: 45280,
    orders: 1247,
    avgOrder: 36.31,
    satisfaction: 94.2,
    menuItems: 45,
    activePromotions: 3,
    staffMembers: 12,
    kitchenEfficiency: 87.5
  };

  const quickActions = [
    { 
      id: 'menu-maker', 
      name: 'Menu Maker', 
      description: 'Create & optimize your menu',
      icon: Menu, 
      color: 'bg-orange-500',
      path: '/menu-maker',
      status: 'active',
      badge: 'Popular'
    },
    { 
      id: 'forecast', 
      name: 'Forecast', 
      description: 'Predict demand & plan inventory',
      icon: TrendingUp, 
      color: 'bg-blue-500',
      path: '/forecast-planner',
      status: 'active',
      badge: 'AI Powered'
    },
    { 
      id: 'restaurant', 
      name: 'Restaurant', 
      description: 'Manage your restaurant profile',
      icon: Building2, 
      color: 'bg-purple-500',
      path: '/restaurant-curator',
      status: 'new',
      badge: 'NEW'
    },
    { 
      id: 'marketing', 
      name: 'Marketing', 
      description: 'Grow your customer base',
      icon: Megaphone, 
      color: 'bg-green-500',
      path: '/marketing-assistant',
      status: 'coming-soon',
      badge: 'SOON'
    }
  ];

  const recentActivity = [
    { id: 1, type: 'article', title: 'Menu Engineering Tips', time: '2h ago', icon: FileText, engagement: 24, category: 'Education' },
    { id: 2, type: 'comment', title: 'Great insights!', time: '5h ago', icon: MessageSquare, engagement: 12, category: 'Interaction' },
    { id: 3, type: 'badge', title: 'Contributor Badge', time: '1d ago', icon: Award, engagement: 8, category: 'Achievement' },
    { id: 4, type: 'post', title: 'New menu analysis', time: '2d ago', icon: TrendingUp, engagement: 31, category: 'Analytics' },
    { id: 5, type: 'promotion', title: 'Weekend Special Launch', time: '3d ago', icon: Megaphone, engagement: 45, category: 'Marketing' }
  ];

  const badges = [
    { id: 1, name: 'Contributor', icon: Star, color: 'text-yellow-500', earned: true, progress: 100, description: 'Active community member' },
    { id: 2, name: 'Engaged', icon: MessageSquare, color: 'text-blue-500', earned: true, progress: 100, description: 'High interaction rate' },
    { id: 3, name: 'Expert', icon: Award, color: 'text-purple-500', earned: false, progress: 75, description: 'Industry knowledge leader' },
    { id: 4, name: 'Innovator', icon: Zap, color: 'text-green-500', earned: false, progress: 45, description: 'Creative solutions provider' },
    { id: 5, name: 'Mentor', icon: Crown, color: 'text-orange-500', earned: false, progress: 30, description: 'Help others grow' }
  ];

  // Enhanced Team data
  const teamMembers = [
    { id: 1, name: 'Sarah Chen', role: 'Head Chef', avatar: '👩‍🍳', status: 'online', currentTask: 'Menu planning', lastActive: '2 min ago', skills: ['French Cuisine', 'Menu Design'], efficiency: 95 },
    { id: 2, name: 'Mike Rodriguez', role: 'Sous Chef', avatar: '👨‍🍳', status: 'online', currentTask: 'Inventory check', lastActive: '5 min ago', skills: ['Italian Cuisine', 'Inventory Management'], efficiency: 88 },
    { id: 3, name: 'Emma Wilson', role: 'Server Manager', avatar: '👩‍💼', status: 'away', currentTask: 'Staff training', lastActive: '15 min ago', skills: ['Customer Service', 'Team Leadership'], efficiency: 92 },
    { id: 4, name: 'David Kim', role: 'Kitchen Manager', avatar: '👨‍💼', status: 'offline', currentTask: 'Equipment maintenance', lastActive: '1 hour ago', skills: ['Kitchen Operations', 'Equipment Maintenance'], efficiency: 85 }
  ];

  // Enhanced Community feed data
  const communityPosts = [
    { id: 1, author: 'Chef Maria', avatar: '👩‍🍳', content: 'Just implemented the new menu engineering strategy. Revenue up 23% this week!', time: '1h ago', likes: 12, comments: 5, shares: 3, category: 'Success Story', verified: true },
    { id: 2, author: 'Restaurant Pro', avatar: '👨‍💼', content: 'Anyone tried the AI-powered inventory system? Looking for recommendations.', time: '3h ago', likes: 8, comments: 15, shares: 2, category: 'Question', verified: false },
    { id: 3, author: 'Culinary Expert', avatar: '👩‍💼', content: 'New article: "10 Ways to Reduce Food Waste in Your Kitchen" - check it out!', time: '5h ago', likes: 25, comments: 8, shares: 12, category: 'Article', verified: true },
    { id: 4, author: 'Kitchen Master', avatar: '👨‍🍳', content: 'Just finished a 12-hour shift but the new fusion menu is getting amazing reviews!', time: '6h ago', likes: 18, comments: 6, shares: 4, category: 'Update', verified: false }
  ];

  // Enhanced WhatsApp-like messages
  const messages = [
    { id: 1, sender: 'Sarah Chen', avatar: '👩‍🍳', message: 'Hey team, I need help with the new menu layout', time: '10:30 AM', isOwn: false, status: 'read', type: 'text' },
    { id: 2, sender: 'You', avatar: '👤', message: 'Sure! What specific issues are you facing?', time: '10:32 AM', isOwn: true, status: 'sent', type: 'text' },
    { id: 3, sender: 'Mike Rodriguez', avatar: '👨‍🍳', message: 'I can help with that. Let me check the current setup', time: '10:35 AM', isOwn: false, status: 'read', type: 'text' },
    { id: 4, sender: 'Sarah Chen', avatar: '👩‍🍳', message: 'Thanks Mike! The pricing strategy needs adjustment', time: '10:37 AM', isOwn: false, status: 'delivered', type: 'text' },
    { id: 5, sender: 'Emma Wilson', avatar: '👩‍💼', message: 'I have some customer feedback that might help with pricing', time: '10:40 AM', isOwn: false, status: 'sent', type: 'text' },
    { id: 6, sender: 'Sarah Chen', avatar: '👩‍🍳', message: 'menu_layout_v2.pdf', time: '10:42 AM', isOwn: false, status: 'read', type: 'file', fileName: 'menu_layout_v2.pdf', fileSize: '2.4 MB', fileType: 'pdf' },
    { id: 7, sender: 'You', avatar: '👤', message: 'Perfect! I can see the issues now. Let me make some adjustments', time: '10:45 AM', isOwn: true, status: 'sent', type: 'text' },
    { id: 8, sender: 'Mike Rodriguez', avatar: '👨‍🍳', message: 'customer_feedback_march.xlsx', time: '10:47 AM', isOwn: false, status: 'read', type: 'file', fileName: 'customer_feedback_march.xlsx', fileSize: '1.8 MB', fileType: 'excel' },
    { id: 9, sender: 'David Kim', avatar: '👨‍💼', message: 'Great work team! The new layout looks much better', time: '10:50 AM', isOwn: false, status: 'delivered', type: 'text' }
  ];

  // Enhanced AI Agent insights
  const aiInsights = [
    { id: 1, type: 'trend', title: 'Menu Performance Alert', description: 'Your seafood dishes are performing 45% better than average', confidence: 92, action: 'Consider expanding seafood menu', priority: 'high', category: 'Revenue' },
    { id: 2, type: 'opportunity', title: 'Staff Scheduling', description: 'Peak hours analysis shows you need 2 more servers on weekends', confidence: 87, action: 'Adjust weekend staffing', priority: 'medium', category: 'Operations' },
    { id: 3, type: 'warning', title: 'Inventory Alert', description: 'Tomatoes running low - reorder needed within 2 days', confidence: 95, action: 'Place tomato order now', priority: 'high', category: 'Inventory' },
    { id: 4, type: 'recommendation', title: 'Customer Engagement', description: 'Social media posts about your specials get 3x more engagement', confidence: 78, action: 'Increase social media presence', priority: 'medium', category: 'Marketing' }
  ];

  // Smart Assistant features
  const [aiAssistantExpanded, setAiAssistantExpanded] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [userRole, setUserRole] = useState('manager'); // manager, chef, server, owner
  const [knowledgeBase, setKnowledgeBase] = useState([
    { id: 1, title: 'Menu Engineering Best Practices', category: 'Menu', tags: ['pricing', 'psychology', 'layout'], access: ['manager', 'chef', 'owner'] },
    { id: 2, title: 'Kitchen Safety Protocols', category: 'Safety', tags: ['safety', 'training', 'compliance'], access: ['chef', 'manager', 'owner'] },
    { id: 3, title: 'Customer Service Excellence', category: 'Service', tags: ['customer', 'service', 'training'], access: ['server', 'manager', 'owner'] },
    { id: 4, title: 'Inventory Management Guide', category: 'Operations', tags: ['inventory', 'waste', 'costs'], access: ['manager', 'owner'] },
    { id: 5, title: 'Financial Reporting Templates', category: 'Finance', tags: ['reports', 'budget', 'analysis'], access: ['owner', 'manager'] }
  ]);

  // Proactive notifications
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'urgent', title: 'Low Inventory Alert', message: 'Tomatoes running low - reorder needed', time: '2 min ago', read: false, action: 'Reorder Now' },
    { id: 2, type: 'info', title: 'Staff Schedule Update', message: 'Weekend staff schedule optimized', time: '15 min ago', read: false, action: 'View Schedule' },
    { id: 3, type: 'success', title: 'Revenue Milestone', message: 'Monthly revenue target achieved!', time: '1 hour ago', read: true, action: 'View Report' },
    { id: 4, type: 'warning', title: 'Customer Feedback', message: '3 new reviews need attention', time: '2 hours ago', read: false, action: 'Review Now' }
  ]);

  // Context-aware AI responses
  const handleAiQuery = async (query: string) => {
    setIsAiThinking(true);
    setAiQuery(query);
    
    // Simulate AI processing
    setTimeout(() => {
      const contextResponses = {
        'menu': `Based on your current menu performance, I recommend focusing on your seafood dishes which are performing 45% above average. Consider adding more seafood options or increasing prices by 10-15%.`,
        'staff': `Your weekend staff scheduling needs optimization. Based on peak hour analysis, you need 2 additional servers on Saturdays and Sundays between 6-9 PM.`,
        'inventory': `Your tomato inventory is running low. Based on current usage patterns, you'll need to reorder within 2 days to avoid stockout. I recommend ordering 50kg.`,
        'revenue': `Your revenue is trending upward! Current month shows 23% increase vs last month. Key drivers: seafood menu items and weekend specials.`,
        'customer': `Customer satisfaction is at 94.2%, which is excellent! Recent feedback highlights your seafood quality and friendly service.`,
        'default': `I can help you with menu optimization, staff scheduling, inventory management, revenue analysis, and customer insights. What specific area would you like to focus on?`
      };
      
      const response = contextResponses[query.toLowerCase().includes('menu') ? 'menu' :
                                    query.toLowerCase().includes('staff') ? 'staff' :
                                    query.toLowerCase().includes('inventory') ? 'inventory' :
                                    query.toLowerCase().includes('revenue') ? 'revenue' :
                                    query.toLowerCase().includes('customer') ? 'customer' : 'default'];
      
      setAiResponse(response);
      setIsAiThinking(false);
    }, 2000);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent': return '🔴';
      case 'warning': return '🟡';
      case 'info': return '🔵';
      case 'success': return '🟢';
      default: return '⚪';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      case 'success': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  // Intelligent Alerts System
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'reminder', title: 'Staff Meeting', message: 'Weekly team meeting in 30 minutes', time: '30 min', priority: 'medium', category: 'Team', action: 'Join Meeting' },
    { id: 2, type: 'trend', title: 'Revenue Spike', message: 'Unusual 40% revenue increase detected', time: '1 hour', priority: 'high', category: 'Analytics', action: 'Investigate' },
    { id: 3, type: 'coordination', title: 'Kitchen Coordination', message: 'Chef Sarah needs backup for dinner rush', time: '2 hours', priority: 'urgent', category: 'Operations', action: 'Assign Staff' },
    { id: 4, type: 'insight', title: 'Customer Pattern', message: 'New customer segment identified', time: '3 hours', priority: 'low', category: 'Marketing', action: 'Review Data' },
    { id: 5, type: 'reminder', title: 'Inventory Check', message: 'Monthly inventory count due tomorrow', time: '1 day', priority: 'medium', category: 'Operations', action: 'Schedule' }
  ]);

  const [trends, setTrends] = useState([
    { id: 1, metric: 'Revenue', value: '+23%', trend: 'up', period: 'vs last month', insight: 'Seafood menu driving growth' },
    { id: 2, metric: 'Customer Satisfaction', value: '94.2%', trend: 'up', period: 'vs last week', insight: 'Service quality improving' },
    { id: 3, metric: 'Staff Efficiency', value: '87.5%', trend: 'stable', period: 'vs last month', insight: 'Training programs effective' },
    { id: 4, metric: 'Food Waste', value: '-15%', trend: 'down', period: 'vs last month', insight: 'Inventory management working' }
  ]);

  const [teamTasks, setTeamTasks] = useState([
    { id: 1, assignee: 'Sarah Chen', task: 'Menu redesign', deadline: 'Today', status: 'in-progress', priority: 'high' },
    { id: 2, assignee: 'Mike Rodriguez', task: 'Inventory count', deadline: 'Tomorrow', status: 'pending', priority: 'medium' },
    { id: 3, assignee: 'Emma Wilson', task: 'Staff training', deadline: 'This week', status: 'completed', priority: 'low' },
    { id: 4, assignee: 'David Kim', task: 'Equipment maintenance', deadline: 'Next week', status: 'pending', priority: 'medium' }
  ]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'reminder': return '⏰';
      case 'trend': return '📈';
      case 'coordination': return '👥';
      case 'insight': return '💡';
      default: return '🔔';
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-300 bg-red-50';
      case 'high': return 'border-orange-300 bg-orange-50';
      case 'medium': return 'border-yellow-300 bg-yellow-50';
      case 'low': return 'border-green-300 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Enhanced Personal Stats
  const personalStats = {
    weeklyRevenue: [12000, 15000, 18000, 22000, 19000, 25000, 28000],
    weeklyOrders: [120, 150, 180, 220, 190, 250, 280],
    customerSatisfaction: [92, 94, 91, 95, 93, 96, 94],
    staffEfficiency: [85, 87, 89, 91, 88, 93, 90]
  };

  // WhatsApp-like features state
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log('Sending message:', messageText);
      setMessageText('');
      setIsTyping(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file.name);
      // Simulate file upload
      setTimeout(() => {
        setSelectedFile(null);
        console.log('File uploaded successfully');
      }, 2000);
    }
  };

  const handleMessageSearch = (query: string) => {
    setChatSearchQuery(query);
    // Filter messages based on search query
    const filteredMessages = messages.filter(msg => 
      msg.message.toLowerCase().includes(query.toLowerCase()) ||
      msg.sender.toLowerCase().includes(query.toLowerCase())
    );
    console.log('Searching messages:', filteredMessages);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return '📄';
      case 'excel': return '📊';
      case 'image': return '🖼️';
      case 'video': return '🎥';
      default: return '📎';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Revenue': return 'text-green-600 bg-green-100';
      case 'Operations': return 'text-blue-600 bg-blue-100';
      case 'Inventory': return 'text-orange-600 bg-orange-100';
      case 'Marketing': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Filter messages based on search
  const filteredMessages = messages.filter(msg => 
    !chatSearchQuery || 
    msg.message.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
    msg.sender.toLowerCase().includes(chatSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced LinkedIn-style Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded"></div>
                <span className="text-xl font-bold text-gray-900">MastroHub</span>
              </div>
              
              {/* Enhanced Search Bar */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-80">
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants, chefs, recipes..." 
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900">
                <Home className="w-5 h-5" />
                <span className="text-xs">Home</span>
              </Link>
              <Link href="/network" className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900">
                <Network className="w-5 h-5" />
                <span className="text-xs">Network</span>
              </Link>
              <Link href="/jobs" className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900">
                <Briefcase className="w-5 h-5" />
                <span className="text-xs">Jobs</span>
              </Link>
              <Link href="/messaging" className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900 relative">
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs">Messaging</span>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </Link>
              <Link href="/notifications" className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900 relative">
                <Bell className="w-5 h-5" />
                <span className="text-xs">Notifications</span>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </Link>
              
              {/* Profile Menu */}
              <div className="flex items-center space-x-2">
                <AvatarUpload 
                  currentAvatar={user?.user_metadata?.avatar_url}
                  onUpload={async (file) => {
                    console.log('Avatar uploaded:', file);
                  }}
                  size="sm"
                />
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar - Enhanced LinkedIn Style */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Enhanced Profile Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-20"></div>
              <div className="px-4 pb-4">
                <div className="flex justify-center -mt-8 mb-4">
                  <AvatarUpload 
                    currentAvatar={user?.user_metadata?.avatar_url}
                    onUpload={async (file) => {
                      console.log('Avatar uploaded:', file);
                    }}
                    size="lg"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {(user as any)?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User Name'}
                  </h2>
                  <p className="text-gray-600 text-sm">Restaurant Manager & Culinary Expert</p>
                  <p className="text-gray-500 text-xs mt-1">Member since 2024</p>
                  <div className="flex items-center justify-center mt-2 space-x-2">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">New York, NY</span>
                    <Globe className="w-3 h-3 text-gray-500 ml-2" />
                    <span className="text-xs text-gray-500">English</span>
                  </div>
                </div>
                
                {/* Enhanced Stats */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{userStats.posts}</div>
                      <div className="text-xs text-gray-600">Posts</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{userStats.followers}</div>
                      <div className="text-xs text-gray-600">Followers</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{userStats.views}</div>
                      <div className="text-xs text-gray-600">Views</div>
                    </div>
                <div>
                      <div className="text-lg font-semibold text-gray-900">${(userStats.revenue / 1000).toFixed(0)}k</div>
                      <div className="text-xs text-gray-600">Revenue</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.id}
                    href={action.path}
                    className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                      action.status === 'coming-soon' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{action.name}</div>
                      <div className="text-xs text-gray-600">{action.description}</div>
                    </div>
                    {action.badge && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        action.badge === 'NEW' ? 'bg-green-100 text-green-800' :
                        action.badge === 'SOON' ? 'bg-yellow-100 text-yellow-800' :
                        action.badge === 'Popular' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {action.badge}
                      </span>
                    )}
                  </Link>
                ))}
                </div>
              </div>

            {/* Enhanced Badges */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="space-y-3">
                {badges.map((badge) => (
                  <div key={badge.id} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg ${badge.earned ? 'bg-yellow-100' : 'bg-gray-100'} flex items-center justify-center`}>
                      <badge.icon className={`w-4 h-4 ${badge.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{badge.name}</div>
                      <div className="text-xs text-gray-600">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <activity.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                      <div className="text-xs text-gray-600 flex items-center space-x-2">
                        <span>{activity.time}</span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{activity.engagement}</span>
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          activity.category === 'Education' ? 'bg-green-100 text-green-800' :
                          activity.category === 'Interaction' ? 'bg-blue-100 text-blue-800' :
                          activity.category === 'Achievement' ? 'bg-yellow-100 text-yellow-800' :
                          activity.category === 'Analytics' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {activity.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Enhanced Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Intelligent Alerts Dashboard */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Intelligent Alerts</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Live monitoring</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Time-based Reminders */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900">⏰ Time-based Reminders</h4>
                  <div className="space-y-2">
                    {alerts.filter(alert => alert.type === 'reminder').slice(0, 2).map((alert) => (
                      <div key={alert.id} className={`border rounded-lg p-2 ${getAlertColor(alert.priority)}`}>
                        <div className="flex items-start space-x-2">
                          <span className="text-sm">{getAlertIcon(alert.type)}</span>
                          <div className="flex-1">
                            <div className="text-xs font-medium text-gray-900">{alert.title}</div>
                            <div className="text-xs text-gray-600">{alert.message}</div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-500">{alert.time}</span>
                              <button className="text-xs text-blue-600 hover:text-blue-700">{alert.action}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data-driven Insights */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900">📈 Data-driven Insights</h4>
                  <div className="space-y-2">
                    {trends.slice(0, 2).map((trend) => (
                      <div key={trend.id} className="border rounded-lg p-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-medium text-gray-900">{trend.metric}</div>
                            <div className="text-xs text-gray-600">{trend.period}</div>
                          </div>
                          <div className={`text-xs font-medium ${getTrendColor(trend.trend)}`}>{trend.value}</div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{trend.insight}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Team Preview */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Team Preview</h3>
                <button 
                  onClick={() => setIsTeamExpanded(!isTeamExpanded)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {isTeamExpanded ? 'Show less' : 'Show more'}
                </button>
              </div>
              
              <div className="space-y-3">
                {teamMembers.slice(0, isTeamExpanded ? teamMembers.length : 2).map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className="relative">
                      <span className="text-2xl">{member.avatar}</span>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        member.status === 'online' ? 'bg-green-500' : 
                        member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-600">{member.role}</div>
                      {isTeamExpanded && (
                        <div className="text-xs text-gray-500 mt-1">
                          {member.currentTask} • {member.lastActive} • Efficiency: {member.efficiency}%
                        </div>
                      )}
                    </div>
                    {member.status === 'online' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Team Coordination */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">👥 Team Coordination</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Active tasks</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                {teamTasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{task.task}</div>
                        <div className="text-xs text-gray-600">Assignee: {task.assignee}</div>
                        <div className="text-xs text-gray-500">Deadline: {task.deadline}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getTaskStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Community Feed */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Community Feed</h3>
                <button 
                  onClick={() => setIsCommunityExpanded(!isCommunityExpanded)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {isCommunityExpanded ? 'Show less' : 'Show more'}
                </button>
              </div>
              
              <div className="space-y-4">
                {communityPosts.slice(0, isCommunityExpanded ? communityPosts.length : 2).map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <span className="text-2xl">{post.avatar}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium text-gray-900">{post.author}</div>
                          {post.verified && <CheckCircle className="w-3 h-3 text-blue-500" />}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            post.category === 'Success Story' ? 'bg-green-100 text-green-800' :
                            post.category === 'Question' ? 'bg-blue-100 text-blue-800' :
                            post.category === 'Article' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {post.category}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">{post.time}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-800 mb-3">{post.content}</div>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{post.likes}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{post.comments}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Share2 className="w-3 h-3" />
                        <span>{post.shares}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Chat & AI */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Enhanced Team Chat - WhatsApp-like */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 h-96 flex flex-col">
              {/* Chat Header with Search */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-gray-900">Team Chat</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setChatSearchQuery('')}
                    className="text-gray-600 hover:text-gray-700"
                    title="Search messages"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-700" title="Video call">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-700" title="Voice call">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-700" title="More options">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              {chatSearchQuery && (
                <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Search className="w-3 h-3 text-gray-500" />
                    <input
                      type="text"
                      value={chatSearchQuery}
                      onChange={(e) => handleMessageSearch(e.target.value)}
                      placeholder="Search in conversation..."
                      className="flex-1 bg-transparent text-sm outline-none"
                    />
                    <button 
                      onClick={() => setChatSearchQuery('')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
              
              {/* Enhanced Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {filteredMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs ${msg.isOwn ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg px-3 py-2 relative group`}>
                      {!msg.isOwn && (
                        <div className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
                          <span>{msg.sender}</span>
                          <span className="text-2xl">{msg.avatar}</span>
                        </div>
                      )}
                      
                      {msg.type === 'text' && <div className="text-sm">{msg.message}</div>}
                      
                      {msg.type === 'file' && (
                        <div className="flex items-center space-x-2 p-2 bg-white/20 rounded border">
                          <span className="text-lg">{getFileIcon(msg.fileType || '')}</span>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{msg.fileName}</div>
                            <div className="text-xs opacity-75">{msg.fileSize}</div>
                          </div>
                          <button className="text-xs underline">Download</button>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                        <span>{msg.time}</span>
                        {msg.isOwn && (
                          <span className="text-xs">
                            {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                      
                      {/* Message Actions */}
                      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedMessage(msg.id)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          ⋯
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 rounded-lg px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Enhanced Message Input */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowFileUpload(!showFileUpload)}
                  className="text-gray-600 hover:text-gray-700"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                
                {showFileUpload && (
                  <div className="absolute bottom-16 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="text-xs"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.mp4"
                    />
                  </div>
                )}
                
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 2000);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-gray-600 hover:text-gray-700"
                  title="Add emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              {/* File Upload Progress */}
              {selectedFile && (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600">{selectedFile.name}</span>
                    <div className="flex-1 bg-blue-200 rounded-full h-1">
                      <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{width: '60%'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced AI Agent - Smart Assistant */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">Smart Assistant</h3>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setAiAssistantExpanded(!aiAssistantExpanded)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {aiAssistantExpanded ? 'Show less' : 'Show more'}
                  </button>
                  <div className="text-xs text-gray-500">Role: {userRole}</div>
                </div>
                    </div>

              {/* AI Chat Interface */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAiQuery(aiQuery)}
                    placeholder="Ask me anything about your restaurant..."
                    className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button 
                    onClick={() => handleAiQuery(aiQuery)}
                    disabled={!aiQuery.trim() || isAiThinking}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                  >
                    {isAiThinking ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                {aiResponse && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
                    <div className="flex items-start space-x-2">
                      <Brain className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div className="text-sm text-gray-800">{aiResponse}</div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Proactive Notifications */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Smart Notifications</h4>
                <div className="space-y-2">
                  {notifications.slice(0, aiAssistantExpanded ? notifications.length : 2).map((notification) => (
                    <div key={notification.id} className={`border rounded-lg p-2 ${getNotificationColor(notification.type)} ${!notification.read ? 'ring-1 ring-blue-500' : ''}`}>
                      <div className="flex items-start space-x-2">
                        <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-gray-900">{notification.title}</div>
                          <div className="text-xs text-gray-600">{notification.message}</div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">{notification.time}</span>
                            <button className="text-xs text-blue-600 hover:text-blue-700">{notification.action}</button>
                          </div>
                        </div>
                      </div>
                    </div>
              ))}
            </div>
          </div>

              {/* Intelligent Alerts */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Intelligent Alerts</h4>
                <div className="space-y-2">
                  {alerts.slice(0, aiAssistantExpanded ? alerts.length : 2).map((alert) => (
                    <div key={alert.id} className={`border rounded-lg p-2 ${getAlertColor(alert.priority)}`}>
                      <div className="flex items-start space-x-2">
                        <span className="text-sm">{getAlertIcon(alert.type)}</span>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-gray-900">{alert.title}</div>
                          <div className="text-xs text-gray-600">{alert.message}</div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">{alert.time}</span>
                            <button className="text-xs text-blue-600 hover:text-blue-700">{alert.action}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trends */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Key Trends</h4>
                <div className="space-y-2">
                  {trends.slice(0, aiAssistantExpanded ? trends.length : 2).map((trend) => (
                    <div key={trend.id} className="border rounded-lg p-2">
                      <div className="flex items-center justify-between">
                    <div>
                          <div className="text-xs font-medium text-gray-900">{trend.metric}</div>
                          <div className="text-xs text-gray-600">{trend.period}</div>
                        </div>
                        <div className={`text-xs font-medium ${getTrendColor(trend.trend)}`}>{trend.value}</div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{trend.insight}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Tasks */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Team Tasks</h4>
                <div className="space-y-2">
                  {teamTasks.slice(0, aiAssistantExpanded ? teamTasks.length : 2).map((task) => (
                    <div key={task.id} className="border rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-medium text-gray-900">{task.task}</div>
                          <div className="text-xs text-gray-600">Assignee: {task.assignee}</div>
                        </div>
                        <div className={`text-xs font-medium ${getTaskStatusColor(task.status)}`}>{task.status}</div>
                  </div>
                      <div className="text-xs text-gray-600 mt-1">Deadline: {task.deadline}</div>
                      <div className="text-xs text-gray-500">Priority: {task.priority}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Knowledge Base */}
              {aiAssistantExpanded && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Knowledge Base</h4>
                  <div className="space-y-2">
                    {knowledgeBase
                      .filter(item => item.access.includes(userRole))
                      .map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-2 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-medium text-gray-900">{item.title}</div>
                              <div className="text-xs text-gray-600">{item.category}</div>
                            </div>
                            <div className="flex space-x-1">
                              {item.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-1 rounded">
                                  {tag}
                                </span>
              ))}
            </div>
          </div>
            </div>
                      ))}
                  </div>
                </div>
              )}

              {/* AI Insights */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">AI Insights</h4>
                {aiInsights.slice(0, aiAssistantExpanded ? aiInsights.length : 2).map((insight) => (
                  <div key={insight.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Brain className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="text-sm font-medium text-gray-900">{insight.title}</div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(insight.priority)}`}>
                            {insight.priority}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(insight.category)}`}>
                            {insight.category}
                      </span>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">{insight.description}</div>
                        {aiAssistantExpanded && (
                          <div className="text-xs text-blue-600">{insight.action}</div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{insight.confidence}%</div>
                    </div>
                  </div>
                ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHub; 