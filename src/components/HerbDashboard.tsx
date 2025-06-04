
import React, { useState, useEffect } from "react";
import HerbSidebar from "./HerbSidebar";
import MobileHeader from "./MobileHeader";
import MapView from "./MapView";
import TraceView from "./TraceView";
import Dashboard from "./herb-trace/Dashboard";
import HerbsCatalog from "./herb-trace/HerbsCatalog";
import CertificationsList from "./herb-trace/CertificationsList";
import SettingsPanel from "./herb-trace/SettingsPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { getDashboardData, EnhancedTrace } from "@/utils/database";

export default function HerbDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState<ReturnType<typeof getDashboardData> | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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

  if (isLoading || !dashboardData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const { farmers, traces, gapcStatus, euGmpStatus, dttmStatus } = dashboardData;

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
          setActiveTab={setActiveTab} 
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
          {/* Dashboard View */}
          {activeTab === "dashboard" && <Dashboard />}

          {/* Herbs Catalog View */}
          {activeTab === "herbs" && <HerbsCatalog />}

          {/* Trace View with Search & QR Code Support */}
          {activeTab === "trace" && (
            <TraceView 
              traces={traces as EnhancedTrace[]}
              searchTerm=""
              setSearchTerm={() => {}}
            />
          )}

          {/* Certification View with Search and Filter - Convert EnhancedFarm to proper format */}
          {activeTab === "certification" && (
            <CertificationsList 
              farmers={farmers.map(farm => ({
                ...farm,
                id: typeof farm.id === 'string' ? parseInt(farm.id.replace('F', ''), 10) || 0 : farm.id
              }))} 
            />
          )}

          {/* Map View */}
          {activeTab === "map" && <MapView />}

          {/* Settings View */}
          {activeTab === "settings" && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
}
