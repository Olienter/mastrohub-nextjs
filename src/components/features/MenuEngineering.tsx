'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  category: string;
  popularity: number;
  profitMargin: number;
}

const sampleMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with herbs',
    price: 28.00,
    cost: 12.00,
    category: 'Main Course',
    popularity: 0.85,
    profitMargin: 57.1
  },
  {
    id: '2',
    name: 'Beef Burger',
    description: 'Classic beef burger with fries',
    price: 18.00,
    cost: 8.50,
    category: 'Main Course',
    popularity: 0.92,
    profitMargin: 52.8
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Fresh romaine with caesar dressing',
    price: 12.00,
    cost: 4.00,
    category: 'Appetizer',
    popularity: 0.45,
    profitMargin: 66.7
  }
];

export default function MenuEngineering() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(sampleMenuItems);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const updateItemPrice = (itemId: string, newPrice: number) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, price: newPrice, profitMargin: ((newPrice - item.cost) / newPrice) * 100 }
        : item
    ));
  };

  const getPricingSuggestions = (item: MenuItem): number[] => {
    const cost = item.cost;
    return [
      Math.round((cost / 0.5) * 100) / 100, // 50% margin
      Math.round((cost / 0.6) * 100) / 100, // 40% margin
      Math.round((cost / 0.7) * 100) / 100, // 30% margin
    ];
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Menu Engineering AI</h1>
        <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
          Run AI Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Menu Items */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Menu Items</h2>
          {menuItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="bg-neutral-800/40 backdrop-blur border border-white/10 rounded-xl p-6 cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{item.name}</h3>
                <span className="text-green-400 font-bold">${item.price}</span>
              </div>
              <p className="text-white/70 mb-3">{item.description}</p>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Cost: ${item.cost}</span>
                <span className="text-white/60">Margin: {item.profitMargin.toFixed(1)}%</span>
                <span className="text-white/60">Popularity: {(item.popularity * 100).toFixed(0)}%</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Analysis */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-4">AI Insights</h2>
          
          <div className="bg-neutral-800/40 backdrop-blur border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">Recommendations</h3>
            <ul className="space-y-2">
              <li className="text-white/80 text-sm">• Consider increasing price for "Caesar Salad" to improve margin</li>
              <li className="text-white/80 text-sm">• "Beef Burger" has excellent popularity - optimize for profit</li>
              <li className="text-white/80 text-sm">• Overall profit margin is good at 58.9%</li>
            </ul>
          </div>

          <div className="bg-neutral-800/40 backdrop-blur border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">Profit Optimization</h3>
            <ul className="space-y-2">
              <li className="text-white/80 text-sm">• Beef Burger could be priced higher</li>
              <li className="text-white/80 text-sm">• Grilled Salmon has optimal pricing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Selected Item Details */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-neutral-800/40 backdrop-blur border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">AI Pricing Suggestions for {selectedItem.name}</h3>
          <div className="grid grid-cols-3 gap-4">
            {getPricingSuggestions(selectedItem).map((price, index) => (
              <button
                key={index}
                onClick={() => updateItemPrice(selectedItem.id, price)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                ${price}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}