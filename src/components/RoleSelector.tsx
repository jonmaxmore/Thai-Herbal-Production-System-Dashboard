
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

    // Set the selected role in localStorage
    localStorage.setItem("userRole", selectedRole);

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
