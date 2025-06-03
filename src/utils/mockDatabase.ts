
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
export type ActivityId = string;
export type WeatherId = string;
export type FieldId = string;

// Process status for herb inspection workflow
export type ProcessStatus = "Not Started" | "In Progress" | "Passed" | "Failed" | "Pending Review" | "Certified" | "Expired";

// Herb inspection processes
export type InspectionProcess = "Lab Testing" | "GACP Certification" | "EU-GMP Certification" | "DTTM Certification" | "Quality Control" | "Market Approval";

// Cannabis-focused herb list (70% cannabis varieties)
const cannabisVarieties = [
  "กัญชาพันธุ์ไทย", "กัญชาเชียงใหม่", "กัญชาอีสาน", "กัญชาใต้", "กัญชากรุงเทพ",
  "กัญชาลาว", "กัญชาเขมร", "กัญชาพม่า", "กัญชาอินเดีย", "กัญชาเนปาล",
  "กัญชาCBD", "กัญชาTHC", "กัญชาไฮบริด", "กัญชาอินดิกา", "กัญชาซาติวา",
  "กัญชาทางการแพทย์", "กัญชาอุตสาหกรรม", "กัญชาเส้นใย", "กัญชาเมล็ด", "กัญชาใบ",
  "กัญชาน้ำมัน", "กัญชาครีม", "กัญชาผง", "กัญชาสกัด", "กัญชาต้นแห้ง"
];

const traditionalHerbs = [
  "ใบบัวบก", "ขมิ้น", "ขิง", "กระชาย", "ตะไคร้", "มะกรูด", "กะเพรา", 
  "โหระพา", "สะระแหน่", "ผักชี", "กระเทียม", "หอมแดง", "พริกไทย"
];

// Combined herb list with 70% cannabis
const enhancedHerbList = [
  ...cannabisVarieties,
  ...cannabisVarieties, // Duplicate to reach 70%
  ...cannabisVarieties.slice(0, 10), // Additional cannabis for 70%+
  ...traditionalHerbs
];

// Enhanced Herb type
export interface HerbData {
  id: string;
  name: string;
  farmerId?: string;
  englishName?: string;
  properties?: string[];
  activeCompounds?: string[];
  traditionalUses?: string[];
  scientificReferences?: string[];
  category: "cannabis" | "traditional";
  thcContent?: number; // For cannabis only
  cbdContent?: number; // For cannabis only
}

// Enhanced Farm type with detailed information
export interface EnhancedFarm extends Omit<Farm, 'id'> {
  id: string;
  userId?: UserId;
  fields: FieldId[];
  totalArea: number; // in rai
  cannabisLicense?: {
    number: string;
    issueDate: Date;
    expiryDate: Date;
    type: "medical" | "industrial" | "research";
  };
  gacp?: {
    status: "Passed" | "Failed" | "Pending" | "Expired";
    issueDate?: Date;
    expiryDate?: Date;
  };
}

// Field management interface
export interface Field {
  id: string;
  farmId: string;
  name: string;
  area: number; // in rai
  soilType: string;
  irrigationType: string;
  currentCrop?: string;
  plantingDate?: Date;
  expectedHarvestDate?: Date;
  coordinates: {
    lat: number;
    lng: number;
  }[];
}

// Farming activity interface
export interface FarmingActivity {
  id: string;
  farmId: string;
  fieldId?: string;
  herbId?: string;
  activityType: "planting" | "watering" | "fertilizing" | "pruning" | "harvesting" | "pest_control" | "soil_preparation" | "transplanting";
  date: Date;
  description: string;
  quantity?: number;
  unit?: string;
  cost?: number;
  laborHours?: number;
  equipmentUsed?: string[];
  notes?: string;
  weather?: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
}

// Weather data interface
export interface WeatherData {
  id: string;
  farmId: string;
  date: Date;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  humidity: number;
  rainfall: number;
  windSpeed: number;
  soilMoisture: number;
  uvIndex: number;
  notes?: string;
}

