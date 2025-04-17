
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
  Plant,
  Microscope,
  UserCheck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Define the available roles with their access rights
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
  | "ADMIN";

// Define access rights structures
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
}

// Define role configuration with metadata and access rights
const roles: {
  id: UserRole;
  name: string;
  description: string;
  icon: React.ElementType;
  route: string;
  access: RoleAccess;
}[] = [
  {
    id: "FARMER",
    name: "Farmer",
    description: "Herb growers who provide produce data",
    icon: Plant,
    route: "/herb-trace/dashboard",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: true, approve: false },
      trace: { view: true, edit: true, approve: false },
      certification: { view: true, edit: false, approve: false },
      map: { view: true, edit: false, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: true, approve: false },
    }
  },
  {
    id: "AGRICULTURE",
    name: "Agriculture Department",
    description: "Monitors and regulates agricultural production",
    icon: Leaf,
    route: "/herb-trace/dashboard",
    access: {
      dashboard: { view: true, edit: true, approve: false },
      herbs: { view: true, edit: true, approve: true },
      trace: { view: true, edit: true, approve: true },
      certification: { view: true, edit: true, approve: true },
      map: { view: true, edit: true, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: false, approve: false },
    }
  },
  {
    id: "TRAD_MED",
    name: "Thai Traditional Medicine",
    description: "Department of Thai Traditional and Alternative Medicine",
    icon: ClipboardCheck,
    route: "/herb-trace/dashboard",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: true, approve: true },
      trace: { view: true, edit: false, approve: false },
      certification: { view: true, edit: true, approve: true },
      map: { view: true, edit: false, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: false, approve: false },
    }
  },
  {
    id: "STANDARDS",
    name: "Standards Agency",
    description: "สำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ",
    icon: Shield,
    route: "/herb-trace/dashboard",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: false, approve: false },
      trace: { view: true, edit: false, approve: false },
      certification: { view: true, edit: true, approve: true },
      map: { view: true, edit: false, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: false, approve: false },
    }
  },
  {
    id: "INSPECTOR",
    name: "Quality Inspector",
    description: "Verifies quality and certification standards",
    icon: Microscope,
    route: "/herb-trace/dashboard",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: false, approve: false },
      trace: { view: true, edit: true, approve: true },
      certification: { view: true, edit: true, approve: true },
      map: { view: true, edit: false, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: false, approve: false },
    }
  },
  {
    id: "PLATFORM_OWNER",
    name: "Platform Owner",
    description: "Platform management and customer service",
    icon: UserCog,
    route: "/herb-trace/dashboard",
    access: {
      dashboard: { view: true, edit: true, approve: false },
      herbs: { view: true, edit: true, approve: false },
      trace: { view: true, edit: true, approve: false },
      certification: { view: true, edit: true, approve: false },
      map: { view: true, edit: true, approve: false },
      settings: { view: true, edit: true, approve: true },
      marketplace: { view: true, edit: true, approve: true },
    }
  },
  {
    id: "MARKET_PLACE",
    name: "Marketplace Manager",
    description: "Marketplace management and reports",
    icon: ShoppingCart,
    route: "/herb-trace/marketplace",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: false, approve: false },
      trace: { view: true, edit: false, approve: false },
      certification: { view: true, edit: false, approve: false },
      map: { view: true, edit: false, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: true, approve: true },
    }
  },
  {
    id: "MEMBER_MAIN",
    name: "Main Member",
    description: "Main business user access",
    icon: Users,
    route: "/herb-trace/dashboard",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: false, approve: false },
      trace: { view: true, edit: false, approve: false },
      certification: { view: true, edit: false, approve: false },
      map: { view: true, edit: false, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: true, approve: false },
    }
  },
  {
    id: "GENERAL_PUBLIC",
    name: "General Public",
    description: "Limited access for general users",
    icon: User,
    route: "/herb-trace/dashboard",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: false, approve: false },
      trace: { view: true, edit: false, approve: false },
      certification: { view: true, edit: false, approve: false },
      map: { view: true, edit: false, approve: false },
      settings: { view: false, edit: false, approve: false },
      marketplace: { view: true, edit: false, approve: false },
    }
  },
  {
    id: "MEMBER_PUBLIC",
    name: "Public Member",
    description: "General public member access",
    icon: User,
    route: "/herb-trace/dashboard",
    access: {
      dashboard: { view: true, edit: false, approve: false },
      herbs: { view: true, edit: false, approve: false },
      trace: { view: true, edit: false, approve: false },
      certification: { view: true, edit: false, approve: false },
      map: { view: true, edit: false, approve: false },
      settings: { view: true, edit: true, approve: false },
      marketplace: { view: true, edit: true, approve: false },
    }
  },
  {
    id: "ADMIN",
    name: "Administrator",
    description: "Full system access and management",
    icon: UserCheck,
    route: "/herb-trace/dashboard",
    access: {
      dashboard: { view: true, edit: true, approve: true },
      herbs: { view: true, edit: true, approve: true },
      trace: { view: true, edit: true, approve: true },
      certification: { view: true, edit: true, approve: true },
      map: { view: true, edit: true, approve: true },
      settings: { view: true, edit: true, approve: true },
      marketplace: { view: true, edit: true, approve: true },
    }
  }
];

export default function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    
    // Store role and access rights in localStorage
    const selectedRoleData = roles.find(r => r.id === role);
    if (selectedRoleData) {
      localStorage.setItem("userRole", role);
      localStorage.setItem("roleAccess", JSON.stringify(selectedRoleData.access));
      
      toast({
        title: "Role selected",
        description: `You are now logged in as ${selectedRoleData.name}`,
      });
      
      // Navigate to the appropriate dashboard
      navigate(selectedRoleData.route);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-6xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Select Your Role</CardTitle>
            <CardDescription>
              Choose your role to access the appropriate dashboard with relevant permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => (
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
                      <p>Access rights include: </p>
                      <ul className="list-disc pl-4 mt-1">
                        {Object.entries(role.access).map(([page, access]) => 
                          access.view && (
                            <li key={page}>
                              {page.charAt(0).toUpperCase() + page.slice(1)}: 
                              {access.edit ? ' Edit' : ' View only'}
                              {access.approve ? ' & Approve' : ''}
                            </li>
                          )
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
                      Select Role
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Your access level will be determined by your selected role
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
