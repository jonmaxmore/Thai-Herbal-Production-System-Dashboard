
import { useState, useEffect } from "react";
import { ClipboardCheck, FlaskConical, CheckCircle, AlertTriangle, Clock, FileText, Download, Eye } from "lucide-react";
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { mockDatabase } from "@/utils/database";

// Mock lab results data based on DTTM standards
const labResults = [
  {
    id: "LAB_001",
    sampleId: "SMP_001",
    herbName: "กัญชาสายพันธุ์เหนือ",
    farmerId: "FARM_001",
    testDate: "2024-12-01",
    testType: "ตรวจสอบคุณภาพพื้นฐาน",
    status: "Completed",
    results: {
      thc: "0.85%",
      cbd: "12.5%",
      moisture: "8.2%",
      heavyMetals: "ไม่พบ",
      pesticides: "ไม่พบ",
      microbiology: "ผ่านมาตรฐาน"
    },
    certifiedBy: "ดร.สมชาย ใจดี",
    certificateNumber: "DTTM-2024-001",
    passed: true
  },
  {
    id: "LAB_002",
    sampleId: "SMP_002",
    herbName: "ฟ้าทะลายโจร",
    farmerId: "FARM_005",
    testDate: "2024-11-28",
    testType: "ตรวจสอบสารปนเปื้อน",
    status: "Completed",
    results: {
      activeCompounds: "12.8 mg/g",
      heavyMetals: "ไม่พบ",
      aflatoxin: "ไม่พบ",
      pesticides: "ไม่พบ",
      moisture: "9.1%"
    },
    certifiedBy: "ดร.วิไล สุขใส",
    certificateNumber: "DTTM-2024-002",
    passed: true
  },
  {
    id: "LAB_003",
    sampleId: "SMP_003",
    herbName: "กัญชาไทยแลนด์",
    farmerId: "FARM_003",
    testDate: "2024-12-02",
    testType: "ตรวจสอบคุณภาพครบวงจร",
    status: "In Progress",
    results: {
      thc: "รอผล",
      cbd: "รอผล",
      moisture: "7.8%",
      heavyMetals: "รอผล"
    },
    certifiedBy: "รอการรับรอง",
    certificateNumber: "รอออกใบรับรอง",
    passed: null
  }
];

const inspectionProcesses = [
  {
    id: "INS_001",
    farmName: "ฟาร์มกัญชาอินทรีย์",
    location: "เชียงใหม่",
    inspectionType: "GACP Certification",
    status: "Scheduled",
    inspectionDate: "2024-12-15",
    inspector: "คุณสมหญิง จันทร์ดี",
    notes: "ตรวจสอบระบบการจัดการคุณภาพและการเก็บบันทึก"
  },
  {
    id: "INS_002",
    farmName: "ฟาร์มสมุนไพรไทย",
    location: "น่าน",
    inspectionType: "EU-GMP Certification",
    status: "Completed",
    inspectionDate: "2024-11-20",
    inspector: "ดร.ประยุทธ สุขสม",
    notes: "ผ่านการตรวจสอบทุกมาตรฐาน"
  }
];

