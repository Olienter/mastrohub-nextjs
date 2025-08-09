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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSmartRecommendations = async () => {
    try {
      const mockRecommendations: SmartRecommendation[] = [
        {
          id: '1',
          type: 'revenue',
          title: 'Implement Dynamic Pricing',
          description: 'Adjust prices based on demand and time of day to maximize revenue during peak hours.',
          impact: 'high',
          effort: 'medium',
          priority: 1,
          estimatedValue: 15000,
          implementationTime: '2-3 weeks',
          tags: ['pricing', 'revenue', 'optimization']
        },
        {
          id: '2',
          type: 'menu',
          title: 'Add Seasonal Menu Items',
          description: 'Introduce 3-4 seasonal dishes to attract customers and increase average order value.',
          impact: 'medium',
          effort: 'low',
          priority: 2,
          estimatedValue: 8000,
          implementationTime: '1-2 weeks',
          tags: ['seasonal', 'menu', 'innovation']
        },
        {
          id: '3',
          type: 'marketing',
          title: 'Launch Social Media Campaign',
          description: 'Create engaging content and run targeted ads to increase brand awareness.',
          impact: 'high',
          effort: 'medium',
          priority: 3,
          estimatedValue: 12000,
          implementationTime: '3-4 weeks',
          tags: ['marketing', 'social media', 'branding']
        },
        {
          id: '4',
          type: 'operations',
          title: 'Optimize Staff Scheduling',
          description: 'Use data-driven scheduling to reduce labor costs while maintaining service quality.',
          impact: 'medium',
          effort: 'low',
          priority: 4,
          estimatedValue: 6000,
          implementationTime: '1 week',
          tags: ['operations', 'staffing', 'efficiency']
        },
        {
          id: '5',
          type: 'customer',
          title: 'Implement Loyalty Program',
          description: 'Create a customer loyalty program to increase repeat visits and average spend.',
          impact: 'high',
          effort: 'medium',
          priority: 5,
          estimatedValue: 10000,
          implementationTime: '2-3 weeks',
          tags: ['loyalty', 'retention', 'customer']
        }
      ];
      
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !aiAgent.current) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiAgent.current.askRestaurantAssistant(content);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        suggestions: response.suggestions,
        actionItems: response.actionItems,
        confidence: response.confidence
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue': return <DollarSign className="w-5 h-5" />;
      case 'menu': return <ChefHat className="w-5 h-5" />;
      case 'marketing': return <Target className="w-5 h-5" />;
      case 'operations': return <Users className="w-5 h-5" />;
      case 'customer': return <BarChart3 className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AI Restaurant Assistant
              </h1>
              <p className="text-gray-600">
                Get intelligent insights and recommendations for your restaurant
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Bot className="w-8 h-8 text-blue-600" />
              <span className="text-sm text-gray-600">AI Powered</span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'recommendations'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Smart Recommendations
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'insights'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Insights
            </button>
          </div>

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="h-96 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-3xl ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`rounded-lg px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          {message.confidence && (
                            <div className="flex items-center mt-2 text-xs opacity-75">
                              <Star className="w-3 h-3 mr-1" />
                              Confidence: {Math.round(message.confidence * 100)}%
                            </div>
                          )}
                        </div>
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
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {messages.length > 0 && messages[messages.length - 1].type === 'assistant' && 
               messages[messages.length - 1].suggestions && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  placeholder="Ask me anything about your restaurant..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Smart Recommendations</h3>
                <button
                  onClick={loadSmartRecommendations}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </button>
              </div>

              <div className="grid gap-4">
                {recommendations.map((recommendation) => (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getTypeIcon(recommendation.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                          <p className="text-sm text-gray-600">{recommendation.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(recommendation.impact)}`}>
                          {recommendation.impact} impact
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getEffortColor(recommendation.effort)}`}>
                          {recommendation.effort} effort
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">€{recommendation.estimatedValue.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Estimated Value</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{recommendation.priority}</p>
                        <p className="text-xs text-gray-600">Priority</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{recommendation.implementationTime}</p>
                        <p className="text-xs text-gray-600">Time to Implement</p>
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.ceil(recommendation.priority / 2)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">Priority Score</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {recommendation.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                        <span>Implement</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8" />
                    <span className="text-2xl font-bold">+15%</span>
                  </div>
                  <h4 className="font-semibold mb-2">Revenue Growth</h4>
                  <p className="text-blue-100 text-sm">Compared to last month</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8" />
                    <span className="text-2xl font-bold">+8%</span>
                  </div>
                  <h4 className="font-semibold mb-2">Customer Satisfaction</h4>
                  <p className="text-green-100 text-sm">Based on recent reviews</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8" />
                    <span className="text-2xl font-bold">-12%</span>
                  </div>
                  <h4 className="font-semibold mb-2">Wait Time</h4>
                  <p className="text-purple-100 text-sm">Improved efficiency</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Key Insights</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Peak hours are 7-9 PM, consider dynamic pricing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Info className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-700">Most popular dish: Truffle Pasta Carbonara</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-700">Staff productivity could be improved by 20%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
