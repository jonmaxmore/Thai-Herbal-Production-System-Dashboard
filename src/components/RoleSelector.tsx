import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Users, 
  Leaf, 
  ClipboardCheck, 
  ShoppingCart, 
  User, 
  UserCog,
  Microscope,
  UserCheck,
  FileText,
  LayoutDashboard,
  Map,
  Book,
  Activity,
  PackageSearch,
  TrendingUp,
  Database,
  Gavel,
  Truck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export type UserRole = 
  | "AGRICULTURE" 
  | "TRAD_MED" 
  | "STANDARDS" 
  | "PLATFORM_OWNER"
  | "GENERAL_PUBLIC"
  | "MARKET_PLACE"
  | "MEMBER_MAIN"
  | "MEMBER_PUBLIC"
  | "FARMER"
  | "INSPECTOR"
  | "ADMIN"
  | "LABORATORY"
  | "MANUFACTURER"
  | "DATA_CONSUMER"
  | "CUSTOMS";

interface PageAccess {
  view: boolean;
  edit: boolean;
  approve: boolean;
}

interface RoleAccess {
  dashboard: PageAccess;
  herbs: PageAccess;
  trace: PageAccess;
  certification: PageAccess;
  map: PageAccess;
  settings: PageAccess;
  marketplace: PageAccess;
  farms: PageAccess;
  activities: PageAccess;
  harvest: PageAccess;
  weather: PageAccess;
  reports: PageAccess;
  learning: PageAccess;
  policy: PageAccess;
  licenses: PageAccess;
  inspection: PageAccess;
  training: PageAccess;
  lab_samples: PageAccess;
  lab_testing: PageAccess;
  lab_materials: PageAccess;
  procurement: PageAccess;
  production: PageAccess;
  inventory: PageAccess;
  logistics: PageAccess;
  qrcode: PageAccess;
  users: PageAccess;
  content: PageAccess;
  marketing: PageAccess;
  support: PageAccess;
  data_catalog: PageAccess;
  api: PageAccess;
  exports: PageAccess;
  tariffs: PageAccess;
  regulations: PageAccess;
  b2b: PageAccess;
  contracts: PageAccess;
}

