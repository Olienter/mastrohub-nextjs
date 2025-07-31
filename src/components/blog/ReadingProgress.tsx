'use client';

import { useState, useEffect, useCallback } from 'react';

export default function ReadingProgress() {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    const newProgress = Math.min(scrollPercent, 100);
    
    setReadingProgress(newProgress);
    setIsVisible(scrollTop > 100);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, [updateProgress]);

  // Track reading progress for analytics
  useEffect(() => {
    if (readingProgress > 0 && readingProgress % 25 === 0) {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'reading_progress', {
          event_category: 'engagement',
          event_label: `${readingProgress}%`,
          value: Math.floor(readingProgress)
        });
      }
    }
  }, [readingProgress]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-slate-700 z-50"
      role="progressbar"
      aria-valuenow={readingProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div 
        className="h-full bg-blue-600 transition-all duration-150 ease-out"
        style={{ width: `${readingProgress}%` }}
      />
    </div>
  );
} 