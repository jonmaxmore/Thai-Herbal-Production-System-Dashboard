
import { useState, useEffect } from 'react';

export type RolePageType = 
  | 'overview'
  | 'dashboard'
  | 'farms'
  | 'activities' 
  | 'harvest'
  | 'weather'
  | 'herbs'
  | 'trace'
  | 'certification'
  | 'inspection'
  | 'licenses'
  | 'lab_samples'
  | 'lab_testing'
  | 'lab_materials'
  | 'map'
  | 'procurement'
  | 'production'
  | 'inventory'
  | 'logistics'
  | 'qrcode'
  | 'marketplace'
  | 'b2b'
  | 'contracts'
  | 'reports'
  | 'exports'
  | 'learning'
  | 'settings'
  | 'users'
  | 'support'
  | 'seed-to-sale';

export type UserRole = 'farmer' | 'lab' | 'manufacturer' | 'admin' | 'data_consumer' | 'ttm_officer' | 'acfs_officer';

// Role-based access control mapping
const roleAccess: Record<UserRole, RolePageType[]> = {
  farmer: [
    'overview', 'dashboard', 'farms', 'activities', 'harvest', 'weather', 'herbs', 'trace', 
    'certification', 'inspection', 'map', 'procurement', 'inventory', 'qrcode', 
    'marketplace', 'contracts', 'learning', 'settings', 'seed-to-sale'
  ],
  lab: [
    'overview', 'dashboard', 'herbs', 'trace', 'certification', 'inspection', 'licenses',
    'lab_samples', 'lab_testing', 'lab_materials', 'map', 'reports', 'exports', 
    'learning', 'settings', 'seed-to-sale'
  ],
  manufacturer: [
    'overview', 'dashboard', 'herbs', 'trace', 'certification', 'procurement', 
    'production', 'inventory', 'logistics', 'qrcode', 'marketplace', 'b2b', 'contracts',
    'reports', 'exports', 'learning', 'settings', 'seed-to-sale'
  ],
  admin: [
    'overview', 'dashboard', 'farms', 'activities', 'harvest', 'weather', 'herbs', 'trace',
    'certification', 'inspection', 'licenses', 'lab_samples', 'lab_testing', 'lab_materials',
    'map', 'procurement', 'production', 'inventory', 'logistics', 'qrcode', 'marketplace',
    'b2b', 'contracts', 'reports', 'exports', 'learning', 'settings', 'users', 'support', 'seed-to-sale'
  ],
  data_consumer: [
    'overview', 'dashboard', 'herbs', 'trace', 'certification', 'map', 'marketplace',
    'reports', 'learning', 'settings', 'seed-to-sale'
  ],
  ttm_officer: [
    'overview', 'dashboard', 'farms', 'herbs', 'trace', 'certification', 'inspection',
    'licenses', 'lab_samples', 'lab_testing', 'map', 'reports', 'exports', 'learning',
    'settings', 'users', 'support', 'seed-to-sale'
  ],
  acfs_officer: [
    'overview', 'dashboard', 'farms', 'activities', 'harvest', 'herbs', 'trace',
    'certification', 'inspection', 'licenses', 'map', 'reports', 'exports', 'learning',
    'settings', 'users', 'support', 'seed-to-sale'
  ]
};

export const useRoleAccess = () => {
  const [userRole, setUserRole] = useState<UserRole>('farmer');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get role from localStorage or default to farmer
    const storedRole = localStorage.getItem('userRole') as UserRole;
    if (storedRole && Object.keys(roleAccess).includes(storedRole)) {
      setUserRole(storedRole);
    } else {
      setUserRole('farmer');
      localStorage.setItem('userRole', 'farmer');
    }
    setIsLoading(false);
  }, []);

  const canView = (page: RolePageType): boolean => {
    return roleAccess[userRole]?.includes(page) ?? false;
  };

  const getAllowedPages = (): RolePageType[] => {
    return roleAccess[userRole] ?? [];
  };

  const setRole = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
  };

  return {
    userRole,
    setRole,
    canView,
    getAllowedPages,
    isLoading
  };
};
