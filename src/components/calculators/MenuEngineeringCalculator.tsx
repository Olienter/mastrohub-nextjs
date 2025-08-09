"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Target, Star, AlertCircle } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  cost: number;
  popularity: number; // 1-10 scale
  category: string;
}

interface MenuAnalysis {
  stars: MenuItem[];
  cashCows: MenuItem[];
  puzzles: MenuItem[];
  dogs: MenuItem[];
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;
  recommendations: string[];
}

export default function MenuEngineeringCalculator() {
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
  const [analysis, setAnalysis] = React.useState<MenuAnalysis | null>(null);
  const [isCalculating, setIsCalculating] = React.useState(false);

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      cost: 0,
      popularity: 5,
      category: 'Main Course'
    };
    setMenuItems([...menuItems, newItem]);
  };

  const updateMenuItem = (id: string, field: keyof MenuItem, value: any) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const calculateMenu = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      const items = menuItems.filter(item => item.name && item.price > 0);
      
      if (items.length === 0) {
        setIsCalculating(false);
        return;
      }

      // Calculate profit margins and popularity scores
      const itemsWithMetrics = items.map(item => ({
        ...item,
        profitMargin: ((item.price - item.cost) / item.price) * 100,
        profitScore: ((item.price - item.cost) / item.price) * item.popularity
      }));

      // Categorize items
      const stars = itemsWithMetrics.filter(item => 
        item.profitMargin > 60 && item.popularity >= 7
      );
      const cashCows = itemsWithMetrics.filter(item => 
        item.profitMargin > 60 && item.popularity < 7
      );
      const puzzles = itemsWithMetrics.filter(item => 
        item.profitMargin <= 60 && item.popularity >= 7
      );
      const dogs = itemsWithMetrics.filter(item => 
        item.profitMargin <= 60 && item.popularity < 7
      );

      const totalRevenue = items.reduce((sum, item) => sum + item.price, 0);
      const totalProfit = items.reduce((sum, item) => sum + (item.price - item.cost), 0);
      const profitMargin = (totalProfit / totalRevenue) * 100;

      const recommendations = [];
      if (stars.length > 0) recommendations.push("Promote your star items in prime menu positions");
      if (cashCows.length > 0) recommendations.push("Improve descriptions and presentation for cash cow items");
      if (puzzles.length > 0) recommendations.push("Optimize costs for popular but low-margin items");
      if (dogs.length > 0) recommendations.push("Consider removing or redesigning low-performing items");

      setAnalysis({
        stars,
        cashCows,
        puzzles,
        dogs,
        totalRevenue,
        totalProfit,
        profitMargin,
        recommendations
      });
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Menu Engineering Calculator
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Analyze your menu items and optimize for maximum profitability
        </p>
      </div>

      {/* Input Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Menu Items
          </h3>
          <motion.button
            onClick={addMenuItem}
            className="px-4 py-2 bg-blue-600 text-gray-900 rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Item
          </motion.button>
        </div>

        <AnimatePresence>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg mb-4"
            >
              <input
                type="text"
                placeholder="Item name"
                value={item.name}
                onChange={(e) => updateMenuItem(item.id, 'name', e.target.value)}
                className="md:col-span-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => updateMenuItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Cost"
                value={item.cost}
                onChange={(e) => updateMenuItem(item.id, 'cost', parseFloat(e.target.value) || 0)}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={item.popularity}
                onChange={(e) => updateMenuItem(item.id, 'popularity', parseInt(e.target.value))}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <option key={num} value={num}>{num}/10 Popularity</option>
                ))}
              </select>
              <button
                onClick={() => removeMenuItem(item.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded"
              >
                Remove
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.button
          onClick={calculateMenu}
          disabled={menuItems.length === 0 || isCalculating}
          className="w-full py-3 bg-green-600 text-gray-900 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          whileHover={{ scale: isCalculating ? 1 : 1.02 }}
          whileTap={{ scale: isCalculating ? 1 : 0.98 }}
        >
          {isCalculating ? 'Calculating...' : 'Analyze Menu'}
        </motion.button>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div
                className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-600">Stars</span>
                </div>
                <p className="text-2xl font-bold">{analysis.stars.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">High profit, high popularity</p>
              </motion.div>

              <motion.div
                className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-600">Cash Cows</span>
                </div>
                <p className="text-2xl font-bold">{analysis.cashCows.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">High profit, low popularity</p>
              </motion.div>

              <motion.div
                className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-600">Puzzles</span>
                </div>
                <p className="text-2xl font-bold">{analysis.puzzles.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Low profit, high popularity</p>
              </motion.div>

              <motion.div
                className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-600">Dogs</span>
                </div>
                <p className="text-2xl font-bold">{analysis.dogs.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Low profit, low popularity</p>
              </motion.div>
            </div>

            {/* Financial Summary */}
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-gray-900 p-6 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-4">Financial Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-700">Total Revenue</p>
                  <p className="text-2xl font-bold">${analysis.totalRevenue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-700">Total Profit</p>
                  <p className="text-2xl font-bold">${analysis.totalProfit.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-700">Profit Margin</p>
                  <p className="text-2xl font-bold">{analysis.profitMargin.toFixed(1)}%</p>
                </div>
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              className="bg-gray-50 p-6 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Recommendations
              </h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-2 text-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <span className="text-blue-600 mt-1">•</span>
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