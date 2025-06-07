
import { useState } from "react";
import { Seedling, Sprout, Sun, Scissors, FlaskConical, Package, Truck, ShoppingCart, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// Mock seed-to-sale data based on DTTM tracking requirements
const seedToSaleStages = [
  { id: "seed", name: "เพาะเมล็ด", icon: Seedling, color: "bg-green-100 text-green-800" },
  { id: "germination", name: "งอก", icon: Sprout, color: "bg-green-200 text-green-800" },
  { id: "vegetative", name: "เจริญเติบโต", icon: Sun, color: "bg-yellow-100 text-yellow-800" },
  { id: "flowering", name: "ออกดอก", icon: Sun, color: "bg-orange-100 text-orange-800" },
  { id: "harvest", name: "เก็บเกี่ยว", icon: Scissors, color: "bg-blue-100 text-blue-800" },
  { id: "testing", name: "ตรวจสอบคุณภาพ", icon: FlaskConical, color: "bg-purple-100 text-purple-800" },
  { id: "packaging", name: "บรรจุ", icon: Package, color: "bg-indigo-100 text-indigo-800" },
  { id: "distribution", name: "จัดจำหน่าย", icon: Truck, color: "bg-gray-100 text-gray-800" },
  { id: "sale", name: "ขาย", icon: ShoppingCart, color: "bg-emerald-100 text-emerald-800" }
];

const seedToSaleTracking = [
  {
    id: "TRACK_001",
    batchNumber: "BATCH_2024_001",
    herbName: "กัญชาสายพันธุ์เหนือ",
    farmName: "ฟาร์มกัญชาอินทรีย์",
    seedDate: "2024-01-15",
    currentStage: "packaging",
    progress: 77,
    stages: {
      seed: { date: "2024-01-15", status: "completed", notes: "เมล็ดพันธุ์คุณภาพดี" },
      germination: { date: "2024-01-22", status: "completed", notes: "งอก 95%" },
      vegetative: { date: "2024-02-15", status: "completed", notes: "เจริญเติบโตดี" },
      flowering: { date: "2024-04-10", status: "completed", notes: "ออกดอกครบ" },
      harvest: { date: "2024-06-05", status: "completed", notes: "เก็บเกี่ยวได้ 25 กก." },
      testing: { date: "2024-06-10", status: "completed", notes: "ผ่านการตรวจสอบ THC 0.8%" },
      packaging: { date: "2024-06-15", status: "in_progress", notes: "กำลังบรรจุ" },
      distribution: { date: "", status: "pending", notes: "" },
      sale: { date: "", status: "pending", notes: "" }
    },
    totalWeight: "25 กก.",
    qualityGrade: "Premium",
    certifications: ["GACP", "Organic"],
    destination: "ร้านยาแผนไทย กทม."
  },
  {
    id: "TRACK_002",
    batchNumber: "BATCH_2024_002",
    herbName: "ฟ้าทะลายโจร",
    farmName: "ฟาร์มสมุนไพรไทย",
    seedDate: "2024-02-01",
    currentStage: "sale",
    progress: 100,
    stages: {
      seed: { date: "2024-02-01", status: "completed", notes: "เมล็ดพันธุ์ท้องถิ่น" },
      germination: { date: "2024-02-08", status: "completed", notes: "งอก 98%" },
      vegetative: { date: "2024-03-01", status: "completed", notes: "เจริญเติบโตเร็ว" },
      flowering: { date: "2024-04-15", status: "completed", notes: "ออกดอกสวย" },
      harvest: { date: "2024-05-20", status: "completed", notes: "เก็บเกี่ยวได้ 15 กก." },
      testing: { date: "2024-05-25", status: "completed", notes: "ผ่านการตรวจสอบทุกด้าน" },
      packaging: { date: "2024-05-30", status: "completed", notes: "บรรจุเสร็จ" },
      distribution: { date: "2024-06-02", status: "completed", notes: "ส่งแล้ว" },
      sale: { date: "2024-06-05", status: "completed", notes: "ขายหมดแล้ว" }
    },
    totalWeight: "15 กก.",
    qualityGrade: "A",
    certifications: ["GACP"],
    destination: "โรงพยาบาลการแพทย์แผนไทย"
  }
];

export default function SeedToSaleView() {
  const [activeTab, setActiveTab] = useState("tracking");
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const { toast } = useToast();

  const getStageStatus = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "pending":
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStageColor = (status: string, isActive: boolean) => {
    if (isActive) return "bg-blue-500 text-white";
    switch (status) {
      case "completed":
        return "bg-green-500 text-white";
      case "in_progress":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  const handleViewDetails = (batchId: string) => {
    setSelectedBatch(batchId);
    toast({
      title: "แสดงรายละเอียด",
      description: `กำลังแสดงรายละเอียดของ ${batchId}`,
    });
  };

  return (
    <HerbTraceLayout activeTab="seed-to-sale">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-green-800">ระบบติดตาม Seed to Sale</h2>
            <p className="text-gray-600 mt-2">ติดตามการผลิตสมุนไพรตั้งแต่เพาะเมล็ดจนถึงผู้บริโภค ตามมาตรฐาน DTTM</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              <Seedling className="h-4 w-4 mr-2" />
              เริ่มต้นการติดตามใหม่
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">แบทช์ทั้งหมด</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{seedToSaleTracking.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">กำลังดำเนินการ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">
                {seedToSaleTracking.filter(t => t.progress < 100).length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">เสร็จสิ้นแล้ว</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {seedToSaleTracking.filter(t => t.progress === 100).length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">น้ำหนักรวม</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">40 กก.</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="tracking">การติดตาม</TabsTrigger>
            <TabsTrigger value="stages">ขั้นตอนการผลิต</TabsTrigger>
            <TabsTrigger value="compliance">การปฏิบัติตามกฎหมาย</TabsTrigger>
          </TabsList>

          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle>การติดตามแบทช์การผลิต</CardTitle>
                <CardDescription>
                  ติดตามการผลิตสมุนไพรในแต่ละขั้นตอนตามมาตรฐาน DTTM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {seedToSaleTracking.map((tracking) => (
                    <Card key={tracking.id} className="border-l-4 border-l-green-500">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{tracking.herbName}</CardTitle>
                            <CardDescription>
                              {tracking.batchNumber} - {tracking.farmName}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">{tracking.qualityGrade}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>ความคืบหน้า</span>
                              <span>{tracking.progress}%</span>
                            </div>
                            <Progress value={tracking.progress} className="h-2" />
                          </div>
                          
                          <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
                            {seedToSaleStages.map((stage, index) => {
                              const stageData = tracking.stages[stage.id as keyof typeof tracking.stages];
                              const isActive = tracking.currentStage === stage.id;
                              
                              return (
                                <div key={stage.id} className="text-center">
                                  <div 
                                    className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${getStageColor(stageData.status, isActive)}`}
                                  >
                                    <stage.icon className="h-4 w-4" />
                                  </div>
                                  <p className="text-xs">{stage.name}</p>
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="flex justify-between items-center pt-4 border-t">
                            <div className="text-sm">
                              <p><strong>น้ำหนัก:</strong> {tracking.totalWeight}</p>
                              <p><strong>ปลายทาง:</strong> {tracking.destination}</p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewDetails(tracking.id)}
                            >
                              ดูรายละเอียด
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stages">
            <Card>
              <CardHeader>
                <CardTitle>ขั้นตอนการผลิตสมุนไพร</CardTitle>
                <CardDescription>
                  ขั้นตอนมาตรฐานการผลิตสมุนไพรตามแนวทาง DTTM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {seedToSaleStages.map((stage, index) => (
                    <Card key={stage.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stage.color}`}>
                            <stage.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{stage.name}</CardTitle>
                            <CardDescription>ขั้นตอนที่ {index + 1}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          {stage.id === "seed" && "การเพาะเมล็ดพันธุ์ที่ได้รับการรับรองคุณภาพ"}
                          {stage.id === "germination" && "การงอกของเมล็ดภายใต้สภาพแวดล้อมที่เหมาะสม"}
                          {stage.id === "vegetative" && "การเจริญเติบโตในระยะใบและลำต้น"}
                          {stage.id === "flowering" && "การออกดอกและพัฒนาผลผลิต"}
                          {stage.id === "harvest" && "การเก็บเกี่ยวในช่วงเวลาที่เหมาะสม"}
                          {stage.id === "testing" && "การตรวจสอบคุณภาพตามมาตรฐาน DTTM"}
                          {stage.id === "packaging" && "การบรรจุตามมาตรฐานความปลอดภัย"}
                          {stage.id === "distribution" && "การขนส่งและกระจายสินค้า"}
                          {stage.id === "sale" && "การขายถึงผู้บริโภคหรือหน่วยงานการแพทย์"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>การปฏิบัติตามกฎหมายและระเบียบ</CardTitle>
                <CardDescription>
                  ตรวจสอบการปฏิบัติตามกฎหมายว่าด้วยยาและระเบียบ DTTM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">กฎหมายพืชกัญชา</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• ใบอนุญาตปลูกกัญชา</li>
                          <li>• การควบคุม THC ไม่เกิน 1%</li>
                          <li>• การรายงานการผลิต</li>
                          <li>• การตรวจสอบเป็นระยะ</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">มาตรฐาน GACP</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• การจัดการคุณภาพ</li>
                          <li>• การเก็บบันทึก</li>
                          <li>• การควบคุมการปนเปื้อน</li>
                          <li>• การฝึกอบรมบุคลากร</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HerbTraceLayout>
  );
}
