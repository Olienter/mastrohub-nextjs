export type UserRole = 'owner' | 'manager' | 'staff' | 'viewer';

export interface Permission {
  resource: string;
  action: string;
  description: string;
}

export interface Role {
  id: UserRole;
  name: string;
  description: string;
  permissions: Permission[];
}

export const ROLES: Record<UserRole, Role> = {
  owner: {
    id: 'owner',
    name: 'Owner',
    description: 'Full access to all features and settings',
    permissions: [
      { resource: 'dashboard', action: 'read', description: 'View dashboard' },
      { resource: 'dashboard', action: 'write', description: 'Edit dashboard' },
      { resource: 'menu-maker', action: 'read', description: 'View menu maker' },
      { resource: 'menu-maker', action: 'write', description: 'Edit menu maker' },
      { resource: 'marketing', action: 'read', description: 'View marketing tools' },
      { resource: 'marketing', action: 'write', description: 'Edit marketing tools' },
      { resource: 'training', action: 'read', description: 'View training materials' },
      { resource: 'training', action: 'write', description: 'Edit training materials' },
      { resource: 'analytics', action: 'read', description: 'View analytics' },
      { resource: 'analytics', action: 'write', description: 'Edit analytics' },
      { resource: 'ai-assistant', action: 'read', description: 'View AI assistant' },
      { resource: 'ai-assistant', action: 'write', description: 'Use AI assistant' },
      { resource: 'advanced-analytics', action: 'read', description: 'View advanced analytics' },
      { resource: 'advanced-analytics', action: 'write', description: 'Edit advanced analytics' },
      { resource: 'supply-chain', action: 'read', description: 'View supply chain' },
      { resource: 'supply-chain', action: 'write', description: 'Edit supply chain' },
      { resource: 'notifications', action: 'read', description: 'View notifications' },
      { resource: 'notifications', action: 'create', description: 'Create notifications' },
      { resource: 'notifications', action: 'update', description: 'Update notification settings' },
      { resource: 'mobile-app', action: 'read', description: 'Access mobile app' },
      { resource: 'mobile-app', action: 'write', description: 'Use mobile app features' },
      { resource: 'pwa', action: 'read', description: 'Access PWA features' },
      { resource: 'pwa', action: 'write', description: 'Use PWA features' },
      { resource: 'offline-mode', action: 'read', description: 'Access offline mode' },
      { resource: 'offline-mode', action: 'write', description: 'Use offline features' },
      { resource: 'push-notifications', action: 'read', description: 'View push notifications' },
      { resource: 'push-notifications', action: 'write', description: 'Manage push notifications' },
      { resource: 'security-compliance', action: 'read', description: 'View security and compliance' },
      { resource: 'security-compliance', action: 'write', description: 'Manage security and compliance' },
      { resource: 'users', action: 'read', description: 'View users' },
      { resource: 'users', action: 'write', description: 'Edit users' },
      { resource: 'settings', action: 'read', description: 'View settings' },
      { resource: 'settings', action: 'write', description: 'Edit settings' },
      { resource: 'api-gateway', action: 'view', description: 'View API Gateway dashboard and status' },
      { resource: 'api-gateway', action: 'manage', description: 'Manage integrations, webhooks, and rate limits' },
      { resource: 'api-gateway', action: 'test', description: 'Test integrations and webhooks' },
      { resource: 'enterprise', action: 'view', description: 'View enterprise features' },
      { resource: 'enterprise', action: 'manage', description: 'Manage enterprise features' },
      { resource: 'enterprise', action: 'tenant', description: 'Manage tenants' },
      { resource: 'enterprise', action: 'audit', description: 'View audit logs' },
      { resource: 'enterprise', action: 'compliance', description: 'Generate compliance reports' },
      { resource: 'enterprise', action: 'analytics', description: 'View enterprise analytics' },
      { resource: 'enterprise', action: 'subscriptions', description: 'Manage subscriptions' },
      { resource: 'enterprise', action: 'white-label', description: 'Manage white label' },
      { resource: 'enterprise', action: 'billing', description: 'Manage billing' },
      { resource: 'testing', action: 'view', description: 'View testing dashboard and results' },
      { resource: 'testing', action: 'run', description: 'Run tests and generate reports' },
      { resource: 'testing', action: 'manage', description: 'Manage test configurations and settings' },
      { resource: 'quality', action: 'view', description: 'View quality assurance dashboard' },
      { resource: 'quality', action: 'analyze', description: 'Analyze code quality and security' },
      { resource: 'quality', action: 'manage', description: 'Manage quality settings and thresholds' },
      { resource: 'quality', action: 'review', description: 'Perform automated code reviews' },
      { resource: 'quality', action: 'security', description: 'Access security scanning features' }
    ]
  },
  manager: {
    id: 'manager',
    name: 'Manager',
    description: 'Access to most features with some restrictions',
    permissions: [
      { resource: 'dashboard', action: 'read', description: 'View dashboard' },
      { resource: 'menu-maker', action: 'read', description: 'View menu maker' },
      { resource: 'menu-maker', action: 'write', description: 'Edit menu maker' },
      { resource: 'marketing', action: 'read', description: 'View marketing tools' },
      { resource: 'marketing', action: 'write', description: 'Edit marketing tools' },
      { resource: 'training', action: 'read', description: 'View training materials' },
      { resource: 'analytics', action: 'read', description: 'View analytics' },
      { resource: 'ai-assistant', action: 'read', description: 'View AI assistant' },
      { resource: 'ai-assistant', action: 'write', description: 'Use AI assistant' },
      { resource: 'advanced-analytics', action: 'read', description: 'View advanced analytics' },
      { resource: 'supply-chain', action: 'read', description: 'View supply chain' },
      { resource: 'supply-chain', action: 'write', description: 'Edit supply chain' },
      { resource: 'notifications', action: 'read', description: 'View notifications' },
      { resource: 'mobile-app', action: 'read', description: 'Access mobile app' },
      { resource: 'mobile-app', action: 'write', description: 'Use mobile app features' },
      { resource: 'pwa', action: 'read', description: 'Access PWA features' },
      { resource: 'offline-mode', action: 'read', description: 'Access offline mode' },
      { resource: 'push-notifications', action: 'read', description: 'View push notifications' },
      { resource: 'security-compliance', action: 'read', description: 'View security and compliance' },
      { resource: 'security-compliance', action: 'write', description: 'Manage security and compliance' },
      { resource: 'users', action: 'read', description: 'View users' },
      { resource: 'settings', action: 'read', description: 'View settings' },
      { resource: 'api-gateway', action: 'view', description: 'View API Gateway dashboard and status' },
      { resource: 'api-gateway', action: 'manage', description: 'Manage integrations, webhooks, and rate limits' },
      { resource: 'api-gateway', action: 'test', description: 'Test integrations and webhooks' },
      { resource: 'testing', action: 'view', description: 'View testing dashboard and results' },
      { resource: 'testing', action: 'run', description: 'Run tests and generate reports' },
      { resource: 'quality', action: 'view', description: 'View quality assurance dashboard' },
      { resource: 'quality', action: 'analyze', description: 'Analyze code quality and security' },
      { resource: 'quality', action: 'review', description: 'Perform automated code reviews' }
    ]
  },
  staff: {
    id: 'staff',
    name: 'Staff',
    description: 'Limited access to core features',
    permissions: [
      { resource: 'dashboard', action: 'read', description: 'View dashboard' },
      { resource: 'menu-maker', action: 'read', description: 'View menu maker' },
      { resource: 'training', action: 'read', description: 'View training materials' },
      { resource: 'analytics', action: 'read', description: 'View analytics' },
      { resource: 'ai-assistant', action: 'read', description: 'View AI assistant' },
      { resource: 'supply-chain', action: 'read', description: 'View supply chain' },
      { resource: 'notifications', action: 'read', description: 'View notifications' },
      { resource: 'mobile-app', action: 'read', description: 'Access mobile app' },
      { resource: 'pwa', action: 'read', description: 'Access PWA features' },
      { resource: 'offline-mode', action: 'read', description: 'Access offline mode' },
      { resource: 'push-notifications', action: 'read', description: 'View push notifications' },
      { resource: 'api-gateway', action: 'view', description: 'View API Gateway dashboard and status' },
      { resource: 'api-gateway', action: 'manage', description: 'Manage integrations, webhooks, and rate limits' },
      { resource: 'api-gateway', action: 'test', description: 'Test integrations and webhooks' },
      { resource: 'testing', action: 'view', description: 'View testing dashboard and results' },
      { resource: 'quality', action: 'view', description: 'View quality assurance dashboard' }
    ]
  },
  viewer: {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to basic features',
    permissions: [
      { resource: 'dashboard', action: 'read', description: 'View dashboard' },
      { resource: 'menu-maker', action: 'read', description: 'View menu maker' },
      { resource: 'training', action: 'read', description: 'View training materials' },
      { resource: 'analytics', action: 'read', description: 'View analytics' },
      { resource: 'ai-assistant', action: 'read', description: 'View AI assistant' },
      { resource: 'supply-chain', action: 'read', description: 'View supply chain' },
      { resource: 'notifications', action: 'read', description: 'View notifications' },
      { resource: 'mobile-app', action: 'read', description: 'Access mobile app' },
      { resource: 'pwa', action: 'read', description: 'Access PWA features' },
      { resource: 'offline-mode', action: 'read', description: 'Access offline mode' },
      { resource: 'push-notifications', action: 'read', description: 'View push notifications' },
      { resource: 'api-gateway', action: 'view', description: 'View API Gateway dashboard and status' },
      { resource: 'api-gateway', action: 'manage', description: 'Manage integrations, webhooks, and rate limits' },
      { resource: 'api-gateway', action: 'test', description: 'Test integrations and webhooks' },
      { resource: 'testing', action: 'view', description: 'View testing dashboard and results' },
      { resource: 'quality', action: 'view', description: 'View quality assurance dashboard' }
    ]
  }
};

