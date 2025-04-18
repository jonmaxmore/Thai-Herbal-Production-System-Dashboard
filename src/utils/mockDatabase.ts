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
export type LaboratoryId = string;
export type SampleId = string;
export type InspectionId = string;

// List of economic herbs as per new requirements
export const economicHerbs = [
  "กัญชา", 
  "กระชายดำ", 
  "ขมิ้นชัน", 
  "บัวบก", 
  "ฟ้าทะลายโจร", 
  "กระชาย"
];

// Process status for herb inspection workflow
export type ProcessStatus = 
  "รอดำเนินการ" | 
  "อยู่ระหว่างดำเนินการ" | 
  "ผ่าน" | 
  "ไม่ผ่าน" | 
  "รอการตรวจสอบ" | 
  "ได้รับการรับรอง" | 
  "หมดอายุ";

// Herb inspection processes
export type InspectionProcess = 
  "การทดสอบในห้องปฏิบัติการ" | 
  "การรับรอง GACP" | 
  "การรับรอง EU-GMP" | 
  "การรับรอง DTTM" | 
  "การควบคุมคุณภาพ" | 
  "การอนุมัติการตลาด";

// Stakeholder organizations
export type StakeholderOrganization = 
  "กรมแพทย์แผนไทยและการแพทย์ทางเลือก" | 
  "มกอช." | 
  "เกษตรกร" | 
  "ห้องปฏิบัติการ" |
  "ผู้พัฒนาแพลตฟอร์ม";

// Create a consistent database with relationships between entities
export interface MockDatabase {
  users: Record<UserId, typeof generatedUsers[0]>;
  farmers: Record<FarmerId, Farm & { 
    userId?: UserId;
    herbs?: HerbId[];
    certifications?: CertificationId[];
  }>;
  herbs: Record<HerbId, {
    id: HerbId;
    name: string;
    farmerId?: FarmerId;
    englishName?: string;
    properties?: string[];
    activeCompounds?: string[];
    traditionalUses?: string[];
    scientificReferences?: string[];
    cultivationDate?: Date;
    harvestDate?: Date;
    productionArea?: number;
    yield?: number;
    qualityScore?: number;
    isEconomicHerb: boolean;
  }>;
  traces: Record<TraceId, Trace & { 
    id: string;
    herbId: HerbId;
    userId?: UserId;
    timestamp: Date;
    event: string;
    location?: string;
    herbName?: string;
    verifiedBy?: string;
    referenceCode?: string;
  }>;
  transactions: Record<TransactionId, Transaction & {
    id: string;
    buyerId?: UserId;
    sellerId?: UserId;
    herbId?: HerbId;
    timestamp: Date;
    amount: number;
    price: number;
    status: string;
    paymentMethod?: string;
    buyerName?: string;
    sellerName?: string;
    herbName?: string;
  }>;
  certifications: Record<CertificationId, {
    id: CertificationId;
    type: "gacp" | "euGmp" | "dttm";
    status: "ผ่าน" | "ไม่ผ่าน" | "รอดำเนินการ" | "หมดอายุ";
    farmerId: FarmerId;
    issuerId?: UserId;
    issueDate: Date;
    expiryDate: Date;
    documentUrl?: string;
    issuerOrganization?: StakeholderOrganization;
  }>;
  laboratorySamples: Record<SampleId, {
    id: SampleId;
    herbId: HerbId;
    farmerId: FarmerId;
    collectionDate: Date;
    sampleType: string;
    status: "รอการวิเคราะห์" | "กำลังวิเคราะห์" | "วิเคราะห์เสร็จสิ้น";
    laboratoryId: LaboratoryId;
    resultsId?: string;
  }>;
  laboratoryResults: Record<string, {
    id: string;
    sampleId: SampleId;
    testDate: Date;
    completionDate?: Date;
    analysisType: string[];
    results: Record<string, number | string>;
    passedCriteria: string[];
    failedCriteria: string[];
    overallResult: "ผ่าน" | "ไม่ผ่าน";
    analystId?: UserId;
    recommendations?: string[];
    nextSteps?: string;
  }>;
  laboratories: Record<LaboratoryId, {
    id: LaboratoryId;
    name: string;
    location: string;
    certifications: string[];
    specialties: string[];
    contactInfo: {
      email: string;
      phone: string;
      website?: string;
    };
    staffIds: UserId[];
  }>;
  inspectionProcesses: Record<InspectionId, {
    id: InspectionId;
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
    inspectorOrganization?: StakeholderOrganization;
    results?: {
      passedCriteria: string[];
      failedCriteria: string[];
      measurements?: Record<string, number>;
      recommendedActions?: string[];
    };
  }>;
  stakeholders: Record<string, {
    id: string;
    organization: StakeholderOrganization;
    role: string;
    interest: string;
    influence: "High" | "Medium" | "Low";
    contactPerson?: string;
    contactInfo?: {
      email: string;
      phone: string;
    };
    userIds?: UserId[];
  }>;
}

