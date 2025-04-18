
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowRight, ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react';

export const RelationshipDiagram: React.FC = () => {
  // Define the relationships between stakeholders
  const relationships = [
    {
      id: 'rel1',
      from: 'เกษตร',
      to: 'แพลตฟอร์ม',
      description: 'เกษตรกรกรอกข้อมูลการปลูกผ่านเว็บ/แอปฯ',
      direction: 'right',
    },
    {
      id: 'rel2',
      from: 'แพลตฟอร์ม',
      to: 'ห้องปฏิบัติการ',
      description: 'แพลตฟอร์มประสานส่งตัวอย่างเพื่อวิเคราะห์',
      direction: 'right',
    },
    {
      id: 'rel3',
      from: 'ห้องปฏิบัติการ',
      to: 'แพลตฟอร์ม',
      description: 'ผลการวิเคราะห์อัปโหลดแบบเรียลไทม์',
      direction: 'down',
    },
    {
      id: 'rel4',
      from: 'แพลตฟอร์ม',
      to: 'มกอช.',
      description: 'รายงานผลและตัวชี้วัด ให้มกอช. นำไปใช้ประเมินและให้คำแนะนำ',
      direction: 'up',
    },
    {
      id: 'rel5',
      from: 'แพลตฟอร์ม',
      to: 'กรมแพทย์แผนไทยฯ',
      description: 'สรุปรายงานมาตรฐาน เชื่อมข้อมูลสนับสนุนการกำกับดูแล',
      direction: 'up',
    },
    {
      id: 'rel6',
      from: 'มกอช.',
      to: 'เกษตร',
      description: 'ถ่ายทอดความรู้ผ่านแพลตฟอร์ม และฝึกอบรมในภาคสนาม',
      direction: 'down',
    },
    {
      id: 'rel7',
      from: 'กรมแพทย์แผนไทยฯ',
      to: 'มกอช.',
      description: 'กำหนดนโยบายและมาตรฐาน ส่งต่อให้มกอช.',
      direction: 'left',
    },
    {
      id: 'rel8',
      from: 'ผู้ให้บริการแพลตฟอร์ม',
      to: 'กรมแพทย์แผนไทยฯ',
      description: 'ถ่ายทอดเทคโนโลยี เอกสาร และอบรมเมื่อสิ้นสุดโครงการ',
      direction: 'up',
    },
  ];

  // Return arrow icon based on direction
  const getArrowIcon = (direction: string) => {
    switch (direction) {
      case 'right':
        return <ArrowRight className="h-4 w-4 text-green-600" />;
      case 'left':
        return <ArrowLeft className="h-4 w-4 text-green-600" />;
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-green-600" />;
      default:
        return <ArrowRight className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">คำอธิบายความเชื่อมโยง</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relationships.map((rel) => (
            <div 
              key={rel.id}
              className="p-4 bg-white border rounded-lg shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center mb-2">
                <div className="font-medium text-blue-700 mr-2">{rel.from}</div>
                {getArrowIcon(rel.direction)}
                <div className="font-medium text-purple-700 ml-2">{rel.to}</div>
              </div>
              <p className="text-sm text-gray-600">{rel.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2">แผนภาพความสัมพันธ์</h3>
          <div className="text-center">
            <svg width="100%" height="300" viewBox="0 0 800 300" className="mx-auto">
              {/* DTM */}
              <rect x="350" y="50" width="120" height="50" rx="5" fill="#e3f2fd" stroke="#2196f3" strokeWidth="2" />
              <text x="410" y="80" textAnchor="middle" fill="#1565c0" fontWeight="bold">กรมแพทย์แผนไทยฯ</text>
              
              {/* MOSK */}
              <rect x="600" y="150" width="120" height="50" rx="5" fill="#e8f5e9" stroke="#4caf50" strokeWidth="2" />
              <text x="660" y="180" textAnchor="middle" fill="#2e7d32" fontWeight="bold">มกอช.</text>
              
              {/* Platform */}
              <rect x="350" y="150" width="120" height="50" rx="5" fill="#fff3e0" stroke="#ff9800" strokeWidth="2" />
              <text x="410" y="180" textAnchor="middle" fill="#e65100" fontWeight="bold">แพลตฟอร์ม</text>
              
              {/* Farmers */}
              <rect x="100" y="150" width="120" height="50" rx="5" fill="#f3e5f5" stroke="#9c27b0" strokeWidth="2" />
              <text x="160" y="180" textAnchor="middle" fill="#6a1b9a" fontWeight="bold">เกษตรกร</text>
              
              {/* Lab */}
              <rect x="350" y="250" width="120" height="50" rx="5" fill="#e0f7fa" stroke="#00bcd4" strokeWidth="2" />
              <text x="410" y="280" textAnchor="middle" fill="#00838f" fontWeight="bold">ห้องปฏิบัติการ</text>
              
              {/* Arrows */}
              {/* DTM to MOSK */}
              <path d="M470 75 L600 150" stroke="#757575" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="5,5" />
              
              {/* DTM to Platform */}
              <path d="M410 100 L410 150" stroke="#757575" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* MOSK to Farmers */}
              <path d="M600 175 L220 175" stroke="#757575" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Platform to Farmers */}
              <path d="M350 175 L220 175" stroke="#757575" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Farmers to Lab */}
              <path d="M160 200 L350 250" stroke="#757575" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Lab to Platform */}
              <path d="M410 250 L410 200" stroke="#757575" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Platform to DTM - End of project */}
              <path d="M470 150 L600 75" stroke="#f44336" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="10,5" />
              <text x="550" y="100" fill="#d32f2f" fontStyle="italic" fontSize="12">ถ่ายทอดเทคโนโลยี</text>
              <text x="550" y="115" fill="#d32f2f" fontStyle="italic" fontSize="12">(สิ้นสุดโครงการ)</text>
              
              {/* Arrowhead marker */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#757575" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
