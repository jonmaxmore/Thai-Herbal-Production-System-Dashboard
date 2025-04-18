
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LineChart, Line
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertTriangle, Clock, Ban } from "lucide-react";

interface ChartSectionProps {
  gapcStatus: Record<string, number>;
  euGmpStatus: Record<string, number>;
  dttmStatus: Record<string, number>;
}

export function ChartSection({ gapcStatus, euGmpStatus, dttmStatus }: ChartSectionProps) {
  // Format data for charts
  const certificationStatusData = Object.entries(gapcStatus).map(
    ([status, count]) => ({ name: status, value: count })
  );

  const allCertificationsData = [
    { name: 'GACP', passed: gapcStatus["Passed"] || 0, pending: gapcStatus["Pending"] || 0, failed: gapcStatus["Failed"] || 0, expired: gapcStatus["Expired"] || 0 },
    { name: 'EU-GMP', passed: euGmpStatus["Passed"] || 0, pending: euGmpStatus["Pending"] || 0, failed: euGmpStatus["Failed"] || 0, expired: euGmpStatus["Expired"] || 0 },
    { name: 'DTTM', passed: dttmStatus["Passed"] || 0, pending: dttmStatus["Pending"] || 0, failed: dttmStatus["Failed"] || 0, expired: dttmStatus["Expired"] || 0 },
  ];

  // Create trend data (simulated for demo)
  const trendData = [
    { month: 'ม.ค.', gacp: 12, eugmp: 8, dttm: 5 },
    { month: 'ก.พ.', gacp: 15, eugmp: 10, dttm: 7 },
    { month: 'มี.ค.', gacp: 18, eugmp: 12, dttm: 9 },
    { month: 'เม.ย.', gacp: 24, eugmp: 15, dttm: 11 },
    { month: 'พ.ค.', gacp: 28, eugmp: 18, dttm: 14 },
    { month: 'มิ.ย.', gacp: 32, eugmp: 22, dttm: 16 },
  ];

  // Status icons
  const StatusIcon = ({ status }: { status: string }) => {
    switch(status) {
      case 'Passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Expired':
        return <Ban className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  // Calculate totals
  const getTotal = (status: Record<string, number>) => {
    return Object.values(status).reduce((sum, count) => sum + count, 0);
  };

  const totalGACP = getTotal(gapcStatus);
  const totalEUGMP = getTotal(euGmpStatus);
  const totalDTTM = getTotal(dttmStatus);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg">GACP Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <StatusIcon status="Passed" />
                <span className="ml-2">ผ่าน: {gapcStatus["Passed"] || 0}</span>
              </div>
              <div className="flex items-center">
                <StatusIcon status="Failed" />
                <span className="ml-2">ไม่ผ่าน: {gapcStatus["Failed"] || 0}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <StatusIcon status="Pending" />
                <span className="ml-2">รอดำเนินการ: {gapcStatus["Pending"] || 0}</span>
              </div>
              <div className="flex items-center">
                <StatusIcon status="Expired" />
                <span className="ml-2">หมดอายุ: {gapcStatus["Expired"] || 0}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <span className="font-semibold">ทั้งหมด: {totalGACP}</span>
              <span className="ml-4 text-green-600">อัตราผ่าน: {totalGACP > 0 ? ((gapcStatus["Passed"] || 0) / totalGACP * 100).toFixed(1) : 0}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg">EU-GMP Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <StatusIcon status="Passed" />
                <span className="ml-2">ผ่าน: {euGmpStatus["Passed"] || 0}</span>
              </div>
              <div className="flex items-center">
                <StatusIcon status="Failed" />
                <span className="ml-2">ไม่ผ่าน: {euGmpStatus["Failed"] || 0}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <StatusIcon status="Pending" />
                <span className="ml-2">รอดำเนินการ: {euGmpStatus["Pending"] || 0}</span>
              </div>
              <div className="flex items-center">
                <StatusIcon status="Expired" />
                <span className="ml-2">หมดอายุ: {euGmpStatus["Expired"] || 0}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <span className="font-semibold">ทั้งหมด: {totalEUGMP}</span>
              <span className="ml-4 text-green-600">อัตราผ่าน: {totalEUGMP > 0 ? ((euGmpStatus["Passed"] || 0) / totalEUGMP * 100).toFixed(1) : 0}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg">DTTM Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <StatusIcon status="Passed" />
                <span className="ml-2">ผ่าน: {dttmStatus["Passed"] || 0}</span>
              </div>
              <div className="flex items-center">
                <StatusIcon status="Failed" />
                <span className="ml-2">ไม่ผ่าน: {dttmStatus["Failed"] || 0}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <StatusIcon status="Pending" />
                <span className="ml-2">รอดำเนินการ: {dttmStatus["Pending"] || 0}</span>
              </div>
              <div className="flex items-center">
                <StatusIcon status="Expired" />
                <span className="ml-2">หมดอายุ: {dttmStatus["Expired"] || 0}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <span className="font-semibold">ทั้งหมด: {totalDTTM}</span>
              <span className="ml-4 text-green-600">อัตราผ่าน: {totalDTTM > 0 ? ((dttmStatus["Passed"] || 0) / totalDTTM * 100).toFixed(1) : 0}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
          <TabsTrigger value="comparison">เปรียบเทียบ</TabsTrigger>
          <TabsTrigger value="trends">แนวโน้ม</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold mb-2 text-green-800">GACP Status Overview</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={certificationStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {certificationStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === 'Passed' ? '#22c55e' :
                            entry.name === 'Failed' ? '#ef4444' :
                            entry.name === 'Pending' ? '#eab308' : '#94a3b8'
                          }
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold mb-2 text-green-800">Certification by Type</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={allCertificationsData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="passed" name="ผ่าน" stackId="a" fill="#22c55e" />
                    <Bar dataKey="pending" name="รอดำเนินการ" stackId="a" fill="#eab308" />
                    <Bar dataKey="failed" name="ไม่ผ่าน" stackId="a" fill="#ef4444" />
                    <Bar dataKey="expired" name="หมดอายุ" stackId="a" fill="#94a3b8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="comparison">
          <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold mb-2 text-green-800">การเปรียบเทียบมาตรฐานการรับรอง</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'ผ่าน', GACP: gapcStatus["Passed"] || 0, "EU-GMP": euGmpStatus["Passed"] || 0, DTTM: dttmStatus["Passed"] || 0 },
                    { name: 'รอดำเนินการ', GACP: gapcStatus["Pending"] || 0, "EU-GMP": euGmpStatus["Pending"] || 0, DTTM: dttmStatus["Pending"] || 0 },
                    { name: 'ไม่ผ่าน', GACP: gapcStatus["Failed"] || 0, "EU-GMP": euGmpStatus["Failed"] || 0, DTTM: dttmStatus["Failed"] || 0 },
                    { name: 'หมดอายุ', GACP: gapcStatus["Expired"] || 0, "EU-GMP": euGmpStatus["Expired"] || 0, DTTM: dttmStatus["Expired"] || 0 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="GACP" fill="#22c55e" />
                  <Bar dataKey="EU-GMP" fill="#3b82f6" />
                  <Bar dataKey="DTTM" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold mb-2 text-green-800">แนวโน้มการรับรองรายเดือน</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="gacp" name="GACP" stroke="#22c55e" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="eugmp" name="EU-GMP" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="dttm" name="DTTM" stroke="#8b5cf6" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
