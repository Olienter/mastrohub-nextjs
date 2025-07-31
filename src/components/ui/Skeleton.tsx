import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export default function Skeleton({ className = "h-4", count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`bg-gray-200 dark:bg-slate-700 rounded animate-pulse ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        />
      ))}
    </>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
      <div className="h-48 bg-gray-200 dark:bg-slate-700 animate-pulse" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" count={2} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-2 w-16" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
} 