
import { useState } from "react";
import { Sprout, Package, Truck, Store, MapPin, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

// Mock data for seed to sale tracking
const seedToSaleData = [
  {
    id: "STS_001",
    plantId: "PLANT_001",
    batchNumber: "BATCH_2024_001",
    herbName: "กัญชาสายพันธุ์เหนือ",
    farmName: "ฟาร์มกัญชาอินทรีย์",
    currentStage: "Harvested",
    progress: 75,
    timeline: [
      { stage: "Seeded", date: "2024-01-15", status: "completed" },
      { stage: "Growing", date: "2024-03-01", status: "completed" },
      { stage: "Flowering", date: "2024-05-15", status: "completed" },
      { stage: "Harvested", date: "2024-07-20", status: "completed" },
      { stage: "Processing", date: "2024-08-01", status: "in-progress" },
      { stage: "Testing", date: "2024-08-15", status: "pending" },
      { stage: "Packaging", date: "2024-09-01", status: "pending" },
      { stage: "Distribution", date: "2024-09-15", status: "pending" },
      { stage: "Retail", date: "2024-10-01", status: "pending" }
    ]
  },
  {
    id: "STS_002",
    plantId: "PLANT_002",
    batchNumber: "BATCH_2024_002",
    herbName: "ฟ้าทะลายโจร",
    farmName: "ฟาร์มสมุนไพรไทย",
    currentStage: "Testing",
    progress: 85,
    timeline: [
      { stage: "Seeded", date: "2024-02-01", status: "completed" },
      { stage: "Growing", date: "2024-04-01", status: "completed" },
      { stage: "Harvested", date: "2024-07-01", status: "completed" },
      { stage: "Processing", date: "2024-07-15", status: "completed" },
      { stage: "Testing", date: "2024-08-01", status: "in-progress" },
      { stage: "Packaging", date: "2024-08-20", status: "pending" },
      { stage: "Distribution", date: "2024-09-01", status: "pending" },
      { stage: "Retail", date: "2024-09-15", status: "pending" }
    ]
  }
];

export default function SeedToSaleView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedItem, setSelectedItem] = useState(seedToSaleData[0]);

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "Seeded": return <Sprout className="h-4 w-4" />;
      case "Growing": case "Flowering": return <Sprout className="h-4 w-4" />;
      case "Harvested": case "Processing": return <Package className="h-4 w-4" />;
      case "Testing": return <CheckCircle className="h-4 w-4" />;
      case "Packaging": return <Package className="h-4 w-4" />;
      case "Distribution": return <Truck className="h-4 w-4" />;
      case "Retail": return <Store className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">เสร็จสิ้น</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800">กำลังดำเนินการ</Badge>;
      case "pending":
        return <Badge className="bg-gray-100 text-gray-800">รอดำเนินการ</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <HerbTraceLayout activeTab="seed-to-sale">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-green-800">Seed to Sale Tracking</h2>
            <p className="text-gray-600 mt-2">ติดตามการเดินทางของสมุนไพรตั้งแต่เมล็ดจนถึงผู้บริโภค</p>
          </div>
          <Button>
            <Sprout className="h-4 w-4 mr-2" />
            เริ่มต้นการติดตามใหม่
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Sprout className="h-5 w-5 mr-2 text-green-500" />
                ปลูกแล้ว
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1,250</p>
              <p className="text-sm text-gray-600">ต้น</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-500" />
                แปรรูปแล้ว
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">850</p>
              <p className="text-sm text-gray-600">ชุด</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Truck className="h-5 w-5 mr-2 text-orange-500" />
                กำลังขนส่ง
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">320</p>
              <p className="text-sm text-gray-600">ชุด</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Store className="h-5 w-5 mr-2 text-purple-500" />
                จำหน่ายแล้ว
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">530</p>
              <p className="text-sm text-gray-600">ชุด</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
            <TabsTrigger value="timeline">ไทม์ไลน์</TabsTrigger>
            <TabsTrigger value="tracking">การติดตาม</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>รายการติดตาม Seed to Sale</CardTitle>
                  <CardDescription>
                    รายการสมุนไพรที่กำลังอยู่ในกระบวนการ Seed to Sale
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {seedToSaleData.map((item) => (
                      <div 
                        key={item.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedItem.id === item.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{item.herbName}</h4>
                          <Badge variant="secondary">{item.currentStage}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.farmName}</p>
                        <p className="text-sm text-gray-600 mb-3">Batch: {item.batchNumber}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>ความคืบหน้า</span>
                            <span>{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>รายละเอียดการติดตาม</CardTitle>
                  <CardDescription>
                    ข้อมูลละเอียดของ {selectedItem.herbName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">ข้อมูลพื้นฐาน</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">ชื่อสมุนไพร:</span>
                          <p className="font-medium">{selectedItem.herbName}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">ฟาร์ม:</span>
                          <p className="font-medium">{selectedItem.farmName}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Batch Number:</span>
                          <p className="font-medium">{selectedItem.batchNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">สถานะปัจจุบัน:</span>
                          <p className="font-medium">{selectedItem.currentStage}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">ไทม์ไลน์การดำเนินการ</h4>
                      <div className="space-y-3">
                        {selectedItem.timeline.slice(-4).map((timeline, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              timeline.status === 'completed' ? 'bg-green-100 text-green-600' :
                              timeline.status === 'in-progress' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {getStageIcon(timeline.stage)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{timeline.stage}</p>
                              <p className="text-sm text-gray-600">{timeline.date}</p>
                            </div>
                            {getStatusBadge(timeline.status)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>ไทม์ไลน์ทั้งหมด - {selectedItem.herbName}</CardTitle>
                <CardDescription>
                  การติดตามขั้นตอนการดำเนินการตั้งแต่เริ่มต้นจนถึงปัจจุบัน
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {selectedItem.timeline.map((timeline, index) => (
                      <div key={index} className="relative flex items-start gap-4">
                        <div className={`p-3 rounded-full border-4 border-white z-10 ${
                          timeline.status === 'completed' ? 'bg-green-500 text-white' :
                          timeline.status === 'in-progress' ? 'bg-yellow-500 text-white' :
                          'bg-gray-300 text-gray-600'
                        }`}>
                          {getStageIcon(timeline.stage)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{timeline.stage}</h4>
                            {getStatusBadge(timeline.status)}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{timeline.date}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            ขั้นตอนที่ {index + 1} ของกระบวนการ Seed to Sale
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle>ตารางการติดตาม</CardTitle>
                <CardDescription>
                  ข้อมูลการติดตามทั้งหมดในระบบ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch Number</TableHead>
                      <TableHead>ชื่อสมุนไพร</TableHead>
                      <TableHead>ฟาร์ม</TableHead>
                      <TableHead>สถานะปัจจุบัน</TableHead>
                      <TableHead>ความคืบหน้า</TableHead>
                      <TableHead>การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seedToSaleData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.batchNumber}</TableCell>
                        <TableCell>{item.herbName}</TableCell>
                        <TableCell>{item.farmName}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.currentStage}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={item.progress} className="h-2 w-16" />
                            <span className="text-sm">{item.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <MapPin className="h-4 w-4 mr-1" />
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
        </Tabs>
      </div>
    </HerbTraceLayout>
  );
}
