"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TestTube, 
  TrendingUp, 
  BarChart3,
  Target,
  Zap
} from 'lucide-react';

interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: {
    id: string;
    name: string;
    description: string;
    performance: number;
    color: string;
  }[];
  status: 'running' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
}

export default function ABTesting() {
  const [tests, setTests] = React.useState<ABTest[]>([
    {
      id: 'cta-button',
      name: 'CTA Button Color',
      description: 'Testing different button colors for conversion optimization',
      variants: [
        { id: 'blue', name: 'Blue', description: 'Original blue button', performance: 100, color: 'bg-blue-600' },
        { id: 'green', name: 'Green', description: 'Green button variant', performance: 127, color: 'bg-green-600' },
        { id: 'purple', name: 'Purple', description: 'Purple button variant', performance: 115, color: 'bg-purple-600' }
      ],
      status: 'running',
      startDate: '2024-01-01'
    },
    {
      id: 'headline-style',
      name: 'Headline Style',
      description: 'Testing different headline approaches for engagement',
      variants: [
        { id: 'benefit', name: 'Benefit-Focused', description: 'Focus on customer benefits', performance: 100, color: 'bg-blue-600' },
        { id: 'question', name: 'Question-Based', description: 'Ask engaging questions', performance: 142, color: 'bg-green-600' },
        { id: 'number', name: 'Number-Based', description: 'Include specific numbers', performance: 118, color: 'bg-purple-600' }
      ],
      status: 'completed',
      startDate: '2023-12-01',
      endDate: '2024-01-01'
    }
  ]);

  const [selectedTest, setSelectedTest] = React.useState<ABTest | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'completed':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getWinner = (test: ABTest) => {
    return test.variants.reduce((winner, variant) => 
      variant.performance > winner.performance ? variant : winner
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <TestTube className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          A/B Testing Dashboard
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test List */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Active Tests
          </h4>
          <div className="space-y-4">
            {tests.map((test) => (
              <motion.div
                key={test.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedTest?.id === test.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
                onClick={() => setSelectedTest(test)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    {test.name}
                  </h5>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                    {test.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {test.description}
                </p>
                
                {test.status === 'completed' && (
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-medium">
                      Winner: {getWinner(test).name}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Test Details */}
        <div>
          {selectedTest ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                {selectedTest.name} Results
              </h4>
              
              <div className="space-y-4">
                {selectedTest.variants.map((variant, index) => (
                  <motion.div
                    key={variant.id}
                    className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {variant.name}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {variant.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {variant.performance}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Performance
                        </p>
                      </div>
                    </div>
                    
                    {/* Performance Bar */}
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                      <motion.div
                        className={`h-2 rounded-full ${variant.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(variant.performance, 100)}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      />
                    </div>
                    
                    {variant.performance > 100 && (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <TrendingUp className="w-4 h-4" />
                        +{variant.performance - 100}% improvement
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Test Actions */}
              <div className="mt-6 flex gap-3">
                <motion.button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Details
                </motion.button>
                <motion.button
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Pause Test
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              Select a test to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 