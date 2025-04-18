
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from '@/components/ui/table';
import { Users, Building2, User, Flask, Code } from 'lucide-react';

interface StakeholderType {
  id: string;
  name: string;
  type: string;
  role: string;
  interest: string;
  influence: 'High' | 'Medium' | 'Low';
}

export const StakeholderRegister: React.FC = () => {
  // Define stakeholders based on your requirements
  const stakeholders: StakeholderType[] = [
    {
      id: 'STK001',
      name: 'กรมแพทย์แผนไทยและการแพทย์ทางเลือก (DTM)',
      type: 'หน่วยงาน',
      role: 'ผู้ใช้งานหลัก รับข้อมูลและนำไปใช้กำกับดูแลมาตรฐานสมุนไพร',
      interest: 'การใช้งานระบบและมาตรฐานคุณภาพ',
      influence: 'High'
    },
    {
      id: 'STK002',
      name: 'สำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ (มกอช.)',
      type: 'หน่วยงาน',
      role: 'ถ่ายทอดองค์ความรู้และประเมินตามมาตรฐาน',
      interest: 'ถ่ายทอดมาตรฐานปฏิบัติ',
      influence: 'Medium'
    },
    {
      id: 'STK003',
      name: 'เกษตรกรสมุนไพร',
      type: 'บุคคล',
      role: 'ปลูกและจัดหาข้อมูลวัตถุดิบ',
      interest: 'รายได้และความยั่งยืน',
      influence: 'Medium'
    },
    {
      id: 'STK004',
      name: 'ห้องปฏิบัติการ',
      type: 'บริการ/ห้องปฏิบัติการ',
      role: 'วิเคราะห์และทดสอบตัวอย่างสมุนไพร',
      interest: 'ความแม่นยำของผลทดสอบ',
      influence: 'Medium'
    },
    {
      id: 'STK005',
      name: 'ผู้ให้บริการแพลตฟอร์ม',
      type: 'บริการ/ห้องปฏิบัติการ',
      role: 'พัฒนา ดูแลระบบ hosting, API, support',
      interest: 'เสถียรภาพและประสิทธิภาพของระบบ',
      influence: 'High'
    }
  ];

  // Function to get the appropriate icon for each stakeholder type
  const getStakeholderIcon = (type: string) => {
    switch (type) {
      case 'หน่วยงาน':
        return <Building2 className="h-5 w-5 text-blue-600" />;
      case 'บุคคล':
        return <User className="h-5 w-5 text-green-600" />;
      case 'บริการ/ห้องปฏิบัติการ':
        if (stakeholders.find(s => s.type === type)?.name.includes('ห้องปฏิบัติการ')) {
          return <Flask className="h-5 w-5 text-purple-600" />;
        }
        return <Code className="h-5 w-5 text-orange-600" />;
      default:
        return <Users className="h-5 w-5 text-gray-600" />;
    }
  };

  // Function to get the influence badge class
  const getInfluenceBadgeClass = (influence: 'High' | 'Medium' | 'Low') => {
    switch (influence) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Users className="h-5 w-5 text-green-600" />
          ทะเบียนผู้มีส่วนได้ส่วนเสีย (Stakeholder Register)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">ประเภท</TableHead>
                <TableHead>กลุ่มผู้มีส่วนได้ส่วนเสีย</TableHead>
                <TableHead className="w-[250px]">บทบาทหลัก</TableHead>
                <TableHead className="w-[200px]">ความสนใจ</TableHead>
                <TableHead className="w-[100px]">อิทธิพล</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stakeholders.map((stakeholder) => (
                <TableRow key={stakeholder.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getStakeholderIcon(stakeholder.type)}
                      <span>{stakeholder.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{stakeholder.name}</TableCell>
                  <TableCell>{stakeholder.role}</TableCell>
                  <TableCell>{stakeholder.interest}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getInfluenceBadgeClass(stakeholder.influence)}`}>
                      {stakeholder.influence}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
