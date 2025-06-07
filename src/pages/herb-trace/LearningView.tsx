
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LearningView() {
  return (
    <HerbTraceLayout activeTab="learning">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ห้องเรียนออนไลน์</h1>
          <p className="text-muted-foreground">
            เรียนรู้เกี่ยวกับการเพาะปลูกสมุนไพร
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>คอร์สเรียน</CardTitle>
            <CardDescription>ระบบนี้อยู่ระหว่างการพัฒนา</CardDescription>
          </CardHeader>
          <CardContent>
            <p>กำลังพัฒนาฟีเจอร์ห้องเรียนออนไลน์</p>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
