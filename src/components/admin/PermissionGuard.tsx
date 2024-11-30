import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Permission } from '@/lib/permissions';
import PermissionDenied from './PermissionDenied';

interface PermissionGuardProps {
  permissions: Permission[];
  children: React.ReactNode;
  redirectTo?: string;
  showError?: boolean;
}

export default function PermissionGuard({ 
  permissions, 
  children, 
  redirectTo = '/admin',
  showError = true
}: PermissionGuardProps) {
  const { checkPermissions, loading } = useAdmin();

  if (loading) {
    return null;
  }

  const hasAccess = checkPermissions(permissions);

  if (!hasAccess) {
    if (showError) {
      return <PermissionDenied />;
    }
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
}