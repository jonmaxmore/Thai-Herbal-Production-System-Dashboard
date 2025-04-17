
import React from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { 
  getUsersByMonth, 
  getUsersByRole, 
  getUsersByProvince, 
  getUserActivityStats 
} from "@/utils/mockUserData";

// Chart colors
const COLORS = [
  "#22c55e", "#84cc16", "#10b981", "#14b8a6", 
  "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", 
  "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"
];

export function UserAnalytics() {
  // Get mock data
  const usersByMonth = getUsersByMonth();
  const usersByRole = getUsersByRole();
  const topProvinces = getUsersByProvince(5);
  const activityStats = getUserActivityStats();
  
  // Format month labels
  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return `${month}/${year.slice(2)}`;
  };
  
  // Format role labels in Thai
  const formatRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      farmer: "เกษตรกร",
      lab: "ห้องปฏิบัติการ",
      manufacturer: "ผู้ผลิต",
      ttm_officer: "กรมแพทย์แผนไทย",
      acfs_officer: "มกอช.",
      customs_officer: "กรมศุลกากร",
      admin: "ผู้ดูแลระบบ",
      data_consumer: "ผู้ใช้ข้อมูล",
      guest: "ผู้เยี่ยมชม"
    };
    return roleLabels[role] || role;
  };
  
  // Show only latest 12 months for the graph
  const recentMonths = usersByMonth.slice(-12);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">ผู้ใช้งานทั้งหมด</CardTitle>
            <CardDescription>จำนวนผู้ใช้งานในระบบ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{activityStats.totalUsers.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              ผู้ใช้งานที่ยืนยันตัวตนแล้ว {activityStats.verifiedUsers.toLocaleString()} คน ({Math.round(activityStats.verifiedUsers/activityStats.totalUsers*100)}%)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">ผู้ใช้งานที่กำลังใช้งาน</CardTitle>
            <CardDescription>จำนวนบัญชีที่มีสถานะใช้งานได้</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{activityStats.activeUsers.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              คิดเป็น {Math.round(activityStats.activeUsers/activityStats.totalUsers*100)}% ของผู้ใช้งานทั้งหมด
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">กิจกรรมในระบบ</CardTitle>
            <CardDescription>จำนวนกิจกรรมทั้งหมดที่เกิดขึ้น</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{activityStats.totalLogins.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              การเข้าสู่ระบบทั้งหมด (เฉลี่ย {Math.round(activityStats.averageLoginsPerUser)} ครั้ง/ผู้ใช้)
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>ผู้ใช้งานตามกลุ่มผู้ใช้</CardTitle>
            <CardDescription>สัดส่วนผู้ใช้งานแยกตามบทบาท</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usersByRole}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="role"
                    label={({ role, percent }) => `${formatRoleLabel(role)} ${(percent * 100).toFixed(0)}%`}
                  >
                    {usersByRole.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value} คน`, 'จำนวน']}
                    labelFormatter={(value: string) => `กลุ่ม: ${formatRoleLabel(value)}`}
                  />
                  <Legend 
                    formatter={(value) => formatRoleLabel(value)} 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>ผู้ใช้งานรายจังหวัด</CardTitle>
            <CardDescription>5 จังหวัดที่มีผู้ใช้งานมากที่สุด</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProvinces}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 80,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="province" 
                    tick={{ fontSize: 12 }} 
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value} คน`, 'จำนวนผู้ใช้']}
                    labelFormatter={(value: string) => `จังหวัด: ${value}`}
                  />
                  <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>จำนวนผู้ลงทะเบียนรายเดือน</CardTitle>
          <CardDescription>12 เดือนล่าสุด</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={recentMonths}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 25,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  height={60}
                  tickFormatter={formatMonthLabel}
                  tick={(props) => {
                    const { x, y, payload } = props;
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text 
                          x={0} 
                          y={0} 
                          dy={16} 
                          textAnchor="end" 
                          fill="#666"
                          transform="rotate(-45)"
                          fontSize={12}
                        >
                          {formatMonthLabel(payload.value)}
                        </text>
                      </g>
                    );
                  }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value} คน`, 'จำนวนลงทะเบียน']}
                  labelFormatter={(value: string) => `เดือน: ${formatMonthLabel(value)}`}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserAnalytics;
