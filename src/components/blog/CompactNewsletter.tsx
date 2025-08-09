"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Star, Clock, Users, Zap, Check } from 'lucide-react';

export default function CompactNewsletter() {
  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate API call
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
    setEmail('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 text-gray-900 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-5 h-5" />
        <h4 className="font-semibold text-sm">Premium Insights</h4>
      </div>
      
      <p className="text-xs text-gray-700 mb-3">
        Get exclusive strategies weekly
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="w-full px-3 py-2 rounded text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        <button
          type="submit"
          className="w-full bg-white text-purple-600 rounded py-2 text-sm font-medium hover:bg-purple-50 transition-colors"
        >
          {isSubscribed ? 'Subscribed!' : 'Subscribe'}
        </button>
      </form>
      
      <div className="mt-3 text-xs text-gray-700">
        <div className="flex items-center gap-1 mb-1">
          <Check className="w-3 h-3" />
          <span>10,000+ restaurant owners</span>
        </div>
        <div className="flex items-center gap-1">
          <Check className="w-3 h-3" />
          <span>Unsubscribe anytime</span>
        </div>
      </div>
    </motion.div>
  );
} 