
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HerbSidebar from "@/components/HerbSidebar";
import MobileHeader from "@/components/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRoleAccess, RolePageType as PageType } from "@/hooks/use-role-access";
import { useToast } from "@/hooks/use-toast";

interface HerbTraceLayoutProps {
  children: React.ReactNode;
  activeTab?: PageType;
}

export default function HerbTraceLayout({ children, activeTab }: HerbTraceLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading, canView } = useRoleAccess();

  const getTabTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Dashboard";
      case "herbs": return "Herbs Catalog";
      case "trace": return "Traceability";
      case "certification": return "Certifications";
      case "inspection": return "Inspection";
      case "map": return "Map View";
      case "settings": return "Settings";
      case "marketplace": return "Marketplace";
      case "overview": return "Overview";
      case "seed-to-sale": return "Seed to Sale";
      case "farms": return "Farm Management";
      case "activities": return "Activities";
      case "harvest": return "Harvest";
      case "weather": return "Weather";
      case "licenses": return "Licenses";
      case "lab_samples": return "Lab Samples";
      case "lab_testing": return "Lab Testing";
      case "lab_materials": return "Lab Materials";
      case "procurement": return "Procurement";
      case "production": return "Production";
      case "inventory": return "Inventory";
      case "logistics": return "Logistics";
      case "qrcode": return "QR Code";
      case "b2b": return "B2B Market";
      case "contracts": return "Contracts";
      case "reports": return "Reports";
      case "exports": return "Exports";
      case "learning": return "Learning";
      case "users": return "User Management";
      case "support": return "Support";
      default: return "HerbTrace";
    }
  };

  useEffect(() => {
    if (!isLoading && activeTab) {
      if (!canView(activeTab)) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to view this page",
        });
        navigate("/herb-trace/dashboard");
      }
    }
  }, [activeTab, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

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

      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader 
          title={getTabTitle()} 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
