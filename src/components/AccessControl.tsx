
import React from 'react';
import { PageType, useRoleAccess } from '@/hooks/use-role-access';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  Eye, 
  Edit, 
  CheckCircle, 
  AlertTriangle,
  Lock, 
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AccessControlProps {
  page: PageType;
  children: React.ReactNode;
  requiredPermission?: 'view' | 'edit' | 'approve';
  fallback?: React.ReactNode;
  showBadge?: boolean;
  workflowStage?: 'submitted' | 'in-review' | 'approved' | 'rejected' | 'draft';
}

export default function AccessControl({
  page,
  children,
  requiredPermission = 'view',
  fallback,
  showBadge = false,
  workflowStage
}: AccessControlProps) {
  const { canView, canEdit, canApprove, getWorkflowStatus } = useRoleAccess();
  
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

  // Get appropriate badge color based on workflow stage
  const getBadgeVariant = () => {
    if (!workflowStage) return "default";
    
    switch (workflowStage) {
      case 'draft': return "secondary";
      case 'submitted': return "outline";
      case 'in-review': return "default";
      case 'approved': return "success";
      case 'rejected': return "destructive";
      default: return "default";
    }
  };

  // Get appropriate icon based on permission
  const getPermissionIcon = () => {
    switch (requiredPermission) {
      case 'view': return <Eye className="h-4 w-4" />;
      case 'edit': return <Edit className="h-4 w-4" />;
      case 'approve': return <CheckCircle className="h-4 w-4" />;
      default: return <Lock className="h-4 w-4" />;
    }
  };

  // Get workflow status badge
  const getWorkflowBadge = () => {
    if (!workflowStage) return null;
    
    const icons = {
      'draft': <Edit className="h-3 w-3 mr-1" />,
      'submitted': <Clock className="h-3 w-3 mr-1" />,
      'in-review': <AlertTriangle className="h-3 w-3 mr-1" />,
      'approved': <CheckCircle className="h-3 w-3 mr-1" />,
      'rejected': <Shield className="h-3 w-3 mr-1" />
    };
    
    const labels = {
      'draft': 'ร่าง',
      'submitted': 'ส่งแล้ว',
      'in-review': 'กำลังตรวจสอบ',
      'approved': 'อนุมัติแล้ว',
      'rejected': 'ถูกปฏิเสธ'
    };
    
    return (
      <Badge variant={getBadgeVariant()} className="ml-2 flex items-center">
        {icons[workflowStage]}
        {labels[workflowStage]}
      </Badge>
    );
  };
  
  // Default fallback component
  const defaultFallback = (
    <Alert variant="destructive" className="mt-4">
      <Shield className="h-4 w-4" />
      <AlertTitle>สิทธิการเข้าถึงถูกจำกัด</AlertTitle>
      <AlertDescription>
        คุณไม่มีสิทธิในการ{requiredPermission === 'view' ? 'เข้าดู' : requiredPermission === 'edit' ? 'แก้ไข' : 'อนุมัติ'}
        สำหรับส่วน {page} นี้
      </AlertDescription>
    </Alert>
  );
  
  // If showing a badge and has access, render with badge
  if (showBadge && hasAccess() && workflowStage) {
    return (
      <div className="relative">
        {children}
        <div className="absolute top-0 right-0">
          {getWorkflowBadge()}
        </div>
      </div>
    );
  }
  
  // Normal access check
  return hasAccess() ? <>{children}</> : (fallback || defaultFallback);
}

// Export a WorkflowStatus component to show permission and workflow status
export function WorkflowStatus({ page }: { page: PageType }) {
  const { getWorkflowStatus } = useRoleAccess();
  
  const status = getWorkflowStatus(page);
  
  const getStatusBadge = () => {
    switch (status) {
      case 'approve':
        return (
          <Badge variant="success" className="flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            มีสิทธิอนุมัติ
          </Badge>
        );
      case 'edit':
        return (
          <Badge variant="default" className="flex items-center">
            <Edit className="h-3 w-3 mr-1" />
            มีสิทธิแก้ไข
          </Badge>
        );
      case 'view':
        return (
          <Badge variant="secondary" className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            มีสิทธิดูอย่างเดียว
          </Badge>
        );
      default:
        return (
          <Badge variant="destructive" className="flex items-center">
            <Lock className="h-3 w-3 mr-1" />
            ไม่มีสิทธิเข้าถึง
          </Badge>
        );
    }
  };
  
  return getStatusBadge();
}
