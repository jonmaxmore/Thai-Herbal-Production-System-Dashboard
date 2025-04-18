
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUsersByRole } from "@/utils/mockDatabase";

// Chart colors
const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#ec4899",
  "#f59e0b",
  "#6366f1",
  "#84cc16",
  "#14b8a6",
  "#a855f7",
];

const stakeholderGroups = [
  {
    role: "farmer",
    nameTh: "เกษตรกร",
    description: "ผู้ปลูกและจำหน่ายสมุนไพร",
    impact: "high",
    influence: "medium",
  },
  {
    role: "manufacturer",
    nameTh: "ผู้ผลิต",
    description: "ผู้แปรรูปผลิตภัณฑ์สมุนไพร",
    impact: "high",
    influence: "high",
  },
  {
    role: "ttm_officer",
    nameTh: "กรมการแพทย์แผนไทย",
    description: "หน่วยงานกำกับดูแลด้านการแพทย์แผนไทย",
    impact: "high",
    influence: "high",
  },
  {
    role: "acfs_officer",
    nameTh: "มกอช.",
    description: "หน่วยงานรับรองมาตรฐานสินค้าเกษตร",
    impact: "high",
    influence: "high",
  },
  {
    role: "customs_officer",
    nameTh: "กรมศุลกากร",
    description: "หน่วยงานกำกับดูแลการนำเข้า-ส่งออก",
    impact: "medium",
    influence: "high",
  },
  {
    role: "lab",
    nameTh: "ห้องปฏิบัติการ",
    description: "หน่วยตรวจสอบคุณภาพสมุนไพร",
    impact: "medium",
    influence: "medium",
  },
  {
    role: "data_consumer",
    nameTh: "ผู้ใช้ข้อมูล",
    description: "ผู้ใช้ข้อมูลเพื่อการวิจัยและพัฒนา",
    impact: "low",
    influence: "low",
  },
];

const impactScores = {
  high: 3,
  medium: 2,
  low: 1,
};

export function StakeholderAnalysis() {
  const usersByRole = getUsersByRole();

  // Prepare data for pie chart
  const pieData = stakeholderGroups.map((group) => ({
    name: group.nameTh,
    value: usersByRole.find((u) => u.role === group.role)?.count || 0,
  }));

  // Prepare data for influence-impact matrix
  const matrixData = stakeholderGroups.map((group) => ({
    name: group.nameTh,
    score:
      impactScores[group.impact as keyof typeof impactScores] *
      impactScores[group.influence as keyof typeof impactScores],
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>สัดส่วนผู้มีส่วนได้ส่วนเสีย</CardTitle>
            <CardDescription>
              จำนวนผู้ใช้งานระบบแยกตามประเภทผู้มีส่วนได้ส่วนเสีย
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ระดับอิทธิพลและผลกระทบ</CardTitle>
            <CardDescription>
              การวิเคราะห์ผู้มีส่วนได้ส่วนเสียตามระดับอิทธิพลและผลกระทบ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={matrixData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    label={{
                      value: "ระดับอิทธิพล × ผลกระทบ",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Bar dataKey="score" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายละเอียดผู้มีส่วนได้ส่วนเสีย</CardTitle>
          <CardDescription>
            ข้อมูลและบทบาทของผู้มีส่วนได้ส่วนเสียในระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ประเภท</TableHead>
                  <TableHead>คำอธิบาย</TableHead>
                  <TableHead>ผลกระทบ</TableHead>
                  <TableHead>อิทธิพล</TableHead>
                  <TableHead>จำนวนในระบบ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stakeholderGroups.map((group) => (
                  <TableRow key={group.role}>
                    <TableCell className="font-medium">{group.nameTh}</TableCell>
                    <TableCell>{group.description}</TableCell>
                    <TableCell>
                      {group.impact === "high"
                        ? "สูง"
                        : group.impact === "medium"
                        ? "ปานกลาง"
                        : "ต่ำ"}
                    </TableCell>
                    <TableCell>
                      {group.influence === "high"
                        ? "สูง"
                        : group.influence === "medium"
                        ? "ปานกลาง"
                        : "ต่ำ"}
                    </TableCell>
                    <TableCell>
                      {usersByRole.find((u) => u.role === group.role)?.count || 0}{" "}
                      คน
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

export default StakeholderAnalysis;
