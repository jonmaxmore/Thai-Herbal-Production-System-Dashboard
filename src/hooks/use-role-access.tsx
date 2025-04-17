
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
  | "marketplace";

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
    protectPage
  };
};
