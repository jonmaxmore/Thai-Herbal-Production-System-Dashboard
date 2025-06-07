
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductionView() {
  return (
    <HerbTraceLayout activeTab="production">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">กระบวนการผลิต</h1>
          <p className="text-muted-foreground">
            จัดการกระบวนการผลิตสมุนไพร
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>การผลิต</CardTitle>
            <CardDescription>ระบบนี้อยู่ระหว่างการพัฒนา</CardDescription>
          </CardHeader>
          <CardContent>
            <p>กำลังพัฒนาฟีเจอร์การจัดการกระบวนการผลิต</p>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
