'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AIAgent, MenuContext, MenuData } from '@/lib/ai-agent'
import { aiProvider } from '@/lib/ai-provider'

interface AIInterviewProps {
  onComplete: (manuals: MenuData) => void
  onCancel: () => void
}

interface InterviewState {
  currentQuestion: number
  answers: Record<string, string>
  isComplete: boolean
  isLoading: boolean
  error?: string
}

export default function AIInterview({ onComplete, onCancel }: AIInterviewProps) {
  const [state, setState] = useState<InterviewState>({
    currentQuestion: 1,
    answers: {},
    isComplete: false,
    isLoading: false
  })

  const [currentQuestion, setCurrentQuestion] = useState<string>('')
  const [currentAnswer, setCurrentAnswer] = useState<string>('')
  const [aiAgent, setAiAgent] = useState<AIAgent | null>(null)

  useEffect(() => {
    // Initialize AI Agent
    const agent = new AIAgent({})
    setAiAgent(agent)
    
    // Load first question
    loadQuestion(1)
  }, [])

  const loadQuestion = async (questionNumber: number) => {
    if (!aiAgent) return

    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const question = await aiAgent.askSmartQuestion(questionNumber)
      setCurrentQuestion(question)
      setCurrentAnswer('')
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to load question',
        isLoading: false 
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handleAnswerSubmit = async () => {
    if (!aiAgent || !currentAnswer.trim()) return

    setState(prev => ({ ...prev, isLoading: true }))

    try {
      // Process answer
      await aiAgent.processAnswer(state.currentQuestion, currentAnswer)
      
      // Save answer
      setState(prev => ({
        ...prev,
        answers: { ...prev.answers, [`q${state.currentQuestion}`]: currentAnswer }
      }))

      // Check if we're done (15 questions total)
      if (state.currentQuestion >= 15) {
        await generateManuals()
      } else {
        // Move to next question
        const nextQuestion = state.currentQuestion + 1
        setState(prev => ({ ...prev, currentQuestion: nextQuestion }))
        await loadQuestion(nextQuestion)
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to process answer',
        isLoading: false 
      }))
    }
  }

  const generateManuals = async () => {
    if (!aiAgent) return

    try {
      const manuals = await aiAgent.generateAllManuals()
      setState(prev => ({ ...prev, isComplete: true }))
      onComplete(manuals)
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to generate manuals',
        isLoading: false 
      }))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAnswerSubmit()
    }
  }

  const getProgressPercentage = () => {
    return (state.currentQuestion / 15) * 100
  }

  if (state.isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h3 className="text-xl font-semibold mb-2">Manuals Generated!</h3>
            <p className="text-gray-600 mb-6">
              All 7 manuals have been created successfully.
            </p>
            <button
              onClick={() => onComplete({} as MenuData)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              View Manuals
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">AI Menu Interview</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {state.currentQuestion} of 15</span>
            <span>{Math.round(getProgressPercentage())}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {state.isLoading ? 'Loading question...' : currentQuestion}
          </h3>
          
          {state.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {state.error}
            </div>
          )}
        </div>

        {/* Answer Input */}
        <div className="mb-6">
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer here..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            disabled={state.isLoading}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
            disabled={state.isLoading}
          >
            Cancel
          </button>
          
          <button
            onClick={handleAnswerSubmit}
            disabled={!currentAnswer.trim() || state.isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.isLoading ? 'Processing...' : 'Next Question'}
          </button>
        </div>

        {/* AI Assistant Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-blue-800">AI Assistant</span>
          </div>
          <p className="text-sm text-blue-700">
            I'm analyzing your answers to create comprehensive manuals for your team. 
            Each question helps me understand your dish better and generate more accurate information.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
