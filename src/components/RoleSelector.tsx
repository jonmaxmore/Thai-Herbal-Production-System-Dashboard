
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { roleCategories, rolesConfig, type RoleCategory } from "@/config/roles";

const RoleSelector = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<RoleCategory>("production");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleConfirm = () => {
    if (!selectedRole) {
      toast({
        variant: "destructive",
        title: "กรุณาเลือกบทบาท",
        description: "คุณต้องเลือกบทบาทก่อนเข้าสู่ระบบ",
      });
      return;
    }

    // Set the selected role and access rights in localStorage
    localStorage.setItem("userRole", selectedRole);
    
    toast({
      title: "เข้าสู่ระบบสำเร็จ",
      description: `เข้าสู่ระบบในฐานะ ${rolesConfig.find(r => r.id === selectedRole)?.label}`,
    });

    // Redirect to the dashboard
    navigate("/herb-trace/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">เลือกบทบาทของคุณ</CardTitle>
          <CardDescription>
            เลือกบทบาทที่เหมาะสมกับการใช้งานของคุณ
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="production" value={activeCategory} onValueChange={(v) => setActiveCategory(v as RoleCategory)}>
            <TabsList className="grid grid-cols-4 mb-6">
              {Object.entries(roleCategories).map(([id, { label }]) => (
                <TabsTrigger key={id} value={id} className="text-sm">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(roleCategories).map(([category, { description }]) => (
              <TabsContent key={category} value={category}>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">{description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rolesConfig
                      .filter(role => role.category === category)
                      .map(role => {
                        const Icon = role.icon;
                        return (
                          <Button
                            key={role.id}
                            variant={selectedRole === role.id ? "default" : "outline"}
                            className={`h-auto p-4 flex items-start gap-4 ${
                              selectedRole === role.id ? "ring-2 ring-primary" : ""
                            }`}
                            onClick={() => handleRoleSelect(role.id)}
                          >
                            <Icon className="h-5 w-5 mt-1 flex-shrink-0" />
                            <div className="text-left">
                              <div className="font-medium">{role.label}</div>
                              <div className="text-sm text-muted-foreground">
                                {role.description}
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleConfirm}
              disabled={!selectedRole}
              className="w-full md:w-auto"
            >
              เข้าสู่ระบบ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelector;