// Enhanced Trace type with farming activity links
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
  fieldId?: string;
  activityId?: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  qualityGrade: "A" | "B" | "C" | "Premium";
  userId?: string;
  herbName?: string;
  verifiedBy?: string;
  certifications: string[];
  temperature?: number;
  humidity?: number;
  moistureLevel?: number;
  destinationName?: string;
  destinationContact?: string;
  transportMethod?: string;
  notes?: string;
  thcLevel?: number; // For cannabis traces
  cbdLevel?: number; // For cannabis traces
}

// Enhanced database interface
export interface MockDatabase {
  users: Record<UserId, typeof generatedUsers[0]>;
  farmers: Record<FarmerId, EnhancedFarm>;
  fields: Record<FieldId, Field>;
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
    type: "gapc" | "euGmp" | "dttm" | "cannabis_license";
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
    fieldId?: FieldId;
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
  farmingActivities: Record<ActivityId, FarmingActivity>;
  weatherData: Record<WeatherId, WeatherData>;
}

// Generate Thai provinces for realistic location data
const thaiProvinces = [
  "เชียงใหม่", "เชียงราย", "น่าน", "แพร่", "แม่ฮ่องสอน", "ลำปาง", "ลำพูน", "อุตรดิตถ์",
  "นครราชสีมา", "บุรีรัมย์", "สุรินทร์", "ศรีสะเกษ", "อุบลราชธานี", "ยโสธร", "อำนาจเจริญ",
  "กาญจนบุรี", "ราชบุรี", "เพชรบุรี", "ประจวบคีรีขันธ์", "สุพรรณบุรี", "นครปฐม"
];

