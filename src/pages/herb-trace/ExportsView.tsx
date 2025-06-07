
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExportsView() {
  return (
    <HerbTraceLayout activeTab="exports">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">การส่งออก</h1>
          <p className="text-muted-foreground">
            จัดการข้อมูลการส่งออกสมุนไพร
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลการส่งออก</CardTitle>
            <CardDescription>ระบบนี้อยู่ระหว่างการพัฒนา</CardDescription>
          </CardHeader>
          <CardContent>
            <p>กำลังพัฒนาฟีเจอร์การจัดการข้อมูลส่งออก</p>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
