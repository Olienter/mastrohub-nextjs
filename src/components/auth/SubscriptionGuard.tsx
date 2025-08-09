"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  requiredTier: 'free' | 'premium';
  fallback?: React.ReactNode;
}

// Simple login prompt component
const LoginPrompt = () => (
  <div className="text-center p-8">
    <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
    <p className="text-gray-600 mb-4">You need to be logged in to access this feature.</p>
    <a href="/login" className="bg-blue-600 text-gray-900 px-4 py-2 rounded-lg hover:bg-blue-700">
      Go to Login
    </a>
  </div>
);

// Simple upgrade prompt component
const UpgradePrompt = () => (
  <div className="text-center p-8">
    <h2 className="text-xl font-semibold mb-2">Premium Feature</h2>
    <p className="text-gray-600 mb-4">This feature requires a premium subscription.</p>
    <a href="/upgrade" className="bg-green-600 text-gray-900 px-4 py-2 rounded-lg hover:bg-green-700">
      Upgrade Now
    </a>
  </div>
);

export default function SubscriptionGuard({ 
  children, 
  requiredTier, 
  fallback 
}: SubscriptionGuardProps) {
  const { user } = useAuth();
  
  if (!user) {
    return <LoginPrompt />;
  }
  
  // For now, assume all users have free tier
  const userSubscription: 'free' | 'premium' = 'free';
  
  // Check if user needs premium but doesn't have it
  if (requiredTier === 'premium' && userSubscription === 'free') {
    return fallback || <UpgradePrompt />;
  }
  
  return <>{children}</>;
} 