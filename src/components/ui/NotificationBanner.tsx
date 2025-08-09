'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  X, 
  Bell,
  AlertTriangle
} from 'lucide-react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationBannerProps {
  type: NotificationType;
  title: string;
  message: string;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  autoDismissDelay?: number;
  className?: string;
}

export default function NotificationBanner({
  type,
  title,
  message,
  onDismiss,
  autoDismiss = false,
  autoDismissDelay = 5000,
  className = ''
}: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, autoDismissDelay);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, autoDismissDelay, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-500',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: AlertTriangle,
          iconColor: 'text-yellow-500',
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: AlertCircle,
          iconColor: 'text-red-500',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: Info,
          iconColor: 'text-blue-500',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700'
        };
    }
  };

  const styles = getTypeStyles();
  const Icon = styles.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`${styles.bg} ${styles.border} border rounded-lg p-4 ${className}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon className={`h-5 w-5 ${styles.iconColor}`} />
            </div>
            <div className="ml-3 flex-1">
              <h3 className={`text-sm font-medium ${styles.titleColor}`}>
                {title}
              </h3>
              <p className={`text-sm mt-1 ${styles.messageColor}`}>
                {message}
              </p>
            </div>
            {onDismiss && (
              <div className="ml-auto pl-3">
                <button
                  onClick={handleDismiss}
                  className={`inline-flex rounded-md p-1.5 ${styles.bg} ${styles.messageColor} hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type === 'success' ? 'green' : type === 'warning' ? 'yellow' : type === 'error' ? 'red' : 'blue'}-50`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Notification container for multiple notifications
interface NotificationContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function NotificationContainer({ children, className = '' }: NotificationContainerProps) {
  return (
    <div className={`fixed top-4 right-4 z-50 space-y-2 ${className}`}>
      {children}
    </div>
  );
}
