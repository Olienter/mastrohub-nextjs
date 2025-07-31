"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Gauge, 
  Zap, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  fcp: number; // First Contentful Paint
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    fcp: 0
  });

  const [isMonitoring, setIsMonitoring] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
          }
          if (entry.entryType === 'first-input') {
            setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }));
          }
          if (entry.entryType === 'layout-shift') {
            setMetrics(prev => ({ ...prev, cls: prev.cls + (entry as any).value }));
          }
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

      // Measure TTFB
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        setMetrics(prev => ({ ...prev, ttfb: navigationEntry.responseStart - navigationEntry.requestStart }));
      }

      // Measure FCP
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
      }

      setIsMonitoring(true);

      return () => observer.disconnect();
    }
  }, []);

  const getScore = (value: number, thresholds: { good: number; needsImprovement: number }) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.needsImprovement) return 'needs-improvement';
    return 'poor';
  };

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getScoreIcon = (score: string) => {
    switch (score) {
      case 'good': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'needs-improvement': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'poor': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Performance Monitor
        </h2>
        <div className="flex items-center space-x-2">
          {isMonitoring && (
            <div className="flex items-center space-x-1 text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-sm">Monitoring</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* LCP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">LCP</span>
            {getScoreIcon(getScore(metrics.lcp, { good: 2500, needsImprovement: 4000 }))}
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.lcp > 0 ? `${Math.round(metrics.lcp)}ms` : '--'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Largest Contentful Paint
          </div>
        </motion.div>

        {/* FID */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">FID</span>
            {getScoreIcon(getScore(metrics.fid, { good: 100, needsImprovement: 300 }))}
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.fid > 0 ? `${Math.round(metrics.fid)}ms` : '--'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            First Input Delay
          </div>
        </motion.div>

        {/* CLS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">CLS</span>
            {getScoreIcon(getScore(metrics.cls, { good: 0.1, needsImprovement: 0.25 }))}
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.cls > 0 ? metrics.cls.toFixed(3) : '--'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Cumulative Layout Shift
          </div>
        </motion.div>
      </div>
    </div>
  );
} 