// Generate consistent database with 1000 farmers and 6000+ inspections
const createEnhancedDatabase = (): MockDatabase => {
  const users: MockDatabase['users'] = {};
  const farmers: MockDatabase['farmers'] = {};
  const fields: MockDatabase['fields'] = {};
  const herbs: MockDatabase['herbs'] = {};
  const traces: MockDatabase['traces'] = {};
  const transactions: MockDatabase['transactions'] = {};
  const certifications: MockDatabase['certifications'] = {};
  const inspectionProcesses: MockDatabase['inspectionProcesses'] = {};
  const farmingActivities: MockDatabase['farmingActivities'] = {};
  const weatherData: MockDatabase['weatherData'] = {};

  // Generate 1000+ users with proper roles
  const usersList = generateMockUsers(1200);
  usersList.forEach(user => {
    users[user.id] = user;
  });

  // Get farmers from users (ensure we have enough farmer-role users)
  const farmerUsers = Object.values(users).filter(u => u.role === 'farmer');
  
  // Generate 1000 farmers with linked user accounts
  for (let i = 1; i <= 1000; i++) {
    const farmerId = `F${String(i).padStart(6, '0')}`;
    const province = thaiProvinces[Math.floor(Math.random() * thaiProvinces.length)];
    
    // Link to user if available
    const userId = i <= farmerUsers.length ? farmerUsers[i - 1].id : undefined;
    
    // Generate cannabis license for 70% of farmers
    const hasCannabisLicense = Math.random() < 0.7;
    const cannabisLicense = hasCannabisLicense ? {
      number: `CNB-${province.substring(0, 2)}-${new Date().getFullYear()}-${String(i).padStart(4, '0')}`,
      issueDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + (1 + Math.random() * 2) * 365 * 24 * 60 * 60 * 1000),
      type: ["medical", "industrial", "research"][Math.floor(Math.random() * 3)] as "medical" | "industrial" | "research"
    } : undefined;

    const totalArea = Math.floor(Math.random() * 100) + 10; // 10-110 rai
    const numFields = Math.floor(Math.random() * 5) + 1; // 1-5 fields per farm
    const fieldIds: string[] = [];

    // Generate fields for this farm
    for (let f = 1; f <= numFields; f++) {
      const fieldId = `${farmerId}_FIELD_${f}`;
      fieldIds.push(fieldId);
      
      const fieldArea = totalArea / numFields;
      const fieldLat = 13 + Math.random() * 7;
      const fieldLng = 98 + Math.random() * 7;

      fields[fieldId] = {
        id: fieldId,
        farmId: farmerId,
        name: `แปลงที่ ${f}`,
        area: fieldArea,
        soilType: ["ดินร่วน", "ดินเหนียว", "ดินทราย", "ดินลูกรัง"][Math.floor(Math.random() * 4)],
        irrigationType: ["น้ำฝน", "สปริงเกอร์", "ดริป", "ท่วม"][Math.floor(Math.random() * 4)],
        coordinates: [
          { lat: fieldLat, lng: fieldLng },
          { lat: fieldLat + 0.001, lng: fieldLng },
          { lat: fieldLat + 0.001, lng: fieldLng + 0.001 },
          { lat: fieldLat, lng: fieldLng + 0.001 }
        ]
      };
    }

    farmers[farmerId] = {
      id: farmerId,
      name: `ฟาร์มกัญชา ${i}`,
      herb: hasCannabisLicense ? cannabisVarieties[Math.floor(Math.random() * cannabisVarieties.length)] : traditionalHerbs[Math.floor(Math.random() * traditionalHerbs.length)],
      gacp: {
        status: ["Passed", "Failed", "Pending", "Expired"][Math.floor(Math.random() * 4)] as any,
        issueDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000)
      },
      euGmp: ["Passed", "Failed", "Pending", "Expired"][Math.floor(Math.random() * 4)] as any,
      dttm: ["Passed", "Failed", "Pending", "Expired"][Math.floor(Math.random() * 4)] as any,
      tis: ["Passed", "Failed", "Pending", "Expired"][Math.floor(Math.random() * 4)] as any,
      location: {
        lat: 13 + Math.random() * 7,
        lng: 98 + Math.random() * 7
      },
      owner: {
        name: userId ? users[userId].fullName : `เกษตกร ${i}`,
        phoneNumber: `08${Math.floor(10000000 + Math.random() * 90000000)}`,
        email: `farmer${i}@example.com`,
        licenseNumber: `LIC-${i}`,
        registrationDate: new Date(2020 + Math.random() * 4, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString()
      },
      province,
      registrationNumber: `REG-${province}-${i}`,
      organicCertified: Math.random() > 0.5,
      lastInspectionDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      nextInspectionDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      fdaApproved: Math.random() > 0.3,
      cultivationArea: Math.floor(Math.random() * 50) + 1,
      establishedYear: 2015 + Math.floor(Math.random() * 8),
      userId,
      fields: fieldIds,
      totalArea,
      cannabisLicense
    };
  }

  // Generate herbs with proper categorization
  enhancedHerbList.forEach((herbName, index) => {
    const herbId = `H${String(index + 1).padStart(6, '0')}`;
    const isCannabis = cannabisVarieties.includes(herbName);
    
    // Assign to random farmer
    const farmersArray = Object.values(farmers);
    const randomFarmer = farmersArray[Math.floor(Math.random() * farmersArray.length)];
    
    herbs[herbId] = {
      id: herbId,
      name: herbName,
      farmerId: randomFarmer.id,
      category: isCannabis ? "cannabis" : "traditional",
      thcContent: isCannabis ? Math.random() * 25 : undefined, // 0-25% THC
      cbdContent: iscannabis ? Math.random() * 20 : undefined, // 0-20% CBD
      properties: isCanvas ? ["Pain Relief", "Anti-inflammatory", "Anxiety Relief"] : ["Traditional Medicine", "Herbal Tea"],
      activeCompounds: isCanvas ? ["THC", "CBD", "Terpenes"] : ["Natural Compounds"],
      traditionalUses: isCanvas ? ["Medical Cannabis", "Industrial Hemp"] : ["Traditional Thai Medicine"]
    };
  });

  // Generate 6000+ inspection processes
  const farmersArray = Object.values(farmers);
  const herbsArray = Object.values(herbs);
  const inspectorUsers = Object.values(users).filter(u => 
    ['lab', 'ttm_officer', 'acfs_officer', 'customs_officer'].includes(u.role)
  );

  for (let i = 1; i <= 6500; i++) {
    const processId = `P${String(i).padStart(6, '0')}`;
    const randomFarmer = farmersArray[Math.floor(Math.random() * farmersArray.length)];
    const randomHerb = herbsArray.filter(h => h.farmerId === randomFarmer.id)[0] || herbsArray[0];
    const randomField = randomFarmer.fields[Math.floor(Math.random() * randomFarmer.fields.length)];
    
    const processTypes: InspectionProcess[] = [
      "Lab Testing", "GACP Certification", "EU-GMP Certification", 
      "DTTM Certification", "Quality Control", "Market Approval"
    ];
    
    const processType = processTypes[Math.floor(Math.random() * processTypes.length)];
    const inspector = inspectorUsers[Math.floor(Math.random() * inspectorUsers.length)];
    
    const statuses: ProcessStatus[] = ["Passed", "Failed", "In Progress", "Pending Review"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    inspectionProcesses[processId] = {
      id: processId,
      herbId: randomHerb.id,
      farmerId: randomFarmer.id,
      fieldId: randomField,
      processType,
      status,
      startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      completionDate: status === "Passed" || status === "Failed" ? 
        new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
      inspectorId: inspector.id,
      notes: `ตรวจสอบ ${processType} สำหรับ ${randomHerb.name}`,
      results: status === "Passed" || status === "Failed" ? {
        passedCriteria: ["มาตรฐานคุณภาพ", "ความปลอดภัย", "การจัดเก็บ"],
        failedCriteria: status === "Failed" ? ["ระดับสารพิษเกินกำหนด"] : [],
        measurements: {
          moisture: Math.random() * 15 + 5,
          purity: Math.random() * 20 + 80,
          thc: randomHerb.category === "cannabis" ? Math.random() * 25 : 0,
          cbd: randomHerb.category === "cannabis" ? Math.random() * 20 : 0
        },
        recommendedActions: status === "Failed" ? ["ปรับปรุงกระบวนการ", "ตรวจสอบใหม่"] : []
      } : undefined
    };
  }

  // Generate farming activities (10+ activities per farm)
  let activityCounter = 1;
  farmersArray.forEach(farmer => {
    const numActivities = Math.floor(Math.random() * 20) + 10; // 10-30 activities per farm
    
    for (let a = 1; a <= numActivities; a++) {
      const activityId = `A${String(activityCounter).padStart(6, '0')}`;
      activityCounter++;
      
      const activityTypes: FarmingActivity['activityType'][] = [
        "planting", "watering", "fertilizing", "pruning", "harvesting", 
        "pest_control", "soil_preparation", "transplanting"
      ];
      
      const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const randomField = farmer.fields[Math.floor(Math.random() * farmer.fields.length)];
      const farmerHerbs = herbsArray.filter(h => h.farmerId === farmer.id);
      const randomHerb = farmerHerbs[Math.floor(Math.random() * farmerHerbs.length)];
      
      farmingActivities[activityId] = {
        id: activityId,
        farmId: farmer.id,
        fieldId: randomField,
        herbId: randomHerb?.id,
        activityType,
        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        description: `${activityType} สำหรับ ${randomHerb?.name || 'พืช'}`,
        quantity: Math.floor(Math.random() * 100) + 1,
        unit: ["กิโลกรัม", "ลิตร", "ถุง", "ต้น"][Math.floor(Math.random() * 4)],
        cost: Math.floor(Math.random() * 5000) + 500,
        laborHours: Math.floor(Math.random() * 8) + 1,
        equipmentUsed: ["จอบ", "รดน้ำ", "ปุ่ย", "เครื่องตัด"].slice(0, Math.floor(Math.random() * 3) + 1),
        notes: `กิจกรรม ${activityType} เสร็จสิ้น`,
        weather: {
          temperature: Math.floor(Math.random() * 10) + 25,
          humidity: Math.floor(Math.random() * 30) + 60,
          rainfall: Math.random() * 50
        }
      };
    }
  });

  // Generate weather data (daily data for past year)
  let weatherCounter = 1;
  farmersArray.forEach(farmer => {
    const daysBack = 365;
    
    for (let d = 0; d < daysBack; d++) {
      const weatherId = `W${String(weatherCounter).padStart(6, '0')}`;
      weatherCounter++;
      
      const date = new Date(Date.now() - d * 24 * 60 * 60 * 1000);
      const temp = 25 + Math.random() * 10; // 25-35°C
      
      weatherData[weatherId] = {
        id: weatherId,
        farmId: farmer.id,
        date,
        temperature: {
          min: temp - 5,
          max: temp + 5,
          avg: temp
        },
        humidity: Math.floor(Math.random() * 40) + 50, // 50-90%
        rainfall: Math.random() * 100, // 0-100mm
        windSpeed: Math.random() * 20, // 0-20 km/h
        soilMoisture: Math.random() * 100, // 0-100%
        uvIndex: Math.floor(Math.random() * 11), // 0-10
        notes: Math.random() > 0.9 ? "สภาพอากาศผิดปกติ" : undefined
      };
    }
  });

  // Generate traces linked to activities
  let traceCounter = 1;
  Object.values(farmingActivities).forEach(activity => {
    if (Math.random() > 0.3) { // 70% of activities generate traces
      const traceId = `T${String(traceCounter).padStart(6, '0')}`;
      traceCounter++;
      
      const farmer = farmers[activity.farmId];
      const herb = activity.herbId ? herbs[activity.herbId] : undefined;
      
      traces[traceId] = {
        id: traceId,
        herbId: herb?.id || '',
        herb: herb?.name || 'ไม่ระบุ',
        event: activity.activityType,
        timestamp: activity.date.toISOString(),
        location: farmer.location,
        referenceCode: `REF-${traceId}`,
        farmId: farmer.id,
        fieldId: activity.fieldId,
        activityId: activity.id,
        batchNumber: `BATCH-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        quantity: activity.quantity || Math.floor(Math.random() * 100),
        unit: activity.unit || "กิโลกรัม",
        qualityGrade: ["A", "B", "C", "Premium"][Math.floor(Math.random() * 4)] as any,
        userId: farmer.userId,
        herbName: herb?.name,
        verifiedBy: farmer.userId ? users[farmer.userId]?.fullName : undefined,
        certifications: ["GACP", "Organic Thailand"],
        thcLevel: herb?.category === "cannabis" ? herb.thcContent : undefined,
        cbdLevel: herb?.category === "cannabis" ? herb.cbdContent : undefined,
        temperature: activity.weather?.temperature,
        humidity: activity.weather?.humidity,
        notes: activity.notes
      };
    }
  });

  // Generate certifications
  let certCounter = 1;
  farmersArray.forEach(farmer => {
    const certTypes: Array<"gapc" | "euGmp" | "dttm" | "cannabis_license"> = 
      ["gapc", "euGmp", "dttm"];
    
    if (farmer.cannabisLicense) {
      certTypes.push("cannabis_license");
    }
    
    certTypes.forEach(certType => {
      if (Math.random() > 0.2) { // 80% chance of having each certification
        const certId = `C${String(certCounter).padStart(6, '0')}`;
        certCounter++;
        
        certifications[certId] = {
          id: certId,
          type: certType,
          status: ["Passed", "Failed", "Pending", "Expired"][Math.floor(Math.random() * 4)] as any,
          farmerId: farmer.id,
          issuerId: inspectorUsers[Math.floor(Math.random() * inspectorUsers.length)].id,
          issueDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
          documentUrl: `https://example.com/cert/${certId}.pdf`
        };
      }
    });
  });

  // Generate transactions
  let txCounter = 1;
  const consumerUsers = Object.values(users).filter(u => 
    ['manufacturer', 'data_consumer'].includes(u.role)
  );
  
  for (let i = 1; i <= 500; i++) {
    const txId = `TX${String(txCounter).padStart(6, '0')}`;
    txCounter++;
    
    const randomHerb = herbsArray[Math.floor(Math.random() * herbsArray.length)];
    const seller = randomHerb.farmerId ? farmers[randomHerb.farmerId] : undefined;
    const buyer = consumerUsers[Math.floor(Math.random() * consumerUsers.length)];
    
    transactions[txId] = {
      id: txId,
      herbId: randomHerb.id,
      buyerId: buyer.id,
      sellerId: seller?.userId,
      productName: randomHerb.name,
      quantity: Math.floor(Math.random() * 1000) + 10,
      unit: "กิโลกรัม",
      pricePerUnit: Math.floor(Math.random() * 500) + 50,
      totalAmount: 0, // Will be calculated
      timestamp: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      status: ["completed", "pending", "cancelled"][Math.floor(Math.random() * 3)] as any,
      paymentMethod: ["bank_transfer", "cash", "crypto"][Math.floor(Math.random() * 3)] as any,
      location: seller?.location || { lat: 13.7563, lng: 100.5018 },
      notes: `ขาย ${randomHerb.name} คุณภาพดี`
    };
    
    // Calculate total amount
    transactions[txId].totalAmount = transactions[txId].quantity * transactions[txId].pricePerUnit;
  }

  return {
    users,
    farmers,
    fields,
    herbs,
    traces,
    transactions,
    certifications,
    inspectionProcesses,
    farmingActivities,
    weatherData
  };
};