// Herb properties and compound database
const herbProperties = {
  "กัญชา": {
    englishName: "Cannabis",
    properties: ["Analgesic", "Anti-inflammatory", "Antiemetic"],
    activeCompounds: ["THC", "CBD", "CBN", "Terpenes"],
    traditionalUses: ["Pain management", "Nausea relief", "Appetite stimulation"],
    scientificReferences: ["Journal of Pain Research 2021", "European Journal of Pharmacology 2019"]
  },
  "กระชายดำ": {
    englishName: "Black Ginger",
    properties: ["Antioxidant", "Anti-inflammatory", "Adaptogenic"],
    activeCompounds: ["Polymethoxyflavones", "Flavonoids", "Kaempferol"],
    traditionalUses: ["Male vitality", "Energy enhancement", "Circulation improvement"],
    scientificReferences: ["Journal of Ethnopharmacology 2020", "BMC Complementary Medicine 2018"]
  },
  "ขมิ้นชัน": {
    englishName: "Turmeric",
    properties: ["Anti-inflammatory", "Antioxidant", "Antimicrobial"],
    activeCompounds: ["Curcumin", "Demethoxycurcumin", "Bisdemethoxycurcumin"],
    traditionalUses: ["Digestive disorders", "Wound healing", "Joint pain"],
    scientificReferences: ["PLOS ONE 2019", "Journal of Medicinal Food 2021"]
  },
  "บัวบก": {
    englishName: "Gotu Kola",
    properties: ["Anti-inflammatory", "Wound healing", "Memory enhancement"],
    activeCompounds: ["Asiaticoside", "Madecassoside", "Asiatic acid"],
    traditionalUses: ["Skin conditions", "Cognitive function", "Longevity"],
    scientificReferences: ["Journal of Ethnopharmacology 2018", "Phytomedicine 2020"]
  },
  "ฟ้าทะลายโจร": {
    englishName: "Andrographis",
    properties: ["Antiviral", "Immunomodulatory", "Anti-inflammatory"],
    activeCompounds: ["Andrographolide", "Neoandrographolide", "Diterpene lactones"],
    traditionalUses: ["Common cold", "Throat infections", "Inflammatory conditions"],
    scientificReferences: ["Pharmaceuticals 2020", "Journal of Clinical Pharmacy and Therapeutics 2021"]
  },
  "กระชาย": {
    englishName: "Lesser Galangal",
    properties: ["Antimicrobial", "Antioxidant", "Aphrodisiac"],
    activeCompounds: ["Flavonoids", "Terpenoids", "Phenolic compounds"],
    traditionalUses: ["Male vitality", "Immune support", "Respiratory health"],
    scientificReferences: ["Journal of Ethnopharmacology 2022", "Phytotherapy Research 2021"]
  }
};

// Generate a laboratory database
const generateLaboratories = (count: number) => {
  const laboratories: Record<string, any> = {};
  
  const labNames = [
    "ห้องปฏิบัติการกลางกรมแพทย์แผนไทย",
    "ศูนย์วิเคราะห์คุณภาพสมุนไพรแห่งชาติ",
    "ห้องปฏิบัติการคณะเภสัชศาสตร์ มหาวิทยาลัยมหิดล",
    "ห้องปฏิบัติการวิจัยสมุนไพร จุฬาลงกรณ์มหาวิทยาลัย",
    "ศูนย์ทดสอบผลิตภัณฑ์สมุนไพร กรมวิทยาศาสตร์การแพทย์"
  ];
  
  const labSpecialties = [
    ["การทดสอบสารสำคัญในสมุนไพร", "การตรวจสอบสารปนเปื้อน"],
    ["การวิเคราะห์โลหะหนัก", "การตรวจสอบยาฆ่าแมลง", "การหาปริมาณสารสำคัญ"],
    ["การวิเคราะห์คุณภาพน้ำมันหอมระเหย", "การทดสอบฤทธิ์ต้านอนุมูลอิสระ"],
    ["การพัฒนาวิธีวิเคราะห์สมุนไพร", "การตรวจสอบความเป็นพิษ"],
    ["การตรวจสอบจุลินทรีย์ก่อโรค", "การวิเคราะห์สารสกัดสมุนไพร"]
  ];
  
  const labCertifications = [
    ["ISO/IEC 17025", "GLP"],
    ["ISO 9001", "ISO/IEC 17025", "OECD GLP"],
    ["ISO/IEC 17025", "มาตรฐานห้องปฏิบัติการทดสอบกระทรวงสาธารณสุข"],
    ["ISO/IEC 17025"],
    ["ISO 9001", "ISO/IEC 17025", "ห้องปฏิบัติการอ้างอิงด้านสมุนไพร"]
  ];
  
  const locations = [
    "กรุงเทพมหานคร",
    "นนทบุรี",
    "กรุงเทพมหานคร",
    "กรุงเทพมหานคร",
    "นนทบุรี"
  ];
  
  for (let i = 0; i < Math.min(count, labNames.length); i++) {
    const labId = `LAB${String(i + 1).padStart(3, '0')}`;
    
    laboratories[labId] = {
      id: labId,
      name: labNames[i],
      location: locations[i],
      certifications: labCertifications[i],
      specialties: labSpecialties[i],
      contactInfo: {
        email: `contact@${labNames[i].toLowerCase().replace(/\s+/g, '')}.go.th`,
        phone: `02-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        website: `https://www.${labNames[i].toLowerCase().replace(/\s+/g, '')}.go.th`
      },
      staffIds: []
    };
  }
  
  return laboratories;
};

// Generate stakeholders based on the provided information
const generateStakeholders = () => {
  const stakeholders: Record<string, any> = {};
  
  const stakeholderData = [
    {
      id: "STK001",
      organization: "กรมแพทย์แผนไทยและการแพทย์ทางเลือก" as StakeholderOrganization,
      role: "ผู้ใช้งานหลัก รับข้อมูลและนำไปใช้กำกับดูแลมาตรฐานสมุนไพร",
      interest: "การใช้งานระบบและมาตรฐานคุณภาพ",
      influence: "High" as const,
      contactPerson: "ดร.สมชาย นวลสุธา",
      contactInfo: {
        email: "contact@dtam.go.th",
        phone: "02-149-5555"
      }
    },
    {
      id: "STK002",
      organization: "มกอช." as StakeholderOrganization,
      role: "ถ่ายทอดองค์ความรู้และประเมินตามมาตรฐาน",
      interest: "ถ่ายทอดมาตรฐานปฏิบัติ",
      influence: "Medium" as const,
      contactPerson: "ดร.วรรณา ตรีวิทย์",
      contactInfo: {
        email: "contact@acfs.go.th",
        phone: "02-561-2277"
      }
    },
    {
      id: "STK003",
      organization: "เกษตรกร" as StakeholderOrganization,
      role: "ปลูกและจัดหาข้อมูลวัตถุดิบ",
      interest: "รายได้และความยั่งยืน",
      influence: "Medium" as const
    },
    {
      id: "STK004",
      organization: "ห้องปฏิบัติการ" as StakeholderOrganization,
      role: "วิเคราะห์และทดสอบตัวอย่างสมุนไพร",
      interest: "ความแม่นยำของผลทดสอบ",
      influence: "Medium" as const
    },
    {
      id: "STK005",
      organization: "ผู้พัฒนาแพลตฟอร์ม" as StakeholderOrganization,
      role: "พัฒนา ดูแลระบบ hosting, API, support",
      interest: "เสถียรภาพและประสิทธิภาพของระบบ",
      influence: "High" as const,
      contactPerson: "นายนวัตกรรม ดิจิตอล",
      contactInfo: {
        email: "contact@platform.co.th",
        phone: "02-999-8888"
      }
    }
  ];
  
  stakeholderData.forEach(stakeholder => {
    stakeholders[stakeholder.id] = stakeholder;
  });
  
  return stakeholders;
};

