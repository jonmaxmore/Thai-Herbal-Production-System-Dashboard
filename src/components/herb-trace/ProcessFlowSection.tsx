
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from "recharts";
import { InspectionProcess, ProcessStatus } from "@/utils/database/types";

interface ProcessFlowSectionProps {
  processStats: {
    totalProcesses: number;
    statusCounts: Record<ProcessStatus, number>;
    processCounts: Record<InspectionProcess, number>;
    averageCompletionRate: number;
    averageFailureRate: number;
  };
  recentInspections: Array<{
    id: string;
    herbId: string;
    herbName: string;
    processType: InspectionProcess;
    status: ProcessStatus;
    startDate: Date;
    completionDate?: Date;
    inspectorName?: string;
    farmerName?: string;
  }>;
}

// Status color mapping
const statusColors: Record<ProcessStatus, string> = {
  "In Progress": "#3b82f6",
  "Passed": "#22c55e",
  "Failed": "#ef4444",
  "Pending": "#eab308",
  "Expired": "#6b7280"
};

export function ProcessFlowSection({ processStats, recentInspections }: ProcessFlowSectionProps) {
  // Format data for charts
  const statusData = Object.entries(processStats.statusCounts)
    .map(([status, count]) => ({ 
      name: status, 
      value: count,
      percentage: (count / processStats.totalProcesses * 100).toFixed(1)
    }))
    .filter(item => item.value > 0);

  const processTypeData = Object.entries(processStats.processCounts)
    .map(([type, count]) => ({ name: type, count }))
    .filter(item => item.count > 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-green-800">สถานะกระบวนการตรวจสอบ</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={statusColors[entry.name as ProcessStatus] || "#94a3b8"} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} กระบวนการ`, ""]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-green-800">กระบวนการตามประเภท</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processTypeData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12 }}
                width={120}
              />
              <Tooltip formatter={(value) => [`${value} กระบวนการ`, ""]} />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 bg-white shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-green-800">กระบวนการตรวจสอบล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สมุนไพร</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เกษตรกร</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">กระบวนการ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้ตรวจสอบ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentInspections.map((inspection) => (
                  <tr key={inspection.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{inspection.herbName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{inspection.farmerName || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{inspection.processType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={`
                          ${inspection.status === "Passed" ? "bg-green-100 text-green-800 border-green-300" : 
                            inspection.status === "Failed" ? "bg-red-100 text-red-800 border-red-300" :
                            inspection.status === "In Progress" ? "bg-blue-100 text-blue-800 border-blue-300" :
                            inspection.status === "Pending" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                            "bg-gray-100 text-gray-800 border-gray-300"}
                        `}
                      >
                        {inspection.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(inspection.completionDate || inspection.startDate).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{inspection.inspectorName || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
