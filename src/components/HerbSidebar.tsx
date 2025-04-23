import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Leaf, 
  Search, 
  ClipboardCheck, 
  Settings, 
  MapPin, 
  ShoppingCart, 
  LogOut, 
  Lock, 
  CheckCircle,
  LayoutDashboard,
  FileText,
  Book,
  Activity,
  PlaneTakeoff,
  Shield,
  Award,
  PackageSearch,
  BarChart2,
  Truck,
  Database,
  Users,
  HelpCircle,
  Package,
  QrCode,
  Cloud,
  FlaskConical,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RolePageType, useRoleAccess } from '@/hooks/use-role-access';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { WorkflowStatus } from './AccessControl';

interface NavItem {
  id: RolePageType;
  label: string;
  icon: React.ElementType;
  path: string;
  section?: string;
  children?: NavItem[];
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export default function HerbSidebar({ 
  activeTab, 
  setActiveTab, 
  isMobile = false,
  setIsMobileMenuOpen
}: SidebarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole, canView } = useRoleAccess();
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    main: true,
    farm: false,
    certification: false,
    lab: false,
    market: false,
    reports: false
  });
  
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const navItems: NavItem[] = [
    { 
      id: 'overview', 
      label: 'ภาพรวมโครงการ', 
      icon: Info, 
      path: '/herb-trace/overview', 
      section: 'main' 
    },
    { 
      id: 'dashboard', 
      label: 'แดชบอร์ด', 
      icon: LayoutDashboard, 
      path: '/herb-trace/dashboard', 
      section: 'main' 
    },
    { 
      id: 'farms', 
      label: 'จัดการแปลงปลูก', 
      icon: Leaf, 
      path: '/herb-trace/farms', 
      section: 'farm' 
    },
    { 
      id: 'activities', 
      label: 'บันทึกกิจกรรม', 
      icon: Activity, 
      path: '/herb-trace/activities', 
      section: 'farm' 
    },
    { 
      id: 'harvest', 
      label: 'การเก็บเกี่ยว', 
      icon: PlaneTakeoff,
      path: '/herb-trace/harvest', 
      section: 'farm' 
    },
    { 
      id: 'weather', 
      label: 'สภาพอากาศ', 
      icon: Cloud, 
      path: '/herb-trace/weather', 
      section: 'farm' 
    },
    
    { 
      id: 'herbs', 
      label: 'สมุนไพร', 
      icon: Leaf, 
      path: '/herb-trace/herbs',
      section: 'main'
    },
    
    { 
      id: 'trace', 
      label: 'ตรวจสอบย้อนกลับ', 
      icon: Search, 
      path: '/herb-trace/trace',
      section: 'main'
    },
    
    { 
      id: 'certification', 
      label: 'การรับรองมาตรฐาน', 
      icon: Award, 
      path: '/herb-trace/certification',
      section: 'certification'
    },
    { 
      id: 'inspection', 
      label: 'การตรวจประเมิน', 
      icon: ClipboardCheck, 
      path: '/herb-trace/inspection', 
      section: 'certification' 
    },
    { 
      id: 'licenses', 
      label: 'ใบอนุญาต', 
      icon: FileText, 
      path: '/herb-trace/licenses', 
      section: 'certification' 
    },
    
    { 
      id: 'lab_samples', 
      label: 'ตัวอย่างวิเคราะห์', 
      icon: FlaskConical, 
      path: '/herb-trace/lab/samples', 
      section: 'lab' 
    },
    { 
      id: 'lab_testing', 
      label: 'ผลการวิเคราะห์', 
      icon: FileText, 
      path: '/herb-trace/lab/testing', 
      section: 'lab' 
    },
    { 
      id: 'lab_materials', 
      label: 'วัสดุและอุปกรณ์', 
      icon: Package, 
      path: '/herb-trace/lab/materials', 
      section: 'lab' 
    },
    
    { 
      id: 'map', 
      label: 'แผนที่', 
      icon: MapPin, 
      path: '/herb-trace/map',
      section: 'main'
    },
    
    { 
      id: 'procurement', 
      label: 'จัดซื้อวัตถุดิบ', 
      icon: PackageSearch, 
      path: '/herb-trace/procurement', 
      section: 'market' 
    },
    { 
      id: 'production', 
      label: 'กระบวนการผลิต', 
      icon: Activity, 
      path: '/herb-trace/production', 
      section: 'market' 
    },
    { 
      id: 'inventory', 
      label: 'สินค้าคงคลัง', 
      icon: Package, 
      path: '/herb-trace/inventory', 
      section: 'market' 
    },
    { 
      id: 'logistics', 
      label: 'การขนส่ง', 
      icon: Truck, 
      path: '/herb-trace/logistics', 
      section: 'market' 
    },
    { 
      id: 'qrcode', 
      label: 'QR Code', 
      icon: QrCode, 
      path: '/herb-trace/qrcode', 
      section: 'market' 
    },
    
    { 
      id: 'marketplace', 
      label: 'ตลาดกลาง', 
      icon: ShoppingCart, 
      path: '/herb-trace/marketplace',
      section: 'main'
    },
    { 
      id: 'b2b', 
      label: 'ตลาด B2B', 
      icon: Users, 
      path: '/herb-trace/b2b', 
      section: 'market' 
    },
    { 
      id: 'contracts', 
      label: 'สัญญาซื้อขาย', 
      icon: FileText, 
      path: '/herb-trace/contracts', 
      section: 'market' 
    },
    
    { 
      id: 'reports', 
      label: 'รายงาน', 
      icon: BarChart2, 
      path: '/herb-trace/reports', 
      section: 'reports' 
    },
    { 
      id: 'exports', 
      label: 'การส่งออก', 
      icon: FileText, 
      path: '/herb-trace/exports', 
      section: 'reports' 
    },
    
    { 
      id: 'learning', 
      label: 'ห้องเรียนออนไลน์', 
      icon: Book, 
      path: '/herb-trace/learning',
      section: 'main'
    },
    
    { 
      id: 'settings', 
      label: 'ตั้งค่า', 
      icon: Settings, 
      path: '/herb-trace/settings',
      section: 'main'
    },
    { 
      id: 'users', 
      label: 'จัดการผู้ใช้', 
      icon: Users, 
      path: '/herb-trace/users', 
      section: 'main' 
    },
    { 
      id: 'support', 
      label: 'ช่วยเหลือ', 
      icon: HelpCircle, 
      path: '/herb-trace/support', 
      section: 'main' 
    },
  ];

  const sections = [
    { id: 'farm', label: 'การเพาะปลูก', icon: Leaf },
    { id: 'certification', label: 'การรับรอง', icon: Shield },
    { id: 'lab', label: 'ห้องปฏิบัติการ', icon: FlaskConical },
    { id: 'market', label: 'การผลิตและตลาด', icon: ShoppingCart },
    { id: 'reports', label: 'รายงานและวิเคราะห์', icon: BarChart2 }
  ];

  const getNavItemsBySection = (sectionId: string) => {
    return navItems
      .filter(item => item.section === sectionId && canView(item.id))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  const handleTabChange = (tabId: RolePageType, path: string) => {
    if (!canView(tabId)) {
      toast({
        variant: "destructive",
        title: "ไม่สามารถเข้าถึงได้",
        description: "คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้",
      });
      return;
    }
    
    setActiveTab(tabId);
    navigate(path);
    if (isMobile && setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("roleAccess");
    
    toast({
      title: "ออกจากระบบสำเร็จ",
      description: "คุณได้ออกจากระบบแล้ว",
    });
    
    navigate("/");
  };

  const getPermissionIcon = (page: RolePageType) => {
    if (!canView(page)) return <Lock className="h-3 w-3 text-red-600" />;
    return <CheckCircle className="h-3 w-3 text-green-600" />;
  };

  const mainNavItems = getNavItemsBySection('main');

  return (
    <div className="w-64 p-4 bg-white border-r h-screen space-y-6 shadow-md flex flex-col">
      <div className="flex items-center gap-2 px-2 mb-6">
        <Leaf className="h-6 w-6 text-herb" />
        <h1 className="text-xl font-bold">Thai Herbal Production System</h1>
      </div>

      <div className="px-3 py-2 bg-green-50 rounded-md mb-4">
        <p className="text-xs text-gray-500">เข้าสู่ระบบในฐานะ</p>
        <p className="text-sm font-medium">{userRole}</p>
      </div>

      <nav className="space-y-1 flex-grow overflow-y-auto">
        {mainNavItems.map((item) => (
          <TooltipProvider key={item.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  disabled={!canView(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    !canView(item.id) 
                      ? "text-gray-300 cursor-not-allowed" 
                      : activeTab === item.id
                        ? "bg-herb-light text-herb-dark"
                        : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={() => handleTabChange(item.id, item.path)}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    !canView(item.id) ? "text-gray-300" : ""
                  )} />
                  <span>{item.label}</span>
                  <span className="ml-auto">
                    <WorkflowStatus page={item.id} />
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <WorkflowStatus page={item.id} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        {sections.map((section) => {
          const sectionItems = getNavItemsBySection(section.id);
          
          if (sectionItems.length === 0) return null;
          
          return (
            <Collapsible 
              key={section.id}
              open={openSections[section.id]}
              onOpenChange={() => toggleSection(section.id)}
              className="w-full"
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                <div className="flex items-center gap-3">
                  <section.icon className="h-5 w-5" />
                  <span>{section.label}</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-4 w-4 transition-transform ${openSections[section.id] ? 'transform rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 space-y-1">
                {sectionItems.map((item) => (
                  <TooltipProvider key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          disabled={!canView(item.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            !canView(item.id) 
                              ? "text-gray-300 cursor-not-allowed" 
                              : activeTab === item.id
                                ? "bg-herb-light text-herb-dark"
                                : "text-gray-600 hover:bg-gray-100"
                          )}
                          onClick={() => handleTabChange(item.id, item.path)}
                        >
                          <item.icon className={cn(
                            "h-5 w-5",
                            !canView(item.id) ? "text-gray-300" : ""
                          )} />
                          <span>{item.label}</span>
                          <span className="ml-auto">
                            <WorkflowStatus page={item.id} />
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <WorkflowStatus page={item.id} />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-gray-200">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>ออกจากระบบ</span>
        </Button>
        
        <div className="mt-4 px-3 py-2">
          <p className="text-xs text-gray-500">Powered by</p>
          <p className="text-sm font-medium">Thai Herbal Production System</p>
        </div>
      </div>
    </div>
  );
}
