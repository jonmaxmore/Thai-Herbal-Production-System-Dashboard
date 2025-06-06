
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Upload, FileText, Camera, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GACPApplicationService } from "@/services/gacpApplicationService";
import { thaiProvinces } from "@/utils/database/constants";

interface GACPApplicationFormProps {
  farmerId: string;
  userId: string;
  onApplicationCreated?: (applicationId: string) => void;
}

export default function GACPApplicationForm({ farmerId, userId, onApplicationCreated }: GACPApplicationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      farmName: "",
      province: "",
      cultivationArea: "",
      crops: [] as string[],
      farmImages: [] as string[],
      labResults: [] as string[]
    }
  });

  const onSubmit = async (data: any) => {
    try {
      if (!applicationId) {
        // Create new application
        const application = GACPApplicationService.createApplication(farmerId, userId);
        setApplicationId(application.id);
        
        toast({
          title: "สร้างใบสมัครสำเร็จ",
          description: "ใบสมัคร GACP ถูกสร้างแล้ว กรุณากรอกข้อมูลให้ครบถ้วน",
        });
      }

      // Update application with form data
      if (applicationId) {
        GACPApplicationService.updateApplication(applicationId, {
          farmData: {
            name: data.farmName,
            location: { lat: 13.7563, lng: 100.5018 }, // Mock coordinates
            province: data.province,
            cultivationArea: parseFloat(data.cultivationArea),
            crops: data.crops,
            farmImages: data.farmImages
          },
          labResults: {
            files: data.labResults,
            uploadDate: new Date()
          }
        });

        if (currentStep < 4) {
          setCurrentStep(currentStep + 1);
        } else {
          // Submit application
          const success = GACPApplicationService.submitApplication(applicationId);
          if (success) {
            toast({
              title: "ยื่นใบสมัครสำเร็จ",
              description: "ใบสมัคร GACP ถูกส่งเพื่อตรวจสอบแล้ว จะมีการแจ้งผลภายใน 3-5 วันทำการ",
            });
            setIsOpen(false);
            onApplicationCreated?.(applicationId);
          }
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งใบสมัครได้ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setApplicationId(null);
    form.reset();
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">ข้อมูลฟาร์ม/แปลงปลูก</h3>
              <p className="text-sm text-gray-600">กรอกข้อมูลพื้นฐานของฟาร์มหรือแปลงปลูก</p>
            </div>

            <FormField
              control={form.control}
              name="farmName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อฟาร์ม/แปลงปลูก *</FormLabel>
                  <FormControl>
                    <Input placeholder="กรุณากรอกชื่อฟาร์มหรือแปลงปลูก" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>จังหวัด *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกจังหวัด" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {thaiProvinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cultivationArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>พื้นที่เพาะปลูก (ไร่) *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="จำนวนไร่" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Camera className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">รูปภาพฟาร์ม</h3>
              <p className="text-sm text-gray-600">อัพโหลดรูปภาพฟาร์มหรือแปลงปลูก</p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">คลิกเพื่ออัพโหลดรูปภาพ</p>
              <p className="text-sm text-gray-500">รองรับไฟล์ JPG, PNG (ขนาดไม่เกิน 5MB)</p>
              <Button variant="outline" className="mt-4">
                <Upload className="h-4 w-4 mr-2" />
                เลือกไฟล์
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">ผลการตรวจจากห้องแลป</h3>
              <p className="text-sm text-gray-600">อัพโหลดผลการตรวจสอบจากห้องปฏิบัติการ</p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">อัพโหลดไฟล์ผลการตรวจ</p>
              <p className="text-sm text-gray-500">รองรับไฟล์ PDF, DOC, DOCX</p>
              <Button variant="outline" className="mt-4">
                <Upload className="h-4 w-4 mr-2" />
                เลือกไฟล์
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">เอกสารที่ต้องการ:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• ผลการตรวจสอบดิน</li>
                <li>• ผลการตรวจสอบน้ำ</li>
                <li>• ผลการตรวจสอบสารเคมีตกค้าง</li>
                <li>• รายงานการใช้ปุ่ยและสารเคมี</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">ตรวจสอบข้อมูล</h3>
              <p className="text-sm text-gray-600">กรุณาตรวจสอบข้อมูลก่อนส่งใบสมัคร</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <strong>ชื่อฟาร์ม:</strong> {form.watch("farmName")}
              </div>
              <div>
                <strong>จังหวัด:</strong> {form.watch("province")}
              </div>
              <div>
                <strong>พื้นที่เพาะปลูก:</strong> {form.watch("cultivationArea")} ไร่
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">ข้อปฏิบัติสำคัญ:</h4>
                  <ul className="text-sm text-amber-700 mt-1 space-y-1">
                    <li>• ข้อมูลจะถูกส่งไปยัง บริษัท พรีดิพทีพ เอไอ โซลูชั่น จำกัด</li>
                    <li>• การตรวจสอบโดย AI จะใช้เวลา 2-3 วันทำการ</li>
                    <li>• หากผ่านการตรวจสอบ จะมีการนัด Video Call</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          ยื่นขอ GACP Certificate
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>ใบสมัครขอ GACP Certificate</SheetTitle>
          <SheetDescription>
            การยื่นขอใบรับรองมาตรฐาน GACP จากกรมการแพทย์แผนไทยและการแพทย์ทางเลือก
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStep()}

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  ย้อนกลับ
                </Button>
                
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {currentStep === 4 ? "ส่งใบสมัคร" : "ถัดไป"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
