"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Target, BarChart3 } from 'lucide-react';

interface ProfitAnalysis {
  currentMargin: number;
  targetMargin: number;
  priceIncrease: number;
  costReduction: number;
  volumeImpact: number;
  recommendations: string[];
}

export default function ProfitMarginOptimizer() {
  const [currentPrice, setCurrentPrice] = React.useState(0);
  const [currentCost, setCurrentCost] = React.useState(0);
  const [targetMargin, setTargetMargin] = React.useState(70);
  const [analysis, setAnalysis] = React.useState<ProfitAnalysis | null>(null);

  const calculateOptimization = () => {
    if (currentPrice <= 0 || currentCost <= 0) return;

    const currentMargin = ((currentPrice - currentCost) / currentPrice) * 100;
    const targetPrice = currentCost / (1 - targetMargin / 100);
    const priceIncrease = ((targetPrice - currentPrice) / currentPrice) * 100;
    const costReduction = ((currentCost - (currentPrice * (1 - targetMargin / 100))) / currentCost) * 100;

    const recommendations = [];
    if (priceIncrease > 0) {
      recommendations.push(`Increase price by ${priceIncrease.toFixed(1)}% to reach target margin`);
    }
    if (costReduction > 0) {
      recommendations.push(`Reduce costs by ${costReduction.toFixed(1)}% to reach target margin`);
    }
    if (currentMargin >= targetMargin) {
      recommendations.push("You've already achieved your target margin!");
    }

    setAnalysis({
      currentMargin,
      targetMargin,
      priceIncrease: Math.max(0, priceIncrease),
      costReduction: Math.max(0, costReduction),
      volumeImpact: priceIncrease > 0 ? Math.min(priceIncrease * 0.5, 20) : 0,
      recommendations
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-800/80 rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Profit Margin Optimizer
        </h2>
        <p className="text-slate-300 mb-8">
          Optimize your menu pricing to maximize profitability while maintaining customer satisfaction.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-slate-800/80 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Menu Item Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Current Price ($)
            </label>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Current Cost ($)
            </label>
            <input
              type="number"
              value={currentCost}
              onChange={(e) => setCurrentCost(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Target Margin (%)
            </label>
            <input
              type="number"
              value={targetMargin}
              onChange={(e) => setTargetMargin(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="70"
              min="0"
              max="100"
            />
          </div>
        </div>

        <button
          onClick={calculateOptimization}
          disabled={currentPrice <= 0 || currentCost <= 0}
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors mb-8"
        >
          Calculate Optimization
        </button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Current vs Target */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="bg-blue-900/20 p-6 rounded-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-blue-400">Current Margin</h3>
                </div>
                <p className="text-3xl font-bold text-blue-400">{analysis.currentMargin.toFixed(1)}%</p>
              </motion.div>

              <motion.div
                className="bg-green-900/20 p-6 rounded-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-green-400">Target Margin</h3>
                </div>
                <p className="text-3xl font-bold text-green-400">{analysis.targetMargin.toFixed(1)}%</p>
              </motion.div>
            </div>

            {/* Optimization Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.priceIncrease > 0 && (
                <motion.div
                  className="bg-yellow-900/20 p-4 rounded-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="font-semibold text-yellow-400 mb-2">Price Increase</h4>
                  <p className="text-2xl font-bold text-yellow-400">+{analysis.priceIncrease.toFixed(1)}%</p>
                  <p className="text-sm text-slate-400">
                    Potential volume impact: -{analysis.volumeImpact.toFixed(1)}%
                  </p>
                </motion.div>
              )}

              {analysis.costReduction > 0 && (
                <motion.div
                  className="bg-purple-900/20 p-4 rounded-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h4 className="font-semibold text-purple-400 mb-2">Cost Reduction</h4>
                  <p className="text-2xl font-bold text-purple-400">-{analysis.costReduction.toFixed(1)}%</p>
                  <p className="text-sm text-slate-400">
                    No volume impact
                  </p>
                </motion.div>
              )}
            </div>

            {/* Recommendations */}
            <motion.div
              className="bg-slate-700/50 p-6 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Recommendations
              </h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-2 text-slate-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <span className="text-green-400 mt-1">•</span>
                    {rec}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 