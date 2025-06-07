
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProcurementView() {
  return (
    <HerbTraceLayout activeTab="procurement">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">จัดซื้อวัตถุดิบ</h1>
          <p className="text-muted-foreground">
            ระบบจัดซื้อวัตถุดิบสมุนไพร
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>การจัดซื้อ</CardTitle>
            <CardDescription>ระบบนี้อยู่ระหว่างการพัฒนา</CardDescription>
          </CardHeader>
          <CardContent>
            <p>กำลังพัฒนาฟีเจอร์การจัดซื้อวัตถุดิบ</p>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
