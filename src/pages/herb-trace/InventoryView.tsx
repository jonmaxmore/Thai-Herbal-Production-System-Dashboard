
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function InventoryView() {
  return (
    <HerbTraceLayout activeTab="inventory">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">สินค้าคงคลัง</h1>
          <p className="text-muted-foreground">
            จัดการสินค้าคงคลังสมุนไพร
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>คลังสินค้า</CardTitle>
            <CardDescription>ระบบนี้อยู่ระหว่างการพัฒนา</CardDescription>
          </CardHeader>
          <CardContent>
            <p>กำลังพัฒนาฟีเจอร์การจัดการคลังสินค้า</p>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