// Create our enhanced database singleton
export const mockDatabase = createEnhancedDatabase();

// Export functions for backward compatibility and new functionality
export const getDashboardData = () => {
  const farmers = Object.values(mockDatabase.farmers);
  const traces = Object.values(mockDatabase.traces).slice(0, 50);
  
  // Calculate certification status counts
  const gapcStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0 };
  const euGmpStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0 };
  const dttmStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0 };
  
  farmers.forEach(farmer => {
    gapcStatus[farmer.gacp?.status || "Pending"]++;
    euGmpStatus[farmer.euGmp]++;
    dttmStatus[farmer.dttm]++;
  });

  return {
    farmers,
    traces,
    gapcStatus,
    euGmpStatus,
    dttmStatus,
    userStats: getUserActivityStats(),
    transactions: Object.values(mockDatabase.transactions).slice(0, 10),
    totalSales: Object.values(mockDatabase.transactions)
      .filter(tx => tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.totalAmount, 0),
    pendingOrders: Object.values(mockDatabase.transactions)
      .filter(tx => tx.status === 'pending').length,
    processStats: {
      totalProcesses: Object.keys(mockDatabase.inspectionProcesses).length,
      statusCounts: {} as any,
      processCounts: {} as any,
      averageCompletionRate: 0.75,
      averageFailureRate: 0.15
    },
    stakeholdersByRole: [],
    stakeholderInvolvement: [],
    recentInspections: Object.values(mockDatabase.inspectionProcesses).slice(0, 10)
  };
};

