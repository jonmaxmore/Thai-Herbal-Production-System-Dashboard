
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

// Create our enhanced database singleton with reset capability
let _mockDatabase: MockDatabase | null = null;

export const mockDatabase = (() => {
  if (!_mockDatabase) {
    console.log("Initializing new enhanced database...");
    _mockDatabase = createEnhancedDatabase();
  }
  return _mockDatabase;
})();

// Reset database function
export const resetDatabase = () => {
  console.log("Resetting database...");
  _mockDatabase = null;
  _mockDatabase = createEnhancedDatabase();
  return _mockDatabase;
};

// Enhanced getUserActivityStats function with proper error handling
export const getUserActivityStats = () => {
  const users = Object.values(mockDatabase.users);
  const activeUsers = users.filter((user: any) => user.status === 'active').length;
  const verifiedUsers = users.filter((user: any) => user.verificationStatus === true).length;
  
  // Enhanced arithmetic operation with proper validation
  const totalLogins = users.reduce((sum: number, user: any): number => {
    const userLogins = user.stats?.logins;
    const loginCount = (typeof userLogins === 'number' && !isNaN(userLogins)) ? userLogins : 0;
    return sum + loginCount;
  }, 0);
  
  const totalUsers = users.length;
  const averageLogins = totalUsers > 0 ? Math.round((totalLogins / totalUsers) * 100) / 100 : 0;
  
  return {
    totalUsers,
    activeUsers,
    verifiedUsers,
    totalLogins,
    averageLogins
  };
};

// Enhanced getDashboardData with comprehensive system information
export const getDashboardData = () => {
  const farmers = Object.values(mockDatabase.farmers) as import('./types').EnhancedFarm[];
  const traces = Object.values(mockDatabase.traces).slice(0, 50) as import('./types').EnhancedTrace[];
  const herbs = Object.values(mockDatabase.herbs) as import('./types').HerbData[];
  
  // Calculate detailed certification status counts
  const gapcStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0, "In Progress": 0 };
  const euGmpStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0, "In Progress": 0 };
  const dttmStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0, "In Progress": 0 };
  
  farmers.forEach((farmer) => {
    gapcStatus[farmer.gacp as keyof typeof gapcStatus]++;
    euGmpStatus[farmer.euGmp as keyof typeof euGmpStatus]++;
    dttmStatus[farmer.dttm as keyof typeof dttmStatus]++;
  });

  // Calculate enhanced process statistics
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

  // Enhanced stakeholder data with real counts
  const allUsers = Object.values(mockDatabase.users);
  const stakeholdersByRole: import('./types').StakeholderData[] = [
    { role: "farmers", count: allUsers.filter(u => u.role === 'farmer').length },
    { role: "inspectors", count: allUsers.filter(u => ['lab', 'ttm_officer', 'acfs_officer'].includes(u.role)).length },
    { role: "manufacturers", count: allUsers.filter(u => u.role === 'manufacturer').length },
    { role: "administrators", count: allUsers.filter(u => u.role === 'admin').length },
    { role: "data_consumers", count: allUsers.filter(u => u.role === 'data_consumer').length }
  ];

  const stakeholderInvolvement: import('./types').InvolvementData[] = [
    { status: "active", count: allUsers.filter(u => u.status === 'active').length, category: "user_activity" },
    { status: "inactive", count: allUsers.filter(u => u.status === 'inactive').length, category: "user_activity" },
    { status: "verified", count: allUsers.filter(u => u.verificationStatus === true).length, category: "verification_status" },
    { status: "pending", count: allUsers.filter(u => u.status === 'pending').length, category: "user_activity" }
  ];

  // Enhanced recent inspections with complete data
  const recentInspections: import('./types').InspectionProcessData[] = allProcesses.slice(0, 10).map((process: any) => {
    const farm = mockDatabase.farmers[process.farmerId];
    const herb = mockDatabase.herbs[process.herbId];
    const farmer = farm?.userId ? mockDatabase.users[farm.userId] : null;
    const inspector = process.inspectorId ? mockDatabase.users[process.inspectorId] : null;
    
    return {
      id: process.id,
      farmerId: process.farmerId,
      herbId: process.herbId,
      herbName: herb?.name || "ไม่ระบุสมุนไพร",
      processType: process.processType,
      status: process.status,
      startDate: process.startDate,
      completionDate: process.completionDate,
      inspectorName: inspector?.fullName || "รอมอบหมายผู้ตรวจสอบ",
      farmerName: farmer?.fullName || farm?.owner?.name || "ไม่ระบุเกษตรกร"
    };
  });

  // Cannabis vs Traditional herb statistics
  const cannabisHerbs = herbs.filter(h => h.category === 'cannabis').length;
  const traditionalHerbs = herbs.filter(h => h.category === 'traditional').length;
  const cannabisPercentage = Math.round((cannabisHerbs / herbs.length) * 100);

  return {
    farmers,
    traces,
    herbs,
    gapcStatus,
    euGmpStatus,
    dttmStatus,
    userStats: getUserActivityStats(),
    transactions: Object.values(mockDatabase.transactions).slice(0, 20) as import('./types').EnhancedTransaction[],
    totalSales: Object.values(mockDatabase.transactions)
      .filter((tx: any) => tx.status === 'Completed')
      .reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0),
    pendingOrders: Object.values(mockDatabase.transactions)
      .filter((tx: any) => tx.status === 'Pending').length,
    processStats: {
      totalProcesses: Object.keys(mockDatabase.inspectionProcesses).length,
      statusCounts,
      processCounts,
      averageCompletionRate: statusCounts.Passed / (statusCounts.Passed + statusCounts.Failed + statusCounts["In Progress"]) || 0,
      averageFailureRate: statusCounts.Failed / (statusCounts.Passed + statusCounts.Failed + statusCounts["In Progress"]) || 0
    },
    stakeholdersByRole,
    stakeholderInvolvement,
    recentInspections,
    // New enhanced statistics
    systemStats: {
      totalFarms: farmers.length,
      totalHerbs: herbs.length,
      totalTraces: Object.keys(mockDatabase.traces).length,
      totalTransactions: Object.keys(mockDatabase.transactions).length,
      cannabisPercentage,
      traditionalPercentage: 100 - cannabisPercentage,
      organicCertifiedFarms: farmers.filter(f => f.organicCertified).length
    }
  };
};

