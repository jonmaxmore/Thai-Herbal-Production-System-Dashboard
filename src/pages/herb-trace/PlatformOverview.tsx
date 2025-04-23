
import React from 'react';
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StakeholderRegister } from "@/components/herb-trace/StakeholderRegister";
import { Info, FileText, Users, FlowChart, Connection } from "lucide-react";

export default function PlatformOverview() {
  // Mock data for stakeholder register
  const stakeholders = [
    {
      type: "หน่วยงาน",
      name: "กรมแพทย์แผนไทยและการแพทย์ทางเลือก (DTM)",
      role: "ผู้ใช้งานหลัก รับข้อมูลและนำไปใช้กำกับดูแลมาตรฐานสมุนไพร",
      interest: "การใช้งานระบบและมาตรฐานคุณภาพ",
      influence: "High" as const
    },
    {
      type: "หน่วยงาน",
      name: "สำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ (มกอช.)",
      role: "ถ่ายทอดองค์ความรู้และประเมินตามมาตรฐาน",
      interest: "ถ่ายทอดมาตรฐานปฏิบัติ",
      influence: "Medium" as const
    },
    {
      type: "บุคคล",
      name: "เกษตรกรสมุนไพร",
      role: "ปลูกและจัดหาข้อมูลวัตถุดิบ",
      interest: "รายได้และความยั่งยืน",
      influence: "Medium" as const
    },
    {
      type: "บริการ",
      name: "ห้องปฏิบัติการ",
      role: "วิเคราะห์และทดสอบตัวอย่างสมุนไพร",
      interest: "ความแม่นยำของผลทดสอบ",
      influence: "Medium" as const
    },
    {
      type: "บริการ",
      name: "ผู้ให้บริการแพลตฟอร์ม",
      role: "พัฒนา ดูแลระบบ hosting, API, support ให้บริการปรึกษา",
      interest: "เสถียรภาพและประสิทธิภาพของระบบ, บริการครบวงจร",
      influence: "High" as const
    }
  ];

  return (
    <HerbTraceLayout activeTab="overview">
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-green-800 mb-6">
          แผนภาพความเชื่อมโยงผู้มีส่วนได้ส่วนเสีย: ระบบการผลิตสมุนไพรไทยตามแนวทาง GACP
        </h1>

        <Tabs defaultValue="objectives" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="objectives" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>จุดมุ่งหมายหลัก</span>
            </TabsTrigger>
            <TabsTrigger value="stakeholders" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>ผู้มีส่วนได้ส่วนเสีย</span>
            </TabsTrigger>
            <TabsTrigger value="process" className="flex items-center gap-2">
              <FlowChart className="h-4 w-4" />
              <span>กระบวนการทำงาน</span>
            </TabsTrigger>
            <TabsTrigger value="relationships" className="flex items-center gap-2">
              <Connection className="h-4 w-4" />
              <span>ความเชื่อมโยง</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="objectives">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-green-800">
                  จุดมุ่งหมายหลักของแพลตฟอร์ม (Key Objectives)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-lg font-medium text-green-800 mb-2">แก้ปัญหาการเข้าถึงข้อมูล</h3>
                  <p>ช่วยเกษตรกรเข้าถึงข้อมูล GACP และแนวทางปลูกสมุนไพรเศรษฐกิจ 6 ชนิด (รวมกัญชา)</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">แพลตฟอร์มฟรี</h3>
                  <p>เก็บข้อมูลการปลูก วิเคราะห์แนวทางปรับปรุงคุณภาพ</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-medium text-purple-800 mb-2">บริการคำปรึกษา</h3>
                  <p>ประสานกรมแพทย์แผนไทยฯ ตรวจสถานที่ปลูก ช่วยขอมาตรฐาน GACP</p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-medium text-yellow-800 mb-2">สนับสนุนห่วงโซ่คุณค่า</h3>
                  <p>ครอบคลุมตั้งแต่ต้นน้ำถึงปลายน้ำ</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-medium text-orange-800 mb-2">รองรับการวิเคราะห์คุณภาพ</h3>
                  <p>สนับสนุนการวิเคราะห์คุณภาพสมุนไพรในห้องปฏิบัติการก่อนยื่นขอ GACP</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stakeholders">
            <StakeholderRegister stakeholders={stakeholders} />
          </TabsContent>

          <TabsContent value="process">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-green-800">
                  แผนภาพกระบวนการทำงาน (Process Flow)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                  <img 
                    src="https://mermaid.ink/img/pako:eNp1kU9rwzAMxb_KobdCDqXsD-xlh8FB6VqyQjqWYouduEts59_Ksu8eNS3pOjbJz0_vCZ6IBCUYIoekV07nZNHORJ8FNgLzFrNSNEDLOT4_dJ3oj15lkUHNWSJa4eXXRRpnzTk27KJUhxCIw0xJrEJQcFST5qpVHEiKHrLKjVbSNsN0Z3-6XiRCXoxZxPbE7TQMfTkUY2G92TfDe1fhGgVp9JgqmNQZsHIHyGgZnAdVsG3CrFAqn0OKlN3Dqjm0L0yD8-Rd19ue57arWu74LUvmD1Zrb06onNGQC2wLTlwVqZCw_-NKLz5gVEZlGGJ0hPqRFVYnJVJSB6eGtQkRFnZJGiXqA-rAp9FLVCbYC7qElnLO6EpIhmR8ukHWxTJJkw4KXYCUoQjJGP1aEoO_wnM7TDd3X7yUuxU" 
                    alt="Process Flow Diagram" 
                    className="mx-auto max-w-full h-auto"
                  />
                  <p className="mt-4 text-sm text-gray-500">แผนภาพกระบวนการทำงานระหว่างผู้มีส่วนได้ส่วนเสีย</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relationships">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-green-800">
                    แผนภาพความสัมพันธ์ (Relationship Diagram)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                    <img 
                      src="https://mermaid.ink/img/pako:eNp1kk9rwzAMxb_KobctPZSyP7CXHQYHpWvJCulYii124pZYzr-VZN89apo2W0mC0NT69ZOMBxBGCTqQQfLSWlOSQbtgdRPYBMxVmZSgARon9fu56_j0x0kTGdScJKIVnk5dJHFSnGPBLkptCJ4YRgpiYb2Ck9BMiZuWsSPOB0iSG6Ww3YzzJ_vvepYIeXFmEdqDsMM4DtVYzGXzuj8MH32NKxS4wXNegmYDYKUOkLHigHWMFcMm9BKl9pnliP4Ai1LolZGQ3Fq17Xn-3XXb85z3WXD9_E3-tbRqQ3ggmE5dIoTg1Fj7j1smpxF0rNcahGQVwTqkRpxqwajGBKsiVlSAxUOWSqbQTqzBnlbZi4qzd2pDiE2O6GaQHTLeQEZx5TSDjPcuXorwjnVnypDGYA3-Wo7H8eHpCzV4vF4" 
                      alt="Relationship Diagram" 
                      className="mx-auto max-w-full h-auto"
                    />
                    <p className="mt-4 text-sm text-gray-500">แผนภาพความสัมพันธ์ระหว่างผู้มีส่วนได้ส่วนเสีย</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-green-800">
                    คำอธิบายความเชื่อมโยง (Detailed Linkages)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border-l-4 border-green-500 bg-green-50">
                    <p className="font-medium">เกษตรกร → แพลตฟอร์ม:</p>
                    <p>เกษตรกรกรอกข้อมูลการปลูกผ่านเว็บ/แอปพลิเคชัน</p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                    <p className="font-medium">แพลตฟอร์ม → ห้องปฏิบัติการ:</p>
                    <p>แพลตฟอร์มประสานการส่งตัวอย่างเพื่อวิเคราะห์คุณภาพ</p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                    <p className="font-medium">ห้องปฏิบัติการ → แพลตฟอร์ม:</p>
                    <p>ผลการวิเคราะห์คุณภาพสมุนไพรอัปโหลดแบบเรียลไทม์</p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                    <p className="font-medium">แพลตฟอร์ม → มกอช.:</p>
                    <p>รายงานผลและตัวชี้วัด เพื่อใช้ในการประเมินและให้คำแนะนำ</p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
                    <p className="font-medium">แพลตฟอร์ม → กรมแพทย์แผนไทยฯ:</p>
                    <p>สรุปรายงานมาตรฐาน เชื่อมข้อมูลสนับสนุนการกำกับดูแล</p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-red-500 bg-red-50">
                    <p className="font-medium">มกอช. → เกษตรกร:</p>
                    <p>ถ่ายทอดความรู้ผ่านแพลตฟอร์ม และจัดฝึกอบรมในภาคสนาม</p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-indigo-500 bg-indigo-50">
                    <p className="font-medium">กรมแพทย์แผนไทยฯ → มกอช.:</p>
                    <p>กำหนดนโยบายและมาตรฐาน ส่งต่อให้มกอช.นำไปปฏิบัติ</p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-pink-500 bg-pink-50">
                    <p className="font-medium">ผู้ให้บริการแพลตฟอร์ม → กรมแพทย์แผนไทยฯ:</p>
                    <p>ถ่ายทอดเทคโนโลยี เอกสาร และจัดอบรมเมื่อสิ้นสุดโครงการ</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HerbTraceLayout>
  );
}