// Export enhanced types and functions
export type { EnhancedTrace, EnhancedFarm, HerbData, FarmingActivity, WeatherData, Field };

// Backward compatibility exports
export { getUsersByMonth, getUsersByRole, getUsersByProvince, getUserActivityStats };

export const generateFarmers = (count: number) => Object.values(mockDatabase.farmers).slice(0, count);
export const generateTraces = (count: number) => Object.values(mockDatabase.traces).slice(0, count);
export const generateTransactions = (count: number) => Object.values(mockDatabase.transactions).slice(0, count);

// New cannabis-specific functions
export const getCannabisStatistics = () => {
  const allHerbs = Object.values(mockDatabase.herbs);
  const cannabisHerbs = allHerbs.filter(h => h.category === "cannabis");
  const traditionalHerbs = allHerbs.filter(h => h.category === "traditional");
  
  return {
    totalHerbs: allHerbs.length,
    cannabisCount: cannabisHerbs.length,
    traditionalCount: traditionalHerbs.length,
    cannabisPercentage: (cannabisHerbs.length / allHerbs.length) * 100,
    averageThc: cannabisHerbs.reduce((sum, h) => sum + (h.thcContent || 0), 0) / cannabisHerbs.length,
    averageCbd: cannabisHerbs.reduce((sum, h) => sum + (h.cbdContent || 0), 0) / cannabisHerbs.length
  };
};

export const getFarmingActivitiesByFarm = (farmId: string) => {
  return Object.values(mockDatabase.farmingActivities)
    .filter(activity => activity.farmId === farmId)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const getWeatherDataByFarm = (farmId: string, days: number = 30) => {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return Object.values(mockDatabase.weatherData)
    .filter(weather => weather.farmId === farmId && weather.date >= cutoffDate)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const getFieldsByFarm = (farmId: string) => {
  const farmer = mockDatabase.farmers[farmId];
  if (!farmer) return [];
  
  return farmer.fields.map(fieldId => mockDatabase.fields[fieldId]).filter(Boolean);
};
