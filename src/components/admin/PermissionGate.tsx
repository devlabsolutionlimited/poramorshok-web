import { ReactNode } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Permission, hasPermission } from '@/lib/permissions';

interface PermissionGateProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PermissionGate({ 
  permission, 
  children, 
  fallback = null 
}: PermissionGateProps) {
  const { user } = useAdmin();

  if (!hasPermission(user, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}