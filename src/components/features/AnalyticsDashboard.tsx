'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnalyticsData {
  revenue: number;
  orders: number;
  avgOrderValue: number;
  profitMargin: number;
  wastePercentage: number;
  customerSatisfaction: number;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>({
    revenue: 0,
    orders: 0,
    avgOrderValue: 0,
    profitMargin: 0,
    wastePercentage: 0,
    customerSatisfaction: 0
  });

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setData({
        revenue: Math.random() * 10000 + 5000,
        orders: Math.floor(Math.random() * 100) + 50,
        avgOrderValue: Math.random() * 50 + 25,
        profitMargin: Math.random() * 30 + 60,
        wastePercentage: Math.random() * 10 + 5,
        customerSatisfaction: Math.random() * 20 + 80
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      label: 'Revenue',
      value: `$${data.revenue.toFixed(0)}`,
      change: '+12.5%',
      color: 'text-green-400'
    },
    {
      label: 'Orders',
      value: data.orders,
      change: '+8.2%',
      color: 'text-blue-400'
    },
    {
      label: 'Avg Order',
      value: `$${data.avgOrderValue.toFixed(2)}`,
      change: '+5.1%',
      color: 'text-purple-400'
    },
    {
      label: 'Profit Margin',
      value: `${data.profitMargin.toFixed(1)}%`,
      change: '+2.3%',
      color: 'text-yellow-400'
    },
    {
      label: 'Waste %',
      value: `${data.wastePercentage.toFixed(1)}%`,
      change: '-1.8%',
      color: 'text-red-400'
    },
    {
      label: 'Satisfaction',
      value: `${data.customerSatisfaction.toFixed(1)}%`,
      change: '+3.2%',
      color: 'text-cyan-400'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-neutral-800/40 backdrop-blur border border-white/10 rounded-xl p-6"
          >
            <h3 className="text-white/60 text-sm mb-2">{metric.label}</h3>
            <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            <p className="text-green-400 text-sm mt-1">{metric.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-neutral-800/40 backdrop-blur border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Revenue Trend</h3>
          <div className="h-64 bg-neutral-700/30 rounded-lg flex items-center justify-center">
            <p className="text-white/60">Chart Component</p>
          </div>
        </div>

        <div className="bg-neutral-800/40 backdrop-blur border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Popular Items</h3>
          <div className="space-y-3">
            {['Grilled Salmon', 'Beef Burger', 'Caesar Salad'].map((item, index) => (
              <div key={item} className="flex justify-between items-center">
                <span className="text-white">{item}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-neutral-700 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full" 
                      style={{ width: `${85 - index * 20}%` }}
                    />
                  </div>
                  <span className="text-white/60 text-sm">{85 - index * 20}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 