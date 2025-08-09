'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { AIAgent } from '@/lib/ai-agent';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  TrendingUp, 
  ChefHat, 
  DollarSign,
  Users,
  BarChart3,
  Target,
  Calendar,
  Zap,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Star,
  Clock,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actionItems?: string[];
  confidence?: number;
}

interface SmartRecommendation {
  id: string;
  type: 'revenue' | 'menu' | 'marketing' | 'operations' | 'customer';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  priority: number;
  estimatedValue: number;
  implementationTime: string;
  tags: string[];
}

export default function AIAssistant() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'recommendations' | 'insights'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiAgent = useRef<AIAgent>();

  useEffect(() => {
    // Initialize AI Agent with restaurant context
    if (currentWorkspace) {
      aiAgent.current = new AIAgent({}, {
        menuItems: [],
        restaurantName: currentWorkspace.name,
        cuisine: currentWorkspace.cuisine || 'International',
        location: currentWorkspace.location,
        targetAudience: ['Business professionals', 'Food enthusiasts'],
        priceRange: 'premium',
        totalRevenue: 50000,
        averageOrderValue: 25,
        customerCount: 2000,
        popularItems: ['Truffle Pasta Carbonara', 'Grilled Salmon'],
        seasonalTrends: ['Summer salads', 'Winter comfort food'],
        availableTools: ['Menu Maker', 'QR Menu', 'Analytics', 'Marketing'],
        qrMenuEnabled: true,
        analyticsEnabled: true,
        marketingEnabled: true
      });

      // Load initial recommendations
      loadSmartRecommendations();
      
      // Add welcome message
      setMessages([{
        id: '1',
        type: 'assistant',
        content: `Hello! I'm your AI restaurant assistant. I can help you with menu optimization, marketing strategies, financial analysis, and much more. What would you like to know about ${currentWorkspace.name}?`,
        timestamp: new Date(),
        suggestions: [
          'How can I increase my revenue?',
          'What menu items should I add?',
          'Help me with marketing strategy',
          'Analyze my financial performance'
        ]
      }]);
    }
  }, [currentWorkspace]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadSmartRecommendations = async () => {
    // Simulate loading smart recommendations
    const mockRecommendations: SmartRecommendation[] = [
      {
        id: '1',
        type: 'revenue',
        title: 'Implement Dynamic Pricing',
        description: 'Adjust prices based on demand, time of day, and customer segments to maximize revenue.',
        impact: 'high',
        effort: 'medium',
        priority: 1,
        estimatedValue: 15000,
        implementationTime: '2-3 weeks',
        tags: ['pricing', 'revenue', 'automation']
      },
      {
        id: '2',
        type: 'menu',
        title: 'Add Seasonal Menu Items',
        description: 'Introduce seasonal dishes to attract customers and increase average order value.',
        impact: 'medium',
        effort: 'low',
        priority: 2,
        estimatedValue: 8000,
        implementationTime: '1-2 weeks',
        tags: ['menu', 'seasonal', 'innovation']
      },
      {
        id: '3',
        type: 'marketing',
        title: 'Launch Social Media Campaign',
        description: 'Create engaging content and run targeted ads on social media platforms.',
        impact: 'high',
        effort: 'high',
        priority: 3,
        estimatedValue: 12000,
        implementationTime: '4-6 weeks',
        tags: ['marketing', 'social media', 'branding']
      }
    ];
    
    setRecommendations(mockRecommendations);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I understand you're asking about "${content}". Let me analyze your restaurant data and provide you with actionable insights. Based on your current performance, I recommend focusing on menu optimization and customer engagement strategies.`,
        timestamp: new Date(),
        suggestions: [
          'Show me detailed analytics',
          'Help me optimize my menu',
          'Create a marketing plan',
          'Analyze customer feedback'
        ],
        actionItems: [
          'Review current menu performance',
          'Analyze customer preferences',
          'Check revenue trends'
        ]
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400 bg-red-900/50 border-red-700/50';
      case 'medium': return 'text-yellow-400 bg-yellow-900/50 border-yellow-700/50';
      case 'low': return 'text-green-400 bg-green-900/50 border-green-700/50';
      default: return 'text-slate-400 bg-slate-700/50 border-slate-600/50';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'text-green-400 bg-green-900/50 border-green-700/50';
      case 'medium': return 'text-yellow-400 bg-yellow-900/50 border-yellow-700/50';
      case 'high': return 'text-red-400 bg-red-900/50 border-red-700/50';
      default: return 'text-slate-400 bg-slate-700/50 border-slate-600/50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue': return <DollarSign className="w-5 h-5" />;
      case 'menu': return <ChefHat className="w-5 h-5" />;
      case 'marketing': return <TrendingUp className="w-5 h-5" />;
      case 'operations': return <Zap className="w-5 h-5" />;
      case 'customer': return <Users className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-md shadow-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Bot className="w-8 h-8 text-blue-400" />
                <h1 className="ml-3 text-2xl font-bold text-white">AI Assistant</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300 text-sm">AI Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700/50 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Chat with AI Assistant</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto mb-6 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-700/50 text-slate-200'
                      }`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {message.type === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4 text-blue-400" />
                          )}
                          <span className="text-xs opacity-75">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        
                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block w-full text-left px-3 py-2 bg-slate-600/50 hover:bg-slate-600/70 rounded-lg text-xs transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-slate-700/50 text-slate-200 px-4 py-3 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-blue-400" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  placeholder="Ask me anything about your restaurant..."
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Recommendations Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Smart Recommendations</h2>
                <Lightbulb className="w-5 h-5 text-yellow-400" />
              </div>

              <div className="space-y-4">
                {recommendations.map((recommendation) => (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-700/50 border border-slate-600/50 rounded-xl p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-slate-600/50 rounded-lg">
                          {getTypeIcon(recommendation.type)}
                        </div>
                        <h3 className="font-semibold text-white">{recommendation.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-3">{recommendation.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getImpactColor(recommendation.impact)}`}>
                        {recommendation.impact} impact
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getEffortColor(recommendation.effort)}`}>
                        {recommendation.effort} effort
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Est. Value: €{recommendation.estimatedValue.toLocaleString()}</span>
                      <span className="text-slate-400">{recommendation.implementationTime}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
