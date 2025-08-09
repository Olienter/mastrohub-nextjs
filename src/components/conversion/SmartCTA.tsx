"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  Target, 
  Calendar, 
  Download, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react';

interface CTAConfig {
  id: string;
  title: string;
  subtitle: string;
  action: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  badge?: string;
  features?: string[];
}

export default function SmartCTA() {
  const [selectedCTA, setSelectedCTA] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const ctaConfigs: CTAConfig[] = [
    {
      id: 'menu-analysis',
      title: 'Get Your Free Menu Analysis',
      subtitle: 'Discover how much revenue you\'re leaving on the table',
      action: 'Analyze My Menu',
      icon: <Calculator className="w-6 h-6" />,
      color: 'blue',
      gradient: 'from-blue-600 to-purple-600',
      badge: 'Most Popular',
      features: [
        '45% average revenue increase',
        'Data-driven recommendations',
        'Free 30-minute consultation',
        'Custom pricing strategies'
      ]
    },
    {
      id: 'revenue-calculator',
      title: 'Calculate Your Potential Revenue',
      subtitle: 'See exactly how much you could earn with our strategies',
      action: 'Calculate Now',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'green',
      gradient: 'from-green-600 to-teal-600',
      features: [
        'Personalized revenue projections',
        'Cost optimization insights',
        'Market analysis included',
        'Action plan delivered'
      ]
    },
    {
      id: 'consultation',
      title: 'Book Free Consultation',
      subtitle: 'Get personalized advice from restaurant experts',
      action: 'Book Now',
      icon: <Calendar className="w-6 h-6" />,
      color: 'purple',
      gradient: 'from-purple-600 to-pink-600',
      badge: 'Limited Time',
      features: [
        '30-minute free session',
        'Expert restaurant consultant',
        'Custom action plan',
        'Follow-up support'
      ]
    }
  ];

  // Auto-rotate CTAs
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSelectedCTA((prev) => (prev + 1) % ctaConfigs.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ctaConfigs.length]);

  const currentCTA = ctaConfigs[selectedCTA];

  const handleCTAClick = (ctaId: string) => {
    // Track CTA click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cta_click', {
        event_category: 'Conversion',
        event_label: ctaId,
        value: 1
      });
    }

    // Simulate form submission
    console.log(`CTA clicked: ${ctaId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        className={`bg-gradient-to-r ${currentCTA.gradient} rounded-2xl shadow-2xl overflow-hidden`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="p-8 text-white">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-3 bg-slate-700/20 rounded-xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {currentCTA.icon}
              </motion.div>
              <div>
                {currentCTA.badge && (
                  <motion.span
                    className="inline-block px-3 py-1 bg-slate-700/20 rounded-full text-xs font-semibold mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentCTA.badge}
                  </motion.span>
                )}
                <h2 className="text-3xl font-bold mb-2">{currentCTA.title}</h2>
                <p className="text-lg text-white/90">{currentCTA.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {currentCTA.features?.map((feature, index) => (
              <motion.div
                key={feature}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-white/90">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={() => handleCTAClick(currentCTA.id)}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-700/50 text-white font-semibold rounded-xl hover:bg-slate-700/70 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{currentCTA.action}</span>
            <motion.div
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.button>

          {/* Trust Indicators */}
          <motion.div
            className="mt-6 flex items-center gap-6 text-white/80 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-300" />
              <span>4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Users icon was removed from imports, so this will cause an error */}
              {/* <Users className="w-4 h-4" /> */}
              <span>10,000+ restaurants helped</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span>100% free</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {ctaConfigs.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setSelectedCTA(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === selectedCTA 
                ? 'bg-blue-600' 
                : 'bg-slate-600 dark:bg-slate-600'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>
    </div>
  );
} 