// Generate relationships between entities
const createRelatedData = (): MockDatabase => {
  // Generate base entities
  const usersList = generatedUsers;
  const farmersList = originalGenerateFarmers(100);
  const tracesList: any[] = [];
  const transactionsList: any[] = [];

  // Create indexed collections
  const users: MockDatabase['users'] = {};
  const farmers: MockDatabase['farmers'] = {};
  const herbs: MockDatabase['herbs'] = {};
  const traces: MockDatabase['traces'] = {};
  const transactions: MockDatabase['transactions'] = {};
  const certifications: MockDatabase['certifications'] = {};
  const inspectionProcesses: MockDatabase['inspectionProcesses'] = {};
  const laboratories = generateLaboratories(5);
  const stakeholders = generateStakeholders();
  const laboratorySamples: MockDatabase['laboratorySamples'] = {};
  const laboratoryResults: MockDatabase['laboratoryResults'] = {};

  // Index users
  usersList.forEach(user => {
    users[user.id] = user;
  });

  // Assign users to stakeholder organizations
  Object.values(stakeholders).forEach(stakeholder => {
    stakeholder.userIds = [];
    
    // Find users based on roles that match the stakeholder organization
    Object.values(users).forEach(user => {
      if (
        (stakeholder.organization === "กรมแพทย์แผนไทยและการแพทย์ทางเลือก" && user.role === "ttm_officer") ||
        (stakeholder.organization === "มกอช." && user.role === "acfs_officer") ||
        (stakeholder.organization === "เกษตรกร" && user.role === "farmer") ||
        (stakeholder.organization === "ห้องปฏิบัติการ" && user.role === "lab") ||
        (stakeholder.organization === "ผู้พัฒนาแพลตฟอร์ม" && user.role === "admin")
      ) {
        stakeholder.userIds.push(user.id);
      }
    });
  });
  
  // Assign lab staff
  Object.values(laboratories).forEach(lab => {
    const labUsers = Object.values(users).filter(user => user.role === "lab");
    // Randomly assign some lab users to each laboratory
    lab.staffIds = labUsers
      .filter(() => Math.random() > 0.7)
      .map(user => user.id);
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
      userId,
      herbs: [],
      certifications: []
    };
  });

  // Create herbs with a focus on economic herbs
  const allHerbs = [...economicHerbs, ...herbList.filter(herb => !economicHerbs.includes(herb))];
  const farmersArray = Object.values(farmers);
  
  allHerbs.forEach((herbName, index) => {
    const herbId = `H${String(index + 1).padStart(6, '0')}`;
    // Assign to a random farmer
    const randomFarmerIndex = Math.floor(Math.random() * farmersArray.length);
    const farmerId = farmersArray[randomFarmerIndex].id;
    
    // Add herb to farmer's list
    if (farmers[farmerId].herbs) {
      farmers[farmerId].herbs!.push(herbId);
    } else {
      farmers[farmerId].herbs = [herbId];
    }
    
    // Add herb properties if available
    const herbData = herbProperties[herbName as keyof typeof herbProperties];
    const isEconomicHerb = economicHerbs.includes(herbName);
    
    // Create cultivation and harvest dates
    const now = new Date();
    const cultivationDate = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const harvestDate = new Date(cultivationDate.getTime() + (30 + Math.random() * 60) * 24 * 60 * 60 * 1000);
    
    herbs[herbId] = {
      id: herbId,
      name: herbName,
      farmerId,
      isEconomicHerb,
      cultivationDate,
      harvestDate,
      productionArea: Math.round(Math.random() * 10 + 1), // 1-10 rai
      yield: Math.round(Math.random() * 500 + 100), // 100-600 kg
      qualityScore: Math.round(Math.random() * 50 + 50), // 50-100%
      ...(herbData || {})
    };
  });

  // Create certifications with references to farmers
  const certificationTypes: Array<"gacp" | "euGmp" | "dttm"> = ["gacp", "euGmp", "dttm"];
  const certStatuses: Array<"ผ่าน" | "ไม่ผ่าน" | "รอดำเนินการ" | "หมดอายุ"> = ["ผ่าน", "ไม่ผ่าน", "รอดำเนินการ", "หมดอายุ"];
  
  Object.values(farmers).forEach((farmer, fIndex) => {
    certificationTypes.forEach((certType, tIndex) => {
      // Not all farmers have all certification types, but economic herb farmers are more likely to have certifications
      const hasEconomicHerbs = farmer.herbs?.some(herbId => herbs[herbId]?.isEconomicHerb) || false;
      if (Math.random() > (hasEconomicHerbs ? 0.2 : 0.7)) {
        const certId = `C${String(fIndex + 1).padStart(3, '0')}${tIndex + 1}`;
        
        // Weighted random status (more "ผ่าน" for economic herbs)
        const statusRandom = Math.random();
        let status: "ผ่าน" | "ไม่ผ่าน" | "รอดำเนินการ" | "หมดอายุ";
        
        if (hasEconomicHerbs) {
          status = statusRandom > 0.6 ? "ผ่าน" : 
                  statusRandom > 0.4 ? "รอดำเนินการ" : 
                  statusRandom > 0.2 ? "ไม่ผ่าน" : "หมดอายุ";
        } else {
          status = statusRandom > 0.7 ? "ผ่าน" : 
                  statusRandom > 0.5 ? "รอดำเนินการ" : 
                  statusRandom > 0.3 ? "ไม่ผ่าน" : "หมดอายุ";
        }
        
        // Find an appropriate officer and organization for this certification type
        let issuerId = undefined;
        let issuerOrganization: StakeholderOrganization | undefined = undefined;
        
        if (certType === "gacp") {
          // GACP is managed by มกอช.
          issuerOrganization = "มกอช.";
          const eligibleOfficers = Object.values(users).filter(u => u.role === "acfs_officer");
          if (eligibleOfficers.length > 0) {
            issuerId = eligibleOfficers[Math.floor(Math.random() * eligibleOfficers.length)].id;
          }
        } else if (certType === "dttm") {
          // DTTM is managed by กรมแพทย์แผนไทยและการแพทย์ทางเลือก
          issuerOrganization = "กรมแพทย์แผนไทยและการแพทย์ทางเลือก";
          const eligibleOfficers = Object.values(users).filter(u => u.role === "ttm_officer");
          if (eligibleOfficers.length > 0) {
            issuerId = eligibleOfficers[Math.floor(Math.random() * eligibleOfficers.length)].id;
          }
        } else {
          // EU-GMP is often managed by international bodies, but locally coordinated by TTM
          issuerOrganization = "กรมแพทย์แผนไทยและการแพทย์ทางเลือก";
          const eligibleOfficers = Object.values(users).filter(u => u.role === "customs_officer" || u.role === "ttm_officer");
          if (eligibleOfficers.length > 0) {
            issuerId = eligibleOfficers[Math.floor(Math.random() * eligibleOfficers.length)].id;
          }
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
          issuerOrganization,
          documentUrl: Math.random() > 0.3 ? `https://example.com/cert/${certId}.pdf` : undefined
        };
        
        // Add certification to farmer's list
        if (farmer.certifications) {
          farmer.certifications.push(certId);
        } else {
          farmer.certifications = [certId];
        }
      }
    });
  });

  // Create laboratory samples for herbs
  let sampleCounter = 0;
  const labsArray = Object.values(laboratories);
  
  Object.values(herbs).forEach((herb, hIndex) => {
    // Economic herbs have more samples
    const sampleCount = herb.isEconomicHerb ? 
      Math.floor(Math.random() * 3) + 2 : // 2-4 samples for economic herbs
      Math.floor(Math.random() * 2) + 1;  // 1-2 samples for other herbs
    
    for (let i = 0; i < sampleCount; i++) {
      const sampleId = `S${String(sampleCounter + 1).padStart(6, '0')}`;
      sampleCounter++;
      
      // Assign to a random laboratory
      const randomLabIndex = Math.floor(Math.random() * labsArray.length);
      const labId = labsArray[randomLabIndex].id;
      
      // Create sample collection date
      const now = new Date();
      const collectionDate = new Date(now.getTime() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000); // Up to 6 months ago
      
      // Determine sample status
      const statusRandom = Math.random();
      const status = statusRandom > 0.7 ? "วิเคราะห์เสร็จสิ้น" :
                    statusRandom > 0.4 ? "กำลังวิเคราะห์" : "รอการวิเคราะห์";
      
      // Create sample
      laboratorySamples[sampleId] = {
        id: sampleId,
        herbId: herb.id,
        farmerId: herb.farmerId || Object.keys(farmers)[0],
        collectionDate,
        sampleType: Math.random() > 0.5 ? "ใบสด" : "ราก",
        status,
        laboratoryId: labId,
        resultsId: status === "วิเคราะห์เสร็จสิ้น" ? `R${sampleId.substring(1)}` : undefined
      };
      
      // If sample is analyzed, create results
      if (status === "วิเคราะห์เสร็จสิ้น") {
        const resultId = `R${sampleId.substring(1)}`;
        const testDate = new Date(collectionDate.getTime() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000); // 0-14 days after collection
        const completionDate = new Date(testDate.getTime() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000); // 0-7 days after testing
        
        // Find an analyst from the laboratory
        let analystId = undefined;
        if (laboratories[labId].staffIds.length > 0) {
          analystId = laboratories[labId].staffIds[Math.floor(Math.random() * laboratories[labId].staffIds.length)];
        }
        
        // Create random test results
        const isEconomicHerb = herb.isEconomicHerb;
        const passQuality = isEconomicHerb ? Math.random() > 0.2 : Math.random() > 0.4; // Economic herbs more likely to pass
        
        const passedCriteria = [
          "ปริมาณสารสำคัญอยู่ในเกณฑ์",
          "ไม่พบการปนเปื้อนจุลินทรีย์",
          "ความชื้นอยู่ในเกณฑ์มาตรฐาน"
        ];
        
        const failedCriteria = passQuality ? [] : [
          "พบโลหะหนักเกินมาตรฐาน",
          "พบสารกำจัดศัตรูพืชตกค้าง",
          "ปริมาณสารสำคัญต่ำกว่าเกณฑ์"
        ];
        
        const analysisTypes = [
          "การวัดปริมาณสารสำคัญ",
          "การตรวจการปนเปื้อนโลหะหนัก",
          "การตรวจการปนเปื้อนจุลินทรีย์"
        ];
        
        const recommendations = passQuality ? [] : [
          "ปรับปรุงการเตรียมดินและการดูแล",
          "ทบทวนวิธีการเก็บเกี่ยว",
          "ตรวจสอบแหล่งน้ำและการให้น้ำ",
          "ส่งตัวอย่างตรวจซ้ำหลัง 3 เดือน"
        ];
        
        laboratoryResults[resultId] = {
          id: resultId,
          sampleId,
          testDate,
          completionDate,
          analysisType: analysisTypes,
          results: {
            moisture: (Math.random() * 10 + 5).toFixed(2),
            activeCompound: (Math.random() * 5 + 2).toFixed(2),
            heavyMetals: passQuality ? "ไม่พบ" : "พบ",
            pesticides: passQuality ? "ไม่พบ" : "พบ",
            microbiologicalContamination: passQuality ? "ไม่พบ" : "พบบางชนิด"
          },
          passedCriteria,
          failedCriteria,
          overallResult: passQuality ? "ผ่าน" : "ไม่ผ่าน",
          analystId,
          recommendations: recommendations.length > 0 ? recommendations : undefined,
          nextSteps: passQuality ? "สามารถนำไปใช้ในกระบวนการต่อไปได้" : "ต้องปรับปรุงคุณภาพก่อนตรวจซ้ำ"
        };
        
        // Create trace record for laboratory testing
        const traceId = `T${String(tracesList.length).padStart(6, '0')}`;
        traces[traceId] = {
          id: traceId,
          herbId: herb.id,
          userId: analystId,
          timestamp: completionDate,
          event: `ผลการวิเคราะห์คุณภาพสมุนไพร: ${passQuality ? "ผ่าน" : "ไม่ผ่าน"}`,
          location: laboratories[labId].location,
          herbName: herb.name,
          verifiedBy: analystId ? users[analystId]?.fullName : "เจ้าหน้าที่ห้องปฏิบัติการ",
          referenceCode: resultId
        };
        tracesList.push(traces[traceId]);
      }
    }
  });

  // Create inspection processes to represent the complete workflow
  // This demonstrates how herbs go through multiple inspection stages based on the process flow
  const processTypes: InspectionProcess[] = [
    "การทดสอบในห้องปฏิบัติการ", 
    "การรับรอง GACP", 
    "การรับรอง EU-GMP", 
    "การรับรอง DTTM", 
    "การควบคุมคุณภาพ", 
    "การอนุมัติการตลาด"
  ];
  
  let processCounter = 0;
  
  // Focus on economic herbs for the inspection processes
  const economicHerbsList = Object.values(herbs).filter(herb => herb.isEconomicHerb);
  
  economicHerbsList.forEach(herb => {
    // Create a complete process chain for each herb
    let previousProcessId = undefined;
    
    processTypes.forEach((processType, processIndex) => {
      const processId = `P${String(processCounter + 1).padStart(6, '0')}`;
      processCounter++;
      
      // Determine process status based on position in chain
      // Earlier processes are more likely to be completed
      const progressChance = 1 - (processIndex / processTypes.length) * 0.7;
      const isStarted = Math.random() < progressChance + 0.2;
      
      // Determine the appropriate organization for this process type
      let inspectorOrganization: StakeholderOrganization | undefined;
      if (processType === "การทดสอบในห้องปฏิบัติการ") {
        inspectorOrganization = "ห้องปฏิบัติการ";
      } else if (processType === "การรับรอง GACP") {
        inspectorOrganization = "มกอช.";
      } else if (processType === "การรับรอง EU-GMP" || processType === "การรับรอง DTTM") {
        inspectorOrganization = "กรมแพทย์แผนไทยและการแพทย์ทางเลือก";
      } else {
        // Quality control and market approval can be done by various stakeholders
        inspectorOrganization = Math.random() > 0.5 ? "กรมแพทย์แผนไทยและการแพทย์ทางเลือก" : "มกอช.";
      }
      
      if (!isStarted) {
        // Process not yet started
        inspectionProcesses[processId] = {
          id: processId,
          herbId: herb.id,
          farmerId: herb.farmerId || Object.keys(farmers)[0],
          processType,
          status: "รอดำเนินการ",
          startDate: new Date(Date.now() + (processIndex * 7 * 24 * 60 * 60 * 1000)), // Future start date
          previousProcess: previousProcessId,
          inspectorOrganization
        };
      } else {
        // Process has started
        const completionRandom = Math.random();
        let status: ProcessStatus;
        let completionDate: Date | undefined;
        
        if (completionRandom > 0.7) {
          status = "ผ่าน";
          completionDate = new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);
        } else if (completionRandom > 0.5) {
          status = "ไม่ผ่าน";
          completionDate = new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);
        } else if (completionRandom > 0.3) {
          status = "อยู่ระหว่างดำเนินการ";
          completionDate = undefined;
        } else {
          status = "รอการตรวจสอบ";
          completionDate = undefined;
        }
        
        // Find an appropriate inspector based on the process type
        let inspectorId = undefined;
        if (processType === "การทดสอบในห้องปฏิบัติการ") {
          const labUsers = Object.values(users).filter(u => u.role === 'lab');
          if (labUsers.length > 0) {
            inspectorId = labUsers[Math.floor(Math.random() * labUsers.length)].id;
          }
        } else if (processType === "การรับรอง GACP") {
          const acfsOfficers = Object.values(users).filter(u => u.role === 'acfs_officer');
          if (acfsOfficers.length > 0) {
            inspectorId = acfsOfficers[Math.floor(Math.random() * acfsOfficers.length)].id;
          }
        } else if (processType === "การรับรอง EU-GMP") {
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
        const results = (status === "ผ่าน" || status === "ไม่ผ่าน") ? {
          passedCriteria: [
            "องค์ประกอบทางเคมีอยู่ในเกณฑ์",
            "ไม่พบสารปนเปื้อน",
            "ปริมาณความชื้นเหมาะสม"
          ],
          failedCriteria: status === "ไม่ผ่าน" ? [
            "พบโลหะหนักเกินเกณฑ์",
            "พบสารกำจัดศัตรูพืชตกค้าง"
          ] : [],
          measurements: {
            moisture: Math.round((Math.random() * 10 + 5) * 10) / 10,
            purity: Math.round((Math.random() * 20 + 80) * 10) / 10,
            activeCompound: Math.round((Math.random() * 5 + 2) * 10) / 10
          },
          recommendedActions: status === "ไม่ผ่าน" ? [
            "ปรับปรุงการจัดการดิน",
            "ทบทวนวิธีการเพาะปลูก",
            "ส่งตรวจใหม่หลัง 3 เดือน"
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
          notes: status === "ไม่ผ่าน" ? "ไม่ผ่านเกณฑ์ตามมาตรฐานที่กำหนด" : 
                status === "ผ่าน" ? "ผ่านตามเกณฑ์มาตรฐานทุกข้อ" : 
                "อยู่ระหว่างการตรวจสอบ",
          previousProcess: previousProcessId,
          inspectorOrganization,
          results
        };
        
        // Create trace record for completed processes
        if (status === "ผ่าน" || status === "ไม่ผ่าน") {
          const traceId = `T${String(tracesList.length).padStart(6, '0')}`;
          traces[traceId] = {
            id: traceId,
            herbId: herb.id,
            userId: inspectorId,
            timestamp: completionDate || new Date(),
            event: `${processType}: ${status === "ผ่าน" ? "ผ่านการตรวจสอบ" : "ไม่ผ่านการตรวจสอบ"}`,
            location: "สำนักงานเขตพื้นที่",
            herbName: herb.name,
            verifiedBy: inspectorId ? users[inspectorId]?.fullName : undefined,
            referenceCode: processId
          };
          tracesList.push(traces[traceId]);
        }
      }
      
      // Update next process for the previous process
      if (previousProcessId && inspectionProcesses[previousProcessId]) {
        inspectionProcesses[previousProcessId].nextProcess = processId;
      }
      
      // Set current process as previous for the next iteration
      previousProcessId = processId;
    });
    
    // Create traces for herb cultivation and harvest
    const cultivationTraceId = `T${String(tracesList.length).padStart(6, '0')}`;
    traces[cultivationTraceId] = {
      id: cultivationTraceId,
      herbId: herb.id,
      userId: herb.farmerId && farmers[herb.farmerId].userId ? farmers[herb.farmerId].userId : undefined,
      timestamp: herb.cultivationDate || new Date(),
      event: "เริ่มการเพาะปลูก",
      location: herb.farmerId ? farmers[herb.farmerId].location || "ไม่ระบุ" : "ไม่ระบุ",
      herbName: herb.name,
      verifiedBy: herb.farmerId && farmers[herb.farmerId].userId && users[farmers[herb.farmerId].userId!] ? 
        users[farmers[herb.farmerId].userId!].fullName : 
        herb.farmerId ? farmers[herb.farmerId].name : "เกษตรกร"
    };
    tracesList.push(traces[cultivationTraceId]);
    
    if (herb.harvestDate && herb.harvestDate < new Date()) {
      const harvestTraceId = `T${String(tracesList.length).padStart(6, '0')}`;
      traces[harvestTraceId] = {
        id: harvestTraceId,
        herbId: herb.id,
        userId: herb.farmerId && farmers[herb.farmerId].userId ? farmers[herb.farmerId].userId : undefined,
        timestamp: herb.harvestDate,
        event: "เก็บเกี่ยวผลผลิต",
        location: herb.farmerId ? farmers[herb.farmerId].location || "ไม่ระบุ" : "ไม่ระบุ",
        herbName: herb.name,
        verifiedBy: herb.farmerId && farmers[herb.farmerId].userId && users[farmers[herb.farmerId].userId!] ? 
          users[farmers[herb.farmerId].userId!].fullName : 
          herb.farmerId ? farmers[herb.farmerId].name : "เกษตรกร",
        referenceCode: `YLD-${Math.round(herb.yield || 0)}KG`
      };
      tracesList.push(traces[harvestTraceId]);
    }
  });
  
  // Create some transactions for economic herbs that passed all inspections
  // First, identify herbs that have passed laboratory testing
  const passedHerbIds = new Set<string>();
  Object.values(laboratoryResults).forEach(result => {
    if (result.overallResult === "ผ่าน") {
      const sample = laboratorySamples[result.sampleId];
      if (sample) {
        passedHerbIds.add(sample.herbId);
      }
    }
  });
  
  // Create transactions for these herbs
  const consumerUsers = Object.values(users).filter(
    user => ['manufacturer', 'data_consumer'].includes(user.role)
  );
  
  let transactionCounter = 0;
  passedHerbIds.forEach(herbId => {
    const herb = herbs[herbId];
    if (!herb || !herb.farmerId) return;
    
    const transactionCount = Math.floor(Math.random() * 3) + 1; // 1-3 transactions per herb
    for (let i = 0; i < transactionCount; i++) {
      const transactionId = `TX${String(transactionCounter + 1).padStart(6, '0')}`;
      transactionCounter++;
      
      // The seller is the farmer who owns the herb
      let sellerId = undefined;
      if (farmers[herb.farmerId] && farmers[herb.farmerId].userId) {
        sellerId = farmers[herb.farmerId].userId;
      }
      
      // Buyer is a consumer (manufacturer or data_consumer)
      let buyerId = undefined;
      if (consumerUsers.length > 0) {
        buyerId = consumerUsers[Math.floor(Math.random() * consumerUsers.length)].id;
      }
      
      // Create transaction date after harvest date
      const transactionDate = new Date();
      if (herb.harvestDate && herb.harvestDate < transactionDate) {
        transactionDate.setTime(herb.harvestDate.getTime() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000); // 0-30 days after harvest
      }
      
      // Create transaction
      const amount = Math.floor(Math.random() * (herb.yield || 100)) + 10; // Random amount but not more than yield
      const price = amount * (Math.floor(Math.random() * 50) + 50); // 50-100 baht per unit
      
      transactions[transactionId] = {
        id: transactionId,
        herbId,
        buyerId,
        sellerId,
        timestamp: transactionDate,
        amount,
        price,
        status: Math.random() > 0.2 ? "สำเร็จ" : "รอดำเนินการ",
        paymentMethod: Math.random() > 0.5 ? "โอนเงิน" : "เงินสด",
        buyerName: buyerId && users[buyerId] ? users[buyerId].fullName : "ไม่ระบุ",
        sellerName: sellerId && users[sellerId] ? users[sellerId].fullName : "ไม่ระบุ",
        herbName: herb.name
      };
      transactionsList.push(transactions[transactionId]);
      
      // Create trace for the transaction
      const traceId = `T${String(tracesList.length).padStart(6, '0')}`;
      traces[traceId] = {
        id: traceId,
        herbId,
        userId: sellerId,
        timestamp: transactionDate,
        event: `การซื้อขาย: ${amount} หน่วย`,
        location: "ตลาดกลาง",
        herbName: herb.name,
        verifiedBy: sellerId && users[sellerId] ? users[sellerId].fullName : undefined,
        referenceCode: transactionId
      };
      tracesList.push(traces[traceId]);
    }
  });

  return {
    users,
    farmers,
    herbs,
    traces,
    transactions,
    certifications,
    inspectionProcesses,
    stakeholders,
    laboratorySamples,
    laboratoryResults,
    laboratories
  };
};

