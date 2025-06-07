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

export type WorkflowStatus = 'view' | 'edit' | 'approve' | 'none';

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

// Enhanced role permissions with edit and approve capabilities
const rolePermissions: Record<UserRole, Record<RolePageType, { view: boolean; edit: boolean; approve: boolean }>> = {
  farmer: {
    overview: { view: true, edit: false, approve: false },
    dashboard: { view: true, edit: false, approve: false },
    farms: { view: true, edit: true, approve: false },
    activities: { view: true, edit: true, approve: false },
    harvest: { view: true, edit: true, approve: false },
    weather: { view: true, edit: false, approve: false },
    herbs: { view: true, edit: true, approve: false },
    trace: { view: true, edit: true, approve: false },
    certification: { view: true, edit: false, approve: false },
    inspection: { view: true, edit: false, approve: false },
    licenses: { view: false, edit: false, approve: false },
    lab_samples: { view: false, edit: false, approve: false },
    lab_testing: { view: false, edit: false, approve: false },
    lab_materials: { view: false, edit: false, approve: false },
    map: { view: true, edit: false, approve: false },
    procurement: { view: true, edit: true, approve: false },
    production: { view: false, edit: false, approve: false },
    inventory: { view: true, edit: true, approve: false },
    logistics: { view: false, edit: false, approve: false },
    qrcode: { view: true, edit: true, approve: false },
    marketplace: { view: true, edit: true, approve: false },
    b2b: { view: false, edit: false, approve: false },
    contracts: { view: true, edit: true, approve: false },
    reports: { view: false, edit: false, approve: false },
    exports: { view: false, edit: false, approve: false },
    learning: { view: true, edit: false, approve: false },
    settings: { view: true, edit: true, approve: false },
    users: { view: false, edit: false, approve: false },
    support: { view: false, edit: false, approve: false },
    'seed-to-sale': { view: true, edit: true, approve: false }
  },
  lab: {
    overview: { view: true, edit: false, approve: false },
    dashboard: { view: true, edit: false, approve: false },
    farms: { view: false, edit: false, approve: false },
    activities: { view: false, edit: false, approve: false },
    harvest: { view: false, edit: false, approve: false },
    weather: { view: false, edit: false, approve: false },
    herbs: { view: true, edit: false, approve: false },
    trace: { view: true, edit: true, approve: false },
    certification: { view: true, edit: true, approve: true },
    inspection: { view: true, edit: true, approve: true },
    licenses: { view: true, edit: false, approve: false },
    lab_samples: { view: true, edit: true, approve: true },
    lab_testing: { view: true, edit: true, approve: true },
    lab_materials: { view: true, edit: true, approve: false },
    map: { view: true, edit: false, approve: false },
    procurement: { view: false, edit: false, approve: false },
    production: { view: false, edit: false, approve: false },
    inventory: { view: false, edit: false, approve: false },
    logistics: { view: false, edit: false, approve: false },
    qrcode: { view: false, edit: false, approve: false },
    marketplace: { view: false, edit: false, approve: false },
    b2b: { view: false, edit: false, approve: false },
    contracts: { view: false, edit: false, approve: false },
    reports: { view: true, edit: true, approve: false },
    exports: { view: true, edit: false, approve: false },
    learning: { view: true, edit: false, approve: false },
    settings: { view: true, edit: true, approve: false },
    users: { view: false, edit: false, approve: false },
    support: { view: false, edit: false, approve: false },
    'seed-to-sale': { view: true, edit: false, approve: false }
  },
  manufacturer: {
    overview: { view: true, edit: false, approve: false },
    dashboard: { view: true, edit: false, approve: false },
    farms: { view: false, edit: false, approve: false },
    activities: { view: false, edit: false, approve: false },
    harvest: { view: false, edit: false, approve: false },
    weather: { view: false, edit: false, approve: false },
    herbs: { view: true, edit: false, approve: false },
    trace: { view: true, edit: true, approve: false },
    certification: { view: true, edit: false, approve: false },
    inspection: { view: false, edit: false, approve: false },
    licenses: { view: false, edit: false, approve: false },
    lab_samples: { view: false, edit: false, approve: false },
    lab_testing: { view: false, edit: false, approve: false },
    lab_materials: { view: false, edit: false, approve: false },
    map: { view: false, edit: false, approve: false },
    procurement: { view: true, edit: true, approve: false },
    production: { view: true, edit: true, approve: true },
    inventory: { view: true, edit: true, approve: false },
    logistics: { view: true, edit: true, approve: false },
    qrcode: { view: true, edit: true, approve: false },
    marketplace: { view: true, edit: true, approve: false },
    b2b: { view: true, edit: true, approve: false },
    contracts: { view: true, edit: true, approve: false },
    reports: { view: true, edit: false, approve: false },
    exports: { view: true, edit: true, approve: false },
    learning: { view: true, edit: false, approve: false },
    settings: { view: true, edit: true, approve: false },
    users: { view: false, edit: false, approve: false },
    support: { view: false, edit: false, approve: false },
    'seed-to-sale': { view: true, edit: false, approve: false }
  },
  admin: {
    overview: { view: true, edit: true, approve: true },
    dashboard: { view: true, edit: true, approve: true },
    farms: { view: true, edit: true, approve: true },
    activities: { view: true, edit: true, approve: true },
    harvest: { view: true, edit: true, approve: true },
    weather: { view: true, edit: true, approve: true },
    herbs: { view: true, edit: true, approve: true },
    trace: { view: true, edit: true, approve: true },
    certification: { view: true, edit: true, approve: true },
    inspection: { view: true, edit: true, approve: true },
    licenses: { view: true, edit: true, approve: true },
    lab_samples: { view: true, edit: true, approve: true },
    lab_testing: { view: true, edit: true, approve: true },
    lab_materials: { view: true, edit: true, approve: true },
    map: { view: true, edit: true, approve: true },
    procurement: { view: true, edit: true, approve: true },
    production: { view: true, edit: true, approve: true },
    inventory: { view: true, edit: true, approve: true },
    logistics: { view: true, edit: true, approve: true },
    qrcode: { view: true, edit: true, approve: true },
    marketplace: { view: true, edit: true, approve: true },
    b2b: { view: true, edit: true, approve: true },
    contracts: { view: true, edit: true, approve: true },
    reports: { view: true, edit: true, approve: true },
    exports: { view: true, edit: true, approve: true },
    learning: { view: true, edit: true, approve: true },
    settings: { view: true, edit: true, approve: true },
    users: { view: true, edit: true, approve: true },
    support: { view: true, edit: true, approve: true },
    'seed-to-sale': { view: true, edit: true, approve: true }
  },
  data_consumer: {
    overview: { view: true, edit: false, approve: false },
    dashboard: { view: true, edit: false, approve: false },
    farms: { view: false, edit: false, approve: false },
    activities: { view: false, edit: false, approve: false },
    harvest: { view: false, edit: false, approve: false },
    weather: { view: false, edit: false, approve: false },
    herbs: { view: true, edit: false, approve: false },
    trace: { view: true, edit: false, approve: false },
    certification: { view: true, edit: false, approve: false },
    inspection: { view: false, edit: false, approve: false },
    licenses: { view: false, edit: false, approve: false },
    lab_samples: { view: false, edit: false, approve: false },
    lab_testing: { view: false, edit: false, approve: false },
    lab_materials: { view: false, edit: false, approve: false },
    map: { view: true, edit: false, approve: false },
    procurement: { view: false, edit: false, approve: false },
    production: { view: false, edit: false, approve: false },
    inventory: { view: false, edit: false, approve: false },
    logistics: { view: false, edit: false, approve: false },
    qrcode: { view: false, edit: false, approve: false },
    marketplace: { view: true, edit: false, approve: false },
    b2b: { view: false, edit: false, approve: false },
    contracts: { view: false, edit: false, approve: false },
    reports: { view: true, edit: false, approve: false },
    exports: { view: false, edit: false, approve: false },
    learning: { view: true, edit: false, approve: false },
    settings: { view: true, edit: false, approve: false },
    users: { view: false, edit: false, approve: false },
    support: { view: false, edit: false, approve: false },
    'seed-to-sale': { view: true, edit: false, approve: false }
  },
  ttm_officer: {
    overview: { view: true, edit: false, approve: false },
    dashboard: { view: true, edit: false, approve: false },
    farms: { view: true, edit: false, approve: true },
    activities: { view: false, edit: false, approve: false },
    harvest: { view: false, edit: false, approve: false },
    weather: { view: false, edit: false, approve: false },
    herbs: { view: true, edit: false, approve: false },
    trace: { view: true, edit: false, approve: false },
    certification: { view: true, edit: true, approve: true },
    inspection: { view: true, edit: true, approve: true },
    licenses: { view: true, edit: true, approve: true },
    lab_samples: { view: true, edit: false, approve: true },
    lab_testing: { view: true, edit: false, approve: true },
    lab_materials: { view: false, edit: false, approve: false },
    map: { view: true, edit: false, approve: false },
    procurement: { view: false, edit: false, approve: false },
    production: { view: false, edit: false, approve: false },
    inventory: { view: false, edit: false, approve: false },
    logistics: { view: false, edit: false, approve: false },
    qrcode: { view: false, edit: false, approve: false },
    marketplace: { view: false, edit: false, approve: false },
    b2b: { view: false, edit: false, approve: false },
    contracts: { view: false, edit: false, approve: false },
    reports: { view: true, edit: false, approve: false },
    exports: { view: true, edit: true, approve: true },
    learning: { view: true, edit: true, approve: true },
    settings: { view: true, edit: true, approve: false },
    users: { view: true, edit: true, approve: true },
    support: { view: true, edit: true, approve: false },
    'seed-to-sale': { view: true, edit: false, approve: false }
  },
  acfs_officer: {
    overview: { view: true, edit: false, approve: false },
    dashboard: { view: true, edit: false, approve: false },
    farms: { view: true, edit: true, approve: true },
    activities: { view: true, edit: true, approve: true },
    harvest: { view: true, edit: false, approve: true },
    weather: { view: false, edit: false, approve: false },
    herbs: { view: true, edit: false, approve: false },
    trace: { view: true, edit: false, approve: false },
    certification: { view: true, edit: true, approve: true },
    inspection: { view: true, edit: true, approve: true },
    licenses: { view: true, edit: false, approve: true },
    lab_samples: { view: false, edit: false, approve: false },
    lab_testing: { view: false, edit: false, approve: false },
    lab_materials: { view: false, edit: false, approve: false },
    map: { view: true, edit: false, approve: false },
    procurement: { view: false, edit: false, approve: false },
    production: { view: false, edit: false, approve: false },
    inventory: { view: false, edit: false, approve: false },
    logistics: { view: false, edit: false, approve: false },
    qrcode: { view: false, edit: false, approve: false },
    marketplace: { view: false, edit: false, approve: false },
    b2b: { view: false, edit: false, approve: false },
    contracts: { view: false, edit: false, approve: false },
    reports: { view: true, edit: false, approve: false },
    exports: { view: true, edit: false, approve: true },
    learning: { view: true, edit: false, approve: false },
    settings: { view: true, edit: true, approve: false },
    users: { view: true, edit: false, approve: false },
    support: { view: true, edit: false, approve: false },
    'seed-to-sale': { view: true, edit: false, approve: false }
  }
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

  const canEdit = (page: RolePageType): boolean => {
    return rolePermissions[userRole]?.[page]?.edit ?? false;
  };

  const canApprove = (page: RolePageType): boolean => {
    return rolePermissions[userRole]?.[page]?.approve ?? false;
  };

  const getWorkflowStatus = (page: RolePageType): WorkflowStatus => {
    const permissions = rolePermissions[userRole]?.[page];
    if (!permissions?.view) return 'none';
    if (permissions.approve) return 'approve';
    if (permissions.edit) return 'edit';
    return 'view';
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
    canEdit,
    canApprove,
    getWorkflowStatus,
    getAllowedPages,
    isLoading
  };
};
