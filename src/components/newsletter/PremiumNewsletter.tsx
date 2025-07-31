"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  CheckCircle, 
  Star, 
  Clock, 
  Users,
  Zap,
  BookOpen
} from 'lucide-react';

interface NewsletterBenefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function PremiumNewsletter() {
  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const benefits: NewsletterBenefit[] = [
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Exclusive Content',
      description: 'Get early access to premium articles and industry insights'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Weekly Digest',
      description: 'Curated content delivered every Monday morning'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Expert Network',
      description: 'Connect with industry leaders and successful restaurateurs'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Actionable Tips',
      description: 'Practical strategies you can implement immediately'
    }
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Mail className="w-12 h-12 mx-auto mb-4" />
        </motion.div>
        
        <h3 className="text-2xl font-bold mb-2">
          Get Premium Insights
        </h3>
        <p className="text-blue-100 mb-6">
          Join 10,000+ restaurant owners getting exclusive content and strategies
        </p>
      </div>

      {!isSubscribed ? (
        <motion.form
          onSubmit={handleSubscribe}
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex gap-3 mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
              required
            />
            <motion.button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </motion.button>
          </div>
          
          <p className="text-blue-100 text-sm">
            🔒 We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.form>
      ) : (
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h4 className="text-xl font-bold mb-2">Welcome to the Community!</h4>
          <p className="text-blue-100">
            Check your email for a welcome message and your first exclusive content.
          </p>
        </motion.div>
      )}

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            className="flex items-start gap-3 p-3 bg-white/10 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <div className="text-blue-200">
              {benefit.icon}
            </div>
            <div>
              <h4 className="font-semibold mb-1">{benefit.title}</h4>
              <p className="text-blue-100 text-sm">{benefit.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Social Proof */}
      <motion.div
        className="mt-6 pt-6 border-t border-white/20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-blue-100 text-sm mb-2">
          Trusted by industry leaders
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-blue-200">
          <span>⭐ 4.9/5 rating</span>
          <span>•</span>
          <span>10,000+ subscribers</span>
          <span>•</span>
          <span>98% satisfaction</span>
        </div>
      </motion.div>
    </div>
  );
} 