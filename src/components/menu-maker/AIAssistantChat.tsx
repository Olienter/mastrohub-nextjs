'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AIAgent, AIAssistantResponse, RestaurantContext } from '@/lib/ai-agent'
import { Brain, Send, MessageCircle, TrendingUp, DollarSign, Users, Package, Lightbulb, Target, BarChart3 } from 'lucide-react'

interface AIAssistantChatProps {
  restaurantContext: RestaurantContext
  onClose: () => void
}

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  response?: AIAssistantResponse
}

export default function AIAssistantChat({ restaurantContext, onClose }: AIAssistantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiAgent, setAiAgent] = useState<AIAgent | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize AI Agent with restaurant context
    const agent = new AIAgent({}, restaurantContext)
    setAiAgent(agent)
    
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'assistant',
      content: `Hello! I'm your AI Restaurant Assistant. I have access to all your restaurant data and can help you with:

• Menu analysis and optimization
• Business recommendations
• Financial insights
• Marketing strategies
• Supply chain optimization
• Customer behavior analysis
• Trend predictions

What would you like to know about your restaurant?`,
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
        content: 'Sorry, I encountered an error. Please try again.',
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

  const getQuickQuestions = () => [
    {
      icon: <TrendingUp className="w-4 h-4" />,
      text: "Which menu items are most profitable?",
      color: "bg-green-100 text-green-800"
    },
    {
      icon: <DollarSign className="w-4 h-4" />,
      text: "How can I increase revenue?",
      color: "bg-blue-100 text-blue-800"
    },
    {
      icon: <Users className="w-4 h-4" />,
      text: "What's my customer behavior like?",
      color: "bg-purple-100 text-purple-800"
    },
    {
      icon: <Package className="w-4 h-4" />,
      text: "How can I optimize my supply chain?",
      color: "bg-orange-100 text-orange-800"
    },
    {
      icon: <Target className="w-4 h-4" />,
      text: "What marketing strategy should I use?",
      color: "bg-pink-100 text-pink-800"
    },
    {
      icon: <BarChart3 className="w-4 h-4" />,
      text: "What are the upcoming trends?",
      color: "bg-indigo-100 text-indigo-800"
    }
  ]

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Restaurant Assistant</h2>
              <p className="text-sm text-gray-600">Powered by GPT-4o</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  
                  {/* Show response details if available */}
                  {message.response && (
                    <div className="mt-3 space-y-2">
                      {message.response.suggestions.length > 0 && (
                        <div className="bg-white bg-opacity-10 rounded p-2">
                          <p className="text-xs font-semibold mb-1">Suggestions:</p>
                          <ul className="text-xs space-y-1">
                            {message.response.suggestions.map((suggestion, index) => (
                              <li key={index}>• {suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {message.response.actionItems.length > 0 && (
                        <div className="bg-white bg-opacity-10 rounded p-2">
                          <p className="text-xs font-semibold mb-1">Action Items:</p>
                          <ul className="text-xs space-y-1">
                            {message.response.actionItems.map((action, index) => (
                              <li key={index}>• {action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
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
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="p-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {getQuickQuestions().map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question.text)}
                  className={`p-3 rounded-lg text-sm flex items-center space-x-2 hover:opacity-80 transition-opacity ${question.color}`}
                >
                  {question.icon}
                  <span>{question.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your restaurant..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
