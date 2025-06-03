
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, QrCode, Info, Truck, Leaf, Thermometer, Droplets } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCode from "react-qr-code";
import { Trace, Farm, generateFarmers } from "@/utils/herbData";
import StatusBadge from "./StatusBadge";
import { Separator } from "@/components/ui/separator";

interface TraceViewProps {
  traces: Trace[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const TraceView: React.FC<TraceViewProps> = ({ traces, searchTerm, setSearchTerm }) => {
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  useEffect(() => {
    // Load farms data
    setFarms(generateFarmers(100));
  }, []);

  // Find the farm associated with the selected trace
  useEffect(() => {
    if (selectedTrace) {
      const farm = farms.find(f => f.id === selectedTrace.farmId);
      setSelectedFarm(farm || null);
    } else {
      setSelectedFarm(null);
    }
  }, [selectedTrace, farms]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold hidden md:block text-green-800">Track and Trace</h2>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" />
        <Input
          className="pl-10 border-green-200 focus:border-green-500"
          placeholder="Search by herb, event, or reference code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Herb</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Reference Code</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {traces.map(trace => (
                  <TableRow key={trace.id} className="hover:bg-green-50">
                    <TableCell>{trace.id}</TableCell>
                    <TableCell>{trace.herb}</TableCell>
                    <TableCell>
                      <Badge 
                        className={`${
                          trace.event === "Seeding" ? "bg-blue-500" :
                          trace.event === "Growing" ? "bg-emerald-500" :
                          trace.event === "Harvesting" ? "bg-amber-500" :
                          trace.event === "Processing" ? "bg-purple-500" :
                          trace.event === "Testing" ? "bg-sky-500" :
                          trace.event === "Packaging" ? "bg-indigo-500" :
                          trace.event === "Shipping" ? "bg-orange-500" :
                          trace.event === "Delivered" ? "bg-green-600" :
                          "bg-gray-500"
                        } text-white`}
                      >
                        {trace.event}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {trace.referenceCode || `HERB-${trace.id}-${trace.event.substring(0, 3).toUpperCase()}`}
                    </TableCell>
                    <TableCell>{new Date(trace.timestamp).toLocaleDateString()}</TableCell>
                    <TableCell>{trace.location.lat.toFixed(3)}, {trace.location.lng.toFixed(3)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1 text-green-700 border-green-200 hover:bg-green-50"
                            onClick={() => setSelectedTrace(trace)}
                          >
                            <Info className="h-4 w-4" /> View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl text-green-800">
                              Trace Information - {trace.referenceCode}
                            </DialogTitle>
                          </DialogHeader>
                          
                          {selectedTrace && selectedFarm && (
                            <Tabs defaultValue="trace" className="mt-4">
                              <TabsList className="grid grid-cols-3 mb-4">
                                <TabsTrigger value="trace">Trace Details</TabsTrigger>
                                <TabsTrigger value="farm">Farm Information</TabsTrigger>
                                <TabsTrigger value="qrcode">QR Code</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="trace" className="p-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-6">
                                    <div>
                                      <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                                        <Leaf className="mr-2 h-5 w-5 text-green-600" /> สมุนไพร / Herb Information
                                      </h3>
                                      <div className="bg-green-50 p-4 rounded-md space-y-2">
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">สมุนไพร:</div>
                                          <div className="col-span-2">{selectedTrace.herb}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">คุณภาพ:</div>
                                          <div className="col-span-2">
                                            <Badge className={
                                              selectedTrace.qualityGrade === "Premium" ? "bg-purple-600" :
                                              selectedTrace.qualityGrade === "A" ? "bg-green-600" :
                                              selectedTrace.qualityGrade === "B" ? "bg-blue-600" :
                                              "bg-yellow-600"
                                            }>
                                              {selectedTrace.qualityGrade}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">จำนวน:</div>
                                          <div className="col-span-2">{selectedTrace.quantity} {selectedTrace.unit}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">เลขที่รุ่น:</div>
                                          <div className="col-span-2">{selectedTrace.batchNumber}</div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                                        <Truck className="mr-2 h-5 w-5 text-green-600" /> ข้อมูลติดตาม / Tracking Information
                                      </h3>
                                      <div className="bg-green-50 p-4 rounded-md space-y-2">
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">เหตุการณ์:</div>
                                          <div className="col-span-2">
                                            <Badge className={`${
                                              selectedTrace.event === "Seeding" ? "bg-blue-500" :
                                              selectedTrace.event === "Growing" ? "bg-emerald-500" :
                                              selectedTrace.event === "Harvesting" ? "bg-amber-500" :
                                              selectedTrace.event === "Processing" ? "bg-purple-500" :
                                              selectedTrace.event === "Testing" ? "bg-sky-500" :
                                              selectedTrace.event === "Packaging" ? "bg-indigo-500" :
                                              selectedTrace.event === "Shipping" ? "bg-orange-500" :
                                              selectedTrace.event === "Delivered" ? "bg-green-600" :
                                              "bg-gray-500"
                                            } text-white`}>
                                              {selectedTrace.event}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">วันที่:</div>
                                          <div className="col-span-2">{formatDate(selectedTrace.timestamp)}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">รหัสอ้างอิง:</div>
                                          <div className="col-span-2">{selectedTrace.referenceCode}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">พิกัด:</div>
                                          <div className="col-span-2">{selectedTrace.location.lat.toFixed(4)}, {selectedTrace.location.lng.toFixed(4)}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-6">
                                    {(selectedTrace.temperature || selectedTrace.humidity) && (
                                      <div>
                                        <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                                          <Thermometer className="mr-2 h-5 w-5 text-green-600" /> สภาพแวดล้อม / Environmental Data
                                        </h3>
                                        <div className="bg-green-50 p-4 rounded-md space-y-2">
                                          {selectedTrace.temperature && (
                                            <div className="grid grid-cols-3 gap-2">
                                              <div className="font-medium">อุณหภูมิ:</div>
                                              <div className="col-span-2">{selectedTrace.temperature}°C</div>
                                            </div>
                                          )}
                                          {selectedTrace.humidity && (
                                            <div className="grid grid-cols-3 gap-2">
                                              <div className="font-medium">ความชื้น:</div>
                                              <div className="col-span-2">{selectedTrace.humidity}%</div>
                                            </div>
                                          )}
                                          {selectedTrace.moistureLevel && (
                                            <div className="grid grid-cols-3 gap-2">
                                              <div className="font-medium">ความชื้นในวัตถุดิบ:</div>
                                              <div className="col-span-2">{selectedTrace.moistureLevel}%</div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {selectedTrace.destinationName && (
                                      <div>
                                        <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                                          <Truck className="mr-2 h-5 w-5 text-green-600" /> ข้อมูลการจัดส่ง / Shipping Information
                                        </h3>
                                        <div className="bg-green-50 p-4 rounded-md space-y-2">
                                          <div className="grid grid-cols-3 gap-2">
                                            <div className="font-medium">ปลายทาง:</div>
                                            <div className="col-span-2">{selectedTrace.destinationName}</div>
                                          </div>
                                          {selectedTrace.destinationContact && (
                                            <div className="grid grid-cols-3 gap-2">
                                              <div className="font-medium">ติดต่อ:</div>
                                              <div className="col-span-2">{selectedTrace.destinationContact}</div>
                                            </div>
                                          )}
                                          {selectedTrace.transportMethod && (
                                            <div className="grid grid-cols-3 gap-2">
                                              <div className="font-medium">การขนส่ง:</div>
                                              <div className="col-span-2">{selectedTrace.transportMethod}</div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {selectedTrace.certifications.length > 0 && (
                                      <div>
                                        <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                                          <QrCode className="mr-2 h-5 w-5 text-green-600" /> การรับรองมาตรฐาน / Certifications
                                        </h3>
                                        <div className="bg-green-50 p-4 rounded-md">
                                          <div className="flex flex-wrap gap-2">
                                            {selectedTrace.certifications.map((cert, index) => (
                                              <Badge key={index} className="bg-blue-600">
                                                {cert}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {selectedTrace.notes && (
                                      <div>
                                        <h3 className="text-lg font-semibold text-green-800 mb-2">หมายเหตุ / Notes</h3>
                                        <div className="bg-green-50 p-4 rounded-md">
                                          <p>{selectedTrace.notes}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="farm" className="p-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-6">
                                    <div>
                                      <h3 className="text-lg font-semibold text-green-800 mb-2">ข้อมูลฟาร์ม / Farm Information</h3>
                                      <div className="bg-green-50 p-4 rounded-md space-y-2">
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">ชื่อฟาร์ม:</div>
                                          <div className="col-span-2">{selectedFarm.name}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">จังหวัด:</div>
                                          <div className="col-span-2">{selectedFarm.province}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">สมุนไพรหลัก:</div>
                                          <div className="col-span-2">{selectedFarm.herb}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">พื้นที่เพาะปลูก:</div>
                                          <div className="col-span-2">{selectedFarm.cultivationArea} ไร่</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">ก่อตั้งปี:</div>
                                          <div className="col-span-2">{selectedFarm.establishedYear}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">เลขทะเบียน:</div>
                                          <div className="col-span-2">{selectedFarm.registrationNumber}</div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h3 className="text-lg font-semibold text-green-800 mb-2">ข้อมูลเจ้าของ / Owner Information</h3>
                                      <div className="bg-green-50 p-4 rounded-md space-y-2">
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">ชื่อ:</div>
                                          <div className="col-span-2">{selectedFarm.owner.name}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">โทรศัพท์:</div>
                                          <div className="col-span-2">{selectedFarm.owner.phoneNumber}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">อีเมล:</div>
                                          <div className="col-span-2">{selectedFarm.owner.email}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">เลขที่ใบอนุญาต:</div>
                                          <div className="col-span-2">{selectedFarm.owner.licenseNumber}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">วันที่จดทะเบียน:</div>
                                          <div className="col-span-2">{formatDate(selectedFarm.owner.registrationDate)}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-6">
                                    <div>
                                      <h3 className="text-lg font-semibold text-green-800 mb-2">สถานะการรับรอง / Certification Status</h3>
                                      <div className="bg-green-50 p-4 rounded-md space-y-3">
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium">GACP:</div>
                                          <StatusBadge status={selectedFarm.gapc} />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium">EU-GMP:</div>
                                          <StatusBadge status={selectedFarm.euGmp} />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium">กรมแพทย์แผนไทยฯ:</div>
                                          <StatusBadge status={selectedFarm.dttm} />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium">มาตรฐาน มอก.:</div>
                                          <StatusBadge status={selectedFarm.tis} />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium">เกษตรอินทรีย์:</div>
                                          <Badge className={selectedFarm.organicCertified ? "bg-green-600" : "bg-gray-400"}>
                                            {selectedFarm.organicCertified ? "รับรองแล้ว ✓" : "ไม่รับรอง ✗"}
                                          </Badge>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium">รับรอง อย.:</div>
                                          <Badge className={selectedFarm.fdaApproved ? "bg-green-600" : "bg-gray-400"}>
                                            {selectedFarm.fdaApproved ? "รับรองแล้ว ✓" : "ไม่รับรอง ✗"}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h3 className="text-lg font-semibold text-green-800 mb-2">ข้อมูลการตรวจสอบ / Inspection Information</h3>
                                      <div className="bg-green-50 p-4 rounded-md space-y-2">
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">ตรวจสอบล่าสุด:</div>
                                          <div className="col-span-2">{formatDate(selectedFarm.lastInspectionDate)}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">กำหนดตรวจครั้งถัดไป:</div>
                                          <div className="col-span-2">{formatDate(selectedFarm.nextInspectionDate)}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="qrcode" className="p-2">
                                <div className="flex flex-col items-center justify-center p-6">
                                  <QRCode 
                                    value={JSON.stringify({
                                      id: selectedTrace.id,
                                      herb: selectedTrace.herb,
                                      event: selectedTrace.event,
                                      timestamp: selectedTrace.timestamp,
                                      referenceCode: selectedTrace.referenceCode,
                                      farmId: selectedTrace.farmId,
                                      farmName: selectedFarm.name,
                                      batchNumber: selectedTrace.batchNumber,
                                      quantity: selectedTrace.quantity,
                                      unit: selectedTrace.unit,
                                      qualityGrade: selectedTrace.qualityGrade
                                    })} 
                                    size={250}
                                  />
                                  <p className="mt-6 text-center font-medium">
                                    {selectedTrace.referenceCode}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-2">
                                    {selectedTrace.herb} - {selectedTrace.event}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatDate(selectedTrace.timestamp)}
                                  </p>
                                  
                                  <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-500">
                                      Scan this QR code to verify the authenticity and track this herb product
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1 text-blue-700 border-blue-200 hover:bg-blue-50 ml-2"
                            onClick={() => setSelectedTrace(trace)}
                          >
                            <QrCode className="h-4 w-4" /> QR
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Trace QR Code</DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col items-center justify-center p-6">
                            <QRCode 
                              value={JSON.stringify({
                                id: trace.id,
                                herb: trace.herb,
                                event: trace.event,
                                timestamp: trace.timestamp,
                                referenceCode: trace.referenceCode || `HERB-${trace.id}-${trace.event.substring(0, 3).toUpperCase()}`,
                                location: trace.location
                              })} 
                              size={200}
                            />
                            <p className="mt-4 text-center font-medium">
                              {trace.referenceCode || `HERB-${trace.id}-${trace.event.substring(0, 3).toUpperCase()}`}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              {trace.herb} - {trace.event}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(trace.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TraceView;
