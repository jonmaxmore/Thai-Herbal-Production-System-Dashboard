import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, QrCode, Info, Truck, Leaf, Thermometer, Droplets, MapPin, User, Calendar, Award } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCode from "react-qr-code";
import { mockDatabase } from '@/utils/database';
import { EnhancedTrace, EnhancedFarm } from '@/utils/database/types';
import StatusBadge from "./StatusBadge";
import { Separator } from "@/components/ui/separator";

interface TraceViewProps {
  traces: EnhancedTrace[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const TraceView: React.FC<TraceViewProps> = ({ traces, searchTerm, setSearchTerm }) => {
  const [selectedTrace, setSelectedTrace] = useState<EnhancedTrace | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<EnhancedFarm | null>(null);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [herbJourney, setHerbJourney] = useState<EnhancedTrace[]>([]);

  // Find the farm and farmer associated with the selected trace
  useEffect(() => {
    if (selectedTrace) {
      const farm = mockDatabase.farmers[selectedTrace.farmId];
      const farmer = farm?.userId ? mockDatabase.users[farm.userId] : null;
      
      // Get all traces for this herb to show journey
      const journeyTraces = Object.values(mockDatabase.traces)
        .filter((trace: any) => trace.herbId === selectedTrace.herbId)
        .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      setSelectedFarm(farm || null);
      setSelectedFarmer(farmer);
      setHerbJourney(journeyTraces as EnhancedTrace[]);
    } else {
      setSelectedFarm(null);
      setSelectedFarmer(null);
      setHerbJourney([]);
    }
  }, [selectedTrace]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
                        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl text-green-800">
                              Track and Trace Details - {trace.referenceCode}
                            </DialogTitle>
                          </DialogHeader>
                          
                          {selectedTrace && selectedFarm && (
                            <Tabs defaultValue="origin" className="mt-4">
                              <TabsList className="grid grid-cols-4 mb-4">
                                <TabsTrigger value="origin">ข้อมูลต้นทาง</TabsTrigger>
                                <TabsTrigger value="cultivation">การปลูก</TabsTrigger>
                                <TabsTrigger value="journey">ประวัติการเดินทาง</TabsTrigger>
                                <TabsTrigger value="qrcode">QR Code</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="origin" className="p-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-6">
                                    <div>
                                      <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                                        <MapPin className="mr-2 h-5 w-5 text-green-600" /> ข้อมูลต้นทาง / Origin Information
                                      </h3>
                                      <div className="bg-green-50 p-4 rounded-md space-y-2">
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">ฟาร์ม:</div>
                                          <div className="col-span-2">{selectedFarm.name}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">จังหวัด:</div>
                                          <div className="col-span-2">{selectedFarm.province}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">เลขทะเบียน:</div>
                                          <div className="col-span-2">{selectedFarm.registrationNumber}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">พิกัด:</div>
                                          <div className="col-span-2">{selectedTrace.location.lat.toFixed(4)}, {selectedTrace.location.lng.toFixed(4)}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">ก่อตั้งปี:</div>
                                          <div className="col-span-2">{selectedFarm.establishedYear}</div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {selectedFarmer && (
                                      <div>
                                        <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                                          <User className="mr-2 h-5 w-5 text-green-600" /> ข้อมูลเกษตรกร / Farmer Information
                                        </h3>
                                        <div className="bg-green-50 p-4 rounded-md space-y-2">
                                          <div className="grid grid-cols-3 gap-2">
                                            <div className="font-medium">ชื่อ:</div>
                                            <div className="col-span-2">{selectedFarmer.fullName}</div>
                                          </div>
                                          <div className="grid grid-cols-3 gap-2">
                                            <div className="font-medium">โทรศัพท์:</div>
                                            <div className="col-span-2">{selectedFarmer.phoneNumber}</div>
                                          </div>
                                          <div className="grid grid-cols-3 gap-2">
                                            <div className="font-medium">อีเมล:</div>
                                            <div className="col-span-2">{selectedFarmer.email}</div>
                                          </div>
                                          <div className="grid grid-cols-3 gap-2">
                                            <div className="font-medium">สถานะ:</div>
                                            <div className="col-span-2">
                                              <Badge className={selectedFarmer.isActive ? "bg-green-600" : "bg-gray-400"}>
                                                {selectedFarmer.isActive ? "ใช้งานอยู่" : "ไม่ใช้งาน"}
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-6">
                                    <div>
                                      <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                                        <Leaf className="mr-2 h-5 w-5 text-green-600" /> ข้อมูลสมุนไพร / Herb Information
                                      </h3>
                                      <div className="bg-green-50 p-4 rounded-md space-y-2">
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">สมุนไพร:</div>
                                          <div className="col-span-2">{selectedTrace.herb}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">เลขที่รุ่น:</div>
                                          <div className="col-span-2">{selectedTrace.batchNumber}</div>
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
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                                        <Award className="mr-2 h-5 w-5 text-green-600" /> การรับรองมาตรฐาน / Certifications
                                      </h3>
                                      <div className="bg-green-50 p-4 rounded-md space-y-3">
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium">GACP:</div>
                                          <StatusBadge status={selectedFarm.gacp} />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium">EU-GMP:</div>
                                          <StatusBadge status={selectedFarm.optionalCertifications?.euGmp || 'Not Applied'} />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium">กรมแพทย์แผนไทยฯ:</div>
                                          <StatusBadge status={selectedFarm.optionalCertifications?.dttm || 'Not Applied'} />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium">เกษตรอินทรีย์:</div>
                                          <Badge className={selectedFarm.organicCertified ? "bg-green-600" : "bg-gray-400"}>
                                            {selectedFarm.organicCertified ? "รับรองแล้ว ✓" : "ไม่รับรอง ✗"}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="cultivation" className="p-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-6">
                                    <div>
                                      <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                                        <Leaf className="mr-2 h-5 w-5 text-green-600" /> ข้อมูลการเพาะปลูก / Cultivation Details
                                      </h3>
                                      <div className="bg-green-50 p-4 rounded-md space-y-2">
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">พื้นที่เพาะปลูก:</div>
                                          <div className="col-span-2">{selectedFarm.cultivationArea} ไร่</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">สมุนไพรหลัก:</div>
                                          <div className="col-span-2">{selectedFarm.herb}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">วิธีการปลูก:</div>
                                          <div className="col-span-2">{selectedFarm.organicCertified ? "เกษตรอินทรีย์" : "เกษตรทั่วไป"}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">ฤดูกาลปลูก:</div>
                                          <div className="col-span-2">ตลอดปี</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">แหล่งน้ำ:</div>
                                          <div className="col-span-2">น้ำฝน + บ่อบาดาล</div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                                        <Calendar className="mr-2 h-5 w-5 text-green-600" /> ข้อมูลการตรวจสอบ / Inspection Data
                                      </h3>
                                      <div className="bg-green-50 p-4 rounded-md space-y-2">
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">ตรวจสอบล่าสุด:</div>
                                          <div className="col-span-2">{formatDate(selectedFarm.lastInspectionDate)}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">กำหนดตรวจครั้งถัดไป:</div>
                                          <div className="col-span-2">{formatDate(selectedFarm.nextInspectionDate)}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="font-medium">สถานะการตรวจสอบ:</div>
                                          <div className="col-span-2">
                                            <Badge className="bg-green-600">ผ่านการตรวจสอบ</Badge>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-6">
                                    {(selectedTrace.temperature || selectedTrace.humidity) && (
                                      <div>
                                        <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                                          <Thermometer className="mr-2 h-5 w-5 text-green-600" /> สภาพแวดล้อม / Environmental Conditions
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
                                    
                                    {selectedTrace.certifications && selectedTrace.certifications.length > 0 && (
                                      <div>
                                        <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                                          <Award className="mr-2 h-5 w-5 text-green-600" /> การรับรองผลิตภัณฑ์ / Product Certifications
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
                              
                              <TabsContent value="journey" className="p-2">
                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                                    <Truck className="mr-2 h-5 w-5 text-green-600" /> ประวัติการเดินทางของสินค้า / Product Journey History
                                  </h3>
                                  
                                  <div className="relative">
                                    {herbJourney.map((journeyTrace, index) => (
                                      <div key={journeyTrace.id} className="flex items-start mb-6">
                                        <div className="flex flex-col items-center">
                                          <div className={`w-4 h-4 rounded-full ${
                                            journeyTrace.id === selectedTrace.id 
                                              ? 'bg-green-600' 
                                              : 'bg-blue-400'
                                          }`}></div>
                                          {index < herbJourney.length - 1 && (
                                            <div className="w-0.5 h-12 bg-gray-300 mt-2"></div>
                                          )}
                                        </div>
                                        
                                        <div className="ml-4 flex-1">
                                          <div className={`p-4 rounded-lg ${
                                            journeyTrace.id === selectedTrace.id 
                                              ? 'bg-green-50 border-2 border-green-200' 
                                              : 'bg-gray-50'
                                          }`}>
                                            <div className="flex items-center justify-between mb-2">
                                              <h4 className="font-semibold text-gray-800">{journeyTrace.event}</h4>
                                              <Badge className={`${
                                                journeyTrace.event === "Seeding" ? "bg-blue-500" :
                                                journeyTrace.event === "Growing" ? "bg-emerald-500" :
                                                journeyTrace.event === "Harvesting" ? "bg-amber-500" :
                                                journeyTrace.event === "Processing" ? "bg-purple-500" :
                                                journeyTrace.event === "Testing" ? "bg-sky-500" :
                                                journeyTrace.event === "Packaging" ? "bg-indigo-500" :
                                                journeyTrace.event === "Shipping" ? "bg-orange-500" :
                                                journeyTrace.event === "Delivered" ? "bg-green-600" :
                                                "bg-gray-500"
                                              } text-white`}>
                                                {journeyTrace.event}
                                              </Badge>
                                            </div>
                                            
                                            <div className="text-sm text-gray-600 space-y-1">
                                              <div><strong>วันที่:</strong> {formatDateTime(journeyTrace.timestamp)}</div>
                                              <div><strong>รหัสอ้างอิง:</strong> {journeyTrace.referenceCode}</div>
                                              <div><strong>พิกัด:</strong> {journeyTrace.location.lat.toFixed(4)}, {journeyTrace.location.lng.toFixed(4)}</div>
                                              {journeyTrace.verifiedBy && (
                                                <div><strong>ตรวจสอบโดย:</strong> {journeyTrace.verifiedBy}</div>
                                              )}
                                              {journeyTrace.notes && (
                                                <div><strong>หมายเหตุ:</strong> {journeyTrace.notes}</div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <div className="bg-blue-50 p-4 rounded-md">
                                    <h4 className="font-semibold text-blue-800 mb-2">สรุปการเดินทาง</h4>
                                    <div className="text-sm text-blue-700 space-y-1">
                                      <div>• จำนวนขั้นตอนทั้งหมด: {herbJourney.length} ขั้นตอน</div>
                                      <div>• เริ่มต้น: {formatDateTime(herbJourney[0]?.timestamp || '')}</div>
                                      <div>• ล่าสุด: {formatDateTime(herbJourney[herbJourney.length - 1]?.timestamp || '')}</div>
                                      <div>• สถานะปัจจุบัน: {herbJourney[herbJourney.length - 1]?.event || 'N/A'}</div>
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
                                      qualityGrade: selectedTrace.qualityGrade,
                                      farmer: selectedFarmer?.fullName || 'Unknown'
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
                                      สแกน QR Code นี้เพื่อตรวจสอบความถูกต้องและติดตามผลิตภัณฑ์สมุนไพร
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
