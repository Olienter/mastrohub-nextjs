'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AIProviderType, aiProvider } from '@/lib/ai-provider'
import { Brain, Zap, Shield, DollarSign, Clock } from 'lucide-react'

interface AIProviderSelectorProps {
  onProviderSelect: (provider: AIProviderType) => void
  onClose: () => void
}

export default function AIProviderSelector({ onProviderSelect, onClose }: AIProviderSelectorProps) {
  const [availableProviders, setAvailableProviders] = useState<AIProviderType[]>([])
  const [selectedProvider, setSelectedProvider] = useState<AIProviderType | null>(null)

  useEffect(() => {
    const providers = aiProvider.getAvailableProviders()
    setAvailableProviders(providers)
    if (providers.length > 0) {
      setSelectedProvider(providers[0])
    }
  }, [])

  const handleProviderSelect = (provider: AIProviderType) => {
    setSelectedProvider(provider)
  }

  const handleStartInterview = () => {
    if (selectedProvider) {
      onProviderSelect(selectedProvider)
    }
  }

  const getProviderIcon = (provider: AIProviderType) => {
    switch (provider) {
      case 'openai':
        return <Brain className="w-6 h-6 text-blue-600" />
      case 'anthropic':
        return <Shield className="w-6 h-6 text-green-600" />
      case 'ollama':
        return <Zap className="w-6 h-6 text-purple-600" />
      default:
        return <Brain className="w-6 h-6 text-gray-600" />
    }
  }

  const getProviderColor = (provider: AIProviderType) => {
    switch (provider) {
      case 'openai':
        return 'border-blue-200 bg-blue-50 hover:bg-blue-100'
      case 'anthropic':
        return 'border-green-200 bg-green-50 hover:bg-green-100'
      case 'ollama':
        return 'border-purple-200 bg-purple-50 hover:bg-purple-100'
      default:
        return 'border-gray-200 bg-gray-50 hover:bg-gray-100'
    }
  }

  const getProviderSelectedColor = (provider: AIProviderType) => {
    switch (provider) {
      case 'openai':
        return 'border-blue-500 bg-blue-100'
      case 'anthropic':
        return 'border-green-500 bg-green-100'
      case 'ollama':
        return 'border-purple-500 bg-purple-100'
      default:
        return 'border-gray-500 bg-gray-100'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Choose AI Provider</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Select which AI provider you'd like to use for the interview. Each provider has different strengths and costs.
        </p>

        {/* Provider Options */}
        <div className="space-y-4 mb-6">
          {availableProviders.map((provider) => {
            const info = aiProvider.getProviderInfo(provider)
            const isSelected = selectedProvider === provider
            
            return (
              <motion.div
                key={provider}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? getProviderSelectedColor(provider)
                    : getProviderColor(provider)
                }`}
                onClick={() => handleProviderSelect(provider)}
              >
                <div className="flex items-center space-x-4">
                  {getProviderIcon(provider)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{info.name}</h3>
                    <p className="text-sm text-gray-600">{info.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-600">{info.cost}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-600">{info.speed}</span>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Provider-specific information */}
        {selectedProvider && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">About {aiProvider.getProviderInfo(selectedProvider).name}</h4>
            <div className="text-sm text-gray-600 space-y-1">
              {selectedProvider === 'openai' && (
                <>
                  <p>• Latest GPT-4o model with fastest response times</p>
                  <p>• Best for complex reasoning and creative tasks</p>
                  <p>• Paid per token usage</p>
                </>
              )}
              {selectedProvider === 'anthropic' && (
                <>
                  <p>• Excellent text understanding and safety</p>
                  <p>• Best for detailed analysis and explanations</p>
                  <p>• Paid per token usage</p>
                </>
              )}
              {selectedProvider === 'ollama' && (
                <>
                  <p>• Free local AI model running on your computer</p>
                  <p>• No data leaves your system - complete privacy</p>
                  <p>• Requires Ollama to be installed and running</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          
          <button
            onClick={handleStartInterview}
            disabled={!selectedProvider}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Interview with {selectedProvider ? aiProvider.getProviderInfo(selectedProvider).name : 'AI'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
