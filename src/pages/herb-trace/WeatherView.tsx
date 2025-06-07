
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WeatherView() {
  return (
    <HerbTraceLayout activeTab="weather">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">สภาพอากาศ</h1>
          <p className="text-muted-foreground">
            ข้อมูลสภาพอากาศสำหรับการเพาะปลูก
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลสภาพอากาศ</CardTitle>
            <CardDescription>ระบบนี้อยู่ระหว่างการพัฒนา</CardDescription>
          </CardHeader>
          <CardContent>
            <p>กำลังพัฒนาฟีเจอร์การติดตามสภาพอากาศ</p>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
