
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import { UserRole } from "@/components/RoleSelector";

// Page types that can be accessed
export type PageType = 
  | "dashboard"
  | "herbs"
  | "trace" 
  | "certification"
  | "map"
  | "settings"
  | "marketplace"
  // New pages from sitemap
  | "farms"
  | "activities"
  | "harvest"
  | "weather"
  | "reports"
  | "learning"
  | "policy"
  | "licenses"
  | "inspection"
  | "training"
  | "lab_samples"
  | "lab_testing"
  | "lab_materials"
  | "procurement"
  | "production"
  | "inventory"
  | "logistics"
  | "qrcode"
  | "users"
  | "content"
  | "marketing"
  | "support"
  | "data_catalog"
  | "api"
  | "exports"
  | "tariffs"
  | "regulations"
  | "b2b"
  | "contracts";

// Access rights for a page
export interface PageAccess {
  view: boolean;
  edit: boolean;
  approve: boolean;
}

// Access rights for all pages
export interface RoleAccess {
  dashboard: PageAccess;
  herbs: PageAccess;
  trace: PageAccess;
  certification: PageAccess;
  map: PageAccess;
  settings: PageAccess;
  marketplace: PageAccess;
  // New pages from sitemap
  farms?: PageAccess;
  activities?: PageAccess;
  harvest?: PageAccess;
  weather?: PageAccess;
  reports?: PageAccess;
  learning?: PageAccess;
  policy?: PageAccess;
  licenses?: PageAccess;
  inspection?: PageAccess;
  training?: PageAccess;
  lab_samples?: PageAccess;
  lab_testing?: PageAccess;
  lab_materials?: PageAccess;
  procurement?: PageAccess;
  production?: PageAccess;
  inventory?: PageAccess;
  logistics?: PageAccess;
  qrcode?: PageAccess;
  users?: PageAccess;
  content?: PageAccess;
  marketing?: PageAccess;
  support?: PageAccess;
  data_catalog?: PageAccess;
  api?: PageAccess;
  exports?: PageAccess;
  tariffs?: PageAccess;
  regulations?: PageAccess;
  b2b?: PageAccess;
  contracts?: PageAccess;
}

// Default access - view only for dashboard
const defaultAccess: RoleAccess = {
  dashboard: { view: true, edit: false, approve: false },
  herbs: { view: false, edit: false, approve: false },
  trace: { view: false, edit: false, approve: false },
  certification: { view: false, edit: false, approve: false },
  map: { view: false, edit: false, approve: false },
  settings: { view: false, edit: false, approve: false },
  marketplace: { view: false, edit: false, approve: false },
  // Initialize new page types with no access
  farms: { view: false, edit: false, approve: false },
  activities: { view: false, edit: false, approve: false },
  harvest: { view: false, edit: false, approve: false },
  weather: { view: false, edit: false, approve: false },
  reports: { view: false, edit: false, approve: false },
  learning: { view: false, edit: false, approve: false },
  policy: { view: false, edit: false, approve: false },
  licenses: { view: false, edit: false, approve: false },
  inspection: { view: false, edit: false, approve: false },
  training: { view: false, edit: false, approve: false },
  lab_samples: { view: false, edit: false, approve: false },
  lab_testing: { view: false, edit: false, approve: false },
  lab_materials: { view: false, edit: false, approve: false },
  procurement: { view: false, edit: false, approve: false },
  production: { view: false, edit: false, approve: false },
  inventory: { view: false, edit: false, approve: false },
  logistics: { view: false, edit: false, approve: false },
  qrcode: { view: false, edit: false, approve: false },
  users: { view: false, edit: false, approve: false },
  content: { view: false, edit: false, approve: false },
  marketing: { view: false, edit: false, approve: false },
  support: { view: false, edit: false, approve: false },
  data_catalog: { view: false, edit: false, approve: false },
  api: { view: false, edit: false, approve: false },
  exports: { view: false, edit: false, approve: false },
  tariffs: { view: false, edit: false, approve: false },
  regulations: { view: false, edit: false, approve: false },
  b2b: { view: false, edit: false, approve: false },
  contracts: { view: false, edit: false, approve: false }
};

export const useRoleAccess = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [access, setAccess] = useState<RoleAccess>(defaultAccess);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load role and access rights from localStorage
    const storedRole = localStorage.getItem("userRole");
    const storedAccess = localStorage.getItem("roleAccess");
    
    if (storedRole) {
      setUserRole(storedRole as UserRole);
      
      if (storedAccess) {
        try {
          const parsedAccess = JSON.parse(storedAccess) as RoleAccess;
          setAccess(parsedAccess);
        } catch (error) {
          console.error("Error parsing access rights:", error);
          setAccess(defaultAccess);
        }
      } else {
        setAccess(defaultAccess);
      }
    } else {
      // No role found, redirect to login
      navigate("/");
    }
    
    setIsLoading(false);
  }, [navigate]);

  // Check if user has access to a specific page
  const checkAccess = (page: PageType): PageAccess => {
    return access[page] || { view: false, edit: false, approve: false };
  };

  // Check if user has view access to a specific page
  const canView = (page: PageType): boolean => {
    return access[page]?.view === true;
  };

  // Check if user has edit access to a specific page
  const canEdit = (page: PageType): boolean => {
    return access[page]?.edit === true;
  };

  // Check if user has approve access to a specific page
  const canApprove = (page: PageType): boolean => {
    return access[page]?.approve === true;
  };

  // Get workflow status for a page
  const getWorkflowStatus = (page: PageType): string => {
    const pageAccess = checkAccess(page);
    if (pageAccess.approve) return "approve";
    if (pageAccess.edit) return "edit";
    if (pageAccess.view) return "view";
    return "no-access";
  };

  // Protect a page based on view access
  const protectPage = (page: PageType) => {
    if (!isLoading && !canView(page)) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to view this page",
      });
      navigate("/herb-trace/dashboard");
      return false;
    }
    return true;
  };

  return {
    userRole,
    access,
    isLoading,
    checkAccess,
    canView,
    canEdit,
    canApprove,
    getWorkflowStatus,
    protectPage
  };
};
