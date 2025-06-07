
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LabTestingView() {
  return (
    <HerbTraceLayout activeTab="lab_testing">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ผลการวิเคราะห์</h1>
          <p className="text-muted-foreground">
            ผลการตรวจวิเคราะห์ตัวอย่างสมุนไพร
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>ผลการทดสอบ</CardTitle>
            <CardDescription>ระบบนี้อยู่ระหว่างการพัฒนา</CardDescription>
          </CardHeader>
          <CardContent>
            <p>กำลังพัฒนาฟีเจอร์การแสดงผลการวิเคราะห์</p>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
