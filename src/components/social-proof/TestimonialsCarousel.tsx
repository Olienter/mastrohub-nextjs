"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Quote, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  result: string;
  featured: boolean;
}

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'Restaurant Owner',
      company: 'The Golden Dragon',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: 'MastroHub\'s menu engineering strategies increased our revenue by 47% in just 3 months. The data-driven approach completely transformed how we think about pricing and presentation.',
      rating: 5,
      result: '47% revenue increase in 3 months',
      featured: true
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      title: 'Executive Chef',
      company: 'Bistro Moderno',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'The cost management insights helped us reduce food waste by 35% while maintaining quality. Our profit margins have never been better.',
      rating: 5,
      result: '35% reduction in food waste',
      featured: true
    },
    {
      id: '3',
      name: 'Emma Thompson',
      title: 'Operations Manager',
      company: 'Café Central',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'The AI technology recommendations saved us thousands in operational costs. The implementation was smooth and the results were immediate.',
      rating: 5,
      result: '$15K saved in operational costs',
      featured: false
    },
    {
      id: '4',
      name: 'David Kim',
      title: 'Franchise Owner',
      company: 'Quick Bites Chain',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: 'As a multi-location owner, the scalability insights were invaluable. We\'ve implemented these strategies across all 12 locations with consistent results.',
      rating: 5,
      result: '12 locations optimized',
      featured: true
    }
  ];

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Trusted by Industry Leaders
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          See how restaurant owners are transforming their businesses
        </p>
      </div>

      <div className="relative">
        {/* Navigation Buttons */}
        <motion.button
          onClick={prevTestimonial}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>

        <motion.button
          onClick={nextTestimonial}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>

        {/* Testimonial Card */}
        <div className="relative h-96">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 h-full">
                {/* Featured Badge */}
                {currentTestimonial.featured && (
                  <motion.div
                    className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Featured Success Story
                  </motion.div>
                )}

                {/* Quote Icon */}
                <div className="flex justify-center mb-6">
                  <Quote className="w-8 h-8 text-blue-600" />
                </div>

                {/* Content */}
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{currentTestimonial.content}"
                </p>

                {/* Result Highlight */}
                <motion.div
                  className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700 dark:text-green-400">
                      Key Result:
                    </span>
                  </div>
                  <p className="text-green-800 dark:text-green-300 font-medium">
                    {currentTestimonial.result}
                  </p>
                </motion.div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {currentTestimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentTestimonial.title} at {currentTestimonial.company}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300 dark:bg-slate-600'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 