import { UserRole } from "@/components/RoleSelector";
import { 
  generateMockUsers, mockUsers as generatedUsers,
  getUsersByMonth, getUsersByRole, getUsersByProvince, getUserActivityStats 
} from "./mockUserData";
import { 
  herbList, 
  Farmer, generateFarmers as originalGenerateFarmers,
  Trace, generateTraces as originalGenerateTraces,
  calculateStatusCounts
} from "./herbData";
import {
  Transaction,
  generateTransactions as originalGenerateTransactions,
  getTransactionTotals
} from "./marketplaceData";

// Unique identifier types for cross-referencing
export type UserId = string;
export type FarmerId = string;
export type HerbId = string;
export type TraceId = string;
export type TransactionId = string;
export type CertificationId = string;

// Create a consistent database with relationships between entities
export interface MockDatabase {
  users: Record<UserId, typeof generatedUsers[0]>;
  farmers: Record<FarmerId, Farmer & { userId?: UserId }>;
  herbs: Record<HerbId, typeof herbList[0] & { farmerId?: FarmerId }>;
  traces: Record<TraceId, Trace & { 
    herbId: HerbId;
    userId?: UserId;
  }>;
  transactions: Record<TransactionId, Transaction & {
    buyerId?: UserId;
    sellerId?: UserId;
    herbId?: HerbId;
  }>;
  certifications: Record<CertificationId, {
    id: CertificationId;
    type: "gapc" | "euGmp" | "dttm";
    status: "Passed" | "Failed" | "Pending" | "Expired";
    farmerId: FarmerId;
    issuerId?: UserId;
    issueDate: Date;
    expiryDate: Date;
    documentUrl?: string;
  }>;
}

