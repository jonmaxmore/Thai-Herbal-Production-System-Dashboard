
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FlaskConical, Plus, Search, FileText, Calendar, MapPin, User } from "lucide-react";
import { useState } from "react";

interface LabSample {
  id: string;
  sampleCode: string;
  herbName: string;
  farmSource: string;
  location: string;
  collectionDate: string;
  submittedBy: string;
  testType: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  priority: "high" | "medium" | "low";
  estimatedCompletion: string;
}

const mockSamples: LabSample[] = [
  {
    id: "1",
    sampleCode: "TTM-2024-001",
    herbName: "ฟ้าทะลายโจร",
    farmSource: "สวนเกษตรอินทรีย์ภาคเหนือ",
    location: "เชียงใหม่",
    collectionDate: "2024-06-01",
    submittedBy: "นายสมชาย ใจดี",
    testType: "การตรวจสอบสารออกฤทธิ์",
    status: "in_progress",
    priority: "high",
    estimatedCompletion: "2024-06-15"
  },
  {
    id: "2",
    sampleCode: "TTM-2024-002",
    herbName: "ขมิ้นชัน",
    farmSource: "แปลงเกษตรกรรมอินทรีย์ใต้",
    location: "สงขลา",
    collectionDate: "2024-06-03",
    submittedBy: "นางสุดา เขียวใส",
    testType: "การตรวจสอบสารพิษตกค้าง",
    status: "completed",
    priority: "medium",
    estimatedCompletion: "2024-06-10"
  },
  {
    id: "3",
    sampleCode: "TTM-2024-003",
    herbName: "ใบบัวบก",
    farmSource: "วิสาหกิจชุมชนสมุนไพรอีสาน",
    location: "ขอนแก่น",
    collectionDate: "2024-06-05",
    submittedBy: "นายพิเชษฐ์ ดีงาม",
    testType: "การตรวจสอบคุณภาพและปริมาณ",
    status: "pending",
    priority: "low",
    estimatedCompletion: "2024-06-20"
  }
];

const getStatusBadge = (status: string) => {
  const statusMap = {
    pending: { label: "รอดำเนินการ", variant: "secondary" as const },
    in_progress: { label: "กำลังตรวจ", variant: "default" as const },
    completed: { label: "เสร็จสิ้น", variant: "default" as const },
    rejected: { label: "ปฏิเสธ", variant: "destructive" as const }
  };
  
  const statusInfo = statusMap[status as keyof typeof statusMap];
  return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
};

const getPriorityBadge = (priority: string) => {
  const priorityMap = {
    high: { label: "สูง", variant: "destructive" as const },
    medium: { label: "ปานกลาง", variant: "default" as const },
    low: { label: "ต่ำ", variant: "secondary" as const }
  };
  
  const priorityInfo = priorityMap[priority as keyof typeof priorityMap];
  return <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>;
};

export default function LabSamplesView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [samples] = useState<LabSample[]>(mockSamples);

  const filteredSamples = samples.filter(sample =>
    sample.herbName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sample.sampleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sample.farmSource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <HerbTraceLayout activeTab="lab_samples">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ตัวอย่างวิเคราะห์</h1>
            <p className="text-muted-foreground">
              จัดการตัวอย่างสมุนไพรสำหรับการวิเคราะห์ตามมาตรฐานกรมแพทย์แผนไทยฯ
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มตัวอย่างใหม่
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ตัวอย่างทั้งหมด</CardTitle>
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{samples.length}</div>
              <p className="text-xs text-muted-foreground">
                รายการทั้งหมดในระบบ
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">กำลังตรวจสอบ</CardTitle>
              <FlaskConical className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {samples.filter(s => s.status === "in_progress").length}
              </div>
              <p className="text-xs text-muted-foreground">
                อยู่ระหว่างดำเนินการ
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">เสร็จสิ้น</CardTitle>
              <FlaskConical className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {samples.filter(s => s.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">
                ผลการวิเคราะห์แล้ว
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">รอดำเนินการ</CardTitle>
              <FlaskConical className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {samples.filter(s => s.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">
                รอเข้าคิวตรวจ
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>รายการตัวอย่างวิเคราะห์</CardTitle>
            <CardDescription>
              ตัวอย่างสมุนไพรที่ส่งเข้ามาวิเคราะห์ตามมาตรฐาน กษ. และ อย.
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="ค้นหาตัวอย่าง..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัสตัวอย่าง</TableHead>
                  <TableHead>ชื่อสมุนไพร</TableHead>
                  <TableHead>แหล่งที่มา</TableHead>
                  <TableHead>ประเภทการตรวจ</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>ความสำคัญ</TableHead>
                  <TableHead>กำหนดเสร็จ</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSamples.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium">{sample.sampleCode}</TableCell>
                    <TableCell>{sample.herbName}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span className="text-sm">{sample.farmSource}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{sample.location}</div>
                    </TableCell>
                    <TableCell>{sample.testType}</TableCell>
                    <TableCell>{getStatusBadge(sample.status)}</TableCell>
                    <TableCell>{getPriorityBadge(sample.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">{sample.estimatedCompletion}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          ดูรายละเอียด
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
