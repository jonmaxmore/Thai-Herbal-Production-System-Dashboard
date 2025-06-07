
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContractsView() {
  return (
    <HerbTraceLayout activeTab="contracts">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">สัญญาซื้อขาย</h1>
          <p className="text-muted-foreground">
            จัดการสัญญาซื้อขายสมุนไพร
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>สัญญาต่างๆ</CardTitle>
            <CardDescription>ระบบนี้อยู่ระหว่างการพัฒนา</CardDescription>
          </CardHeader>
          <CardContent>
            <p>กำลังพัฒนาฟีเจอร์การจัดการสัญญา</p>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