const roles: {
  id: UserRole;
  name: string;
  description: string;
  icon: React.ElementType;
  route: string;
  access: RoleAccess;
  category: string;
}[] = [
  {
    id: "FARMER",
    name: "เกษตรกรผู้ปลูกสมุนไพร",
    description: "Herb growers who manage farms and production",
    icon: Leaf,
    route: "/herb-trace/dashboard",
    category: "ผู้ผลิตและผู้ประกอบการ",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: true, approve: false },
      trace: { view: true, edit: true, approve: false },
      certification: { view: true, edit: true, approve: false },
      map: { view: true, edit: false, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: true, approve: false },
      farms: { view: true, edit: true, approve: false },
      activities: { view: true, edit: true, approve: false },
      harvest: { view: true, edit: true, approve: false },
      weather: { view: true, edit: false, approve: false },
      reports: { view: true, edit: false, approve: false },
      learning: { view: true, edit: false, approve: false },
      policy: { view: false, edit: false, approve: false },
      licenses: { view: false, edit: false, approve: false },
      inspection: { view: false, edit: false, approve: false },
      training: { view: true, edit: false, approve: false },
      lab_samples: { view: false, edit: false, approve: false },
      lab_testing: { view: false, edit: false, approve: false },
      lab_materials: { view: false, edit: false, approve: false },
      procurement: { view: false, edit: false, approve: false },
      production: { view: true, edit: true, approve: true },
      inventory: { view: true, edit: true, approve: false },
      logistics: { view: true, edit: false, approve: false },
      qrcode: { view: false, edit: false, approve: false },
      users: { view: false, edit: false, approve: false },
      content: { view: false, edit: false, approve: false },
      marketing: { view: false, edit: false, approve: false },
      support: { view: false, edit: false, approve: false },
      data_catalog: { view: false, edit: false, approve: false },
      api: { view: false, edit: false, approve: false },
      exports: { view: false, edit: false, approve: false },
      tariffs: { view: false, edit: false, approve: false },
      regulations: { view: false, edit: false, approve: false },
      b2b: { view: false, edit: false, approve: false },
      contracts: { view: false, edit: false, approve: false }
    }
  },
  {
    id: "AGRICULTURE",
    name: "กรมการแพทย์แผนไทย",
    description: "Thai Traditional Medicine Department oversight",
    icon: Leaf,
    route: "/herb-trace/dashboard",
    category: "หน่วยงานรัฐบาล",
    access: {
      dashboard: { view: true, edit: true, approve: false },
      herbs: { view: true, edit: true, approve: true },
      trace: { view: true, edit: true, approve: true },
      certification: { view: true, edit: true, approve: true },
      map: { view: true, edit: true, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: false, approve: false },
      farms: { view: true, edit: false, approve: true },
      policy: { view: true, edit: true, approve: true },
      licenses: { view: true, edit: true, approve: true },
      inspection: { view: true, edit: true, approve: true },
      training: { view: true, edit: true, approve: true },
      activities: { view: true, edit: false, approve: false },
      harvest: { view: true, edit: false, approve: false },
      weather: { view: true, edit: false, approve: false },
      reports: { view: true, edit: true, approve: true },
      learning: { view: true, edit: true, approve: true },
      lab_samples: { view: true, edit: false, approve: false },
      lab_testing: { view: true, edit: false, approve: true },
      lab_materials: { view: false, edit: false, approve: false },
      procurement: { view: false, edit: false, approve: false },
      production: { view: true, edit: false, approve: true },
      inventory: { view: false, edit: false, approve: false },
      logistics: { view: false, edit: false, approve: false },
      qrcode: { view: false, edit: false, approve: false },
      users: { view: true, edit: true, approve: true },
      content: { view: true, edit: true, approve: true },
      marketing: { view: true, edit: true, approve: false },
      support: { view: true, edit: true, approve: false },
      data_catalog: { view: true, edit: true, approve: true },
      api: { view: true, edit: false, approve: false },
      exports: { view: true, edit: true, approve: true },
      tariffs: { view: false, edit: false, approve: false },
      regulations: { view: true, edit: true, approve: true },
      b2b: { view: false, edit: false, approve: false },
      contracts: { view: false, edit: false, approve: false }
    }
  },
  {
    id: "STANDARDS",
    name: "มกอช.",
    description: "สำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ",
    icon: Shield,
    route: "/herb-trace/dashboard",
    category: "หน่วยงานรัฐบาล",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: false, approve: false },
      trace: { view: true, edit: false, approve: false },
      certification: { view: true, edit: true, approve: true },
      map: { view: true, edit: false, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: false, approve: false },
      inspection: { view: true, edit: true, approve: true },
      policy: { view: true, edit: true, approve: true },
      licenses: { view: true, edit: true, approve: true },
      training: { view: true, edit: false, approve: false },
      lab_samples: { view: true, edit: false, approve: false },
      lab_testing: { view: true, edit: false, approve: true },
      lab_materials: { view: false, edit: false, approve: false },
      procurement: { view: false, edit: false, approve: false },
      production: { view: true, edit: false, approve: true },
      inventory: { view: false, edit: false, approve: false },
      logistics: { view: false, edit: false, approve: false },
      qrcode: { view: false, edit: false, approve: false },
      users: { view: true, edit: true, approve: false },
      content: { view: true, edit: true, approve: false },
      marketing: { view: false, edit: false, approve: false },
      support: { view: true, edit: true, approve: false },
      data_catalog: { view: true, edit: false, approve: false },
      api: { view: false, edit: false, approve: false },
      exports: { view: true, edit: false, approve: true },
      tariffs: { view: false, edit: false, approve: false },
      regulations: { view: true, edit: true, approve: true },
      b2b: { view: false, edit: false, approve: false },
      contracts: { view: false, edit: false, approve: false }
    }
  },
  {
    id: "LABORATORY",
    name: "ห้องปฏิบัติการ",
    description: "ห้องปฏิบัติการตรวจวิเคราะห์สมุนไพร",
    icon: Microscope,
    route: "/herb-trace/dashboard",
    category: "ผู้ให้บริการและผู้ประกอบการ",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: false, approve: false },
      trace: { view: true, edit: true, approve: false },
      certification: { view: true, edit: false, approve: false },
      map: { view: true, edit: false, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: false, approve: false },
      lab_samples: { view: true, edit: true, approve: true },
      lab_testing: { view: true, edit: true, approve: true },
      lab_materials: { view: true, edit: true, approve: false },
      reports: { view: true, edit: true, approve: false },
      farms: { view: true, edit: false, approve: false },
      activities: { view: false, edit: false, approve: false },
      harvest: { view: false, edit: false, approve: false },
      weather: { view: false, edit: false, approve: false },
      learning: { view: true, edit: false, approve: false },
      policy: { view: false, edit: false, approve: false },
      licenses: { view: true, edit: false, approve: true },
      inspection: { view: false, edit: false, approve: false },
      training: { view: true, edit: false, approve: false },
      procurement: { view: false, edit: false, approve: false },
      production: { view: false, edit: false, approve: false },
      inventory: { view: true, edit: true, approve: false },
      logistics: { view: false, edit: false, approve: false },
      qrcode: { view: false, edit: false, approve: false },
      users: { view: false, edit: false, approve: false },
      content: { view: false, edit: false, approve: false },
      marketing: { view: false, edit: false, approve: false },
      support: { view: false, edit: false, approve: false },
      data_catalog: { view: false, edit: false, approve: false },
      api: { view: false, edit: false, approve: false },
      exports: { view: false, edit: false, approve: false },
      tariffs: { view: false, edit: false, approve: false },
      regulations: { view: false, edit: false, approve: false },
      b2b: { view: false, edit: false, approve: false },
      contracts: { view: false, edit: false, approve: false }
    }
  },
  {
    id: "MANUFACTURER",
    name: "ผู้ประกอบการ",
    description: "ผู้ผลิตและแปรรูปสมุนไพร",
    icon: PackageSearch,
    route: "/herb-trace/dashboard",
    category: "ผู้ผลิตและผู้ประกอบการ",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: false, approve: false },
      trace: { view: true, edit: true, approve: false },
      certification: { view: true, edit: true, approve: false },
      map: { view: true, edit: false, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: true, approve: false },
      procurement: { view: true, edit: true, approve: false },
      production: { view: true, edit: true, approve: true },
      inventory: { view: true, edit: true, approve: false },
      logistics: { view: true, edit: true, approve: false },
      qrcode: { view: true, edit: true, approve: false },
      reports: { view: true, edit: true, approve: false },
      farms: { view: true, edit: false, approve: false },
      activities: { view: false, edit: false, approve: false },
      harvest: { view: false, edit: false, approve: false },
      weather: { view: false, edit: false, approve: false },
      learning: { view: true, edit: false, approve: false },
      policy: { view: false, edit: false, approve: false },
      licenses: { view: true, edit: false, approve: false },
      inspection: { view: false, edit: false, approve: false },
      training: { view: true, edit: false, approve: false },
      lab_samples: { view: true, edit: true, approve: false },
      lab_testing: { view: false, edit: false, approve: false },
      lab_materials: { view: false, edit: false, approve: false },
      users: { view: false, edit: false, approve: false },
      content: { view: false, edit: false, approve: false },
      marketing: { view: true, edit: true, approve: false },
      support: { view: false, edit: false, approve: false },
      data_catalog: { view: false, edit: false, approve: false },
      api: { view: false, edit: false, approve: false },
      exports: { view: true, edit: true, approve: false },
      tariffs: { view: true, edit: false, approve: false },
      regulations: { view: true, edit: false, approve: false },
      b2b: { view: true, edit: true, approve: false },
      contracts: { view: true, edit: true, approve: false }
    }
  },
  {
    id: "INSPECTOR",
    name: "ผู้ตรวจประเมิน",
    description: "ผู้ตรวจประเมินมาตรฐาน",
    icon: ClipboardCheck,
    route: "/herb-trace/dashboard",
    category: "ผู้ให้บริการและผู้ประกอบการ",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: false, approve: false },
      trace: { view: true, edit: true, approve: true },
      certification: { view: true, edit: true, approve: true },
      map: { view: true, edit: false, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: false, approve: false },
      inspection: { view: true, edit: true, approve: true },
      farms: { view: true, edit: false, approve: true },
      activities: { view: true, edit: false, approve: false },
      harvest: { view: true, edit: false, approve: false },
      weather: { view: false, edit: false, approve: false },
      reports: { view: true, edit: true, approve: false },
      learning: { view: true, edit: false, approve: false },
      policy: { view: true, edit: false, approve: false },
      licenses: { view: true, edit: false, approve: false },
      training: { view: true, edit: false, approve: false },
      lab_samples: { view: false, edit: false, approve: false },
      lab_testing: { view: false, edit: false, approve: false },
      lab_materials: { view: false, edit: false, approve: false },
      procurement: { view: false, edit: false, approve: false },
      production: { view: true, edit: false, approve: true },
      inventory: { view: false, edit: false, approve: false },
      logistics: { view: false, edit: false, approve: false },
      qrcode: { view: false, edit: false, approve: false },
      users: { view: false, edit: false, approve: false },
      content: { view: false, edit: false, approve: false },
      marketing: { view: false, edit: false, approve: false },
      support: { view: false, edit: false, approve: false },
      data_catalog: { view: false, edit: false, approve: false },
      api: { view: false, edit: false, approve: false },
      exports: { view: false, edit: false, approve: false },
      tariffs: { view: false, edit: false, approve: false },
      regulations: { view: true, edit: false, approve: false },
      b2b: { view: false, edit: false, approve: false },
      contracts: { view: false, edit: false, approve: false }
    }
  },
  {
    id: "CUSTOMS",
    name: "กรมศุลกากร",
    description: "กรมศุลกากรสำหรับการส่งออก",
    icon: FileText,
    route: "/herb-trace/dashboard",
    category: "หน่วยงานรัฐบาล",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: false, approve: false },
      trace: { view: true, edit: false, approve: false },
      certification: { view: true, edit: false, approve: false },
      map: { view: true, edit: false, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: false, approve: false },
      exports: { view: true, edit: true, approve: true },
      tariffs: { view: true, edit: true, approve: true },
      regulations: { view: true, edit: true, approve: true },
      farms: { view: false, edit: false, approve: false },
      activities: { view: false, edit: false, approve: false },
      harvest: { view: false, edit: false, approve: false },
      weather: { view: false, edit: false, approve: false },
      reports: { view: true, edit: true, approve: false },
      learning: { view: false, edit: false, approve: false },
      policy: { view: true, edit: false, approve: false },
      licenses: { view: true, edit: false, approve: true },
      inspection: { view: true, edit: false, approve: false },
      training: { view: false, edit: false, approve: false },
      lab_samples: { view: false, edit: false, approve: false },
      lab_testing: { view: false, edit: false, approve: false },
      lab_materials: { view: false, edit: false, approve: false },
      procurement: { view: false, edit: false, approve: false },
      production: { view: false, edit: false, approve: false },
      inventory: { view: false, edit: false, approve: false },
      logistics: { view: true, edit: false, approve: true },
      qrcode: { view: false, edit: false, approve: false },
      users: { view: false, edit: false, approve: false },
      content: { view: false, edit: false, approve: false },
      marketing: { view: false, edit: false, approve: false },
      support: { view: false, edit: false, approve: false },
      data_catalog: { view: false, edit: false, approve: false },
      api: { view: false, edit: false, approve: false },
      b2b: { view: false, edit: false, approve: false },
      contracts: { view: false, edit: false, approve: false }
    }
  },
  {
    id: "DATA_CONSUMER",
    name: "ผู้ใช้ข้อมูล",
    description: "บริษัท/รัฐบาลที่ซื้อข้อมูล",
    icon: Database,
    route: "/herb-trace/dashboard",
    category: "ผู้ใช้ข้อมูลและผู้บริโภค",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: false, approve: false },
      trace: { view: true, edit: false, approve: false },
      certification: { view: true, edit: false, approve: false },
      map: { view: true, edit: false, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: false, approve: false },
      data_catalog: { view: true, edit: false, approve: false },
      api: { view: true, edit: false, approve: false },
      reports: { view: true, edit: false, approve: false },
      farms: { view: false, edit: false, approve: false },
      activities: { view: false, edit: false, approve: false },
      harvest: { view: false, edit: false, approve: false },
      weather: { view: false, edit: false, approve: false },
      learning: { view: false, edit: false, approve: false },
      policy: { view: false, edit: false, approve: false },
      licenses: { view: false, edit: false, approve: false },
      inspection: { view: false, edit: false, approve: false },
      training: { view: false, edit: false, approve: false },
      lab_samples: { view: false, edit: false, approve: false },
      lab_testing: { view: false, edit: false, approve: false },
      lab_materials: { view: false, edit: false, approve: false },
      procurement: { view: false, edit: false, approve: false },
      production: { view: false, edit: false, approve: false },
      inventory: { view: false, edit: false, approve: false },
      logistics: { view: false, edit: false, approve: false },
      qrcode: { view: false, edit: false, approve: false },
      users: { view: false, edit: false, approve: false },
      content: { view: false, edit: false, approve: false },
      marketing: { view: false, edit: false, approve: false },
      support: { view: false, edit: false, approve: false },
      exports: { view: false, edit: false, approve: false },
      tariffs: { view: false, edit: false, approve: false },
      regulations: { view: false, edit: false, approve: false },
      b2b: { view: false, edit: false, approve: false },
      contracts: { view: false, edit: false, approve: false }
    }
  },
  {
    id: "MARKET_PLACE",
    name: "ตลาดกลาง",
    description: "ตลาดกลางซื้อขายสมุนไพร",
    icon: ShoppingCart,
    route: "/herb-trace/marketplace",
    category: "ผู้ให้บริการและผู้ประกอบการ",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: false, approve: false },
      trace: { view: true, edit: false, approve: false },
      certification: { view: true, edit: false, approve: false },
      map: { view: true, edit: false, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: true, approve: true },
      b2b: { view: true, edit: true, approve: true },
      farms: { view: true, edit: false, approve: false },
      activities: { view: false, edit: false, approve: false },
      harvest: { view: false, edit: false, approve: false },
      weather: { view: false, edit: false, approve: false },
      reports: { view: true, edit: true, approve: false },
      learning: { view: false, edit: false, approve: false },
      policy: { view: false, edit: false, approve: false },
      licenses: { view: true, edit: false, approve: false },
      inspection: { view: false, edit: false, approve: false },
      training: { view: false, edit: false, approve: false },
      lab_samples: { view: false, edit: false, approve: false },
      lab_testing: { view: false, edit: false, approve: false },
      lab_materials: { view: false, edit: false, approve: false },
      procurement: { view: false, edit: false, approve: false },
      production: { view: false, edit: false, approve: false },
      inventory: { view: true, edit: true, approve: false },
      logistics: { view: true, edit: true, approve: false },
      qrcode: { view: false, edit: false, approve: false },
      users: { view: false, edit: false, approve: false },
      content: { view: true, edit: true, approve: false },
      marketing: { view: true, edit: true, approve: false },
      support: { view: true, edit: true, approve: false },
      data_catalog: { view: false, edit: false, approve: false },
      api: { view: false, edit: false, approve: false },
      exports: { view: false, edit: false, approve: false },
      tariffs: { view: false, edit: false, approve: false },
      regulations: { view: false, edit: false, approve: false },
      contracts: { view: true, edit: true, approve: false }
    }
  },
  {
    id: "MEMBER_MAIN",
    name: "ผู้ค้าสมุนไพร",
    description: "ผู้ค้าในตลาด B2B",
    icon: Gavel,
    route: "/herb-trace/dashboard",
    category: "ผู้ใช้ข้อมูลและผู้บริโภค",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: false, approve: false },
      trace: { view: true, edit: false, approve: false },
      certification: { view: true, edit: false, approve: false },
      map: { view: true, edit: false, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: true, approve: false },
      b2b: { view: true, edit: true, approve: false },
      contracts: { view: true, edit: true, approve: false },
      farms: { view: true, edit: false, approve: false },
      activities: { view: false, edit: false, approve: false },
      harvest: { view: false, edit: false, approve: false },
      weather: { view: false, edit: false, approve: false },
      reports: { view: true, edit: false, approve: false },
      learning: { view: false, edit: false, approve: false },
      policy: { view: false, edit: false, approve: false },
      licenses: { view: true, edit: false, approve: false },
      inspection: { view: false, edit: false, approve: false },
      training: { view: false, edit: false, approve: false },
      lab_samples: { view: false, edit: false, approve: false },
      lab_testing: { view: false, edit: false, approve: false },
      lab_materials: { view: false, edit: false, approve: false },
      procurement: { view: true, edit: true, approve: false },
      production: { view: false, edit: false, approve: false },
      inventory: { view: true, edit: true, approve: false },
      logistics: { view: true, edit: true, approve: false },
      qrcode: { view: false, edit: false, approve: false },
      users: { view: false, edit: false, approve: false },
      content: { view: false, edit: false, approve: false },
      marketing: { view: false, edit: false, approve: false },
      support: { view: false, edit: false, approve: false },
      data_catalog: { view: false, edit: false, approve: false },
      api: { view: false, edit: false, approve: false },
      exports: { view: true, edit: true, approve: false },
      tariffs: { view: true, edit: false, approve: false },
      regulations: { view: true, edit: false, approve: false }
    }
  },
  {
    id: "GENERAL_PUBLIC",
    name: "ประชาชนทั่วไป",
    description: "ผู้ซื้อผลิตภัณฑ์สมุนไพร",
    icon: User,
    route: "/herb-trace/dashboard",
    category: "ผู้ใช้ข้อมูลและผู้บริโภค",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: false, approve: false },
      trace: { view: true, edit: false, approve: false },
      certification: { view: true, edit: false, approve: false },
      map: { view: true, edit: false, approve: false },
      settings: { view: false, edit: false, approve: false },
      marketplace: { view: true, edit: false, approve: false },
      farms: { view: false, edit: false, approve: false },
      activities: { view: false, edit: false, approve: false },
      harvest: { view: false, edit: false, approve: false },
      weather: { view: false, edit: false, approve: false },
      reports: { view: false, edit: false, approve: false },
      learning: { view: true, edit: false, approve: false },
      policy: { view: false, edit: false, approve: false },
      licenses: { view: false, edit: false, approve: false },
      inspection: { view: false, edit: false, approve: false },
      training: { view: false, edit: false, approve: false },
      lab_samples: { view: false, edit: false, approve: false },
      lab_testing: { view: false, edit: false, approve: false },
      lab_materials: { view: false, edit: false, approve: false },
      procurement: { view: false, edit: false, approve: false },
      production: { view: false, edit: false, approve: false },
      inventory: { view: false, edit: false, approve: false },
      logistics: { view: false, edit: false, approve: false },
      qrcode: { view: false, edit: false, approve: false },
      users: { view: false, edit: false, approve: false },
      content: { view: false, edit: false, approve: false },
      marketing: { view: false, edit: false, approve: false },
      support: { view: false, edit: false, approve: false },
      data_catalog: { view: false, edit: false, approve: false },
      api: { view: false, edit: false, approve: false },
      exports: { view: false, edit: false, approve: false },
      tariffs: { view: false, edit: false, approve: false },
      regulations: { view: false, edit: false, approve: false },
      b2b: { view: false, edit: false, approve: false },
      contracts: { view: false, edit: false, approve: false }
    }
  },
  {
    id: "PLATFORM_OWNER",
    name: "ผู้ดูแลระบบ",
    description: "ผู้ดูแลระบบและฝ่ายการตลาด",
    icon: UserCog,
    route: "/herb-trace/dashboard",
    category: "ผู้ดูแลระบบ",
    access: {
      dashboard: { view: true, edit: true, approve: false },
      herbs: { view: true, edit: true, approve: false },
      trace: { view: true, edit: true, approve: false },
      certification: { view: true, edit: true, approve: false },
      map: { view: true, edit: true, approve: false },
      settings: { view: true, edit: true, approve: true },
      marketplace: { view: true, edit: true, approve: true },
      users: { view: true, edit: true, approve: true },
      content: { view: true, edit: true, approve: true },
      marketing: { view: true, edit: true, approve: true },
      support: { view: true, edit: true, approve: true },
      farms: { view: true, edit: false, approve: false },
      activities: { view: true, edit: false, approve: false },
      harvest: { view: true, edit: false, approve: false },
      weather: { view: true, edit: false, approve: false },
      reports: { view: true, edit: true, approve: false },
      learning: { view: true, edit: true, approve: false },
      policy: { view: true, edit: false, approve: false },
      licenses: { view: true, edit: false, approve: false },
      inspection: { view: true, edit: false, approve: false },
      training: { view: true, edit: true, approve: false },
      lab_samples: { view: true, edit: false, approve: false },
      lab_testing: { view: true, edit: false, approve: false },
      lab_materials: { view: true, edit: false, approve: false },
      procurement: { view: true, edit: false, approve: false },
      production: { view: true, edit: false, approve: false },
      inventory: { view: true, edit: false, approve: false },
      logistics: { view: true, edit: false, approve: false },
      qrcode: { view: true, edit: false, approve: false },
      data_catalog: { view: true, edit: true, approve: false },
      api: { view: true, edit: true, approve: false },
      exports: { view: true, edit: false, approve: false },
      tariffs: { view: true, edit: false, approve: false },
      regulations: { view: true, edit: false, approve: false },
      b2b: { view: true, edit: true, approve: false },
      contracts: { view: true, edit: false, approve: false }
    }
  },
  {
    id: "ADMIN",
    name: "ผู้ดูแลระบบหลัก",
    description: "ผู้ดูแลระบบระดับสูงสุด",
    icon: UserCheck,
    route: "/herb-trace/dashboard",
    category: "ผู้ดูแลระบบ",
    access: {
      dashboard: { view: true, edit: true, approve: true },
      herbs: { view: true, edit: true, approve: true },
      trace: { view: true, edit: true, approve: true },
      certification: { view: true, edit: true, approve: true },
      map: { view: true, edit: true, approve: true },
      settings: { view: true, edit: true, approve: true },
      marketplace: { view: true, edit: true, approve: true },
      farms: { view: true, edit: true, approve: true },
      activities: { view: true, edit: true, approve: true },
      harvest: { view: true, edit: true, approve: true },
      weather: { view: true, edit: true, approve: true },
      reports: { view: true, edit: true, approve: true },
      learning: { view: true, edit: true, approve: true },
      policy: { view: true, edit: true, approve: true },
      licenses: { view: true, edit: true, approve: true },
      inspection: { view: true, edit: true, approve: true },
      training: { view: true, edit: true, approve: true },
      lab_samples: { view: true, edit: true, approve: true },
      lab_testing: { view: true, edit: true, approve: true },
      lab_materials: { view: true, edit: true, approve: true },
      procurement: { view: true, edit: true, approve: true },
      production: { view: true, edit: true, approve: true },
      inventory: { view: true, edit: true, approve: true },
      logistics: { view: true, edit: true, approve: true },
      qrcode: { view: true, edit: true, approve: true },
      users: { view: true, edit: true, approve: true },
      content: { view: true, edit: true, approve: true },
      marketing: { view: true, edit: true, approve: true },
      support: { view: true, edit: true, approve: true },
      data_catalog: { view: true, edit: true, approve: true },
      api: { view: true, edit: true, approve: true },
      exports: { view: true, edit: true, approve: true },
      tariffs: { view: true, edit: true, approve: true },
      regulations: { view: true, edit: true, approve: true },
      b2b: { view: true, edit: true, approve: true },
      contracts: { view: true, edit: true, approve: true }
    }
  }
];

