
import React from 'react';
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { KeyObjectives } from '@/components/herb-trace/KeyObjectives';
import { StakeholderRegister } from '@/components/herb-trace/StakeholderRegister';
import { StakeholderFlowChart } from '@/components/herb-trace/StakeholderFlowChart';
import { RelationshipDiagram } from '@/components/herb-trace/RelationshipDiagram';
import { Button } from '@/components/ui/button';
import { FileText, Share2 } from 'lucide-react';

export default function PlatformOverview() {
  return (
    <HerbTraceLayout activeTab="platform_overview">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">ภาพรวมแพลตฟอร์มสมุนไพรไทย</h2>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <FileText className="h-4 w-4 mr-2" />
              พิมพ์เอกสาร
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              แชร์
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Key Objectives Section */}
          <KeyObjectives />
          
          {/* Stakeholder Register */}
          <StakeholderRegister />
          
          {/* Process Flow */}
          <StakeholderFlowChart 
            title="กระบวนการทำงาน (Process Flow)" 
            description="ขั้นตอนการทำงานของแพลตฟอร์มสมุนไพรไทย ตั้งแต่การส่งข้อมูลการปลูกจนถึงการรายงานมาตรฐาน"
          />
          
          {/* Relationship Diagram */}
          <RelationshipDiagram />
        </div>
      </div>
    </HerbTraceLayout>
  );
}
