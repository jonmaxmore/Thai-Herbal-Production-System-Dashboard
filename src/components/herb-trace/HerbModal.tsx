
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { herbTranslations } from "@/utils/herbData";
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, Activity, Bug } from "lucide-react";

interface HerbModalProps {
  herbName: string;
  herbId: number;
  herbImage: string;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for disease identification and market information
const getDiseaseInfo = (herbName: string) => {
  const diseases = [
    {
      name: "โรคใบไหม้",
      symptoms: "ใบเหลือง มีจุดสีน้ำตาล ขอบใบแห้ง",
      cause: "เชื้อรา Alternaria",
      treatment: "ใช้สารป้องกันกำจัดเชื้อรา ปรับปรุงการระบายอากาศ",
      severity: "medium"
    },
    {
      name: "โรคราน้ำค้าง",
      symptoms: "ผงสีขาวบนใบและลำต้น",
      cause: "เชื้อรา Powdery mildew",
      treatment: "พ่นด้วยน้ำผสมเบกกิ้งโซดา หรือสารกำจัดเชื้อรา",
      severity: "low"
    },
    {
      name: "โรคเหี่ยวเฉา",
      symptoms: "ต้นเหี่ยวแฉะ รากเน่า ใบเหลืองร่วง",
      cause: "เชื้อรา Fusarium",
      treatment: "ปรับปรุงการระบายน้ำ ใช้สารป้องกันกำจัดเชื้อรา",
      severity: "high"
    }
  ];
  
  return diseases;
};

const getMarketInfo = (herbName: string) => {
  const basePrice = Math.floor(Math.random() * 500) + 100;
  const priceChange = (Math.random() - 0.5) * 50;
  const demand = Math.floor(Math.random() * 100) + 1;
  
  return {
    currentPrice: basePrice,
    priceChange: priceChange,
    currency: "บาท/กิโลกรัม",
    demand: demand,
    marketTrend: priceChange > 0 ? "increasing" : "decreasing",
    lastUpdated: new Date().toLocaleDateString('th-TH'),
    quarterlyData: [
      { quarter: "Q1", price: basePrice - 30, demand: demand - 10 },
      { quarter: "Q2", price: basePrice - 15, demand: demand - 5 },
      { quarter: "Q3", price: basePrice + 10, demand: demand + 5 },
      { quarter: "Q4", price: basePrice, demand: demand }
    ]
  };
};

export default function HerbModal({ 
  herbName, 
  herbId, 
  herbImage, 
  isOpen, 
  onClose 
}: HerbModalProps) {
  const englishName = herbTranslations[herbName] || herbName;
  const diseaseInfo = getDiseaseInfo(herbName);
  const marketInfo = getMarketInfo(herbName);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-green-800">{herbName}</DialogTitle>
          <DialogDescription>
            {englishName} (ID: {herbId} | UID: HERB-{1000 + herbId})
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">ข้อมูลพื้นฐาน</TabsTrigger>
            <TabsTrigger value="diseases">การตรวจสอบโรค</TabsTrigger>
            <TabsTrigger value="market">ข้อมูลตลาด</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={herbImage} 
                  alt={herbName} 
                  className="w-full h-48 object-cover rounded-md" 
                />
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-semibold">ชื่อไทย:</div>
                  <div>{herbName}</div>
                  
                  <div className="font-semibold">ชื่ออังกฤษ:</div>
                  <div>{englishName}</div>
                  
                  <div className="font-semibold">วงศ์:</div>
                  <div>Sample Plant Family</div>
                  
                  <div className="font-semibold">คุณสมบัติ:</div>
                  <div>สมุนไพรพื้นบ้านแผนไทย</div>
                  
                  <div className="font-semibold">ส่วนที่ใช้:</div>
                  <div>ใบ, ราก, ลำต้น</div>
                  
                  <div className="font-semibold">รูปแบบการใช้:</div>
                  <div>ต้ม, ตำ, สกัด</div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md">
              <h4 className="font-semibold text-green-800 mb-2">สรรพคุณ / Properties</h4>
              <p className="text-sm">
                ใช้รักษาอาการอักเสบ บรรเทาอาการปวด มีสรรพคุณช่วยเสริมสร้างภูมิคุ้มกัน
                และใช้เป็นยาสมุนไพรในการรักษาโรคต่างๆ ตามภูมิปัญญาท้องถิ่น
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="diseases" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-green-800">
                    <Bug className="mr-2 h-5 w-5" />
                    การตรวจสอบโรคและศัตรูพืช
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {diseaseInfo.map((disease, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-red-700">{disease.name}</h5>
                        <Badge className={
                          disease.severity === "high" ? "bg-red-600" :
                          disease.severity === "medium" ? "bg-yellow-600" :
                          "bg-green-600"
                        }>
                          {disease.severity === "high" ? "รุนแรง" :
                           disease.severity === "medium" ? "ปานกลาง" : "เล็กน้อย"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-700">อาการ:</div>
                          <div className="text-gray-600">{disease.symptoms}</div>
                        </div>
                        
                        <div>
                          <div className="font-medium text-gray-700">สาเหตุ:</div>
                          <div className="text-gray-600">{disease.cause}</div>
                        </div>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div>
                        <div className="font-medium text-gray-700 mb-1">วิธีการรักษา:</div>
                        <div className="text-gray-600 text-sm">{disease.treatment}</div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
                      <h5 className="font-semibold text-blue-800">คำแนะนำการป้องกัน</h5>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1 ml-6">
                      <li>• ตรวจสอบต้นสมุนไพรเป็นประจำอย่างน้อยสัปดาห์ละ 2 ครั้ง</li>
                      <li>• รักษาความสะอาดในแปลงปลูก</li>
                      <li>• ให้น้ำและปุ่ยตามความเหมาะสม</li>
                      <li>• แยกต้นที่เป็นโรคออกจากต้นที่สุขภาพดี</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="market" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-green-800">
                    <DollarSign className="mr-2 h-5 w-5" />
                    ราคาตลาดปัจจุบัน
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        ฿{marketInfo.currentPrice}
                      </div>
                      <div className="text-sm text-gray-600">{marketInfo.currency}</div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      {marketInfo.priceChange > 0 ? (
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>+{marketInfo.priceChange.toFixed(2)} บาท</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <TrendingDown className="h-4 w-4 mr-1" />
                          <span>{marketInfo.priceChange.toFixed(2)} บาท</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-700">ความต้องการ:</div>
                        <div className="flex items-center">
                          <div className="text-gray-600">{marketInfo.demand}%</div>
                          <Activity className="h-4 w-4 ml-2 text-blue-500" />
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-700">แนวโน้ม:</div>
                        <Badge className={marketInfo.marketTrend === "increasing" ? "bg-green-600" : "bg-red-600"}>
                          {marketInfo.marketTrend === "increasing" ? "เพิ่มขึ้น" : "ลดลง"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 text-center">
                      อัพเดตล่าสุด: {marketInfo.lastUpdated}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-green-800">
                    <Activity className="mr-2 h-5 w-5" />
                    แนวโน้มรายไตรมาส
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketInfo.quarterlyData.map((quarter, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="font-medium">{quarter.quarter}</div>
                        <div className="flex gap-4 text-sm">
                          <div>฿{quarter.price}</div>
                          <div className="text-blue-600">{quarter.demand}% ความต้องการ</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="bg-yellow-50 p-3 rounded-md">
                    <h6 className="font-semibold text-yellow-800 mb-2">ข้อมูลสำหรับผู้ผลิตยา</h6>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <div>• ราคาส่งให้โรงงานยา: ฿{(marketInfo.currentPrice * 1.2).toFixed(0)}/กก.</div>
                      <div>• มาตรฐานคุณภาพ: ต้องได้รับการรับรองจาก อย.</div>
                      <div>• ปริมาณสั่งซื้อขั้นต่ำ: 100 กิโลกรัม</div>
                      <div>• ระยะเวลาจัดส่ง: 7-14 วันทำการ</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>ปิด</Button>
          <Button>ดูข้อมูลเพิ่มเติม</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
