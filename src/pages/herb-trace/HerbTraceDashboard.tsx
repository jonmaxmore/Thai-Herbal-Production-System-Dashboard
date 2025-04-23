
import { useState, useEffect } from "react";
import { Leaf, Users, ClipboardCheck, AlertTriangle, ShoppingCart, CreditCard, UserCheck, Activity, TestTube, CheckCircle, Package, Database, FileText, FlaskConical, Microscope, Factory } from "lucide-react";
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import StatCard from "@/components/StatCard";
import { ChartSection } from "@/components/herb-trace/ChartSection";
import { TraceEventsTable } from "@/components/herb-trace/TraceEventsTable";
import { TransactionTable } from "@/components/herb-trace/TransactionTable";
import { StakeholderAnalysis } from "@/components/herb-trace/StakeholderAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAnalytics from "@/components/herb-trace/UserAnalytics";
import { getDashboardData } from "@/utils/mockDatabase";
import { ProcessFlowSection } from "@/components/herb-trace/ProcessFlowSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function HerbTraceDashboard() {
  const [dashboardData, setDashboardData] = useState<ReturnType<typeof getDashboardData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          variant: "destructive",
          title: "ข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (isLoading || !dashboardData) {
    return (
      <HerbTraceLayout activeTab="dashboard">
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </HerbTraceLayout>
    );
  }

  const { 
    farmers, 
    traces, 
    gapcStatus, 
    euGmpStatus, 
    dttmStatus, 
    userStats,
    transactions,
    totalSales,
    pendingOrders,
    processStats,
    stakeholdersByRole,
    stakeholderInvolvement,
    recentInspections
  } = dashboardData;
  
  const navigateToSection = (section: string) => {
    navigate(`/herb-trace/${section}`);
  };

  return (
    <HerbTraceLayout activeTab="dashboard">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">ระบบการผลิตสมุนไพรไทย - แผงควบคุม</h2>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <FileText className="h-4 w-4 mr-2" />
              รายงาน
            </Button>
            <Button 
              onClick={() => {
                toast({
                  title: "อัพเดทล่าสุด",
                  description: "ข้อมูลแดชบอร์ดได้รับการอัพเดทแล้ว",
                });
                window.location.reload();
              }}
            >
              <Database className="h-4 w-4 mr-2" />
              รีเฟรชข้อมูล
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard 
            title="ผู้ใช้งานทั้งหมด" 
            value={userStats.totalUsers.toLocaleString()} 
            icon={<Users className="h-5 w-5 text-green-600" />}
            className="bg-white hover:shadow-lg transition-all duration-300" 
          />
          <StatCard 
            title="ผู้ใช้งานที่ยืนยันแล้ว" 
            value={userStats.verifiedUsers.toLocaleString()} 
            icon={<UserCheck className="h-5 w-5 text-green-600" />}
            className="bg-white hover:shadow-lg transition-all duration-300" 
          />
          <StatCard 
            title="กระบวนการทั้งหมด" 
            value={processStats.totalProcesses.toLocaleString()} 
            icon={<Activity className="h-5 w-5 text-green-600" />}
            className="bg-white hover:shadow-lg transition-all duration-300"
          />
          <StatCard 
            title="ผ่านการทดสอบ" 
            value={processStats.statusCounts["Passed"].toLocaleString()} 
            icon={<CheckCircle className="h-5 w-5 text-green-600" />}
            className="bg-white hover:shadow-lg transition-all duration-300"
          />
          <StatCard 
            title="ยอดขายทั้งหมด" 
            value={`฿${totalSales.toLocaleString()}`} 
            icon={<CreditCard className="h-5 w-5 text-green-600" />}
            className="bg-white hover:shadow-lg transition-all duration-300"
          />
          <StatCard 
            title="คำสั่งซื้อที่รอดำเนินการ" 
            value={pendingOrders.toString()} 
            icon={<ShoppingCart className="h-5 w-5 text-green-600" />}
            className="bg-white hover:shadow-lg transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Microscope className="h-5 w-5 mr-2 text-blue-500" />
                ห้องปฏิบัติการ
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-gray-600">ตรวจสอบผลการวิเคราะห์และการทดสอบคุณภาพล่าสุด</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigateToSection('lab/testing')}
              >
                เข้าถึงข้อมูล
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-white hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ClipboardCheck className="h-5 w-5 mr-2 text-green-500" />
                การรับรองมาตรฐาน
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-gray-600">การรับรอง GACP, EU-GMP และ DTTM ทั้งหมด</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigateToSection('certification')}
              >
                เข้าถึงข้อมูล
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-white hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Package className="h-5 w-5 mr-2 text-orange-500" />
                ตรวจสอบย้อนกลับ
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-gray-600">ระบบติดตามและตรวจสอบย้อนกลับสมุนไพร</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigateToSection('trace')}
              >
                เข้าถึงข้อมูล
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-white hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Factory className="h-5 w-5 mr-2 text-purple-500" />
                การผลิต
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-gray-600">สถิติเกี่ยวกับกระบวนการผลิตและการแปรรูป</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigateToSection('production')}
              >
                เข้าถึงข้อมูล
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="certification" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="certification">การรับรองมาตรฐาน</TabsTrigger>
            <TabsTrigger value="process">กระบวนการตรวจสอบ</TabsTrigger>
            <TabsTrigger value="users">ข้อมูลผู้ใช้งาน</TabsTrigger>
            <TabsTrigger value="stakeholders">ผู้มีส่วนได้ส่วนเสีย</TabsTrigger>
            <TabsTrigger value="activity">กิจกรรมในระบบ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="certification">
            <ChartSection 
              gapcStatus={gapcStatus} 
              euGmpStatus={euGmpStatus} 
              dttmStatus={dttmStatus} 
            />
          </TabsContent>
          
          <TabsContent value="process">
            <ProcessFlowSection 
              processStats={processStats}
              recentInspections={recentInspections}
            />
          </TabsContent>
          
          <TabsContent value="users">
            <UserAnalytics />
          </TabsContent>
          
          <TabsContent value="stakeholders">
            <StakeholderAnalysis 
              stakeholdersByRole={stakeholdersByRole}
              stakeholderInvolvement={stakeholderInvolvement}
            />
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="grid grid-cols-1 gap-6">
              <Tabs defaultValue="traceability" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="traceability">การตรวจสอบย้อนกลับ</TabsTrigger>
                  <TabsTrigger value="transactions">ธุรกรรมในตลาด</TabsTrigger>
                </TabsList>
                <TabsContent value="traceability">
                  <TraceEventsTable traces={traces} />
                </TabsContent>
                <TabsContent value="transactions">
                  <TransactionTable transactions={transactions} />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HerbTraceLayout>
  );
}
