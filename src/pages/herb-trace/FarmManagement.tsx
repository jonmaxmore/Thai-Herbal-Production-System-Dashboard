
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Leaf, Plus, Search, MapPin, Calendar, User, TrendingUp } from "lucide-react";
import { useState } from "react";

interface Farm {
  id: string;
  name: string;
  owner: string;
  location: string;
  area: number;
  herbs: string[];
  certification: "GAP" | "Organic" | "None";
  status: "active" | "inactive" | "pending";
  lastUpdate: string;
  yield: number;
}

const mockFarms: Farm[] = [
  {
    id: "1",
    name: "สวนเกษตรอินทรีย์ภาคเหนือ",
    owner: "นายสมชาย ใจดี",
    location: "เชียงใหม่",
    area: 15.5,
    herbs: ["ฟ้าทะลายโจร", "ขิง", "ขมิ้น"],
    certification: "Organic",
    status: "active",
    lastUpdate: "2024-06-05",
    yield: 85
  },
  {
    id: "2",
    name: "แปลงเกษตรกรรมอินทรีย์ใต้",
    owner: "นางสุดา เขียวใส",
    location: "สงขลา",
    area: 22.3,
    herbs: ["ขมิ้นชัน", "กะเพรา", "โหระพา"],
    certification: "GAP",
    status: "active",
    lastUpdate: "2024-06-03",
    yield: 92
  },
  {
    id: "3",
    name: "วิสาหกิจชุมชนสมุนไพรอีสาน",
    owner: "นายพิเชษฐ์ ดีงาม",
    location: "ขอนแก่น",
    area: 18.7,
    herbs: ["ใบบัวบก", "ผักบุ้งจีน", "ตะไคร้"],
    certification: "GAP",
    status: "pending",
    lastUpdate: "2024-06-01",
    yield: 78
  }
];

const getCertificationBadge = (cert: string) => {
  const certMap = {
    GAP: { label: "GAP", variant: "default" as const },
    Organic: { label: "อินทรีย์", variant: "default" as const },
    None: { label: "ไม่มี", variant: "secondary" as const }
  };
  
  const certInfo = certMap[cert as keyof typeof certMap];
  return <Badge variant={certInfo.variant}>{certInfo.label}</Badge>;
};

const getStatusBadge = (status: string) => {
  const statusMap = {
    active: { label: "ใช้งาน", variant: "default" as const },
    inactive: { label: "ไม่ใช้งาน", variant: "secondary" as const },
    pending: { label: "รอการอนุมัติ", variant: "destructive" as const }
  };
  
  const statusInfo = statusMap[status as keyof typeof statusMap];
  return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
};

export default function FarmManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [farms] = useState<Farm[]>(mockFarms);

  const filteredFarms = farms.filter(farm =>
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalArea = farms.reduce((sum, farm) => sum + farm.area, 0);
  const activeFarms = farms.filter(farm => farm.status === "active").length;
  const avgYield = farms.reduce((sum, farm) => sum + farm.yield, 0) / farms.length;

  return (
    <HerbTraceLayout activeTab="farms">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">จัดการแปลงปลูก</h1>
            <p className="text-muted-foreground">
              ระบบจัดการข้อมูลแปลงปลูกสมุนไพรและการติดตามผลผลิต
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มแปลงใหม่
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">แปลงทั้งหมด</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{farms.length}</div>
              <p className="text-xs text-muted-foreground">
                แปลงในระบบ
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">แปลงที่ใช้งาน</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeFarms}</div>
              <p className="text-xs text-muted-foreground">
                กำลังผลิต
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">พื้นที่รวม</CardTitle>
              <MapPin className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalArea.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                ไร่
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ผลผลิตเฉลี่ย</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{avgYield.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">
                ประสิทธิภาพ
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>รายการแปลงปลูก</CardTitle>
            <CardDescription>
              ข้อมูลแปลงปลูกสมุนไพรในระบบ พร้อมสถานะการรับรองมาตรฐาน
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="ค้นหาแปลงปลูก..."
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
                  <TableHead>ชื่อแปลง</TableHead>
                  <TableHead>เจ้าของ</TableHead>
                  <TableHead>ตำแหน่ง</TableHead>
                  <TableHead>พื้นที่ (ไร่)</TableHead>
                  <TableHead>สมุนไพรที่ปลูก</TableHead>
                  <TableHead>การรับรอง</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>ผลผลิต</TableHead>
                  <TableHead>อัปเดตล่าสุด</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFarms.map((farm) => (
                  <TableRow key={farm.id}>
                    <TableCell className="font-medium">{farm.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{farm.owner}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{farm.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>{farm.area}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {farm.herbs.slice(0, 2).map((herb, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {herb}
                          </Badge>
                        ))}
                        {farm.herbs.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{farm.herbs.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getCertificationBadge(farm.certification)}</TableCell>
                    <TableCell>{getStatusBadge(farm.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{farm.yield}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{farm.lastUpdate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
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
