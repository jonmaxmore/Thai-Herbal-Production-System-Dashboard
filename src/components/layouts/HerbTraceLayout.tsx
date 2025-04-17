
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HerbSidebar from "@/components/HerbSidebar";
import MobileHeader from "@/components/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRoleAccess, PageType } from "@/hooks/use-role-access";
import { useToast } from "@/hooks/use-toast";

interface HerbTraceLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export default function HerbTraceLayout({ children, activeTab }: HerbTraceLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading, canView } = useRoleAccess();

  // Map activeTab to page type
  const getPageType = (): PageType => {
    switch (activeTab) {
      case "dashboard": return "dashboard";
      case "herbs": return "herbs";
      case "trace": return "trace";
      case "certification": return "certification";
      case "map": return "map";
      case "settings": return "settings";
      case "marketplace": return "marketplace";
      default: return "dashboard";
    }
  };

  // Get appropriate title based on active tab
  const getTabTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Dashboard";
      case "herbs": return "Herbs Catalog";
      case "trace": return "Traceability";
      case "certification": return "Certifications";
      case "map": return "Map View";
      case "settings": return "Settings";
      case "marketplace": return "Marketplace";
      default: return "HerbTrace";
    }
  };

  // Check access for current page
  useEffect(() => {
    if (!isLoading) {
      const pageType = getPageType();
      if (!canView(pageType)) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to view this page",
        });
        navigate("/herb-trace/dashboard");
      }
    }
  }, [activeTab, isLoading, navigate]);

  // If still loading access rights, show loading indicator
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
      {/* Mobile menu overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - desktop always visible, mobile conditional */}
      <div 
        className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-50 transform transition-transform ease-in-out duration-300" : ""}
          ${isMobile && !isMobileMenuOpen ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        <HerbSidebar 
          activeTab={activeTab} 
          setActiveTab={() => {}}  
          isMobile={isMobile}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <MobileHeader 
          title={getTabTitle()} 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
        />

        {/* Main content scrollable area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
