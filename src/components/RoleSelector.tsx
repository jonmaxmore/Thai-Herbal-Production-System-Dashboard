import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RoleAccess } from "@/hooks/use-role-access";

// Define the possible roles
export enum UserRole {
  FARMER = "farmer",
  LAB = "lab",
  MANUFACTURER = "manufacturer",
  TTM_OFFICER = "ttm_officer",
  ACFS_OFFICER = "acfs_officer",
  CUSTOMS_OFFICER = "customs_officer",
  ADMIN = "admin",
  DATA_CONSUMER = "data_consumer",
  GUEST = "guest",
}

// When setting up access rights for a role, we need to ensure all PageType properties are defined
const setupRoleAccess = (role: UserRole): RoleAccess => {
  // Default access - view only for dashboard
  const baseAccess: RoleAccess = {
    dashboard: { view: true, edit: false, approve: false },
    herbs: { view: false, edit: false, approve: false },
    trace: { view: false, edit: false, approve: false },
    certification: { view: false, edit: false, approve: false },
    map: { view: false, edit: false, approve: false },
    settings: { view: false, edit: false, approve: false },
    marketplace: { view: false, edit: false, approve: false },
    // Initialize all new page types
    farms: { view: false, edit: false, approve: false },
    activities: { view: false, edit: false, approve: false },
    harvest: { view: false, edit: false, approve: false },
    weather: { view: false, edit: false, approve: false },
    reports: { view: false, edit: false, approve: false },
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
    data_catalog: { view: false, edit: false, approve: false },
    api: { view: false, edit: false, approve: false },
    exports: { view: false, edit: false, approve: false },
    tariffs: { view: false, edit: false, approve: false },
    regulations: { view: false, edit: false, approve: false },
    b2b: { view: false, edit: false, approve: false },
    contracts: { view: false, edit: false, approve: false }
  };

  // Now set up role-specific access permissions
  switch (role) {
    case UserRole.FARMER:
      baseAccess.herbs = { view: true, edit: true, approve: false };
      baseAccess.trace = { view: true, edit: true, approve: false };
      baseAccess.certification = { view: true, edit: false, approve: false };
      baseAccess.map = { view: true, edit: false, approve: false };
      baseAccess.marketplace = { view: true, edit: true, approve: false };
      break;
    case UserRole.LAB:
      baseAccess.lab_samples = { view: true, edit: true, approve: true };
      baseAccess.lab_testing = { view: true, edit: true, approve: true };
      baseAccess.lab_materials = { view: true, edit: true, approve: true };
      break;
    case UserRole.MANUFACTURER:
      baseAccess.production = { view: true, edit: true, approve: true };
      baseAccess.inventory = { view: true, edit: true, approve: true };
      baseAccess.logistics = { view: true, edit: true, approve: true };
      break;
    case UserRole.TTM_OFFICER:
      baseAccess.policy = { view: true, edit: true, approve: true };
      baseAccess.licenses = { view: true, edit: true, approve: true };
      baseAccess.training = { view: true, edit: true, approve: true };
      break;
    case UserRole.ACFS_OFFICER:
      baseAccess.farms = { view: true, edit: true, approve: true };
      baseAccess.activities = { view: true, edit: true, approve: true };
      baseAccess.harvest = { view: true, edit: true, approve: true };
      break;
    case UserRole.CUSTOMS_OFFICER:
      baseAccess.exports = { view: true, edit: true, approve: true };
      baseAccess.tariffs = { view: true, edit: true, approve: true };
      baseAccess.regulations = { view: true, edit: true, approve: true };
      break;
    case UserRole.ADMIN:
      Object.keys(baseAccess).forEach((key) => {
        baseAccess[key as keyof RoleAccess] = { view: true, edit: true, approve: true };
      });
      break;
    case UserRole.DATA_CONSUMER:
      baseAccess.data_catalog = { view: true, edit: false, approve: false };
      baseAccess.api = { view: true, edit: false, approve: false };
      break;
    case UserRole.GUEST:
      // Guest has no access to anything except the marketplace
      Object.keys(baseAccess).forEach((key) => {
        if (key !== "marketplace") {
          baseAccess[key as keyof RoleAccess] = { view: false, edit: false, approve: false };
        } else {
          baseAccess.marketplace = { view: true, edit: false, approve: false };
        }
      });
      break;
    default:
      break;
  }

  return baseAccess;
};

