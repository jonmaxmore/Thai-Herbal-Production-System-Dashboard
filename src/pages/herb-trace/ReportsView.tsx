
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsView() {
  return (
    <HerbTraceLayout activeTab="reports">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">รายงาน</h1>
          <p className="text-muted-foreground">
            รายงานและสถิติต่างๆ ของระบบ
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>รายงานสถิติ</CardTitle>
            <CardDescription>ระบบนี้อยู่ระหว่างการพัฒนา</CardDescription>
          </CardHeader>
          <CardContent>
            <p>กำลังพัฒนาฟีเจอร์การสร้างรายงาน</p>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
