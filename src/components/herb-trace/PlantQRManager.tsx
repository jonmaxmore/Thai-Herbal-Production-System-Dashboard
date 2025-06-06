
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { QrCode, Sprout, TestTube, Package, Eye, Plus, Search } from "lucide-react";
import QRCode from "react-qr-code";
import { PlantData, PackageData, PlantGrowthStage, LabResult } from "@/utils/database/types";

interface PlantQRManagerProps {
  farmId: string;
}

export default function PlantQRManager({ farmId }: PlantQRManagerProps) {
  const [plants, setPlants] = useState<PlantData[]>([]);
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PlantData | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("plants");

  // Mock data for demonstration
  useEffect(() => {
    const mockPlants: PlantData[] = [
      {
        id: "PLANT_001",
        qrCode: "QR_PLANT_001_2024",
        plantingDate: new Date("2024-01-15"),
        farmId: farmId,
        herbId: "HERB_001",
        status: "Growing",
        currentLocation: {
          lat: 13.7563,
          lng: 100.5018,
          facilityType: "Farm"
        },
        growthStages: [
          {
            id: "STAGE_001",
            plantId: "PLANT_001",
            stage: "Seeding",
            date: new Date("2024-01-15"),
            notes: "เริ่มปลูกเมล็ดกัญชา พันธุ์ Purple Kush"
          },
          {
            id: "STAGE_002",
            plantId: "PLANT_001",
            stage: "Germination",
            date: new Date("2024-01-20"),
            notes: "เมล็ดงอกแล้ว เจริญเติบโตดี"
          }
        ]
      },
      {
        id: "PLANT_002",
        qrCode: "QR_PLANT_002_2024",
        parentPlantId: "PLANT_001",
        plantingDate: new Date("2024-02-01"),
        farmId: farmId,
        herbId: "HERB_001",
        status: "Mature",
        currentLocation: {
          lat: 13.7563,
          lng: 100.5018,
          facilityType: "Farm"
        },
        growthStages: [
          {
            id: "STAGE_003",
            plantId: "PLANT_002",
            stage: "Seeding",
            date: new Date("2024-02-01"),
            notes: "ปลูกจากต้นแม่ PLANT_001"
          }
        ],
        labResults: [
          {
            id: "LAB_001",
            plantId: "PLANT_002",
            testDate: new Date("2024-03-01"),
            testType: "Quality Control",
            results: { thc: 18.5, cbd: 2.1, moisture: 8.2 },
            passed: true,
            certifiedBy: "Lab Technician A"
          }
        ]
      }
    ];

    const mockPackages: PackageData[] = [
      {
        id: "PKG_001",
        qrCode: "QR_PKG_001_2024",
        packageType: "Dried Herbs",
        plantIds: ["PLANT_001", "PLANT_002", "PLANT_003"],
        totalWeight: 450.5,
        packageDate: new Date("2024-03-15"),
        expiryDate: new Date("2025-03-15"),
        batchNumber: "BATCH_001",
        qualityGrade: "Premium",
        packagedBy: "Packaging Team A"
      }
    ];

    setPlants(mockPlants);
    setPackages(mockPackages);
  }, [farmId]);

  const filteredPlants = plants.filter(plant => 
    searchTerm === "" || 
    plant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.qrCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Seedling": return "bg-yellow-500";
      case "Growing": return "bg-green-500";
      case "Mature": return "bg-blue-500";
      case "Harvested": return "bg-orange-500";
      case "Lab Testing": return "bg-purple-500";
      case "Packaged": return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold text-green-800">ระบบ QR Code ติดตามต้นพืช</h2>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มต้นพืชใหม่
          </Button>
          <Button variant="outline">
            <Package className="h-4 w-4 mr-2" />
            สร้างแพคเกจ
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" />
        <Input
          className="pl-10 border-green-200 focus:border-green-500"
          placeholder="ค้นหาด้วยรหัสต้นพืชหรือ QR Code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plants">รายการต้นพืช</TabsTrigger>
          <TabsTrigger value="packages">แพคเกจรวม</TabsTrigger>
        </TabsList>

        <TabsContent value="plants" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>รหัสต้นพืช</TableHead>
                    <TableHead>QR Code</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>วันที่ปลูก</TableHead>
                    <TableHead>ต้นแม่</TableHead>
                    <TableHead>การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlants.map(plant => (
                    <TableRow key={plant.id}>
                      <TableCell className="font-medium">{plant.id}</TableCell>
                      <TableCell>{plant.qrCode}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(plant.status)} text-white`}>
                          {plant.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{plant.plantingDate.toLocaleDateString('th-TH')}</TableCell>
                      <TableCell>{plant.parentPlantId || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedPlant(plant)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                ดูรายละเอียด
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>รายละเอียดต้นพืช: {plant.id}</DialogTitle>
                              </DialogHeader>
                              
                              {selectedPlant && (
                                <Tabs defaultValue="details" className="mt-4">
                                  <TabsList className="grid grid-cols-4">
                                    <TabsTrigger value="details">ข้อมูลพื้นฐาน</TabsTrigger>
                                    <TabsTrigger value="growth">การเจริญเติบโต</TabsTrigger>
                                    <TabsTrigger value="lab">ผลแล็บ</TabsTrigger>
                                    <TabsTrigger value="qr">QR Code</TabsTrigger>
                                  </TabsList>
                                  
                                  <TabsContent value="details">
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="font-semibold text-green-800">ข้อมูลพื้นฐาน</h4>
                                          <div className="bg-green-50 p-4 rounded-md space-y-2">
                                            <div><strong>รหัส:</strong> {selectedPlant.id}</div>
                                            <div><strong>QR Code:</strong> {selectedPlant.qrCode}</div>
                                            <div><strong>สถานะ:</strong> {selectedPlant.status}</div>
                                            <div><strong>วันที่ปลูก:</strong> {selectedPlant.plantingDate.toLocaleDateString('th-TH')}</div>
                                            {selectedPlant.parentPlantId && (
                                              <div><strong>ต้นแม่:</strong> {selectedPlant.parentPlantId}</div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="font-semibold text-green-800">ตำแหน่งปัจจุบัน</h4>
                                          <div className="bg-blue-50 p-4 rounded-md space-y-2">
                                            <div><strong>ประเภทสถานที่:</strong> {selectedPlant.currentLocation.facilityType}</div>
                                            <div><strong>พิกัด:</strong> {selectedPlant.currentLocation.lat.toFixed(4)}, {selectedPlant.currentLocation.lng.toFixed(4)}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="growth">
                                    <div className="space-y-4">
                                      <h4 className="font-semibold text-green-800">ประวัติการเจริญเติบโต</h4>
                                      {selectedPlant.growthStages.map((stage, index) => (
                                        <div key={stage.id} className="border-l-4 border-green-500 pl-4">
                                          <div className="flex items-center gap-2 mb-2">
                                            <Sprout className="h-4 w-4 text-green-600" />
                                            <span className="font-medium">{stage.stage}</span>
                                            <Badge variant="outline">{stage.date.toLocaleDateString('th-TH')}</Badge>
                                          </div>
                                          {stage.notes && (
                                            <p className="text-sm text-gray-600">{stage.notes}</p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="lab">
                                    <div className="space-y-4">
                                      <h4 className="font-semibold text-green-800">ผลการตรวจสอบจากแล็บ</h4>
                                      {selectedPlant.labResults && selectedPlant.labResults.length > 0 ? (
                                        selectedPlant.labResults.map(result => (
                                          <div key={result.id} className="bg-purple-50 p-4 rounded-md">
                                            <div className="flex items-center gap-2 mb-2">
                                              <TestTube className="h-4 w-4 text-purple-600" />
                                              <span className="font-medium">{result.testType}</span>
                                              <Badge className={result.passed ? "bg-green-600" : "bg-red-600"}>
                                                {result.passed ? "ผ่าน" : "ไม่ผ่าน"}
                                              </Badge>
                                            </div>
                                            <div className="text-sm space-y-1">
                                              <div><strong>วันที่ตรวจ:</strong> {result.testDate.toLocaleDateString('th-TH')}</div>
                                              <div><strong>ผู้ตรวจ:</strong> {result.certifiedBy}</div>
                                              <div><strong>ผลการตรวจ:</strong></div>
                                              <pre className="bg-white p-2 rounded text-xs">
                                                {JSON.stringify(result.results, null, 2)}
                                              </pre>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-gray-500">ยังไม่มีผลการตรวจสอบจากแล็บ</p>
                                      )}
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="qr">
                                    <div className="flex flex-col items-center">
                                      <QRCode 
                                        value={JSON.stringify({
                                          type: "individual_plant",
                                          plantId: selectedPlant.id,
                                          qrCode: selectedPlant.qrCode,
                                          farmId: selectedPlant.farmId,
                                          herbId: selectedPlant.herbId,
                                          status: selectedPlant.status,
                                          plantingDate: selectedPlant.plantingDate,
                                          parentPlantId: selectedPlant.parentPlantId,
                                          growthStages: selectedPlant.growthStages.length,
                                          labResults: selectedPlant.labResults?.length || 0
                                        })} 
                                        size={300}
                                      />
                                      <div className="mt-4 text-center">
                                        <p className="font-bold">{selectedPlant.qrCode}</p>
                                        <p className="text-sm text-gray-600">{selectedPlant.id}</p>
                                        <p className="text-xs text-gray-500">
                                          Individual Plant Tracking QR Code
                                        </p>
                                      </div>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <QrCode className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>QR Code - {plant.id}</DialogTitle>
                              </DialogHeader>
                              <div className="flex flex-col items-center p-4">
                                <QRCode value={plant.qrCode} size={200} />
                                <p className="mt-4 font-medium">{plant.qrCode}</p>
                                <p className="text-sm text-gray-500">{plant.status}</p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                แพคเกจรวม (Package-Level QR Codes)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>รหัสแพคเกจ</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>จำนวนต้น</TableHead>
                    <TableHead>น้ำหนักรวม</TableHead>
                    <TableHead>วันที่แพค</TableHead>
                    <TableHead>การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map(pkg => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.id}</TableCell>
                      <TableCell>{pkg.packageType}</TableCell>
                      <TableCell>{pkg.plantIds.length} ต้น</TableCell>
                      <TableCell>{pkg.totalWeight} กรัม</TableCell>
                      <TableCell>{pkg.packageDate.toLocaleDateString('th-TH')}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedPackage(pkg)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              ดูรายละเอียด
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>รายละเอียดแพคเกจ: {pkg.id}</DialogTitle>
                            </DialogHeader>
                            
                            {selectedPackage && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold text-green-800 mb-2">ข้อมูลแพคเกจ</h4>
                                      <div className="bg-green-50 p-4 rounded-md space-y-2">
                                        <div><strong>รหัส:</strong> {selectedPackage.id}</div>
                                        <div><strong>QR Code:</strong> {selectedPackage.qrCode}</div>
                                        <div><strong>ประเภท:</strong> {selectedPackage.packageType}</div>
                                        <div><strong>น้ำหนักรวม:</strong> {selectedPackage.totalWeight} กรัม</div>
                                        <div><strong>วันที่แพค:</strong> {selectedPackage.packageDate.toLocaleDateString('th-TH')}</div>
                                        <div><strong>วันหมดอายุ:</strong> {selectedPackage.expiryDate.toLocaleDateString('th-TH')}</div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-center">
                                    <div className="text-center">
                                      <QRCode 
                                        value={JSON.stringify({
                                          type: "package",
                                          packageId: selectedPackage.id,
                                          qrCode: selectedPackage.qrCode,
                                          plantIds: selectedPackage.plantIds,
                                          packageType: selectedPackage.packageType,
                                          totalWeight: selectedPackage.totalWeight,
                                          packageDate: selectedPackage.packageDate,
                                          batchNumber: selectedPackage.batchNumber,
                                          qualityGrade: selectedPackage.qualityGrade,
                                          plantCount: selectedPackage.plantIds.length
                                        })} 
                                        size={200}
                                      />
                                      <p className="mt-2 font-bold">{selectedPackage.qrCode}</p>
                                      <p className="text-sm text-gray-600">Package QR Code</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold text-green-800 mb-2">ต้นพืชที่รวมอยู่ในแพคเกจ ({selectedPackage.plantIds.length} ต้น)</h4>
                                  <div className="bg-blue-50 p-4 rounded-md">
                                    <div className="grid grid-cols-3 gap-2">
                                      {selectedPackage.plantIds.map(plantId => (
                                        <Badge key={plantId} variant="outline" className="justify-center">
                                          {plantId}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-2">
                                    QR Code ของแพคเกจนี้มีข้อมูลครบทั้ง {selectedPackage.plantIds.length} ต้น 
                                    สามารถติดตามย้อนกลับไปยังแต่ละต้นได้
                                  </p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
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
  );
}
