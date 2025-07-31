"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Award, 
  Users, 
  Globe,
  CheckCircle,
  Star
} from 'lucide-react';

interface TrustBadge {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
}

export default function TrustBadges() {
  const badges: TrustBadge[] = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Trusted by 10,000+',
      subtitle: 'Restaurant owners worldwide',
      color: 'blue'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Featured in Forbes',
      subtitle: 'Industry recognition',
      color: 'green'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: '98% Satisfaction',
      subtitle: 'Customer success rate',
      color: 'purple'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'ISO 27001 Certified',
      subtitle: 'Data security standards',
      color: 'orange'
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Trusted by Industry Leaders
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Join thousands of successful restaurant owners
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 text-white bg-gradient-to-r ${
                  badge.color === 'blue' ? 'from-blue-600 to-blue-700' :
                  badge.color === 'green' ? 'from-green-600 to-green-700' :
                  badge.color === 'purple' ? 'from-purple-600 to-purple-700' :
                  'from-orange-600 to-orange-700'
                }`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                {badge.icon}
              </motion.div>
              
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {badge.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {badge.subtitle}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">4.9/5</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">15+ Years</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Industry Experience</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">50+ Countries</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Global Reach</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 