// Generate relationships between entities
const createRelatedData = (): MockDatabase => {
  // Generate base entities
  const usersList = generatedUsers;
  const farmersList = originalGenerateFarmers(100);
  const tracesList = originalGenerateTraces(100);
  const transactionsList = originalGenerateTransactions(50);

  // Create indexed collections
  const users: MockDatabase['users'] = {};
  const farmers: MockDatabase['farmers'] = {};
  const herbs: MockDatabase['herbs'] = {};
  const traces: MockDatabase['traces'] = {};
  const transactions: MockDatabase['transactions'] = {};
  const certifications: MockDatabase['certifications'] = {};

  // Index users
  usersList.forEach(user => {
    users[user.id] = user;
  });

  // Connect farmers to users
  const farmerRoleUsers = Object.values(users).filter(user => user.role === 'farmer');
  
  farmersList.forEach((farmer, index) => {
    const farmerId = `F${String(index + 1).padStart(6, '0')}`;
    // Assign a real farmer user if available, otherwise keep as is
    const userId = index < farmerRoleUsers.length ? farmerRoleUsers[index].id : undefined;
    
    farmers[farmerId] = {
      ...farmer,
      id: farmerId,
      userId
    };
  });

  // Connect herbs to farmers
  const farmersArray = Object.values(farmers);
  herbList.forEach((herb, index) => {
    const herbId = `H${String(index + 1).padStart(6, '0')}`;
    // Assign to a random farmer
    const randomFarmerIndex = Math.floor(Math.random() * farmersArray.length);
    const farmerId = farmersArray[randomFarmerIndex].id;
    
    herbs[herbId] = {
      ...herb,
      id: herbId,
      farmerId
    };
  });

  // Connect traces to herbs and users
  const herbsArray = Object.values(herbs);
  const officerUsers = Object.values(users).filter(
    user => ['lab', 'ttm_officer', 'acfs_officer', 'customs_officer'].includes(user.role)
  );
  
  tracesList.forEach((trace, index) => {
    const traceId = `T${String(index + 1).padStart(6, '0')}`;
    // Assign to a random herb
    const randomHerbIndex = Math.floor(Math.random() * herbsArray.length);
    const herbId = herbsArray[randomHerbIndex].id;
    // Assign to a random officer if it's a verification event
    let userId = undefined;
    if (trace.event.includes('verification') || trace.event.includes('certified')) {
      const randomOfficerIndex = Math.floor(Math.random() * officerUsers.length);
      userId = officerUsers[randomOfficerIndex].id;
    }
    
    traces[traceId] = {
      ...trace,
      id: traceId,
      herbId,
      userId
    };
  });

  // Create certifications with references to farmers
  const certificationTypes: Array<"gapc" | "euGmp" | "dttm"> = ["gapc", "euGmp", "dttm"];
  const certStatuses: Array<"Passed" | "Failed" | "Pending" | "Expired"> = ["Passed", "Failed", "Pending", "Expired"];
  
  Object.values(farmers).forEach((farmer, fIndex) => {
    certificationTypes.forEach((certType, tIndex) => {
      // Not all farmers have all certification types
      if (Math.random() > 0.3) {
        const certId = `C${String(fIndex + 1).padStart(3, '0')}${tIndex + 1}`;
        // Weighted random status (more passed than others)
        const statusRandom = Math.random();
        const status = statusRandom > 0.7 ? "Passed" : 
                      statusRandom > 0.5 ? "Pending" : 
                      statusRandom > 0.3 ? "Failed" : "Expired";
        
        // Find an appropriate officer for this certification type
        let issuerId = undefined;
        const officerRole = certType === "gapc" ? "acfs_officer" : 
                           certType === "euGmp" ? "customs_officer" : "ttm_officer";
        const eligibleOfficers = Object.values(users).filter(u => u.role === officerRole);
        if (eligibleOfficers.length > 0) {
          issuerId = eligibleOfficers[Math.floor(Math.random() * eligibleOfficers.length)].id;
        }
        
        // Create issue and expiry dates
        const now = new Date();
        const issueDate = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000); // Up to 1 year ago
        const expiryDate = new Date(issueDate.getTime() + (365 + Math.floor(Math.random() * 365)) * 24 * 60 * 60 * 1000); // 1-2 years after issue
        
        certifications[certId] = {
          id: certId,
          type: certType,
          status,
          farmerId: farmer.id,
          issuerId,
          issueDate,
          expiryDate,
          documentUrl: Math.random() > 0.3 ? `https://example.com/cert/${certId}.pdf` : undefined
        };
      }
    });
  });

  // Connect transactions to herbs, buyers and sellers
  const consumerUsers = Object.values(users).filter(
    user => ['manufacturer', 'data_consumer'].includes(user.role)
  );
  
  transactionsList.forEach((transaction, index) => {
    const transactionId = `TX${String(index + 1).padStart(6, '0')}`;
    // Assign to a random herb
    const randomHerbIndex = Math.floor(Math.random() * herbsArray.length);
    const herb = herbsArray[randomHerbIndex];
    const herbId = herb.id;
    
    // The seller is either the farmer or a manufacturer (reselling)
    let sellerId = undefined;
    if (herb.farmerId && Math.random() > 0.3) {
      // Use the farmer that owns the herb
      if (farmers[herb.farmerId] && farmers[herb.farmerId].userId) {
        sellerId = farmers[herb.farmerId].userId;
      }
    } else {
      // Use a manufacturer as seller (reselling)
      const manufacturerUsers = Object.values(users).filter(u => u.role === 'manufacturer');
      if (manufacturerUsers.length > 0) {
        sellerId = manufacturerUsers[Math.floor(Math.random() * manufacturerUsers.length)].id;
      }
    }
    
    // Buyer is a consumer (manufacturer or data_consumer)
    let buyerId = undefined;
    if (consumerUsers.length > 0) {
      buyerId = consumerUsers[Math.floor(Math.random() * consumerUsers.length)].id;
    }
    
    transactions[transactionId] = {
      ...transaction,
      id: transactionId,
      herbId,
      buyerId,
      sellerId
    };
  });

  return {
    users,
    farmers,
    herbs,
    traces,
    transactions,
    certifications
  };
};

// Create our database singleton
export const mockDatabase = createRelatedData();

// Helper functions to get data with relationships intact
export const getUsersWithFarms = () => {
  return Object.values(mockDatabase.users).map(user => {
    // Find farms owned by this user
    const userFarms = Object.values(mockDatabase.farmers)
      .filter(farmer => farmer.userId === user.id);
    
    return {
      ...user,
      farms: userFarms
    };
  });
};

export const getFarmersWithCertifications = () => {
  return Object.values(mockDatabase.farmers).map(farmer => {
    // Find certifications for this farmer
    const farmerCertifications = Object.values(mockDatabase.certifications)
      .filter(cert => cert.farmerId === farmer.id);
    
    // Find owner user if exists
    const ownerUser = farmer.userId ? mockDatabase.users[farmer.userId] : undefined;
    
    return {
      ...farmer,
      certifications: farmerCertifications,
      owner: ownerUser
    };
  });
};

