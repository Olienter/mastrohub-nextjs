'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Inbox, 
  Search, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  Plus,
  RefreshCw
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  className?: string;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  className = ''
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-gray-100 rounded-full">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {(action || secondaryAction) && (
        <div className="flex justify-center space-x-3">
          {action && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.onClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {action.icon && <action.icon className="w-4 h-4 mr-2" />}
              {action.label}
            </motion.button>
          )}
          
          {secondaryAction && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={secondaryAction.onClick}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {secondaryAction.icon && <secondaryAction.icon className="w-4 h-4 mr-2" />}
              {secondaryAction.label}
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Predefined empty states
export function EmptyMenuState({ onAddItem }: { onAddItem: () => void }) {
  return (
    <EmptyState
      icon={FileText}
      title="No menu items yet"
      description="Start building your menu by adding your first item. Create delicious descriptions and set perfect prices."
      action={{
        label: 'Add Menu Item',
        onClick: onAddItem,
        icon: Plus
      }}
    />
  );
}

export function EmptyUsersState({ onInviteUser }: { onInviteUser: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="No team members yet"
      description="Invite your team members to collaborate on your restaurant management."
      action={{
        label: 'Invite User',
        onClick: onInviteUser,
        icon: Plus
      }}
    />
  );
}

export function EmptyAnalyticsState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <EmptyState
      icon={BarChart3}
      title="No analytics data yet"
      description="Start using the platform to see your analytics and insights."
      action={{
        label: 'Refresh Data',
        onClick: onRefresh,
        icon: RefreshCw
      }}
    />
  );
}

export function EmptySettingsState({ onConfigure }: { onConfigure: () => void }) {
  return (
    <EmptyState
      icon={Settings}
      title="Settings not configured"
      description="Configure your restaurant settings to get the most out of the platform."
      action={{
        label: 'Configure Settings',
        onClick: onConfigure,
        icon: Settings
      }}
    />
  );
}
