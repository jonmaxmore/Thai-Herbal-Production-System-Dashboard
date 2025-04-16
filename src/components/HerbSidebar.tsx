
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Leaf, Search, ClipboardList, Settings, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/herb-trace/dashboard' },
    { id: 'herbs', label: 'Herbs', icon: Leaf, path: '/herb-trace/herbs' },
    { id: 'trace', label: 'Trace', icon: Search, path: '/herb-trace/trace' },
    { id: 'certification', label: 'Certification', icon: ClipboardList, path: '/herb-trace/certification' },
    { id: 'map', label: 'Map', icon: MapPin, path: '/herb-trace/map' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/herb-trace/settings' },
  ];

  const handleTabChange = (tabId: string, path: string) => {
    setActiveTab(tabId);
    navigate(path);
    if (isMobile && setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="w-64 p-4 bg-white border-r h-screen space-y-6 shadow-md">
      <div className="flex items-center gap-2 px-2 mb-6">
        <Leaf className="h-6 w-6 text-herb" />
        <h1 className="text-xl font-bold">HerbTrace</h1>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === item.id
                ? "bg-herb-light text-herb-dark"
                : "text-gray-600 hover:bg-gray-100"
            )}
            onClick={() => handleTabChange(item.id, item.path)}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-200">
        <div className="flex flex-col gap-2">
          <div className="px-3 py-2">
            <p className="text-xs text-gray-500">Powered by</p>
            <p className="text-sm font-medium">HerbTrace Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}