export default function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = Array.from(new Set(roles.map(role => role.category)));

  const filteredRoles = selectedCategory 
    ? roles.filter(role => role.category === selectedCategory)
    : roles;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    
    const selectedRoleData = roles.find(r => r.id === role);
    if (selectedRoleData) {
      localStorage.setItem("userRole", role);
      localStorage.setItem("roleAccess", JSON.stringify(selectedRoleData.access));
      
      toast({
        title: "บทบาทถูกเลือก",
        description: `คุณได้เข้าสู่ระบบในฐานะ ${selectedRoleData.name}`,
      });
      
      navigate(selectedRoleData.route);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-6xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">เลือกบทบาทของคุณ</CardTitle>
            <CardDescription>
              เลือกบทบาทเพื่อเข้าถึงแดชบอร์ดและฟังก์ชันที่เกี่ยวข้อง
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-wrap gap-2 justify-center">
              <Button 
                variant={selectedCategory === null ? "default" : "outline"}
                className="mb-2"
                onClick={() => setSelectedCategory(null)}
              >
                ทั้งหมด
              </Button>
              {categories.map(category => (
                <Button 
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="mb-2"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRoles.map((role) => (
                <Card 
                  key={role.id} 
                  className={`cursor-pointer transition-all ${
                    selectedRole === role.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <role.icon className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>สิทธิการเข้าถึง: </p>
                      <ul className="list-disc pl-4 mt-1">
                        {Object.entries(role.access)
                          .filter(([_, access]) => access.view)
                          .slice(0, 5)
                          .map(([page, access]) => (
                            <li key={page}>
                              {page.charAt(0).toUpperCase() + page.slice(1)}: 
                              {access.edit ? ' แก้ไข' : ' ดูอย่างเดียว'}
                              {access.approve ? ' & อนุมัติ' : ''}
                            </li>
                          ))}
                        {Object.entries(role.access).filter(([_, access]) => access.view).length > 5 && (
                          <li>และอื่นๆ...</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoleSelect(role.id);
                      }}
                    >
                      เลือกบทบาท
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              ระดับการเข้าถึงของคุณจะถูกกำหนดโดยบทบาทที่คุณเลือก
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
