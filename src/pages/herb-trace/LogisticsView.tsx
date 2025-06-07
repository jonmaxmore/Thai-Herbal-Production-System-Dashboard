
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LogisticsView() {
  return (
    <HerbTraceLayout activeTab="logistics">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">การขนส่ง</h1>
          <p className="text-muted-foreground">
            จัดการระบบขนส่งสมุนไพร
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>การขนส่ง</CardTitle>
            <CardDescription>ระบบนี้อยู่ระหว่างการพัฒนา</CardDescription>
          </CardHeader>
          <CardContent>
            <p>กำลังพัฒนาฟีเจอร์การจัดการขนส่ง</p>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
