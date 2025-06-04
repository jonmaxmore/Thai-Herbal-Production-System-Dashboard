
import { MockDatabase, EnhancedFarm, Field, HerbData, EnhancedTrace, EnhancedTransaction, FarmingActivity, WeatherData } from './databaseInterface';
import { ProcessStatus, InspectionProcess } from './types';
import { cannabisVarieties, traditionalHerbs, enhancedHerbList, thaiProvinces } from './constants';
import { generateMockUsers } from "../mockUserData";

// Generate consistent database with 1000 farmers and 6000+ inspections
export const createEnhancedDatabase = (): MockDatabase => {
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

  // Continue with other data generation...
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
      thcContent: isCannabis ? Math.random() * 25 : undefined,
      cbdContent: isCannabis ? Math.random() * 20 : undefined,
      properties: isCannabis ? ["Pain Relief", "Anti-inflammatory", "Anxiety Relief"] : ["Traditional Medicine", "Herbal Tea"],
      activeCompounds: isCannabis ? ["THC", "CBD", "Terpenes"] : ["Natural Compounds"],
      traditionalUses: isCannabis ? ["Medical Cannabis", "Industrial Hemp"] : ["Traditional Thai Medicine"]
    };
  });

  // Generate inspection processes and other data...
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

  // Continue generating other data (activities, weather, traces, transactions, certifications)...
  
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
