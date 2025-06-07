
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActivitiesView() {
  return (
    <HerbTraceLayout activeTab="activities">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">บันทึกกิจกรรม</h1>
          <p className="text-muted-foreground">
            บันทึกกิจกรรมการเพาะปลูกและดูแลสมุนไพร
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>กิจกรรมล่าสุด</CardTitle>
            <CardDescription>ระบบนี้อยู่ระหว่างการพัฒนา</CardDescription>
          </CardHeader>
          <CardContent>
            <p>กำลังพัฒนาฟีเจอร์การบันทึกกิจกรรมการเพาะปลูก</p>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
