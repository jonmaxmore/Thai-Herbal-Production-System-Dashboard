
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, Video, Users, CheckCircle, Clock, AlertTriangle, Award } from "lucide-react";
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import GACPApplicationForm from "@/components/gacp/GACPApplicationForm";
import { GACPApplicationService } from "@/services/gacpApplicationService";
import { GACPApplication, GACPApplicationStatus } from "@/utils/database/types";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<GACPApplicationStatus, string> = {
  "Draft": "bg-gray-500",
  "Submitted": "bg-blue-500",
  "Under Review": "bg-yellow-500",
  "Pre-Approved": "bg-green-500",
  "Rejected": "bg-red-500",
  "Site Inspection Scheduled": "bg-purple-500",
  "Site Inspection Complete": "bg-indigo-500",
  "Approved": "bg-emerald-500",
  "Certificate Issued": "bg-green-600"
};

const statusIcons: Record<GACPApplicationStatus, React.ReactNode> = {
  "Draft": <FileText className="h-4 w-4" />,
  "Submitted": <Clock className="h-4 w-4" />,
  "Under Review": <AlertTriangle className="h-4 w-4" />,
  "Pre-Approved": <Video className="h-4 w-4" />,
  "Rejected": <AlertTriangle className="h-4 w-4" />,
  "Site Inspection Scheduled": <Calendar className="h-4 w-4" />,
  "Site Inspection Complete": <Users className="h-4 w-4" />,
  "Approved": <CheckCircle className="h-4 w-4" />,
  "Certificate Issued": <Award className="h-4 w-4" />
};

export default function GACPApplications() {
  const [applications, setApplications] = useState<GACPApplication[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const apps = GACPApplicationService.getAllApplications();
    const stats = GACPApplicationService.getApplicationStatistics();
    setApplications(apps);
    setStatistics(stats);
  };

  const handleApplicationCreated = (applicationId: string) => {
    toast({
      title: "ใบสมัครถูกสร้าง",
      description: `รหัสใบสมัคร: ${applicationId}`,
    });
    loadData();
  };

  const getFilteredApplications = () => {
    if (activeTab === "all") return applications;
    return applications.filter(app => {
      switch (activeTab) {
        case "pending": return ["Draft", "Submitted", "Under Review"].includes(app.status);
        case "review": return ["Pre-Approved", "Site Inspection Scheduled"].includes(app.status);
        case "completed": return ["Approved", "Certificate Issued"].includes(app.status);
        case "rejected": return app.status === "Rejected";
        default: return true;
      }
    });
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('th-TH');
  };

  const getStatusDescription = (status: GACPApplicationStatus) => {
    switch (status) {
      case "Draft": return "ร่างใบสมัคร";
      case "Submitted": return "ส่งใบสมัครแล้ว";
      case "Under Review": return "อยู่ระหว่างตรวจสอบ";
      case "Pre-Approved": return "ผ่านการตรวจสอบเบื้องต้น";
      case "Rejected": return "ไม่ผ่านการตรวจสอบ";
      case "Site Inspection Scheduled": return "นัดตรวจสถานที่";
      case "Site Inspection Complete": return "ตรวจสถานที่เสร็จแล้ว";
      case "Approved": return "อนุมัติแล้ว";
      case "Certificate Issued": return "ออกใบรับรองแล้ว";
      default: return status;
    }
  };

  return (
    <HerbTraceLayout activeTab="certification">
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-green-800">ใบสมัคร GACP Certificate</h2>
            <p className="text-gray-600">จัดการใบสมัครขอใบรับรองมาตรฐาน GACP</p>
          </div>
          
          <GACPApplicationForm 
            farmerId="FARM_001" 
            userId="USER_001"
            onApplicationCreated={handleApplicationCreated}
          />
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">ใบสมัครทั้งหมด</p>
                    <p className="text-2xl font-bold">{statistics.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">รอตรวจสอบ</p>
                    <p className="text-2xl font-bold">
                      {(statistics.statusCounts["Submitted"] || 0) + (statistics.statusCounts["Under Review"] || 0)}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">ได้รับใบรับรอง</p>
                    <p className="text-2xl font-bold">{statistics.statusCounts["Certificate Issued"] || 0}</p>
                  </div>
                  <Award className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">อัตราความสำเร็จ</p>
                    <p className="text-2xl font-bold">{statistics.approvalRate.toFixed(1)}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายการใบสมัคร</CardTitle>
            <CardDescription>
              ติดตามสถานะใบสมัครขอใบรับรองมาตรฐาน GACP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                <TabsTrigger value="pending">รอดำเนินการ</TabsTrigger>
                <TabsTrigger value="review">อยู่ระหว่างตรวจสอบ</TabsTrigger>
                <TabsTrigger value="completed">เสร็จสิ้น</TabsTrigger>
                <TabsTrigger value="rejected">ไม่ผ่าน</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รหัสใบสมัคร</TableHead>
                      <TableHead>ฟาร์ม</TableHead>
                      <TableHead>วันที่ยื่น</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>ขั้นตอนถัดไป</TableHead>
                      <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredApplications().map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-mono text-sm">
                          {application.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{application.farmData.name || "ไม่ระบุชื่อ"}</div>
                            <div className="text-sm text-gray-500">{application.farmData.province}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDate(application.submittedDate)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[application.status]} text-white`}>
                            <span className="mr-1">{statusIcons[application.status]}</span>
                            {getStatusDescription(application.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {application.status === "Pre-Approved" && application.preApprovalData?.videoCallDate && (
                              <div className="flex items-center text-blue-600">
                                <Video className="h-4 w-4 mr-1" />
                                Video Call: {formatDate(application.preApprovalData.videoCallDate)}
                              </div>
                            )}
                            {application.status === "Site Inspection Scheduled" && application.siteInspection?.scheduledDate && (
                              <div className="flex items-center text-purple-600">
                                <Calendar className="h-4 w-4 mr-1" />
                                ตรวจสถานที่: {formatDate(application.siteInspection.scheduledDate)}
                              </div>
                            )}
                            {application.status === "Certificate Issued" && application.certificateData?.certificateNumber && (
                              <div className="flex items-center text-green-600">
                                <Award className="h-4 w-4 mr-1" />
                                เลขที่: {application.certificateData.certificateNumber}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            ดูรายละเอียด
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {getFilteredApplications().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    ไม่มีใบสมัครในหมวดหมู่นี้
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
