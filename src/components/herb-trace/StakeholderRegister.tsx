
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Building, User, FlaskConical, Globe
} from "lucide-react";

type StakeholderInfluence = "High" | "Medium" | "Low";

interface Stakeholder {
  type: string;
  name: string;
  role: string;
  interest: string;
  influence: StakeholderInfluence;
}

interface StakeholderRegisterProps {
  stakeholders: Stakeholder[];
}

export function StakeholderRegister({ stakeholders }: StakeholderRegisterProps) {
  // Helper function to get icon for stakeholder type
  const getStakeholderIcon = (type: string) => {
    switch (type) {
      case "หน่วยงาน":
        return <Building className="h-5 w-5 text-blue-500" />;
      case "บุคคล":
        return <User className="h-5 w-5 text-green-500" />;
      case "บริการ":
        return <FlaskConical className="h-5 w-5 text-purple-500" />;
      default:
        return <Globe className="h-5 w-5 text-gray-500" />;
    }
  };

  // Helper function to get color for influence level
  const getInfluenceColor = (influence: StakeholderInfluence) => {
    switch (influence) {
      case "High":
        return "bg-red-100 text-red-800 border-red-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Low":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  
  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-green-800">ทะเบียนผู้มีส่วนได้ส่วนเสีย (Stakeholder Register)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ประเภท</TableHead>
                <TableHead>กลุ่มผู้มีส่วนได้ส่วนเสีย</TableHead>
                <TableHead>บทบาทหลัก</TableHead>
                <TableHead>ความสนใจ</TableHead>
                <TableHead className="w-[100px]">อิทธิพล</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stakeholders.map((stakeholder, index) => (
                <TableRow key={index}>
                  <TableCell className="flex items-center gap-2">
                    {getStakeholderIcon(stakeholder.type)}
                    {stakeholder.type}
                  </TableCell>
                  <TableCell className="font-medium">{stakeholder.name}</TableCell>
                  <TableCell>{stakeholder.role}</TableCell>
                  <TableCell>{stakeholder.interest}</TableCell>
                  <TableCell>
                    <Badge className={getInfluenceColor(stakeholder.influence)}>
                      {stakeholder.influence}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
