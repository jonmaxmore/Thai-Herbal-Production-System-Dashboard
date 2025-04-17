
import React from 'react';
import { PageType, useRoleAccess } from '@/hooks/use-role-access';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface AccessControlProps {
  page: PageType;
  children: React.ReactNode;
  requiredPermission?: 'view' | 'edit' | 'approve';
  fallback?: React.ReactNode;
}

export default function AccessControl({
  page,
  children,
  requiredPermission = 'view',
  fallback
}: AccessControlProps) {
  const { canView, canEdit, canApprove } = useRoleAccess();
  
  // Check if user has the required permission
  const hasAccess = () => {
    switch (requiredPermission) {
      case 'view':
        return canView(page);
      case 'edit':
        return canEdit(page);
      case 'approve':
        return canApprove(page);
      default:
        return false;
    }
  };
  
  // Default fallback component
  const defaultFallback = (
    <Alert variant="destructive" className="mt-4">
      <Shield className="h-4 w-4" />
      <AlertTitle>Access Restricted</AlertTitle>
      <AlertDescription>
        You don't have {requiredPermission} permission for this {page} feature.
      </AlertDescription>
    </Alert>
  );
  
  return hasAccess() ? <>{children}</> : (fallback || defaultFallback);
}
