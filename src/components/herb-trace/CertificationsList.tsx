
import React, { useState } from "react";
import { Search, Filter, Star, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/StatusBadge";
import { ProcessStatus } from "@/utils/database/types";
import { EnhancedFarm } from "@/utils/database";

interface CertificationsListProps {
  farmers: EnhancedFarm[];
}

export default function CertificationsList({ farmers }: CertificationsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProcessStatus | "All">("All");
  
  // Filter farmers based on search term and status filter
  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = searchTerm 
      ? farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        farmer.herb.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter !== "All" 
      ? farmer.gacp === statusFilter
      : true;
    
    return matchesSearch && matchesStatus;
  });

  const formatCertificateInfo = (status: string, certificateNumber?: string, expiryDate?: string) => {
    if (status === "Passed" || status === "Approved") {
      return (
        <div className="text-xs text-gray-600">
          {certificateNumber && <div>เลขที่: {certificateNumber}</div>}
          {expiryDate && <div>หมดอายุ: {new Date(expiryDate).toLocaleDateString('th-TH')}</div>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold hidden md:block text-green-800">เกษตรกรที่ได้รับการรับรอง</h2>
          <p className="text-sm text-gray-600">GACP เป็นใบรับรองหลัก, อื่นๆ เป็น optional</p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Star className="h-4 w-4 text-yellow-500" />
          <span>GACP = ใบรับรองหลัก</span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" />
          <Input
            className="pl-10 border-green-200 focus:border-green-500"
            placeholder="ค้นหาเกษตรกรตามชื่อหรือสมุนไพร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-green-600" />
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as ProcessStatus | "All")}
          >
            <SelectTrigger className="w-[180px] border-green-200">
              <SelectValue placeholder="กรองตามสถานะ GACP" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">สถานะทั้งหมด</SelectItem>
              <SelectItem value="Passed">ผ่าน</SelectItem>
              <SelectItem value="Failed">ไม่ผ่าน</SelectItem>
              <SelectItem value="Pending">รอดำเนินการ</SelectItem>
              <SelectItem value="In Progress">กำลังดำเนินการ</SelectItem>
              <SelectItem value="Expired">หมดอายุ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            รายการใบรับรอง
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>ชื่อ</TableHead>
                  <TableHead>สมุนไพร</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>GACP</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">EU-GMP (Optional)</TableHead>
                  <TableHead className="text-center">DTTM (Optional)</TableHead>
                  <TableHead className="text-center">TIS (Optional)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFarmers.map(farmer => (
                  <TableRow key={farmer.id} className="hover:bg-green-50">
                    <TableCell>{farmer.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{farmer.name}</div>
                        <div className="text-sm text-gray-500">{farmer.province}</div>
                      </div>
                    </TableCell>
                    <TableCell>{farmer.herb}</TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <StatusBadge status={farmer.gacp} isPrimary={true} />
                        {formatCertificateInfo(farmer.gacp, farmer.gacpCertificateNumber, farmer.gacpExpiryDate)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <StatusBadge status={farmer.optionalCertifications?.euGmp || "Not Applied"} />
                        {farmer.optionalCertifications?.euGmpSource === "ministry_api" && (
                          <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                            <ExternalLink className="h-3 w-3" />
                            <span>API</span>
                          </div>
                        )}
                        {formatCertificateInfo(
                          farmer.optionalCertifications?.euGmp || "Not Applied", 
                          farmer.optionalCertifications?.euGmpCertificateNumber, 
                          farmer.optionalCertifications?.euGmpExpiryDate
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <StatusBadge status={farmer.optionalCertifications?.dttm || "Not Applied"} />
                        {farmer.optionalCertifications?.dttmSource === "ministry_api" && (
                          <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                            <ExternalLink className="h-3 w-3" />
                            <span>API</span>
                          </div>
                        )}
                        {formatCertificateInfo(
                          farmer.optionalCertifications?.dttm || "Not Applied", 
                          farmer.optionalCertifications?.dttmCertificateNumber, 
                          farmer.optionalCertifications?.dttmExpiryDate
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <StatusBadge status={farmer.optionalCertifications?.tis || "Not Applied"} />
                        {farmer.optionalCertifications?.tisSource === "ministry_api" && (
                          <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                            <ExternalLink className="h-3 w-3" />
                            <span>API</span>
                          </div>
                        )}
                        {formatCertificateInfo(
                          farmer.optionalCertifications?.tis || "Not Applied", 
                          farmer.optionalCertifications?.tisCertificateNumber, 
                          farmer.optionalCertifications?.tisExpiryDate
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredFarmers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              ไม่พบเกษตรกรที่ตรงกับเงื่อนไขการค้นหา
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
