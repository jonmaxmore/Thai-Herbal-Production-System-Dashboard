
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function B2BMarketView() {
  return (
    <HerbTraceLayout activeTab="b2b">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ตลาด B2B</h1>
          <p className="text-muted-foreground">
            แพลตฟอร์มการค้าขายระหว่างธุรกิจ
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>ตลาด B2B</CardTitle>
            <CardDescription>ระบบนี้อยู่ระหว่างการพัฒนา</CardDescription>
          </CardHeader>
          <CardContent>
            <p>กำลังพัฒนาฟีเจอร์ตลาดการค้าระหว่างธุรกิจ</p>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
