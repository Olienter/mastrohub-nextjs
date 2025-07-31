'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Performance monitoring logic
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`Page load time: ${endTime - startTime}ms`);
    };
  }, []);

  return null;
} 