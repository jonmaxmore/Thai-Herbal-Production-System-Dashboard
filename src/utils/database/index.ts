
import { 
  UserId, FarmerId, HerbId, TraceId, CertificationId, 
  ProcessStatus, InspectionProcess
} from './types';
import { generateMockUsers } from "../mockUserData";
import { createEnhancedDatabase } from './generators';

// Re-export all types in a single export statement to avoid duplicates
export type {
  UserId, FarmerId, HerbId, TraceId, CertificationId,
  ProcessStatus, InspectionProcess,
  EnhancedFarm, HerbData, EnhancedTrace, EnhancedTransaction,
  GACPApplication, GACPApplicationStatus, InspectionProcessData, 
  StakeholderData, InvolvementData
} from './types';

// Simplified backward compatibility exports
export const generateFarmers = (count: number) => Object.values(mockDatabase.farmers).slice(0, count);
export const generateTraces = (count: number) => Object.values(mockDatabase.traces).slice(0, count);
export const generateTransactions = (count: number) => Object.values(mockDatabase.transactions).slice(0, count);

// Simplified database interface
export interface MockDatabase {
  users: Record<UserId, ReturnType<typeof generateMockUsers>[0]>;
  farmers: Record<FarmerId, import('./types').EnhancedFarm>;
  herbs: Record<HerbId, import('./types').HerbData>;
  traces: Record<TraceId, import('./types').EnhancedTrace>;
  transactions: Record<string, import('./types').EnhancedTransaction>;
  inspectionProcesses: Record<string, {
    id: string;
    herbId: HerbId;
    farmerId: FarmerId;
    processType: InspectionProcess;
    status: ProcessStatus;
    startDate: Date;
    completionDate?: Date;
    inspectorId?: UserId;
    notes?: string;
  }>;
}

// Create our lite database singleton - fixed to use ES6 import
export const mockDatabase = createEnhancedDatabase();

// Add missing getUserActivityStats function with proper typing
export const getUserActivityStats = () => {
  const users = Object.values(mockDatabase.users);
  const activeUsers = users.filter((user: any) => user.status === 'active').length;
  const verifiedUsers = users.filter((user: any) => user.verificationStatus === true).length;
  
  // Fix the arithmetic operation by ensuring proper number typing
  const totalLogins = users.reduce((sum: number, user: any): number => {
    const userLogins = user.stats?.logins;
    const loginCount = (typeof userLogins === 'number' && !isNaN(userLogins)) ? userLogins : 0;
    return sum + loginCount;
  }, 0);
  
  const totalUsers = users.length;
  const averageLogins = totalUsers > 0 ? totalLogins / totalUsers : 0;
  
  return {
    totalUsers,
    activeUsers,
    verifiedUsers,
    totalLogins,
    averageLogins
  };
};

// Export simplified functions for dashboard data
export const getDashboardData = () => {
  const farmers = Object.values(mockDatabase.farmers) as import('./types').EnhancedFarm[];
  const traces = Object.values(mockDatabase.traces).slice(0, 20) as import('./types').EnhancedTrace[];
  
  // Calculate certification status counts
  const gapcStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0, "In Progress": 0 };
  const euGmpStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0, "In Progress": 0 };
  const dttmStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0, "In Progress": 0 };
  
  farmers.forEach((farmer) => {
    gapcStatus[farmer.gacp as keyof typeof gapcStatus]++;
    euGmpStatus[farmer.euGmp as keyof typeof euGmpStatus]++;
    dttmStatus[farmer.dttm as keyof typeof dttmStatus]++;
  });

  // Calculate simplified process stats
  const allProcesses = Object.values(mockDatabase.inspectionProcesses);
  const statusCounts = {
    "Pending": allProcesses.filter((p: any) => p.status === "Pending").length,
    "In Progress": allProcesses.filter((p: any) => p.status === "In Progress").length,
    "Passed": allProcesses.filter((p: any) => p.status === "Passed").length,
    "Failed": allProcesses.filter((p: any) => p.status === "Failed").length,
    "Expired": allProcesses.filter((p: any) => p.status === "Expired").length
  };

  const processCounts = {
    "GACP Certification": allProcesses.filter((p: any) => p.processType === "GACP Certification").length,
    "EU-GMP Certification": allProcesses.filter((p: any) => p.processType === "EU-GMP Certification").length,
    "DTTM Certification": allProcesses.filter((p: any) => p.processType === "DTTM Certification").length,
    "Quality Control": allProcesses.filter((p: any) => p.processType === "Quality Control").length
  };

  // Mock stakeholder data
  const stakeholdersByRole: import('./types').StakeholderData[] = [
    { role: "farmers", count: farmers.length },
    { role: "inspectors", count: 15 },
    { role: "lab_technicians", count: 8 },
    { role: "administrators", count: 5 }
  ];

  const stakeholderInvolvement: import('./types').InvolvementData[] = [
    { status: "active", count: Math.floor(farmers.length * 0.7), category: "user_activity" },
    { status: "inactive", count: Math.floor(farmers.length * 0.3), category: "user_activity" }
  ];

  const recentInspections: import('./types').InspectionProcessData[] = allProcesses.slice(0, 5).map((process: any) => {
    const farm = mockDatabase.farmers[process.farmerId];
    const herb = mockDatabase.herbs[process.herbId || "HERB_001"];
    const farmer = farm?.userId ? mockDatabase.users[farm.userId] : null;
    
    return {
      id: process.id,
      farmerId: process.farmerId,
      herbId: process.herbId || "HERB_001",
      herbName: herb?.name || "Unknown Herb",
      processType: process.processType,
      status: process.status,
      startDate: process.startDate,
      completionDate: process.completionDate,
      inspectorName: "Inspector " + Math.floor(Math.random() * 10 + 1),
      farmerName: farmer?.fullName || farm?.owner?.name || "Unknown Farmer"
    };
  });

  return {
    farmers,
    traces,
    gapcStatus,
    euGmpStatus,
    dttmStatus,
    userStats: getUserActivityStats(),
    transactions: Object.values(mockDatabase.transactions).slice(0, 10) as import('./types').EnhancedTransaction[],
    totalSales: Object.values(mockDatabase.transactions)
      .filter((tx: any) => tx.status === 'Completed')
      .reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0),
    pendingOrders: Object.values(mockDatabase.transactions)
      .filter((tx: any) => tx.status === 'Pending').length,
    processStats: {
      totalProcesses: Object.keys(mockDatabase.inspectionProcesses).length,
      statusCounts,
      processCounts,
      averageCompletionRate: 0.75,
      averageFailureRate: 0.15
    },
    stakeholdersByRole,
    stakeholderInvolvement,
    recentInspections
  };
};