// System health check function
export const performSystemHealthCheck = () => {
  const data = getDashboardData();
  const issues: string[] = [];
  const improvements: string[] = [];

  // Check data consistency
  if (data.farmers.length === 0) issues.push("ไม่มีข้อมูลเกษตรกรในระบบ");
  if (data.herbs.length === 0) issues.push("ไม่มีข้อมูลสมุนไพรในระบบ");
  if (data.traces.length === 0) issues.push("ไม่มีข้อมูลการตรวจสอบย้อนกลับ");
  
  // Check certification distribution
  const totalCertifications = data.gapcStatus.Passed + data.euGmpStatus.Passed + data.dttmStatus.Passed;
  if (totalCertifications < data.farmers.length * 0.5) {
    improvements.push("ควรเพิ่มอัตราการผ่านการรับรองมาตรฐาน");
  }

  // Check cannabis percentage
  if (data.systemStats && data.systemStats.cannabisPercentage < 65) {
    improvements.push("สัดส่วนกัญชายังไม่ถึง 70% ตามเป้าหมาย");
  }

  return {
    status: issues.length === 0 ? "สุขภาพระบบดี" : "พบปัญหาในระบบ",
    issues,
    improvements,
    timestamp: new Date().toISOString(),
    summary: {
      totalFarms: data.farmers.length,
      totalUsers: data.userStats.totalUsers,
      totalProcesses: data.processStats.totalProcesses,
      cannabisPercentage: data.systemStats?.cannabisPercentage || 0
    }
  };
};

console.log("Enhanced Thai Herbal Production Platform Database initialized");
console.log("Database contains:", performSystemHealthCheck().summary);
