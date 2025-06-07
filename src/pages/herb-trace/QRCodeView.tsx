
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Download, Search, Plus, Eye } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface QRCodeRecord {
  id: string;
  qrId: string;
  herbName: string;
  batchNumber: string;
  farmName: string;
  harvestDate: string;
  status: "active" | "inactive" | "expired";
  scans: number;
  createdDate: string;
}

const mockQRCodes: QRCodeRecord[] = [
  {
    id: "1",
    qrId: "TTM-QR-001",
    herbName: "ฟ้าทะลายโจร",
    batchNumber: "FTJ-2024-001",
    farmName: "สวนเกษตรอินทรีย์ภาคเหนือ",
    harvestDate: "2024-05-15",
    status: "active",
    scans: 127,
    createdDate: "2024-05-16"
  },
  {
    id: "2",
    qrId: "TTM-QR-002",
    herbName: "ขมิ้นชัน",
    batchNumber: "KC-2024-002",
    farmName: "แปลงเกษตรกรรมอินทรีย์ใต้",
    harvestDate: "2024-05-20",
    status: "active",
    scans: 89,
    createdDate: "2024-05-21"
  },
  {
    id: "3",
    qrId: "TTM-QR-003",
    herbName: "ใบบัวบก",
    batchNumber: "BBK-2024-003",
    farmName: "วิสาหกิจชุมชนสมุนไพรอีสาน",
    harvestDate: "2024-04-30",
    status: "expired",
    scans: 256,
    createdDate: "2024-05-01"
  }
];

const getStatusBadge = (status: string) => {
  const statusMap = {
    active: { label: "ใช้งานได้", variant: "default" as const },
    inactive: { label: "ไม่ใช้งาน", variant: "secondary" as const },
    expired: { label: "หมดอายุ", variant: "destructive" as const }
  };
  
  const statusInfo = statusMap[status as keyof typeof statusMap];
  return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
};

export default function QRCodeView() {
  const [selectedHerb, setSelectedHerb] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const generateQRCode = () => {
    if (selectedHerb && batchNumber) {
      const qrData = {
        herb: selectedHerb,
        batch: batchNumber,
        farm: "สวนเกษตรตัวอย่าง",
        harvestDate: new Date().toISOString().split('T')[0],
        verificationUrl: `https://herbtrace.go.th/verify/${batchNumber}`
      };
      setQrValue(JSON.stringify(qrData));
    }
  };

  const filteredQRCodes = mockQRCodes.filter(qr =>
    qr.herbName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qr.qrId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qr.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <HerbTraceLayout activeTab="qrcode">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">QR Code สมุนไพร</h1>
            <p className="text-muted-foreground">
              สร้างและจัดการ QR Code สำหรับติดตามสมุนไพรตามมาตรฐาน Traceability
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                สร้าง QR Code ใหม่
              </CardTitle>
              <CardDescription>
                สร้าง QR Code สำหรับติดตามสมุนไพรจากแปลงถึงผู้บริโภค
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="herb">ชื่อสมุนไพร</Label>
                <Input
                  id="herb"
                  value={selectedHerb}
                  onChange={(e) => setSelectedHerb(e.target.value)}
                  placeholder="เช่น ฟ้าทะลายโจร"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="batch">หมายเลขแบทช์</Label>
                <Input
                  id="batch"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="เช่น FTJ-2024-001"
                />
              </div>
              
              <Button onClick={generateQRCode} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                สร้าง QR Code
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>QR Code ที่สร้าง</CardTitle>
              <CardDescription>
                แสกนเพื่อตรวจสอบข้อมูลสมุนไพร
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              {qrValue ? (
                <div className="space-y-4 text-center">
                  <div className="p-4 bg-white border rounded-lg">
                    <QRCode value={qrValue} size={200} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      สมุนไพร: {selectedHerb}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      แบทช์: {batchNumber}
                    </p>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      ดาวน์โหลด QR Code
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <QrCode className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    กรุณากรอกข้อมูลเพื่อสร้าง QR Code
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>QR Code ที่สร้างแล้ว</CardTitle>
            <CardDescription>
              รายการ QR Code ที่สร้างในระบบพร้อมสถิติการใช้งาน
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="ค้นหา QR Code..."
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
                  <TableHead>รหัส QR</TableHead>
                  <TableHead>ชื่อสมุนไพร</TableHead>
                  <TableHead>หมายเลขแบทช์</TableHead>
                  <TableHead>แหล่งที่มา</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>จำนวนสแกน</TableHead>
                  <TableHead>วันที่สร้าง</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQRCodes.map((qr) => (
                  <TableRow key={qr.id}>
                    <TableCell className="font-medium">{qr.qrId}</TableCell>
                    <TableCell>{qr.herbName}</TableCell>
                    <TableCell>{qr.batchNumber}</TableCell>
                    <TableCell>{qr.farmName}</TableCell>
                    <TableCell>{getStatusBadge(qr.status)}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{qr.scans}</span> ครั้ง
                    </TableCell>
                    <TableCell>{qr.createdDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          ดู
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          ดาวน์โหลด
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
