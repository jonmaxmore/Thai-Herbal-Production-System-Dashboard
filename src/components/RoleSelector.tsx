
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Leaf, ClipboardCheck, ShoppingCart, User, UserCog } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Define the available roles
export type UserRole = 
  | "AGRICULTURE" 
  | "TRAD_MED" 
  | "STANDARDS" 
  | "PLATFORM_OWNER"
  | "GENERAL_PUBLIC"
  | "MARKET_PLACE"
  | "MEMBER_MAIN"
  | "MEMBER_PUBLIC"
  | "ADMIN";

// Role configuration with metadata
const roles: {
  id: UserRole;
  name: string;
  description: string;
  icon: React.ElementType;
  route: string;
}[] = [
  {
    id: "AGRICULTURE",
    name: "Agriculture",
    description: "Access agricultural data and management tools",
    icon: Leaf,
    route: "/herb-trace/dashboard"
  },
  {
    id: "TRAD_MED",
    name: "Thai Traditional Medicine",
    description: "Department of Thai Traditional and Alternative Medicine",
    icon: ClipboardCheck,
    route: "/herb-trace/dashboard"
  },
  {
    id: "STANDARDS",
    name: "Standards Agency",
    description: "สำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ",
    icon: Shield,
    route: "/herb-trace/dashboard"
  },
  {
    id: "PLATFORM_OWNER",
    name: "Platform Owner",
    description: "Platform management and customer service",
    icon: UserCog,
    route: "/herb-trace/dashboard"
  },
  {
    id: "GENERAL_PUBLIC",
    name: "General Public",
    description: "Limited access for general users",
    icon: User,
    route: "/herb-trace/dashboard"
  },
  {
    id: "MARKET_PLACE",
    name: "Marketplace",
    description: "Marketplace management and reports",
    icon: ShoppingCart,
    route: "/herb-trace/marketplace"
  },
  {
    id: "MEMBER_MAIN",
    name: "Main Member",
    description: "Main business user access",
    icon: Users,
    route: "/herb-trace/dashboard"
  },
  {
    id: "MEMBER_PUBLIC",
    name: "Public Member",
    description: "General public member access",
    icon: User,
    route: "/herb-trace/dashboard"
  },
  {
    id: "ADMIN",
    name: "Administrator",
    description: "Full system access and management",
    icon: UserCog,
    route: "/herb-trace/dashboard"
  }
];

export default function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    
    // In a real app, this would store the role in context/state/localStorage
    localStorage.setItem("userRole", role);
    
    // Find the selected role's route
    const selectedRoleData = roles.find(r => r.id === role);
    
    toast({
      title: "Role selected",
      description: `You are now logged in as ${selectedRoleData?.name}`,
    });
    
    // Navigate to the appropriate dashboard
    navigate(selectedRoleData?.route || "/herb-trace/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-6xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Select Your Role</CardTitle>
            <CardDescription>
              Choose your role to access the appropriate dashboard
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
