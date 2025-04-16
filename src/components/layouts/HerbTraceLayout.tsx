
import { useState } from "react";
import HerbSidebar from "@/components/HerbSidebar";
import MobileHeader from "@/components/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";

interface HerbTraceLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export default function HerbTraceLayout({ children, activeTab }: HerbTraceLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Get appropriate title based on active tab
  const getTabTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Dashboard";
      case "herbs": return "Herbs Catalog";
      case "trace": return "Traceability";
      case "certification": return "Certifications";
      case "map": return "Map View";
      case "settings": return "Settings";
      default: return "HerbTrace";
    }
  };

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
