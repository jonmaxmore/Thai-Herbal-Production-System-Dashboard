
import React, { useEffect, useState } from "react";
import { Users, ClipboardCheck, Leaf, AlertTriangle } from "lucide-react";
import StatCard from "@/components/StatCard";
import { ChartSection } from "@/components/herb-trace/ChartSection";
import { TraceEventsTable } from "@/components/herb-trace/TraceEventsTable";
import { AnalyticsService } from "@/services/analyticsService";
import { MasterDataService } from "@/services/masterDataService";
import { ProductionService } from "@/services/productionService";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load dashboard data using service layer
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get data from services
        const farms = MasterDataService.getAllFarms();
        const traces = ProductionService.getAllTraces().slice(0, 50);
        const certificationStats = AnalyticsService.getCertificationStatistics();
        const productionStats = AnalyticsService.getProductionStatistics();
        
        setDashboardData({
          farmers: farms,
          traces: traces,
          gapcStatus: certificationStats.gapcStats,
          euGmpStatus: certificationStats.euGmpStats,
          dttmStatus: certificationStats.dttmStats,
          productionStats
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || !dashboardData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const { 
    farmers, 
    traces, 
    gapcStatus, 
    euGmpStatus, 
    dttmStatus 
  } = dashboardData;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold hidden md:block text-green-800">Herb Trace Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Farmers" 
          value={farmers.length} 
          icon={<Users className="h-5 w-5 text-green-600" />}
          className="bg-white hover:shadow-lg transition-all duration-300" 
        />
        <StatCard 
          title="GACP Passed" 
          value={gapcStatus["Passed"] || 0} 
          icon={<ClipboardCheck className="h-5 w-5 text-green-600" />}
          className="bg-white hover:shadow-lg transition-all duration-300"
        />
        <StatCard 
          title="EU-GMP Pending" 
          value={euGmpStatus["Pending"] || 0} 
          icon={<Leaf className="h-5 w-5 text-green-600" />}
          className="bg-white hover:shadow-lg transition-all duration-300"
        />
        <StatCard 
          title="DTTAM Failed" 
          value={dttmStatus["Failed"] || 0} 
          icon={<AlertTriangle className="h-5 w-5 text-green-600" />}
          className="bg-white hover:shadow-lg transition-all duration-300"
        />
      </div>

      <ChartSection 
        gapcStatus={gapcStatus} 
        euGmpStatus={euGmpStatus} 
        dttmStatus={dttmStatus} 
      />

      <TraceEventsTable traces={traces.slice(0, 5)} />
    </div>
  );
}