export default function InspectionView() {
  const [activeTab, setActiveTab] = useState("lab-results");
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">เสร็จสิ้น</Badge>;
      case "In Progress":
        return <Badge className="bg-yellow-100 text-yellow-800">กำลังดำเนินการ</Badge>;
      case "Scheduled":
        return <Badge className="bg-blue-100 text-blue-800">นัดหมายแล้ว</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleDownloadCertificate = (certificateNumber: string) => {
    toast({
      title: "ดาวน์โหลดใบรับรอง",
      description: `กำลังดาวน์โหลดใบรับรอง ${certificateNumber}`,
    });
  };

  const handleViewDetails = (id: string) => {
    toast({
      title: "ดูรายละเอียด",
      description: `แสดงรายละเอียดการตรวจสอบ ${id}`,
    });
  };

  return (
    <HerbTraceLayout activeTab="inspection">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-green-800">การตรวจประเมินและใบรับรอง</h2>
            <p className="text-gray-600 mt-2">ระบบการตรวจสอบคุณภาพและออกใบรับรองตามมาตรฐาน DTTM</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              รายงานสรุป
            </Button>
            <Button>
              <FlaskConical className="h-4 w-4 mr-2" />
              ส่งตัวอย่างใหม่
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FlaskConical className="h-5 w-5 mr-2 text-blue-500" />
                ตัวอย่างทั้งหมด
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{labResults.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                ผ่านการตรวจสอบ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {labResults.filter(r => r.passed === true).length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                รอผลการตรวจ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">
                {labResults.filter(r => r.passed === null).length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ClipboardCheck className="h-5 w-5 mr-2 text-purple-500" />
                ใบรับรองออกแล้ว
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">
                {labResults.filter(r => r.certificateNumber && !r.certificateNumber.includes("รอ")).length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="lab-results">ผลการตรวจจากแล็บ</TabsTrigger>
            <TabsTrigger value="inspections">การตรวจประเมิน</TabsTrigger>
            <TabsTrigger value="certificates">ใบรับรอง</TabsTrigger>
          </TabsList>

          <TabsContent value="lab-results">
            <Card>
              <CardHeader>
                <CardTitle>ผลการตรวจวิเคราะห์จากห้องปฏิบัติการ</CardTitle>
                <CardDescription>
                  ผลการตรวจสอบคุณภาพสมุนไพรตามมาตรฐานกรมแพทย์แผนไทยและการแพทย์ทางเลือก
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รหัสตัวอย่าง</TableHead>
                      <TableHead>ชื่อสมุนไพร</TableHead>
                      <TableHead>วันที่ตรวจ</TableHead>
                      <TableHead>ประเภทการตรวจ</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>ผู้รับรอง</TableHead>
                      <TableHead>การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.sampleId}</TableCell>
                        <TableCell>{result.herbName}</TableCell>
                        <TableCell>{result.testDate}</TableCell>
                        <TableCell>{result.testType}</TableCell>
                        <TableCell>{getStatusBadge(result.status)}</TableCell>
                        <TableCell>{result.certifiedBy}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewDetails(result.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {result.passed && (
                              <Button 
                                size="sm"
                                onClick={() => handleDownloadCertificate(result.certificateNumber)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inspections">
            <Card>
              <CardHeader>
                <CardTitle>การตรวจประเมินฟาร์ม</CardTitle>
                <CardDescription>
                  การตรวจสอบมาตรฐาน GACP, EU-GMP และ DTTM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ชื่อฟาร์ม</TableHead>
                      <TableHead>สถานที่</TableHead>
                      <TableHead>ประเภทการตรวจ</TableHead>
                      <TableHead>วันที่นัด</TableHead>
                      <TableHead>ผู้ตรวจ</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspectionProcesses.map((inspection) => (
                      <TableRow key={inspection.id}>
                        <TableCell className="font-medium">{inspection.farmName}</TableCell>
                        <TableCell>{inspection.location}</TableCell>
                        <TableCell>{inspection.inspectionType}</TableCell>
                        <TableCell>{inspection.inspectionDate}</TableCell>
                        <TableCell>{inspection.inspector}</TableCell>
                        <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewDetails(inspection.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            ดูรายละเอียด
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>ใบรับรองที่ออกแล้ว</CardTitle>
                <CardDescription>
                  ใบรับรองมาตรฐานที่ออกโดยกรมแพทย์แผนไทยและการแพทย์ทางเลือก
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {labResults.filter(r => r.passed && !r.certificateNumber.includes("รอ")).map((result) => (
                    <Card key={result.id} className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{result.herbName}</CardTitle>
                        <CardDescription>เลขที่ใบรับรอง: {result.certificateNumber}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <p><strong>วันที่ออกใบรับรอง:</strong> {result.testDate}</p>
                          <p><strong>ผู้รับรอง:</strong> {result.certifiedBy}</p>
                          <p><strong>ประเภทการตรวจ:</strong> {result.testType}</p>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleDownloadCertificate(result.certificateNumber)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            ดาวน์โหลด
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HerbTraceLayout>
  );
}
