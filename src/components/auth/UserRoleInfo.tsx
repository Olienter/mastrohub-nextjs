'use client';

import React from 'react';
import { UserRole, ROLES, createRBAC } from '@/lib/rbac';
import { Shield, User, CheckCircle, XCircle } from 'lucide-react';

interface UserRoleInfoProps {
  userRole: UserRole;
  className?: string;
}

export default function UserRoleInfo({ userRole, className = '' }: UserRoleInfoProps) {
  const rbac = createRBAC(userRole);
  const role = rbac.getRole();
  const accessibleFeatures = rbac.getAccessibleFeatures();

  const allFeatures = [
    { id: 'menu-maker', name: 'Menu Maker', description: 'Create and manage menu items' },
    { id: 'qr-menu', name: 'QR Menu', description: 'Generate and manage QR codes' },
    { id: 'analytics', name: 'Analytics', description: 'View business analytics' },
    { id: 'marketing', name: 'Marketing', description: 'Manage marketing campaigns' },
    { id: 'forecast', name: 'Forecast', description: 'View business forecasts' },
    { id: 'training', name: 'Training', description: 'Access training materials' },
    { id: 'workspace-settings', name: 'Settings', description: 'Manage workspace settings' },
    { id: 'user-management', name: 'User Management', description: 'Manage team members' }
  ];

  return (
    <div className={`bg-slate-800/80 rounded-lg shadow-sm border border-slate-700/50 p-4 ${className}`}>
      <div className="flex items-center mb-3">
        <Shield className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-sm font-semibold text-white">Your Role: {role.name}</h3>
      </div>
      
      <p className="text-xs text-slate-300 mb-3">{role.description}</p>
      
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-slate-300 mb-2">Accessible Features:</h4>
        <div className="grid grid-cols-1 gap-1">
          {allFeatures.map((feature) => {
            const hasAccess = accessibleFeatures.includes(feature.id);
            return (
              <div key={feature.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  {hasAccess ? (
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="w-3 h-3 text-slate-400 mr-2" />
                  )}
                  <span className={hasAccess ? 'text-white' : 'text-slate-400'}>
                    {feature.name}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  hasAccess 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-slate-700/50 text-slate-400'
                }`}>
                  {hasAccess ? 'Access' : 'No Access'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
