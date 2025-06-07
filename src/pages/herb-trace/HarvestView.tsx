
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HarvestView() {
  return (
    <HerbTraceLayout activeTab="harvest">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">การเก็บเกี่ยว</h1>
          <p className="text-muted-foreground">
            จัดการข้อมูลการเก็บเกี่ยวสมุนไพร
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลการเก็บเกี่ยว</CardTitle>
            <CardDescription>ระบบนี้อยู่ระหว่างการพัฒนา</CardDescription>
          </CardHeader>
          <CardContent>
            <p>กำลังพัฒนาฟีเจอร์การจัดการข้อมูลการเก็บเกี่ยว</p>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
