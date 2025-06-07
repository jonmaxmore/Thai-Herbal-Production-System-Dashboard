
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

// Create our enhanced database singleton with proper linking
let _mockDatabase: MockDatabase | null = null;

export const mockDatabase = (() => {
  if (!_mockDatabase) {
    console.log("🚀 Initializing new properly-linked enhanced database...");
    _mockDatabase = createEnhancedDatabase();
    console.log("✅ Database initialization complete with proper data flow");
  }
  return _mockDatabase;
})();

// Reset database function
export const resetDatabase = () => {
  console.log("🔄 Resetting database with proper linking...");
  _mockDatabase = null;
  _mockDatabase = createEnhancedDatabase();
  return _mockDatabase;
};

// Enhanced getUserActivityStats function with proper validation
export const getUserActivityStats = () => {
  const users = Object.values(mockDatabase.users);
  const activeUsers = users.filter((user: any) => user.status === 'active').length;
  const verifiedUsers = users.filter((user: any) => user.verificationStatus === true).length;
  
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

// Enhanced getDashboardData with proper data linking validation
export const getDashboardData = () => {
  const farmers = Object.values(mockDatabase.farmers) as import('./types').EnhancedFarm[];
  const traces = Object.values(mockDatabase.traces) as import('./types').EnhancedTrace[];
  const herbs = Object.values(mockDatabase.herbs) as import('./types').HerbData[];
  const allUsers = Object.values(mockDatabase.users);
  
  // Validate data linking before processing
  const validTraces = traces.filter(trace => {
    const farmExists = farmers.find(f => f.id === trace.farmId);
    const herbExists = herbs.find(h => h.id === trace.herbId);
    return farmExists && herbExists;
  });
  
  const validFarmers = farmers.filter(farmer => {
    const userExists = allUsers.find(u => u.id === farmer.userId);
    const farmHerbs = herbs.filter(h => h.farmerId === farmer.id);
    return userExists && farmHerbs.length > 0;
  });
  
  console.log(`📊 Data validation: ${validTraces.length}/${traces.length} traces valid, ${validFarmers.length}/${farmers.length} farmers valid`);
  
  // Calculate certification status with validated data
  const gapcStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0, "In Progress": 0 };
  const euGmpStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0, "In Progress": 0 };
  const dttmStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0, "In Progress": 0 };
  
  validFarmers.forEach((farmer) => {
    gapcStatus[farmer.gacp as keyof typeof gapcStatus]++;
    euGmpStatus[farmer.euGmp as keyof typeof euGmpStatus]++;
    dttmStatus[farmer.dttm as keyof typeof dttmStatus]++;
  });

  // Calculate process statistics with linked data only
  const allProcesses = Object.values(mockDatabase.inspectionProcesses).filter(process => {
    const farmExists = validFarmers.find(f => f.id === process.farmerId);
    const herbExists = herbs.find(h => h.id === process.herbId);
    return farmExists && herbExists;
  });

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

  // Enhanced stakeholder data with real linked counts
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

  // Recent inspections with complete linked data
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

  // Cannabis vs Traditional herb statistics from properly linked data
  const linkedHerbs = herbs.filter(h => validFarmers.find(f => f.id === h.farmerId));
  const cannabisHerbs = linkedHerbs.filter(h => h.category === 'cannabis').length;
  const traditionalHerbs = linkedHerbs.filter(h => h.category === 'traditional').length;
  const cannabisPercentage = linkedHerbs.length > 0 ? Math.round((cannabisHerbs / linkedHerbs.length) * 100) : 0;

  // Only count transactions linked to valid herbs
  const validTransactions = Object.values(mockDatabase.transactions).filter(tx => 
    linkedHerbs.find(h => h.id === tx.herbId)
  ) as import('./types').EnhancedTransaction[];

  return {
    farmers: validFarmers,
    traces: validTraces.slice(0, 50), // Limit for performance
    herbs: linkedHerbs,
    gapcStatus,
    euGmpStatus,
    dttmStatus,
    userStats: getUserActivityStats(),
    transactions: validTransactions.slice(0, 20),
    totalSales: validTransactions
      .filter((tx: any) => tx.status === 'Completed')
      .reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0),
    pendingOrders: validTransactions
      .filter((tx: any) => tx.status === 'Pending').length,
    processStats: {
      totalProcesses: allProcesses.length,
      statusCounts,
      processCounts,
      averageCompletionRate: statusCounts.Passed / (statusCounts.Passed + statusCounts.Failed + statusCounts["In Progress"]) || 0,
      averageFailureRate: statusCounts.Failed / (statusCounts.Passed + statusCounts.Failed + statusCounts["In Progress"]) || 0
    },
    stakeholdersByRole,
    stakeholderInvolvement,
    recentInspections,
    systemStats: {
      totalFarms: validFarmers.length,
      totalHerbs: linkedHerbs.length,
      totalTraces: validTraces.length,
      totalTransactions: validTransactions.length,
      cannabisPercentage,
      traditionalPercentage: 100 - cannabisPercentage,
      organicCertifiedFarms: validFarmers.filter(f => f.organicCertified).length,
      dataIntegrityScore: Math.round(((validTraces.length / traces.length) + (validFarmers.length / farmers.length) + (validTransactions.length / Object.keys(mockDatabase.transactions).length)) / 3 * 100)
    }
  };
};

// Enhanced system health check with data linking validation
export const performSystemHealthCheck = () => {
  const data = getDashboardData();
  const issues: string[] = [];
  const improvements: string[] = [];

  // Check data consistency and linking
  if (data.farmers.length === 0) issues.push("ไม่มีข้อมูลเกษตรกรที่เชื่อมโยงถูกต้องในระบบ");
  if (data.herbs.length === 0) issues.push("ไม่มีข้อมูลสมุนไพรที่เชื่อมโยงถูกต้องในระบบ");
  if (data.traces.length === 0) issues.push("ไม่มีข้อมูลการตรวจสอบย้อนกลับที่เชื่อมโยงถูกต้อง");
  
  // Check data integrity score
  const integrityScore = data.systemStats?.dataIntegrityScore || 0;
  if (integrityScore < 95) {
    improvements.push(`คะแนนความสมบูรณ์ของข้อมูล: ${integrityScore}% (ควรอยู่ที่ 95% ขึ้นไป)`);
  }

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
    status: issues.length === 0 ? "ระบบฐานข้อมูลมีสุขภาพดี - ข้อมูลเชื่อมโยงถูกต้อง 100%" : "พบปัญหาการเชื่อมโยงข้อมูลในระบบ",
    issues,
    improvements,
    timestamp: new Date().toISOString(),
    dataIntegrityScore: integrityScore,
    summary: {
      totalFarms: data.farmers.length,
      totalUsers: data.userStats.totalUsers,
      totalProcesses: data.processStats.totalProcesses,
      cannabisPercentage: data.systemStats?.cannabisPercentage || 0,
      linkedDataPercentage: integrityScore
    }
  };
};

console.log("🌿 Enhanced Thai Herbal Production Platform Database with Proper Linking initialized");
const healthCheck = performSystemHealthCheck();
console.log("📊 Database Health Check:", healthCheck.summary);
console.log(`🔗 Data Integrity Score: ${healthCheck.dataIntegrityScore}%`);
