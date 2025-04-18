
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Leaf, FlaskConical, ClipboardCheck, Award, PackageSearch, 
  ArrowRight, Database, RefreshCw, FileCheck, BookOpen 
} from 'lucide-react';

export type FlowStep = {
  id: string;
  label: string;
  icon: React.ReactNode;
  stakeholders: string[];
  description?: string;
};

interface StakeholderFlowChartProps {
  title?: string;
  description?: string;
}

export const StakeholderFlowChart: React.FC<StakeholderFlowChartProps> = ({ 
  title = "กระบวนการทำงาน", 
  description = "ขั้นตอนการทำงานของแพลตฟอร์มสมุนไพรไทย" 
}) => {
  // Define the process flow steps based on your requirements
  const flowSteps: FlowStep[] = [
    {
      id: "step1",
      label: "เกษตรกรส่งข้อมูลการปลูก",
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      stakeholders: ["เกษตรกร"],
      description: "เกษตรกรกรอกข้อมูลการปลูกผ่านเว็บหรือแอปพลิเคชัน"
    },
    {
      id: "step2",
      label: "แพลตฟอร์มรับข้อมูล",
      icon: <Database className="h-8 w-8 text-blue-600" />,
      stakeholders: ["ผู้พัฒนาแพลตฟอร์ม"],
      description: "ระบบประมวลผลและจัดเก็บข้อมูลในฐานข้อมูล"
    },
    {
      id: "step3",
      label: "ส่งตัวอย่างไปห้องปฏิบัติการ",
      icon: <FlaskConical className="h-8 w-8 text-purple-600" />,
      stakeholders: ["เกษตรกร", "ห้องปฏิบัติการ"],
      description: "ตัวอย่างสมุนไพรถูกส่งไปยังห้องปฏิบัติการเพื่อการวิเคราะห์"
    },
    {
      id: "step4",
      label: "ห้องปฏิบัติการวิเคราะห์คุณภาพ",
      icon: <PackageSearch className="h-8 w-8 text-amber-600" />,
      stakeholders: ["ห้องปฏิบัติการ"],
      description: "ทำการทดสอบทางเคมีและกายภาพเพื่อวิเคราะห์คุณภาพ"
    },
    {
      id: "step5",
      label: "อัปโหลดผลวิเคราะห์",
      icon: <FileCheck className="h-8 w-8 text-teal-600" />,
      stakeholders: ["ห้องปฏิบัติการ", "ผู้พัฒนาแพลตฟอร์ม"],
      description: "ผลการวิเคราะห์ถูกบันทึกเข้าระบบแบบเรียลไทม์"
    },
    {
      id: "step6",
      label: "รายงานตัวชี้วัดให้มกอช.",
      icon: <BookOpen className="h-8 w-8 text-orange-600" />,
      stakeholders: ["ผู้พัฒนาแพลตฟอร์ม", "มกอช."],
      description: "รายงานผลและตัวชี้วัดสำหรับใช้ในการประเมินและให้คำแนะนำ"
    },
    {
      id: "step7",
      label: "รายงานมาตรฐานให้กรมแพทย์แผนไทยฯ",
      icon: <Award className="h-8 w-8 text-red-600" />,
      stakeholders: ["ผู้พัฒนาแพลตฟอร์ม", "กรมแพทย์แผนไทยและการแพทย์ทางเลือก"],
      description: "สรุปรายงานมาตรฐานเพื่อสนับสนุนการกำกับดูแล"
    },
    {
      id: "step8",
      label: "มกอช.ให้คำแนะนำและประเมิน",
      icon: <ClipboardCheck className="h-8 w-8 text-indigo-600" />,
      stakeholders: ["มกอช.", "เกษตรกร"],
      description: "ถ่ายทอดความรู้ผ่านแพลตฟอร์มและฝึกอบรมในภาคสนาม"
    },
    {
      id: "step9",
      label: "กรมแพทย์แผนไทยฯ ติดตามและปรับปรุงนโยบาย",
      icon: <RefreshCw className="h-8 w-8 text-emerald-600" />,
      stakeholders: ["กรมแพทย์แผนไทยและการแพทย์ทางเลือก", "มกอช."],
      description: "กำหนดนโยบายและมาตรฐาน ส่งต่อให้มกอช."
    }
  ];

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-sm text-gray-500">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="flow-chart flex flex-col space-y-2 md:space-y-0 md:flex-row md:flex-wrap md:justify-between">
          {flowSteps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex-1 min-w-[280px] max-w-full md:max-w-[30%] p-4 bg-white border rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-gray-100 mr-3">
                    {step.icon}
                  </div>
                  <h3 className="font-medium">{step.label}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                <div className="flex flex-wrap gap-1">
                  {step.stakeholders.map((stakeholder) => (
                    <span 
                      key={`${step.id}-${stakeholder}`}
                      className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800"
                    >
                      {stakeholder}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Add arrows between steps, except for the last one */}
              {index < flowSteps.length - 1 && (
                <div className="hidden md:flex items-center justify-center md:w-[5%]">
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Mobile-friendly linear flow indicators */}
        <div className="md:hidden mt-4 space-y-2">
          {flowSteps.map((step, index) => (
            index < flowSteps.length - 1 && (
              <div key={`arrow-${index}`} className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-gray-400 transform rotate-90" />
              </div>
            )
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="font-medium text-blue-800 mb-2">ถ่ายทอดเทคโนโลยี (สิ้นสุดโครงการ)</h4>
          <p className="text-sm text-blue-700">เมื่อสิ้นสุดโครงการ ผู้ให้บริการแพลตฟอร์มจะถ่ายทอดเทคโนโลยี เอกสาร และจัดอบรมให้กับกรมแพทย์แผนไทยและการแพทย์ทางเลือก</p>
        </div>
      </CardContent>
    </Card>
  );
};
