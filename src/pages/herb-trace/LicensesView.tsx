
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LicensesView() {
  return (
    <HerbTraceLayout activeTab="licenses">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ใบอนุญาต</h1>
          <p className="text-muted-foreground">
            จัดการใบอนุญาตการผลิตสมุนไพร
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>ใบอนุญาตต่างๆ</CardTitle>
            <CardDescription>ระบบนี้อยู่ระหว่างการพัฒนา</CardDescription>
          </CardHeader>
          <CardContent>
            <p>กำลังพัฒนาฟีเจอร์การจัดการใบอนุญาต</p>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
