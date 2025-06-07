
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LabMaterialsView() {
  return (
    <HerbTraceLayout activeTab="lab_materials">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">วัสดุและอุปกรณ์</h1>
          <p className="text-muted-foreground">
            จัดการวัสดุอุปกรณ์ห้องปฏิบัติการ
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>คลังวัสดุ</CardTitle>
            <CardDescription>ระบบนี้อยู่ระหว่างการพัฒนา</CardDescription>
          </CardHeader>
          <CardContent>
            <p>กำลังพัฒนาฟีเจอร์การจัดการวัสดุอุปกรณ์</p>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
