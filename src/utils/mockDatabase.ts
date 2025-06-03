
import { UserRole } from "@/components/RoleSelector";
import { 
  generateMockUsers, mockUsers as generatedUsers,
  getUsersByMonth, getUsersByRole, getUsersByProvince, getUserActivityStats 
} from "./mockUserData";
import { 
  herbList, 
  Farm, generateFarmers as originalGenerateFarmers,
  Trace, generateTraces as originalGenerateTraces,
  calculateStatusCounts
} from "./herbData";
import {
  MarketplaceTransaction as Transaction,
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

// Process status for herb inspection workflow
export type ProcessStatus = "Not Started" | "In Progress" | "Passed" | "Failed" | "Pending Review" | "Certified" | "Expired";

// Herb inspection processes
export type InspectionProcess = "Lab Testing" | "GACP Certification" | "EU-GMP Certification" | "DTTM Certification" | "Quality Control" | "Market Approval";

// Enhanced Herb type to fix type issues
export interface HerbData {
  id: string;
  name: string;
  farmerId?: string;
  englishName?: string;
  properties?: string[];
  activeCompounds?: string[];
  traditionalUses?: string[];
  scientificReferences?: string[];
}

// Enhanced Farm type with GACP certification
export interface EnhancedFarm extends Omit<Farm, 'id'> {
  id: string;
  userId?: UserId;
  gacp?: {
    status: "Passed" | "Failed" | "Pending" | "Expired";
    issueDate?: Date;
    expiryDate?: Date;
  };
}

// Enhanced Trace type to include additional properties with consistent farmId type
export interface EnhancedTrace {
  id: string;
  herbId: string;
  herb: string;
  event: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
  referenceCode?: string;
  farmId: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  qualityGrade: "A" | "B" | "C" | "Premium";
  userId?: string;
  herbName?: string;
  verifiedBy?: string;
  certifications: string[];
  // Additional optional properties from original Trace
  temperature?: number;
  humidity?: number;
  moistureLevel?: number;
  destinationName?: string;
  destinationContact?: string;
  transportMethod?: string;
  notes?: string;
}

// Herb properties and compound database
const herbProperties = {
  "ใบบัวบก": {
    englishName: "Gotu Kola",
    properties: ["Anti-inflammatory", "Wound healing", "Memory enhancement"],
    activeCompounds: ["Asiaticoside", "Madecassoside", "Asiatic acid"],
    traditionalUses: ["Skin conditions", "Cognitive function", "Longevity"],
    scientificReferences: ["Journal of Ethnopharmacology 2018", "Phytomedicine 2020"]
  },
  "ขมิ้น": {
    englishName: "Turmeric",
    properties: ["Anti-inflammatory", "Antioxidant", "Antimicrobial"],
    activeCompounds: ["Curcumin", "Demethoxycurcumin", "Bisdemethoxycurcumin"],
    traditionalUses: ["Digestive disorders", "Wound healing", "Joint pain"],
    scientificReferences: ["PLOS ONE 2019", "Journal of Medicinal Food 2021"]
  },
  "ขิง": {
    englishName: "Ginger",
    properties: ["Anti-nausea", "Anti-inflammatory", "Analgesic"],
    activeCompounds: ["Gingerol", "Shogaol", "Zingerone"],
    traditionalUses: ["Digestive aid", "Cold remedy", "Motion sickness"],
    scientificReferences: ["Food & Function 2019", "International Journal of Preventive Medicine 2020"]
  },
  "กระชาย": {
    englishName: "Lesser Galangal",
    properties: ["Antimicrobial", "Antioxidant", "Aphrodisiac"],
    activeCompounds: ["Flavonoids", "Terpenoids", "Phenolic compounds"],
    traditionalUses: ["Male vitality", "Immune support", "Respiratory health"],
    scientificReferences: ["Journal of Ethnopharmacology 2022", "Phytotherapy Research 2021"]
  }
};

// Create a consistent database with relationships between entities
export interface MockDatabase {
  users: Record<UserId, typeof generatedUsers[0]>;
  farmers: Record<FarmerId, EnhancedFarm>;
  herbs: Record<HerbId, HerbData>;
  traces: Record<TraceId, EnhancedTrace>;
  transactions: Record<TransactionId, Transaction & {
    id: string;
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
    previousProcess?: string;
    nextProcess?: string;
    results?: {
      passedCriteria: string[];
      failedCriteria: string[];
      measurements?: Record<string, number>;
      recommendedActions?: string[];
    };
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
  const inspectionProcesses: MockDatabase['inspectionProcesses'] = {};

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
    
    // Add GACP certification status
    const gacpStatuses: Array<"Passed" | "Failed" | "Pending" | "Expired"> = ["Passed", "Failed", "Pending", "Expired"];
    const gacpStatus = gacpStatuses[Math.floor(Math.random() * gacpStatuses.length)];
    
    farmers[farmerId] = {
      ...farmer,
      id: farmerId,
      userId,
      gacp: {
        status: gacpStatus,
        issueDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000)
      }
    };
  });

  // Connect herbs to farmers
  const farmersArray = Object.values(farmers);
  herbList.forEach((herb, index) => {
    const herbId = `H${String(index + 1).padStart(6, '0')}`;
    // Assign to a random farmer
    const randomFarmerIndex = Math.floor(Math.random() * farmersArray.length);
    const farmerId = farmersArray[randomFarmerIndex].id;
    
    // Add herb properties if available
    const herbData = herbProperties[herb as keyof typeof herbProperties];
    
    herbs[herbId] = {
      id: herbId,
      name: herb,
      farmerId,
      ...(herbData || {})
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
    
    // Find the farmer for this herb to get consistent farmId
    const herb = herbsArray[randomHerbIndex];
    const farmerId = herb.farmerId || farmersArray[0].id;
    
    traces[traceId] = {
      ...trace,
      id: traceId,
      herbId,
      userId,
      farmId: farmerId,
      herbName: herbsArray[randomHerbIndex].name,
      verifiedBy: userId ? users[userId]?.fullName : undefined
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

  // Create inspection processes to represent the complete workflow
  // This demonstrates how herbs go through multiple inspection stages
  const processTypes: InspectionProcess[] = [
    "Lab Testing", 
    "GACP Certification", 
    "EU-GMP Certification", 
    "DTTM Certification", 
    "Quality Control", 
    "Market Approval"
  ];
  
  // Create inspection processes for a subset of herbs (500 processes)
  const herbsForInspection = Object.values(herbs).slice(0, 100); // Use first 100 herbs
  
  let processCounter = 0;
  herbsForInspection.forEach(herb => {
    // Create a complete process chain for each herb
    let previousProcessId = undefined;
    
    processTypes.forEach((processType, processIndex) => {
      const processId = `P${String(processCounter + 1).padStart(6, '0')}`;
      processCounter++;
      
      // Determine process status based on position in chain
      // Earlier processes are more likely to be completed
      const progressChance = 1 - (processIndex / processTypes.length) * 0.7;
      const isStarted = Math.random() < progressChance + 0.2;
      
      if (!isStarted) {
        // Process not yet started
        inspectionProcesses[processId] = {
          id: processId,
          herbId: herb.id,
          farmerId: herb.farmerId || Object.keys(farmers)[0],
          processType,
          status: "Not Started",
          startDate: new Date(Date.now() + (processIndex * 7 * 24 * 60 * 60 * 1000)), // Future start date
          previousProcess: previousProcessId,
        };
      } else {
        // Process has started
        const completionRandom = Math.random();
        let status: ProcessStatus;
        let completionDate: Date | undefined;
        
        if (completionRandom > 0.7) {
          status = "Passed";
          completionDate = new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);
        } else if (completionRandom > 0.5) {
          status = "Failed";
          completionDate = new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);
        } else if (completionRandom > 0.3) {
          status = "In Progress";
          completionDate = undefined;
        } else {
          status = "Pending Review";
          completionDate = undefined;
        }
        
        // Find an appropriate inspector
        let inspectorId = undefined;
        if (processType === "Lab Testing") {
          const labUsers = Object.values(users).filter(u => u.role === 'lab');
          if (labUsers.length > 0) {
            inspectorId = labUsers[Math.floor(Math.random() * labUsers.length)].id;
          }
        } else if (processType === "GACP Certification") {
          const acfsOfficers = Object.values(users).filter(u => u.role === 'acfs_officer');
          if (acfsOfficers.length > 0) {
            inspectorId = acfsOfficers[Math.floor(Math.random() * acfsOfficers.length)].id;
          }
        } else if (processType === "EU-GMP Certification") {
          const customsOfficers = Object.values(users).filter(u => u.role === 'customs_officer');
          if (customsOfficers.length > 0) {
            inspectorId = customsOfficers[Math.floor(Math.random() * customsOfficers.length)].id;
          }
        } else {
          const ttmOfficers = Object.values(users).filter(u => u.role === 'ttm_officer');
          if (ttmOfficers.length > 0) {
            inspectorId = ttmOfficers[Math.floor(Math.random() * ttmOfficers.length)].id;
          }
        }
        
        // Create results for completed processes
        const results = (status === "Passed" || status === "Failed") ? {
          passedCriteria: [
            "Chemical composition within range",
            "No contaminants detected",
            "Proper moisture content"
          ],
          failedCriteria: status === "Failed" ? [
            "Heavy metal content exceeded limits",
            "Pesticide residue detected"
          ] : [],
          measurements: {
            moisture: Math.random() * 10 + 5,
            purity: Math.random() * 20 + 80,
            activeCompound: Math.random() * 5 + 2
          },
          recommendedActions: status === "Failed" ? [
            "Implement better soil management",
            "Review cultivation practices",
            "Resubmit after 3 months"
          ] : []
        } : undefined;
        
        inspectionProcesses[processId] = {
          id: processId,
          herbId: herb.id,
          farmerId: herb.farmerId || Object.keys(farmers)[0],
          processType,
          status,
          startDate: new Date(Date.now() - Math.floor(Math.random() * 120) * 24 * 60 * 60 * 1000),
          completionDate,
          inspectorId,
          notes: status === "Failed" ? "Does not meet required standards" : 
                status === "Passed" ? "All requirements satisfied" : 
                "Inspection in progress",
          previousProcess: previousProcessId,
          results
        };
      }
      
      // Update next process for the previous process
      if (previousProcessId && inspectionProcesses[previousProcessId]) {
        inspectionProcesses[previousProcessId].nextProcess = processId;
      }
      
      // Set current process as previous for the next iteration
      previousProcessId = processId;
    });
  });

  return {
    users,
    farmers,
    herbs,
    traces,
    transactions,
    certifications,
    inspectionProcesses
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

// Get the complete inspection process flow for a herb
export const getHerbInspectionFlow = (herbId: string) => {
  const processes = Object.values(mockDatabase.inspectionProcesses)
    .filter(process => process.herbId === herbId)
    .sort((a, b) => {
      const processOrder: Record<InspectionProcess, number> = {
        "Lab Testing": 1,
        "GACP Certification": 2,
        "EU-GMP Certification": 3,
        "DTTM Certification": 4,
        "Quality Control": 5,
        "Market Approval": 6
      };
      return processOrder[a.processType] - processOrder[b.processType];
    });
  
  return processes;
};

// Get all stakeholders involved in a herb's lifecycle
export const getHerbStakeholders = (herbId: string) => {
  const herb = mockDatabase.herbs[herbId];
  if (!herb) return [];
  
  const stakeholders: Array<{
    userId: string;
    role: UserRole;
    name: string;
    involvement: string;
    stage: string;
  }> = [];
  
  // Farmer
  if (herb.farmerId && mockDatabase.farmers[herb.farmerId].userId) {
    const farmerId = herb.farmerId;
    const userId = mockDatabase.farmers[farmerId].userId;
    if (userId && mockDatabase.users[userId]) {
      stakeholders.push({
        userId,
        role: mockDatabase.users[userId].role,
        name: mockDatabase.users[userId].fullName,
        involvement: "Cultivation",
        stage: "Production"
      });
    }
  }
  
  // Lab testers
  const labProcesses = Object.values(mockDatabase.inspectionProcesses)
    .filter(p => p.herbId === herbId && p.processType === "Lab Testing" && p.inspectorId);
  
  labProcesses.forEach(process => {
    if (process.inspectorId && mockDatabase.users[process.inspectorId]) {
      stakeholders.push({
        userId: process.inspectorId,
        role: mockDatabase.users[process.inspectorId].role,
        name: mockDatabase.users[process.inspectorId].fullName,
        involvement: "Lab Testing",
        stage: "Quality Assurance"
      });
    }
  });
  
  // Certification officers
  const certProcesses = Object.values(mockDatabase.inspectionProcesses)
    .filter(p => ["GACP Certification", "EU-GMP Certification", "DTTM Certification"].includes(p.processType) && p.inspectorId);
  
  certProcesses.forEach(process => {
    if (process.inspectorId && mockDatabase.users[process.inspectorId]) {
      stakeholders.push({
        userId: process.inspectorId,
        role: mockDatabase.users[process.inspectorId].role,
        name: mockDatabase.users[process.inspectorId].fullName,
        involvement: process.processType,
        stage: "Certification"
      });
    }
  });
  
  // Buyers (from transactions)
  const herbTransactions = Object.values(mockDatabase.transactions)
    .filter(tx => tx.herbId === herbId && tx.buyerId);
  
  herbTransactions.forEach(transaction => {
    if (transaction.buyerId && mockDatabase.users[transaction.buyerId]) {
      stakeholders.push({
        userId: transaction.buyerId,
        role: mockDatabase.users[transaction.buyerId].role,
        name: mockDatabase.users[transaction.buyerId].fullName,
        involvement: "Purchase",
        stage: "Distribution"
      });
    }
  });
  
  return stakeholders;
};

// Get total stakeholders by role
export const getStakeholdersByRole = () => {
  const stakeholderRoles: Record<UserRole, number> = {
    farmer: 0,
    lab: 0,
    manufacturer: 0,
    ttm_officer: 0,
    acfs_officer: 0,
    customs_officer: 0,
    admin: 0,
    data_consumer: 0,
    guest: 0
  };
  
  // Count active stakeholders (those involved in at least one process)
  const activeUserIds = new Set<string>();
  
  // From farmers
  Object.values(mockDatabase.farmers)
    .filter(farmer => farmer.userId)
    .forEach(farmer => {
      if (farmer.userId) activeUserIds.add(farmer.userId);
    });
  
  // From inspection processes
  Object.values(mockDatabase.inspectionProcesses)
    .filter(process => process.inspectorId)
    .forEach(process => {
      if (process.inspectorId) activeUserIds.add(process.inspectorId);
    });
  
  // From transactions
  Object.values(mockDatabase.transactions)
    .forEach(tx => {
      if (tx.buyerId) activeUserIds.add(tx.buyerId);
      if (tx.sellerId) activeUserIds.add(tx.sellerId);
    });
  
  // Count by role
  Array.from(activeUserIds).forEach(userId => {
    const user = mockDatabase.users[userId];
    if (user) {
      stakeholderRoles[user.role]++;
    }
  });
  
  return Object.entries(stakeholderRoles)
    .map(([role, count]) => ({ role, count }))
    .filter(item => item.count > 0);
};

// Get stakeholder involvement statistics
export const getStakeholderInvolvementStats = () => {
  const involvementStats: Record<string, number> = {
    "Production": 0,
    "Testing": 0,
    "Certification": 0,
    "Distribution": 0,
    "Consumption": 0,
    "Regulation": 0
  };
  
  // Count farmers in production
  Object.values(mockDatabase.farmers)
    .filter(farmer => farmer.userId)
    .forEach(() => {
      involvementStats["Production"]++;
    });
  
  // Count lab testers
  Object.values(mockDatabase.inspectionProcesses)
    .filter(p => p.processType === "Lab Testing" && p.inspectorId)
    .forEach(() => {
      involvementStats["Testing"]++;
    });
  
  // Count certification officers
  Object.values(mockDatabase.inspectionProcesses)
    .filter(p => ["GACP Certification", "EU-GMP Certification", "DTTM Certification"].includes(p.processType) && p.inspectorId)
    .forEach(() => {
      involvementStats["Certification"]++;
    });
  
  // Count regulatory officers
  Object.values(mockDatabase.users)
    .filter(user => ["ttm_officer", "acfs_officer", "customs_officer"].includes(user.role))
    .forEach(() => {
      involvementStats["Regulation"]++;
    });
  
  // Count distributors and consumers
  Object.values(mockDatabase.transactions).forEach(tx => {
    if (tx.sellerId) involvementStats["Distribution"]++;
    if (tx.buyerId) involvementStats["Consumption"]++;
  });
  
  return Object.entries(involvementStats)
    .map(([category, count]) => ({ category, count }));
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

// Get all inspection processes for herbs from a specific farmer
export const getInspectionProcessesByFarmer = (farmerId: string) => {
  return Object.values(mockDatabase.inspectionProcesses)
    .filter(process => process.farmerId === farmerId);
};

// Get process flow statistics
export const getProcessFlowStats = () => {
  const totalProcesses = Object.values(mockDatabase.inspectionProcesses).length;
  
  const statusCounts: Record<ProcessStatus, number> = {
    "Not Started": 0,
    "In Progress": 0,
    "Passed": 0,
    "Failed": 0,
    "Pending Review": 0,
    "Certified": 0,
    "Expired": 0
  };
  
  Object.values(mockDatabase.inspectionProcesses).forEach(process => {
    statusCounts[process.status]++;
  });
  
  const processCounts: Record<InspectionProcess, number> = {
    "Lab Testing": 0,
    "GACP Certification": 0,
    "EU-GMP Certification": 0,
    "DTTM Certification": 0,
    "Quality Control": 0,
    "Market Approval": 0
  };
  
  Object.values(mockDatabase.inspectionProcesses).forEach(process => {
    processCounts[process.processType]++;
  });
  
  return {
    totalProcesses,
    statusCounts,
    processCounts,
    averageCompletionRate: statusCounts["Passed"] / totalProcesses,
    averageFailureRate: statusCounts["Failed"] / totalProcesses
  };
};

// Enhanced dashboard data
export const getDashboardData = () => {
  // Get certification counts from the actual certification records
  const gapcStatus = getCertificationStatusCounts("gapc");
  const euGmpStatus = getCertificationStatusCounts("euGmp");
  const dttmStatus = getCertificationStatusCounts("dttm");
  
  // Get user statistics
  const userStats = getUserActivityStats();
  
  // Get process flow statistics
  const processStats = getProcessFlowStats();
  
  // Get stakeholder statistics
  const stakeholdersByRole = getStakeholdersByRole();
  const stakeholderInvolvement = getStakeholderInvolvementStats();
  
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
        verifiedBy: user?.fullName || undefined
      };
    });
  
  // Get transaction data with related entities
  const transactions = Object.values(mockDatabase.transactions)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
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
  
  // Get recent inspections with inspector details
  const recentInspections = Object.values(mockDatabase.inspectionProcesses)
    .sort((a, b) => {
      if (!a.completionDate && !b.completionDate) return 0;
      if (!a.completionDate) return -1;
      if (!b.completionDate) return 1;
      return b.completionDate.getTime() - a.completionDate.getTime();
    })
    .slice(0, 10)
    .map(inspection => {
      const herb = inspection.herbId ? mockDatabase.herbs[inspection.herbId] : undefined;
      const inspector = inspection.inspectorId ? mockDatabase.users[inspection.inspectorId] : undefined;
      
      return {
        ...inspection,
        herbName: herb?.name || 'Unknown',
        inspectorName: inspector?.fullName || 'System'
      };
    });
  
  return {
    farmers: Object.values(mockDatabase.farmers),
    traces: recentTraces,
    gapcStatus,
    euGmpStatus,
    dttmStatus,
    userStats,
    transactions,
    totalSales,
    pendingOrders,
    processStats,
    stakeholdersByRole,
    stakeholderInvolvement,
    recentInspections
  };
};