// Role details
const roleDetails = {
  [UserRole.FARMER]: {
    label: "เกษตรกร",
    description: "เข้าถึงข้อมูลการเพาะปลูก จัดการแปลง และติดตามผลผลิต",
  },
  [UserRole.LAB]: {
    label: "ห้องปฏิบัติการ",
    description: "บันทึกผลการตรวจสอบคุณภาพ และออกใบรับรอง",
  },
  [UserRole.MANUFACTURER]: {
    label: "ผู้ผลิต",
    description: "จัดการกระบวนการผลิตสินค้า และควบคุมคุณภาพ",
  },
  [UserRole.TTM_OFFICER]: {
    label: "เจ้าหน้าที่กรมการแพทย์แผนไทย",
    description: "กำกับดูแลนโยบาย และออกใบอนุญาต",
  },
  [UserRole.ACFS_OFFICER]: {
    label: "เจ้าหน้าที่ มกอช.",
    description: "ตรวจสอบและรับรองมาตรฐาน GAP",
  },
  [UserRole.CUSTOMS_OFFICER]: {
    label: "เจ้าหน้าที่ศุลกากร",
    description: "ตรวจสอบการนำเข้าส่งออกสินค้า",
  },
  [UserRole.ADMIN]: {
    label: "ผู้ดูแลระบบ",
    description: "จัดการระบบและผู้ใช้งานทั้งหมด",
  },
  [UserRole.DATA_CONSUMER]: {
    label: "ผู้ใช้ข้อมูล",
    description: "เข้าถึงข้อมูลสถิติและรายงาน",
  },
  [UserRole.GUEST]: {
    label: "ผู้เยี่ยมชม",
    description: "ดูข้อมูลทั่วไปในระบบ",
  },
};

// Role card component
interface RoleCardProps {
  role: UserRole;
  onSelect: (role: UserRole) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onSelect }) => {
  const { label, description } = roleDetails[role];

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={() => onSelect(role)}
    >
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">เลือกบทบาทนี้</p>
      </CardContent>
    </Card>
  );
};

// Role selector component
const RoleSelector: React.FC = () => {
  const [username, setUsername] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if a role is already selected
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      navigate("/herb-trace/dashboard");
    }
  }, [navigate]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleLogin = () => {
    if (!username) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a username.",
      });
      return;
    }

    if (!selectedRole) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a role.",
      });
      return;
    }

    // Set the selected role and access rights in localStorage
    localStorage.setItem("userRole", selectedRole);
    const accessRights = setupRoleAccess(selectedRole);
    localStorage.setItem("roleAccess", JSON.stringify(accessRights));

    toast({
      title: "Success",
      description: `Logged in as ${roleDetails[selectedRole].label}`,
    });

    // Redirect to the dashboard
    navigate("/herb-trace/dashboard");
  };

  return (
    <div className="grid h-screen place-items-center bg-gray-100">
      <Card className="w-full max-w-md p-8 space-y-4">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            เลือกบทบาทของคุณ
          </CardTitle>
          <CardDescription className="text-center">
            เพื่อประสบการณ์การใช้งานที่เหมาะสม
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">ชื่อผู้ใช้</Label>
            <Input
              id="username"
              placeholder="กรอกชื่อผู้ใช้"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(UserRole).map((role) => (
              <RoleCard
                key={role}
                role={role}
                onSelect={handleRoleSelect}
              />
            ))}
          </div>
          <Button size="lg" onClick={handleLogin} disabled={!selectedRole}>
            เข้าสู่ระบบ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelector;
