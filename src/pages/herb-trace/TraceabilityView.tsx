
import { useState, useEffect } from "react";
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import TraceView from "@/components/TraceView";
import { generateTraces, getDashboardData, EnhancedTrace } from "@/utils/mockDatabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, PackageSearch, FileText, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TraceabilityView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [traces, setTraces] = useState<EnhancedTrace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const dashboardData = getDashboardData();
        setTraces(dashboardData.traces as EnhancedTrace[]);
      } catch (error) {
        console.error("Error loading trace data:", error);
        toast({
          variant: "destructive",
          title: "ข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  // Filter traces based on search term
  const filteredTraces = traces.filter(trace => {
    return searchTerm 
      ? (trace.herbName && trace.herbName.toLowerCase().includes(searchTerm.toLowerCase())) || 
        trace.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trace.referenceCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trace.verifiedBy && trace.verifiedBy.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
  });

  if (isLoading) {
    return (
      <HerbTraceLayout activeTab="trace">
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </HerbTraceLayout>
    );
  }

  return (
    <HerbTraceLayout activeTab="trace">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">ระบบตรวจสอบย้อนกลับสมุนไพร</h2>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <FileText className="h-4 w-4 mr-2" />
              พิมพ์รายงาน
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <QrCode className="h-5 w-5 mr-2 text-blue-500" />
                สแกน QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "เปิดกล้อง",
                    description: "กรุณาสแกน QR code บนผลิตภัณฑ์",
                  });
                }}
              >
                เปิดกล้อง
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-500" />
                ช่วงวันที่
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input type="date" placeholder="วันที่เริ่มต้น" />
              <Input type="date" placeholder="วันที่สิ้นสุด" />
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-lg transition-all duration-300 col-span-1 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <PackageSearch className="h-5 w-5 mr-2 text-orange-500" />
                ค้นหาตามชื่อสมุนไพรหรือเลขอ้างอิง
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input
                type="text"
                placeholder="ค้นหาตามชื่อสมุนไพร, เหตุการณ์, หรือเลขอ้างอิง..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button>
                <PackageSearch className="h-4 w-4 mr-2" />
                ค้นหา
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <TraceView 
            traces={filteredTraces as any[]}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </div>
    </HerbTraceLayout>
  );
}