export const getHerbsWithTraces = () => {
  return Object.values(mockDatabase.herbs).map(herb => {
    // Find traces for this herb
    const herbTraces = Object.values(mockDatabase.traces)
      .filter(trace => trace.herbId === herb.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Find the farmer who grew this herb
    const farmer = herb.farmerId ? mockDatabase.farmers[herb.farmerId] : undefined;
    
    return {
      ...herb,
      traces: herbTraces,
      farmer
    };
  });
};

// Backward compatibility wrappers to ensure existing code works
export const generateFarmers = (count: number) => {
  return Object.values(mockDatabase.farmers).slice(0, count);
};

export const generateTraces = (count: number) => {
  return Object.values(mockDatabase.traces).slice(0, count);
};

export const generateTransactions = (count: number) => {
  return Object.values(mockDatabase.transactions).slice(0, count);
};

// Export the user data functions to maintain compatibility
export {
  getUsersByMonth,
  getUsersByRole,
  getUsersByProvince,
  getUserActivityStats
};

// Calculate certification status counts based on the certification records
export const getCertificationStatusCounts = (type: "gapc" | "euGmp" | "dttm") => {
  const certifications = Object.values(mockDatabase.certifications)
    .filter(cert => cert.type === type);
  
  const counts: Record<string, number> = {
    "Passed": 0,
    "Failed": 0,
    "Pending": 0,
    "Expired": 0
  };
  
  certifications.forEach(cert => {
    counts[cert.status]++;
  });
  
  return counts;
};

// Get certifications by user, useful for dashboard filtering
export const getCertificationsByUser = (userId: string) => {
  // Find all farms owned by this user
  const userFarms = Object.values(mockDatabase.farmers)
    .filter(farmer => farmer.userId === userId)
    .map(farmer => farmer.id);
  
  // Find all certifications for these farms
  return Object.values(mockDatabase.certifications)
    .filter(cert => userFarms.includes(cert.farmerId));
};

// Get transactions involving a specific user
export const getTransactionsByUser = (userId: string) => {
  return Object.values(mockDatabase.transactions)
    .filter(tx => tx.buyerId === userId || tx.sellerId === userId);
};

// Get all traces created or verified by a specific user
export const getTracesByUser = (userId: string) => {
  return Object.values(mockDatabase.traces)
    .filter(trace => trace.userId === userId);
};

// Enhanced dashboard data
export const getDashboardData = () => {
  // Get certification counts from the actual certification records
  const gapcStatus = getCertificationStatusCounts("gapc");
  const euGmpStatus = getCertificationStatusCounts("euGmp");
  const dttmStatus = getCertificationStatusCounts("dttm");
  
  // Get user statistics
  const userStats = getUserActivityStats();
  
  // Get recent traces with related entities
  const recentTraces = Object.values(mockDatabase.traces)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)
    .map(trace => {
      const herb = trace.herbId ? mockDatabase.herbs[trace.herbId] : undefined;
      const user = trace.userId ? mockDatabase.users[trace.userId] : undefined;
      
      return {
        ...trace,
        herbName: herb?.name || 'Unknown',
        verifiedBy: user?.fullName
      };
    });
  
  // Get transaction data with related entities
  const transactions = Object.values(mockDatabase.transactions)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)
    .map(tx => {
      const buyer = tx.buyerId ? mockDatabase.users[tx.buyerId] : undefined;
      const seller = tx.sellerId ? mockDatabase.users[tx.sellerId] : undefined;
      const herb = tx.herbId ? mockDatabase.herbs[tx.herbId] : undefined;
      
      return {
        ...tx,
        buyerName: buyer?.fullName || 'Anonymous',
        sellerName: seller?.fullName || 'Anonymous',
        herbName: herb?.name || 'Unknown'
      };
    });
  
  // Get transaction totals
  const { totalSales, pendingOrders } = getTransactionTotals(
    Object.values(mockDatabase.transactions)
  );
  
  return {
    farmers: Object.values(mockDatabase.farmers),
    traces: recentTraces,
    gapcStatus,
    euGmpStatus,
    dttmStatus,
    userStats,
    transactions,
    totalSales,
    pendingOrders
  };
};
