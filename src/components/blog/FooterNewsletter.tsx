"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Star, Clock, Users, Zap } from 'lucide-react';

export default function FooterNewsletter() {
  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
    setEmail('');
  };

  return (
    <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Get Premium Insights</h2>
          <p className="text-slate-300">Join 10,000+ restaurant owners getting exclusive content</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Email Signup */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {isSubscribed ? 'Subscribed!' : 'Get Premium Insights'}
              </button>
            </form>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              🔒 We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
          
          {/* Benefits */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Exclusive Content</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Weekly Digest</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-sm">Expert Network</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Actionable Tips</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 