// Create our database singleton
export const mockDatabase = createRelatedData();

// Get the complete inspection process flow for a herb
export const getHerbInspectionFlow = (herbId: string) => {
  const processes = Object.values(mockDatabase.inspectionProcesses)
    .filter(process => process.herbId === herbId)
    .sort((a, b) => {
      const processOrder: Record<InspectionProcess, number> = {
        "การทดสอบในห้องปฏิบัติการ": 1,
        "การรับรอง GACP": 2,
        "การรับรอง EU-GMP": 3,
        "การรับรอง DTTM": 4,
        "การควบคุมคุณภาพ": 5,
        "การอนุมัติการตลาด": 6
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
        involvement: "การเพาะปลูก",
        stage: "การผลิต"
      });
    }
  }
  
  // Lab testers
  const labTests = Object.values(mockDatabase.laboratorySamples)
    .filter(sample => sample.herbId === herbId)
    .map(sample => {
      if (sample.status === "วิเคราะห์เสร็จสิ้น" && sample.resultsId) {
        const result = mockDatabase.laboratoryResults[sample.resultsId];
        if (result && result.analystId) {
          return result.analystId;
        }
      }
      return null;
    })
    .filter(id => id !== null) as string[];
  
  // Add unique lab testers
  [...new Set(labTests)].forEach(userId => {
    if (mockDatabase.users[userId]) {
      stakeholders.push({
        userId,
        role: mockDatabase.users[userId].role,
        name: mockDatabase.users[userId].fullName,
        involvement: "การทดสอบคุณภาพ",
        stage: "การควบคุมคุณภาพ"
      });
    }
  });
  
  // Certification officers
  const certProcesses = Object.values(mockDatabase.inspectionProcesses)
    .filter(p => p.herbId === herbId && 
      ["การรับรอง GACP", "การรับรอง EU-GMP", "การรับรอง DTTM"].includes(p.processType) && 
      p.inspectorId);
  
  certProcesses.forEach(process => {
    if (process.inspectorId && mockDatabase.users[process.inspectorId]) {
      stakeholders.push({
        userId: process.inspectorId,
        role: mockDatabase.users[process.inspectorId].role,
        name: mockDatabase.users[process.inspectorId].fullName,
        involvement: process.processType,
        stage: "การรับรอง"
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
        involvement: "การซื้อขาย",
        stage: "การกระจายสินค้า"
      });
    }
  });
  
  return stakeholders;
};

