
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  BookOpen, Leaf, Users, Link, Banknote, 
  MessageSquareText, FlaskConical, Award 
} from 'lucide-react';

export const KeyObjectives: React.FC = () => {
  const objectives = [
    {
      id: 'obj1',
      title: 'แก้ปัญหาการเข้าถึงข้อมูล GACP',
      description: 'ช่วยเกษตรกรเข้าถึงมาตรฐาน GACP และข้อมูลการปลูกสมุนไพรเศรษฐกิจ 6 ชนิด (รวมกัญชา) ได้ง่ายขึ้น',
      icon: <BookOpen className="h-8 w-8 text-blue-600" />
    },
    {
      id: 'obj2',
      title: 'เป็นตัวกลางเชื่อมโยงทุกภาคส่วน',
      description: 'เชื่อมโยงเกษตรกร หน่วยงานรัฐ และห้องปฏิบัติการเข้าด้วยกันในแพลตฟอร์มเดียว',
      icon: <Link className="h-8 w-8 text-purple-600" />
    },
    {
      id: 'obj3',
      title: 'แพลตฟอร์มฟรี ไม่มีค่าใช้จ่าย',
      description: 'เก็บข้อมูลการปลูก และวิเคราะห์แนวทางการปรับปรุงคุณภาพโดยไม่มีค่าใช้จ่าย',
      icon: <Banknote className="h-8 w-8 text-green-600" />
    },
    {
      id: 'obj4',
      title: 'บริการให้คำปรึกษา',
      description: 'ประสานงานกับกรมแพทย์แผนไทยฯ ในการตรวจสถานที่ปลูก และให้คำแนะนำในการขอรับรอง GACP',
      icon: <MessageSquareText className="h-8 w-8 text-amber-600" />
    },
    {
      id: 'obj5',
      title: 'สนับสนุนการวิเคราะห์คุณภาพ',
      description: 'ช่วยเหลือในการวิเคราะห์คุณภาพสมุนไพรในห้องปฏิบัติการก่อนยื่นขอ GACP',
      icon: <FlaskConical className="h-8 w-8 text-red-600" />
    },
    {
      id: 'obj6',
      title: 'ส่งเสริมมาตรฐานตั้งแต่ต้นน้ำถึงปลายน้ำ',
      description: 'ดูแลมาตรฐานการผลิตสมุนไพรตลอดห่วงโซ่อุปทาน เพื่อยกระดับคุณภาพสมุนไพรไทย',
      icon: <Award className="h-8 w-8 text-teal-600" />
    }
  ];

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          จุดมุ่งหมายหลักของแพลตฟอร์ม
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {objectives.map((objective) => (
            <div 
              key={objective.id}
              className="p-4 bg-white border rounded-lg shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-full bg-gray-100 mr-3">
                  {objective.icon}
                </div>
                <h3 className="font-medium">{objective.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{objective.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
