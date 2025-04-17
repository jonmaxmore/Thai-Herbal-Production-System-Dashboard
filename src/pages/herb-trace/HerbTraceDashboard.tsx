
import { useState } from "react";
import { Leaf, Users, ClipboardCheck, AlertTriangle, ShoppingCart, CreditCard, UserCheck } from "lucide-react";
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import StatCard from "@/components/StatCard";
import { herbList, generateFarmers, generateTraces, calculateStatusCounts } from "@/utils/herbData";
import { ChartSection } from "@/components/herb-trace/ChartSection";
import { TraceEventsTable } from "@/components/herb-trace/TraceEventsTable";
import { TransactionTable } from "@/components/herb-trace/TransactionTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAnalytics from "@/components/herb-trace/UserAnalytics";
import { getUserActivityStats } from "@/utils/mockUserData";
import { 
  generateTransactions, 
  getTransactionTotals 
} from "@/utils/marketplaceData";

export default function HerbTraceDashboard() {
  const [farmers] = useState(generateFarmers(100));
  const [traces] = useState(generateTraces(100));
  const [transactions] = useState(generateTransactions(50));
  
  // Certification counts
  const gapcStatus = calculateStatusCounts(farmers, "gapc");
  const euGmpStatus = calculateStatusCounts(farmers, "euGmp");
  const dttmStatus = calculateStatusCounts(farmers, "dttm");

  // Transaction totals
  const { totalSales, pendingOrders } = getTransactionTotals(transactions);
  
  // User statistics from mock data
  const userStats = getUserActivityStats();

  return (
    <HerbTraceLayout activeTab="dashboard">
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold hidden md:block text-green-800">Thai Herbal Production System Dashboard</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
            title="GACP ผ่านการรับรอง" 
            value={gapcStatus["Passed"] || 0} 
            icon={<ClipboardCheck className="h-5 w-5 text-green-600" />}
            className="bg-white hover:shadow-lg transition-all duration-300"
          />
          <StatCard 
            title="EU-GMP รอพิจารณา" 
            value={euGmpStatus["Pending"] || 0} 
            icon={<Leaf className="h-5 w-5 text-green-600" />}
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
            value={pendingOrders} 
            icon={<ShoppingCart className="h-5 w-5 text-green-600" />}
            className="bg-white hover:shadow-lg transition-all duration-300"
          />
        </div>

        <Tabs defaultValue="certification" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="certification">การรับรองมาตรฐาน</TabsTrigger>
            <TabsTrigger value="users">ข้อมูลผู้ใช้งาน</TabsTrigger>
            <TabsTrigger value="activity">กิจกรรมในระบบ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="certification">
            <ChartSection 
              gapcStatus={gapcStatus} 
              euGmpStatus={euGmpStatus} 
              dttmStatus={dttmStatus} 
            />
          </TabsContent>
          
          <TabsContent value="users">
            <UserAnalytics />
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="grid grid-cols-1 gap-6">
              <Tabs defaultValue="traceability" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="traceability">การตรวจสอบย้อนกลับ</TabsTrigger>
                  <TabsTrigger value="transactions">ธุรกรรมในตลาด</TabsTrigger>
                </TabsList>
                <TabsContent value="traceability">
                  <TraceEventsTable traces={traces.slice(0, 5)} />
                </TabsContent>
                <TabsContent value="transactions">
                  <TransactionTable transactions={transactions.slice(0, 10)} />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HerbTraceLayout>
  );
}
