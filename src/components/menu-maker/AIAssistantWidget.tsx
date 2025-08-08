'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AIAgent, AIAssistantResponse, RestaurantContext } from '@/lib/ai-agent'
import { MessageCircle, X, Send, Bot, User, Sparkles, TrendingUp, DollarSign, Users, Package, Target, BarChart3 } from 'lucide-react'

interface AIAssistantWidgetProps {
  restaurantContext: RestaurantContext
}

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  response?: AIAssistantResponse
}

export default function AIAssistantWidget({ restaurantContext }: AIAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiAgent, setAiAgent] = useState<AIAgent | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const agent = new AIAgent({}, restaurantContext)
    setAiAgent(agent)
    
    // Friendly welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'assistant',
      content: `Hi there! 👋 I'm your restaurant assistant. I can help you with menu analysis, business insights, and much more. What would you like to know?`,
      timestamp: new Date()
    }
    
    setMessages([welcomeMessage])
  }, [restaurantContext])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !aiAgent || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await aiAgent.askRestaurantAssistant(inputValue)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        response: response
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I had a moment there. Can you try asking again? 😊',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getQuickSuggestions = () => [
    {
      icon: <TrendingUp className="w-4 h-4" />,
      text: "Most profitable items?",
      color: "bg-green-50 text-green-700 border-green-200"
    },
    {
      icon: <DollarSign className="w-4 h-4" />,
      text: "How to increase revenue?",
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      icon: <Users className="w-4 h-4" />,
      text: "Customer insights?",
      color: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      icon: <Target className="w-4 h-4" />,
      text: "Marketing tips?",
      color: "bg-pink-50 text-pink-700 border-pink-200"
    }
  ]

  const handleQuickSuggestion = (text: string) => {
    setInputValue(text)
  }

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center text-white hover:scale-110"
        >
          {isOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <MessageCircle className="w-7 h-7" />
          )}
        </button>
      </motion.div>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-20 right-6 z-40 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col"
          >
            {/* Header - Compact */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Restaurant Assistant</h3>
                  <div className="text-xs text-gray-600 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Online
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-500 hover:text-gray-700 text-lg p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMinimized ? '□' : '−'}
              </button>
            </div>

            {/* Chat Area - Much Larger */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] p-3 rounded-xl shadow-sm ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-900 border border-gray-100'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          
                          {/* Action Items */}
                          {message.response?.actionItems && message.response.actionItems.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {message.response.actionItems.map((action, index) => (
                                <div key={index} className={`rounded-lg p-2 ${
                                  message.type === 'user' 
                                    ? 'bg-white bg-opacity-20' 
                                    : 'bg-blue-50 border border-blue-100'
                                }`}>
                                  <p className="text-xs font-medium flex items-center">
                                    <span className="mr-1">💡</span>
                                    {action}
                                  </p>
                                </div>
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
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <span className="text-xs text-gray-600 ml-2">Typing...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestions - Compact */}
                {messages.length === 1 && (
                  <div className="p-3 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                      <Sparkles className="w-3 h-3 mr-1 text-blue-600" />
                      Quick suggestions:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {getQuickSuggestions().map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickSuggestion(suggestion.text)}
                          className={`p-2 rounded-lg text-xs border transition-all duration-200 hover:scale-105 ${suggestion.color}`}
                        >
                          <div className="flex items-center space-x-1">
                            {suggestion.icon}
                            <span className="font-medium">{suggestion.text}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area - Compact */}
                <div className="p-3 border-t border-gray-100 bg-white">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything..."
                      className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
