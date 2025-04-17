
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Leaf, Search, ClipboardList, Settings, MapPin, ShoppingCart, LogOut, Lock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRoleAccess } from '@/hooks/use-role-access';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const { userRole, canView, canEdit, canApprove } = useRoleAccess();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/herb-trace/dashboard', page: 'dashboard' },
    { id: 'herbs', label: 'Herbs', icon: Leaf, path: '/herb-trace/herbs', page: 'herbs' },
    { id: 'trace', label: 'Trace', icon: Search, path: '/herb-trace/trace', page: 'trace' },
    { id: 'certification', label: 'Certification', icon: ClipboardList, path: '/herb-trace/certification', page: 'certification' },
    { id: 'map', label: 'Map', icon: MapPin, path: '/herb-trace/map', page: 'map' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart, path: '/herb-trace/marketplace', page: 'marketplace' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/herb-trace/settings', page: 'settings' },
  ];

  const handleTabChange = (tabId: string, path: string, page: string) => {
    if (!canView(page as any)) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to view this page",
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
    // Clear user role and access from local storage
    localStorage.removeItem("userRole");
    localStorage.removeItem("roleAccess");
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    
    // Navigate to login page
    navigate("/");
  };

  // Get permission label for a page
  const getPermissionLabel = (page: string) => {
    if (canApprove(page as any)) return "Approve";
    if (canEdit(page as any)) return "Edit";
    if (canView(page as any)) return "View";
    return "No Access";
  };

  // Get permission icon for a page
  const getPermissionIcon = (page: string) => {
    if (canApprove(page as any)) return <CheckCircle className="h-3 w-3 text-green-600" />;
    if (canEdit(page as any)) return <CheckCircle className="h-3 w-3 text-blue-600" />;
    if (canView(page as any)) return <CheckCircle className="h-3 w-3 text-gray-600" />;
    return <Lock className="h-3 w-3 text-red-600" />;
  };

  return (
    <div className="w-64 p-4 bg-white border-r h-screen space-y-6 shadow-md flex flex-col">
      <div className="flex items-center gap-2 px-2 mb-6">
        <Leaf className="h-6 w-6 text-herb" />
        <h1 className="text-xl font-bold">Thai Herbal Production System</h1>
      </div>

      <div className="px-3 py-2 bg-green-50 rounded-md mb-4">
        <p className="text-xs text-gray-500">Logged in as</p>
        <p className="text-sm font-medium">{userRole}</p>
      </div>

      <nav className="space-y-1 flex-grow">
        {navItems.map((item) => (
          <TooltipProvider key={item.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  disabled={!canView(item.page as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    !canView(item.page as any) 
                      ? "text-gray-300 cursor-not-allowed" 
                      : activeTab === item.id
                        ? "bg-herb-light text-herb-dark"
                        : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={() => handleTabChange(item.id, item.path, item.page)}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    !canView(item.page as any) ? "text-gray-300" : ""
                  )} />
                  <span>{item.label}</span>
                  <span className="ml-auto">
                    {getPermissionIcon(item.page)}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getPermissionLabel(item.page)} permission</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>

      <div className="pt-6 border-t border-gray-200">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
        
        <div className="mt-4 px-3 py-2">
          <p className="text-xs text-gray-500">Powered by</p>
          <p className="text-sm font-medium">Thai Herbal Production System</p>
        </div>
      </div>
    </div>
  );
}
