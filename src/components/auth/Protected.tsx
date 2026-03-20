import React from 'react';
import { usePermissions } from '../../lib/auth-context';

interface ProtectedProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Conditionally renders children based on the user's permissions.
 */
export const Protected: React.FC<ProtectedProps> = ({ 
  resource, 
  action, 
  children, 
  fallback = null 
}) => {
  const { hasPermission } = usePermissions();

  if (hasPermission(resource, action)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};