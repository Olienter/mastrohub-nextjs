'use client';

import { Suspense } from 'react';

interface LazyComponentProps {
  component: React.ComponentType<Record<string, unknown>>;
  fallback?: React.ReactNode;
  props?: Record<string, unknown>;
}

export default function LazyComponent({ 
  component: Component, 
  fallback = <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded"></div>,
  props = {}
}: LazyComponentProps) {
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
} 