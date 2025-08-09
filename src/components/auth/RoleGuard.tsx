'use client';

import React from 'react';
import { UserRole, checkPermission, canAccessFeature } from '@/lib/rbac';

interface RoleGuardProps {
  children: React.ReactNode;
  userRole: UserRole;
  resource?: string;
  action?: string;
  feature?: string;
  fallback?: React.ReactNode;
}

export default function RoleGuard({
  children,
  userRole,
  resource,
  action,
  feature,
  fallback = null
}: RoleGuardProps) {
  let hasAccess = false;

  if (feature) {
    hasAccess = canAccessFeature(userRole, feature);
  } else if (resource && action) {
    hasAccess = checkPermission(userRole, resource, action);
  } else {
    // If no specific permission is required, allow access
    hasAccess = true;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Higher-order component for role-based access
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  userRole: UserRole,
  resource?: string,
  action?: string,
  feature?: string
) {
  return function RoleGuardedComponent(props: P) {
    return (
      <RoleGuard userRole={userRole} resource={resource} action={action} feature={feature}>
        <Component {...props} />
      </RoleGuard>
    );
  };
}

// Hook for checking permissions
export function useRoleGuard(userRole: UserRole) {
  const checkPermissionHelper = (resource: string, action: string) => {
    return checkPermission(userRole, resource, action);
  };

  const canAccessFeatureHelper = (feature: string) => {
    return canAccessFeature(userRole, feature);
  };

  return {
    checkPermission: checkPermissionHelper,
    canAccessFeature: canAccessFeatureHelper
  };
}
