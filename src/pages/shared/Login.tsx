
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Shield, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState("user");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      if (email && password) {
        // Simple validation for demo purposes
        toast({
          title: "Login successful",
          description: "Please select your role",
        });
        
        // Clear any previous role
        localStorage.removeItem("userRole");
        localStorage.removeItem("roleAccess");
        
        // Redirect to the role selector page
        navigate("/role-selector");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Please provide both email and password",
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Thai Herbal Production System</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user" onValueChange={setAccountType}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="user" className="flex gap-2 items-center">
                <Users className="h-4 w-4" />
                <span>User</span>
              </TabsTrigger>
              <TabsTrigger value="farmer" className="flex gap-2 items-center">
                <Leaf className="h-4 w-4" />
                <span>Farmer</span>
              </TabsTrigger>
              <TabsTrigger value="authority" className="flex gap-2 items-center">
                <Shield className="h-4 w-4" />
                <span>Authority</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="user">
              <div className="text-sm text-muted-foreground mb-4">
                Login as a general user to browse herbs, trace products, or make purchases.
              </div>
            </TabsContent>
            <TabsContent value="farmer">
              <div className="text-sm text-muted-foreground mb-4">
                Login as a farmer to register your herbs, apply for certifications, and sell products.
              </div>
            </TabsContent>
            <TabsContent value="authority">
              <div className="text-sm text-muted-foreground mb-4">
                Login as a regulatory authority to approve certifications and monitor compliance.
              </div>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button 
              className="w-full mt-6" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-gray-500">
            Don't have an account? Contact your administrator
          </p>
          <div className="text-xs text-muted-foreground text-center px-4">
            After login, you'll be directed to select your specific role in the system
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
