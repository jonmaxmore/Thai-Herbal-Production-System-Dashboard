
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from "recharts";

interface StakeholderData {
  role: string;
  count: number;
}

interface InvolvementData {
  category: string;
  count: number;
}

interface StakeholderAnalysisProps {
  stakeholdersByRole?: StakeholderData[];
  stakeholderInvolvement?: InvolvementData[];
}

// Role color mapping
const roleColors: Record<string, string> = {
  "farmer": "#22c55e",
  "lab": "#3b82f6",
  "manufacturer": "#eab308",
  "ttm_officer": "#8b5cf6",
  "acfs_officer": "#14b8a6",
  "customs_officer": "#6366f1",
  "admin": "#ef4444",
  "data_consumer": "#ec4899",
  "guest": "#94a3b8"
};

// Role translations
const roleTranslations: Record<string, string> = {
  "farmer": "เกษตรกร",
  "lab": "ห้องปฏิบัติการ",
  "manufacturer": "ผู้ผลิต",
  "ttm_officer": "เจ้าหน้าที่ TTM",
  "acfs_officer": "เจ้าหน้าที่ ACFS",
  "customs_officer": "เจ้าหน้าที่ศุลกากร",
  "admin": "ผู้ดูแลระบบ",
  "data_consumer": "ผู้บริโภคข้อมูล",
  "guest": "ผู้เยี่ยมชม"
};

// Category translations
const categoryTranslations: Record<string, string> = {
  "Production": "การผลิต",
  "Testing": "การทดสอบ",
  "Certification": "การรับรอง",
  "Distribution": "การกระจายสินค้า",
  "Consumption": "การบริโภค",
  "Regulation": "การกำกับดูแล"
};

export function StakeholderAnalysis({ stakeholdersByRole = [], stakeholderInvolvement = [] }: StakeholderAnalysisProps) {
  // Prepare data for charts with translations
  const roleData = stakeholdersByRole.map(item => ({
    ...item,
    nameTranslated: roleTranslations[item.role] || item.role
  }));

  const involvementData = stakeholderInvolvement.map(item => ({
    ...item,
    nameTranslated: categoryTranslations[item.category] || item.category
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-green-800">ผู้มีส่วนได้ส่วนเสียตามบทบาท</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={roleData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis 
                  dataKey="nameTranslated" 
                  type="category" 
                  tick={{ fontSize: 12 }}
                  width={120}
                />
                <Tooltip formatter={(value) => [`${value} คน`, ""]} />
                <Bar dataKey="count" fill="#22c55e">
                  {roleData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={roleColors[entry.role] || "#94a3b8"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-green-800">การมีส่วนร่วมในระบบ</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={involvementData}
                  dataKey="count"
                  nameKey="nameTranslated"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ nameTranslated, percent }) => `${nameTranslated}: ${(percent * 100).toFixed(0)}%`}
                >
                  {involvementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} บทบาท`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-green-800">ระบบผู้มีส่วนได้ส่วนเสียในโซ่อุปทานสมุนไพรไทย</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4 bg-green-50">
              <h3 className="font-semibold text-green-800 mb-2">ผู้ผลิต</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>เกษตรกรผู้ปลูกสมุนไพร</li>
                <li>วิสาหกิจชุมชนด้านสมุนไพร</li>
                <li>สหกรณ์เกษตรกรรมสมุนไพร</li>
                <li>สวนสมุนไพรเพื่อการศึกษา</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="font-semibold text-blue-800 mb-2">ผู้ตรวจสอบและรับรอง</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>ห้องปฏิบัติการตรวจวิเคราะห์</li>
                <li>กรมการแพทย์แผนไทยฯ</li>
                <li>สำนักงานมาตรฐานเกษตรฯ</li>
                <li>หน่วยรับรองมาตรฐาน</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4 bg-yellow-50">
              <h3 className="font-semibold text-yellow-800 mb-2">ผู้แปรรูปและจำหน่าย</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>โรงงานผลิตยาสมุนไพร</li>
                <li>ผู้ผลิตผลิตภัณฑ์เสริมอาหาร</li>
                <li>ผู้ส่งออกสมุนไพร</li>
                <li>ผู้จัดจำหน่ายผลิตภัณฑ์สมุนไพร</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold text-lg text-green-800 mb-2">ประโยชน์ของระบบตรวจสอบย้อนกลับต่อผู้มีส่วนได้ส่วนเสีย</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="border rounded-lg p-3 bg-gray-50">
                <h4 className="font-medium text-green-700">สำหรับเกษตรกรและผู้ผลิต</h4>
                <p className="text-sm text-gray-600 mt-1">
                  ระบบช่วยในการรับรองคุณภาพผลผลิต เพิ่มโอกาสการเข้าถึงตลาดที่มีมูลค่าสูง และสร้างความเชื่อมั่นต่อลูกค้า
                </p>
              </div>
              
              <div className="border rounded-lg p-3 bg-gray-50">
                <h4 className="font-medium text-green-700">สำหรับผู้บริโภคและผู้ซื้อ</h4>
                <p className="text-sm text-gray-600 mt-1">
                  ตรวจสอบแหล่งที่มาและคุณภาพของสมุนไพร เพิ่มความมั่นใจในความปลอดภัยและคุณภาพของผลิตภัณฑ์
                </p>
              </div>
              
              <div className="border rounded-lg p-3 bg-gray-50">
                <h4 className="font-medium text-green-700">สำหรับหน่วยงานกำกับดูแล</h4>
                <p className="text-sm text-gray-600 mt-1">
                  เพิ่มประสิทธิภาพในการติดตามและตรวจสอบ ช่วยในการออกใบรับรองมาตรฐาน และสนับสนุนการพัฒนาอุตสาหกรรมสมุนไพร
                </p>
              </div>
              
              <div className="border rounded-lg p-3 bg-gray-50">
                <h4 className="font-medium text-green-700">สำหรับผู้ส่งออกและตลาดต่างประเทศ</h4>
                <p className="text-sm text-gray-600 mt-1">
                  รับรองว่าสมุนไพรและผลิตภัณฑ์ผ่านมาตรฐานสากล เช่น GMP, GACP ช่วยเพิ่มโอกาสการแข่งขันในตลาดโลก
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