// Get total stakeholders by role
export const getStakeholdersByRole = () => {
  const roleMapping: Record<UserRole, StakeholderOrganization> = {
    farmer: "เกษตรกร",
    lab: "ห้องปฏิบัติการ",
    manufacturer: "เกษตรกร",
    ttm_officer: "กรมแพทย์แผนไทยและการแพทย์ทางเลือก",
    acfs_officer: "มกอช.",
    customs_officer: "กรมแพทย์แผนไทยและการแพทย์ทางเลือก",
    admin: "ผู้พัฒนาแพลตฟอร์ม",
    data_consumer: "เกษตรกร",
    guest: "เกษตรกร"
  };
  
  const stakeholderCounts: Record<StakeholderOrganization, number> = {
    "กรมแพทย์แผนไทยและการแพทย์ทางเลือก": 0,
    "มกอช.": 0,
    "เกษตรกร": 0,
    "ห้องปฏิบัติการ": 0,
    "ผู้พัฒนาแพลตฟอร์ม": 0
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
  
  // From laboratory results
  Object.values(mockDatabase.laboratoryResults)
    .filter(result => result.analystId)
    .forEach(result => {
      if (result.analystId) activeUserIds.add(result.analystId);
    });
  
  // Count by organization
  Array.from(activeUserIds).forEach(userId => {
    const user = mockDatabase.users[userId];
    if (user) {
      const organization = roleMapping[user.role];
      stakeholderCounts[organization]++;
    }
  });
  
  return Object.entries(stakeholderCounts)
    .map(([organization, count]) => ({ 
      role: organization, 
      count 
    }))
    .filter(item => item.count > 0);
};

// Get stakeholder involvement statistics
export const getStakeholderInvolvementStats = () => {
  const involvementStats: Record<string, number> = {
    "การผลิต": 0,
    "การทดสอบ": 0,
    "การรับรอง": 0,
    "การกระจายสินค้า": 0,
    "การบริโภค": 0,
    "การกำกับดูแล": 0
  };
  
  // Count farmers in production
  Object.values(mockDatabase.farmers)
    .filter(farmer => farmer.userId)
    .forEach(() => {
      involvementStats["การผลิต"]++;
    });
  
  // Count lab testers
  Object.values(mockDatabase.laboratoryResults)
    .filter(result => result.analystId)
    .forEach(() => {
      involvementStats["การทดสอบ"]++;
    });
  
  // Count certification officers
  Object.values(mockDatabase.inspectionProcesses)
    .filter(p => ["การรับรอง GACP", "การรับรอง EU-GMP", "การรับรอง DTTM"].includes(p.processType) && p.inspectorId)
    .forEach(() => {
      involvementStats["การรับรอง"]++;
    });
  
  // Count regulatory officers
  Object.values(mockDatabase.users)
    .filter(user => ["ttm_officer", "acfs_officer", "customs_officer"].includes(user.role))
    .forEach(() => {
      involvementStats["การกำกับดูแล"]++;
    });
  
  // Count distributors and consumers
  Object.values(mockDatabase.transactions).forEach(tx => {
    if (tx.sellerId) involvementStats["การกระจายสินค้า"]++;
    if (tx.buyerId) involvementStats["การบริโภค"]++;
  });
  
  return Object.entries(involvementStats)
    .map(([category, count]) => ({ category, count }));
};

// Enhanced dashboard data 
export const getDashboardData = () => {
  // Get certification counts from the actual certification records
  const gapcStatus: Record<string, number> = { "ผ่าน": 0, "ไม่ผ่าน": 0, "รอดำเนินการ": 0, "หมดอายุ": 0 };
  const euGmpStatus: Record<string, number> = { "ผ่าน": 0, "ไม่ผ่าน": 0, "รอดำเนินการ": 0, "หมดอายุ": 0 };
  const dttmStatus: Record<string, number> = { "ผ่าน": 0, "ไม่ผ่าน": 0, "รอดำเนินการ": 0, "หมดอายุ": 0 };
  
  Object.values(mockDatabase.certifications).forEach(cert => {
    if (cert.type === "gacp") {
      gapcStatus[cert.status]++;
    } else if (cert.type === "euGmp") {
      euGmpStatus[cert.status]++;
    } else if (cert.type === "dttm") {
      dttmStatus[cert.status]++;
    }
  });
  
  // Get user statistics
  const userStats = getUserActivityStats();
  
  // Get process flow statistics
  const processStats = {
    totalProcesses: Object.keys(mockDatabase.inspectionProcesses).length,
    statusCounts: {
      "รอดำเนินการ": 0,
      "อยู่ระหว่างดำเนินการ": 0,
      "ผ่าน": 0,
      "ไม่ผ่าน": 0,
      "รอการตรวจสอบ": 0,
      "ได้รับการรับรอง": 0,
      "หมดอายุ": 0
    },
    processCounts: {
      "การทดสอบในห้องปฏิบัติการ": 0,
      "การรับรอง GACP": 0,
      "การรับรอง EU-GMP": 0,
      "การรับรอง DTTM": 0,
      "การควบคุมคุณภาพ": 0,
      "การอนุมัติการตลาด": 0
    },
    averageCompletionRate: 0,
    averageFailureRate: 0
  };
  
  Object.values(mockDatabase.inspectionProcesses).forEach(process => {
    processStats.statusCounts[process.status]++;
    processStats.processCounts[process.processType]++;
  });
  
  processStats.averageCompletionRate = processStats.statusCounts["ผ่าน"] / processStats.totalProcesses;
  processStats.averageFailureRate = processStats.statusCounts["ไม่ผ่าน"] / processStats.totalProcesses;
  
  // Get stakeholder statistics
  const stakeholdersByRole = getStakeholdersByRole();
  const stakeholderInvolvement = getStakeholderInvolvementStats();
  
  // Get recent traces with related entities
  const recentTraces = Object.values(mockDatabase.traces)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);
  
  // Get transaction data with related entities
  const transactions = Object.values(mockDatabase.transactions)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);
  
  // Get transaction totals
  const totalSales = Object.values(mockDatabase.transactions)
    .reduce((sum, tx) => sum + tx.price, 0);
  
  const pendingOrders = Object.values(mockDatabase.transactions)
    .filter(tx => tx.status === "รอดำเนินการ")
    .length;

  // Get recent inspection processes
  const recentInspections = Object.values(mockDatabase.inspectionProcesses)
    .sort((a, b) => {
      const dateA = a.completionDate || a.startDate;
      const dateB = b.completionDate || b.startDate;
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 10)
    .map(process => {
      const herb = process.herbId ? mockDatabase.herbs[process.herbId] : undefined;
      const inspector = process.inspectorId ? mockDatabase.users[process.inspectorId] : undefined;
      const farmer = process.farmerId ? mockDatabase.farmers[process.farmerId] : undefined;
      
      return {
        ...process,
        herbName: herb?.name || 'ไม่ระบุ',
        inspectorName: inspector?.fullName,
        farmerName: farmer?.name
      };
    });
  
  // Get laboratory data
  const labSamplesByStatus = {
    "รอการวิเคราะห์": 0,
    "กำลังวิเคราะห์": 0,
    "วิเคราะห์เสร็จสิ้น": 0
  };
  
  Object.values(mockDatabase.laboratorySamples).forEach(sample => {
    labSamplesByStatus[sample.status]++;
  });
  
  const labResultsByOutcome = {
    "ผ่าน": 0,
    "ไม่ผ่าน": 0
  };
  
  Object.values(mockDatabase.laboratoryResults).forEach(result => {
    labResultsByOutcome[result.overallResult]++;
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
    recentInspections,
    inspectionProcesses: Object.values(mockDatabase.inspectionProcesses),
    labSamplesByStatus,
    labResultsByOutcome,
    laboratories: Object.values(mockDatabase.laboratories)
  };
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

// Get specific data for each module
export const getLabData = () => {
  return {
    samples: Object.values(mockDatabase.laboratorySamples),
    results: Object.values(mockDatabase.laboratoryResults),
    laboratories: Object.values(mockDatabase.laboratories),
    samplesByStatus: {
      "รอการวิเคราะห์": Object.values(mockDatabase.laboratorySamples).filter(s => s.status === "รอการวิเคราะห์").length,
      "กำลังวิเคราะห์": Object.values(mockDatabase.laboratorySamples).filter(s => s.status === "กำลังวิเคราะห์").length,
      "วิเคราะห์เสร็จสิ้น": Object.values(mockDatabase.laboratorySamples).filter(s => s.status === "วิเคราะห์เสร็จสิ้น").length
    },
    resultsByOutcome: {
      "ผ่าน": Object.values(mockDatabase.laboratoryResults).filter(r => r.overallResult === "ผ่าน").length,
      "ไม่ผ่าน": Object.values(mockDatabase.laboratoryResults).filter(r => r.overallResult === "ไม่ผ่าน").length
    }
  };
};

export const getCertificationData = () => {
  return {
    certifications: Object.values(mockDatabase.certifications),
    certificationsByType: {
      gacp: Object.values(mockDatabase.certifications).filter(c => c.type === "gacp"),
      euGmp: Object.values(mockDatabase.certifications).filter(c => c.type === "euGmp"),
      dttm: Object.values(mockDatabase.certifications).filter(c => c.type === "dttm")
    },
    certificationsByStatus: {
      "ผ่าน": Object.values(mockDatabase.certifications).filter(c => c.status === "ผ่าน"),
      "ไม่ผ่าน": Object.values(mockDatabase.certifications).filter(c => c.status === "ไม่ผ่าน"),
      "รอดำเนินการ": Object.values(mockDatabase.certifications).filter(c => c.status === "รอดำเนินการ"),
      "หมดอายุ": Object.values(mockDatabase.certifications).filter(c => c.status === "หมดอายุ")
    }
  };
};

export const getHerbData = () => {
  return {
    herbs: Object.values(mockDatabase.herbs),
    economicHerbs: Object.values(mockDatabase.herbs).filter(h => h.isEconomicHerb),
    regularHerbs: Object.values(mockDatabase.herbs).filter(h => !h.isEconomicHerb),
    totalProductionArea: Object.values(mockDatabase.herbs).reduce((sum, herb) => sum + (herb.productionArea || 0), 0),
    totalYield: Object.values(mockDatabase.herbs).reduce((sum, herb) => sum + (herb.yield || 0), 0)
  };
};
