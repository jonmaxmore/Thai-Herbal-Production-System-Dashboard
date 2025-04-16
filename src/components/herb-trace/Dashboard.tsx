
import React from "react";
import { Users, ClipboardCheck, Leaf, AlertTriangle } from "lucide-react";
import StatCard from "@/components/StatCard";
import { ChartSection } from "@/components/herb-trace/ChartSection";
import { TraceEventsTable } from "@/components/herb-trace/TraceEventsTable";
import { CertificationStatus } from "@/utils/herbData";

interface DashboardProps {
  farmers: any[];
  traces: any[];
  gapcStatus: Record<CertificationStatus, number>;
  euGmpStatus: Record<CertificationStatus, number>;
  dttmStatus: Record<CertificationStatus, number>;
}

export default function Dashboard({ 
  farmers, 
  traces, 
  gapcStatus, 
  euGmpStatus, 
  dttmStatus 
}: DashboardProps) {
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