export class RBAC {
  private userRole: UserRole;
  private userPermissions: Permission[];

  constructor(userRole: UserRole) {
    this.userRole = userRole;
    this.userPermissions = ROLES[userRole]?.permissions || [];
  }

  hasPermission(resource: string, action: string): boolean {
    return this.userPermissions.some(
      permission => permission.resource === resource && permission.action === action
    );
  }

  hasAnyPermission(resource: string, actions: string[]): boolean {
    return actions.some(action => this.hasPermission(resource, action));
  }

  hasAllPermissions(resource: string, actions: string[]): boolean {
    return actions.every(action => this.hasPermission(resource, action));
  }

  getRole(): Role {
    return ROLES[this.userRole];
  }

  getPermissions(): Permission[] {
    return this.userPermissions;
  }

  canAccessFeature(feature: string): boolean {
    const featurePermissions: Record<string, Permission[]> = {
      'dashboard': [
        { resource: 'dashboard', action: 'read', description: 'Access dashboard' }
      ],
      'menu-maker': [
        { resource: 'menu-maker', action: 'read', description: 'Access menu maker' }
      ],
      'marketing': [
        { resource: 'marketing', action: 'read', description: 'Access marketing tools' }
      ],
      'training': [
        { resource: 'training', action: 'read', description: 'Access training materials' }
      ],
      'analytics': [
        { resource: 'analytics', action: 'read', description: 'Access analytics' }
      ],
      'ai-assistant': [
        { resource: 'ai-assistant', action: 'read', description: 'Access AI assistant' }
      ],
      'advanced-analytics': [
        { resource: 'advanced-analytics', action: 'read', description: 'Access advanced analytics' }
      ],
      'supply-chain': [
        { resource: 'supply-chain', action: 'read', description: 'Access supply chain' }
      ],
      'notifications': [
        { resource: 'notifications', action: 'read', description: 'Access notifications' }
      ],
      'mobile-app': [
        { resource: 'mobile-app', action: 'read', description: 'Access mobile app' }
      ],
      'pwa': [
        { resource: 'pwa', action: 'read', description: 'Access PWA features' }
      ],
      'offline-mode': [
        { resource: 'offline-mode', action: 'read', description: 'Access offline mode' }
      ],
      'push-notifications': [
        { resource: 'push-notifications', action: 'read', description: 'Access push notifications' }
      ],
      'security-compliance': [
        { resource: 'security-compliance', action: 'read', description: 'Access security and compliance' }
      ],
      'users': [
        { resource: 'users', action: 'read', description: 'Access user management' }
      ],
      'settings': [
        { resource: 'settings', action: 'read', description: 'Access settings' }
      ],
      'api-gateway': [
        {
          resource: 'api-gateway',
          action: 'view',
          description: 'View API Gateway dashboard and status'
        },
        {
          resource: 'api-gateway',
          action: 'manage',
          description: 'Manage integrations, webhooks, and rate limits'
        },
        {
          resource: 'api-gateway',
          action: 'test',
          description: 'Test integrations and webhooks'
        }
      ],
      'performance': [
        {
          resource: 'performance',
          action: 'view',
          description: 'View performance metrics and cache analytics'
        },
        {
          resource: 'performance',
          action: 'manage',
          description: 'Manage cache operations and performance optimizations'
        },
        {
          resource: 'performance',
          action: 'optimize',
          description: 'Execute performance optimizations and cache management'
        }
      ],
      'advanced-ai': [
        {
          resource: 'advanced-ai',
          action: 'view',
          description: 'View AI insights and predictions'
        },
        {
          resource: 'advanced-ai',
          action: 'analyze',
          description: 'Run AI analysis and generate insights'
        },
        {
          resource: 'advanced-ai',
          action: 'optimize',
          description: 'Execute AI-powered optimizations'
        }
      ],
      'enterprise': [
        {
          resource: 'enterprise',
          action: 'view',
          description: 'View enterprise features and analytics'
        },
        {
          resource: 'enterprise',
          action: 'manage',
          description: 'Manage enterprise features and settings'
        },
        {
          resource: 'enterprise',
          action: 'tenant',
          description: 'Manage tenant configurations'
        },
        {
          resource: 'enterprise',
          action: 'audit',
          description: 'View and manage audit logs'
        },
        {
          resource: 'enterprise',
          action: 'compliance',
          description: 'Generate compliance reports'
        },
        {
          resource: 'enterprise',
          action: 'analytics',
          description: 'View enterprise analytics'
        },
        {
          resource: 'enterprise',
          action: 'subscriptions',
          description: 'Manage subscription plans'
        },
        {
          resource: 'enterprise',
          action: 'white-label',
          description: 'Manage white label configurations'
        },
        {
          resource: 'enterprise',
          action: 'billing',
          description: 'Manage billing and payments'
        }
      ],
      'testing': [
        {
          resource: 'testing',
          action: 'view',
          description: 'View testing dashboard and results'
        },
        {
          resource: 'testing',
          action: 'run',
          description: 'Run tests and generate reports'
        },
        {
          resource: 'testing',
          action: 'manage',
          description: 'Manage test configurations and settings'
        }
      ],
      'quality': [
        {
          resource: 'quality',
          action: 'view',
          description: 'View quality assurance dashboard'
        },
        {
          resource: 'quality',
          action: 'analyze',
          description: 'Analyze code quality and security'
        },
        {
          resource: 'quality',
          action: 'manage',
          description: 'Manage quality settings and thresholds'
        },
        {
          resource: 'quality',
          action: 'review',
          description: 'Perform automated code reviews'
        },
        {
          resource: 'quality',
          action: 'security',
          description: 'Access security scanning features'
        }
      ]
    };

    const permission = featurePermissions[feature];
    return permission ? this.hasAnyPermission(permission[0].resource, permission.map(p => p.action)) : false;
  }

  getAccessibleFeatures(): string[] {
    const allFeatures = [
      'dashboard',
      'menu-maker',
      'marketing',
      'training',
      'analytics',
      'ai-assistant',
      'advanced-analytics',
      'supply-chain',
      'notifications',
      'mobile-app',
      'pwa',
      'offline-mode',
      'push-notifications',
      'security-compliance',
      'users',
      'settings',
      'api-gateway',
      'performance',
      'advanced-ai',
      'enterprise',
      'testing',
      'quality'
    ];

    return allFeatures.filter(feature => this.canAccessFeature(feature));
  }
}

// Helper function to create RBAC instance
export function createRBAC(userRole: UserRole): RBAC {
  return new RBAC(userRole);
}

// Permission check helper
export function checkPermission(userRole: UserRole, resource: string, action: string): boolean {
  const rbac = createRBAC(userRole);
  return rbac.hasPermission(resource, action);
}

// Feature access check helper
export function canAccessFeature(userRole: UserRole, feature: string): boolean {
  const rbac = createRBAC(userRole);
  return rbac.canAccessFeature(feature);
}
