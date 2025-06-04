
import { MockDatabase, EnhancedFarm, HerbData, EnhancedTrace, EnhancedTransaction } from './databaseInterface';
import { ProcessStatus, InspectionProcess } from './types';
import { cannabisVarieties, traditionalHerbs, enhancedHerbList, thaiProvinces } from './constants';
import { generateMockUsers } from "../mockUserData";

// Generate lite database with focused data set (200 farmers, 1000 inspections)
export const createEnhancedDatabase = (): MockDatabase => {
  const users: MockDatabase['users'] = {};
  const farmers: MockDatabase['farmers'] = {};
  const herbs: MockDatabase['herbs'] = {};
  const traces: MockDatabase['traces'] = {};
  const transactions: MockDatabase['transactions'] = {};
  const inspectionProcesses: MockDatabase['inspectionProcesses'] = {};

  // Generate 300 users with proper roles
  const usersList = generateMockUsers(300);
  usersList.forEach(user => {
    users[user.id] = user;
  });

  // Get farmers from users
  const farmerUsers = Object.values(users).filter(u => u.role === 'farmer');
  
  // Generate 200 farmers (lite version)
  for (let i = 1; i <= 200; i++) {
    const farmerId = `F${String(i).padStart(4, '0')}`;
    const province = thaiProvinces[Math.floor(Math.random() * thaiProvinces.length)];
    const userId = i <= farmerUsers.length ? farmerUsers[i - 1].id : `U${String(i).padStart(4, '0')}`;
    
    farmers[farmerId] = {
      id: farmerId,
      name: `ฟาร์มสมุนไพร ${i}`,
      herb: enhancedHerbList[Math.floor(Math.random() * enhancedHerbList.length)],
      gacp: ["Passed", "Failed", "Pending", "Expired"][Math.floor(Math.random() * 4)] as ProcessStatus,
      euGmp: ["Passed", "Failed", "Pending", "Expired"][Math.floor(Math.random() * 4)] as ProcessStatus,
      dttm: ["Passed", "Failed", "Pending", "Expired"][Math.floor(Math.random() * 4)] as ProcessStatus,
      location: {
        lat: 13 + Math.random() * 7,
        lng: 98 + Math.random() * 7
      },
      owner: {
        name: userId && users[userId] ? users[userId].fullName : `เกษตกร ${i}`,
        phoneNumber: `08${Math.floor(10000000 + Math.random() * 90000000)}`,
        email: `farmer${i}@example.com`
      },
      province,
      organicCertified: Math.random() > 0.5,
      lastInspectionDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      cultivationArea: Math.floor(Math.random() * 50) + 1,
      userId
    };
  }

  // Generate focused herbs
  enhancedHerbList.forEach((herbName, index) => {
    const herbId = `H${String(index + 1).padStart(4, '0')}`;
    const isCannabis = cannabisVarieties.includes(herbName);
    
    const farmersArray = Object.values(farmers);
    const randomFarmer = farmersArray[Math.floor(Math.random() * farmersArray.length)];
    
    herbs[herbId] = {
      id: herbId,
      name: herbName,
      farmerId: randomFarmer.id,
      category: isCannabis ? "cannabis" : "traditional",
      thcContent: isCannabis ? Math.random() * 25 : undefined,
      cbdContent: isCannabis ? Math.random() * 20 : undefined,
      properties: isCannabis ? ["Pain Relief", "Anti-inflammatory"] : ["Traditional Medicine"]
    };
  });

  // Generate 1000 inspection processes (lite version)
  const farmersArray = Object.values(farmers);
  const herbsArray = Object.values(herbs);
  const inspectorUsers = Object.values(users).filter(u => 
    ['lab', 'ttm_officer', 'acfs_officer'].includes(u.role)
  );

  for (let i = 1; i <= 1000; i++) {
    const processId = `P${String(i).padStart(4, '0')}`;
    const randomFarmer = farmersArray[Math.floor(Math.random() * farmersArray.length)];
    const randomHerb = herbsArray.filter(h => h.farmerId === randomFarmer.id)[0] || herbsArray[0];
    
    const processTypes: InspectionProcess[] = [
      "GACP Certification", "EU-GMP Certification", "DTTM Certification", "Quality Control"
    ];
    
    const processType = processTypes[Math.floor(Math.random() * processTypes.length)];
    const inspector = inspectorUsers[Math.floor(Math.random() * inspectorUsers.length)];
    
    const statuses: ProcessStatus[] = ["Passed", "Failed", "In Progress", "Pending"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    inspectionProcesses[processId] = {
      id: processId,
      herbId: randomHerb.id,
      farmerId: randomFarmer.id,
      processType,
      status,
      startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      completionDate: status === "Passed" || status === "Failed" ? 
        new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
      inspectorId: inspector?.id,
      notes: `ตรวจสอบ ${processType} สำหรับ ${randomHerb.name}`
    };
  }

  // Generate 500 traces (lite version)
  for (let i = 1; i <= 500; i++) {
    const traceId = `T${String(i).padStart(4, '0')}`;
    const randomFarmer = farmersArray[Math.floor(Math.random() * farmersArray.length)];
    const randomHerb = herbsArray.filter(h => h.farmerId === randomFarmer.id)[0] || herbsArray[0];
    
    traces[traceId] = {
      id: traceId,
      herbId: randomHerb.id,
      herb: randomHerb.name,
      event: ["ปลูก", "รดน้ำ", "เก็บเกี่ยว", "แปรรูป", "บรรจุ"][Math.floor(Math.random() * 5)],
      timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      location: randomFarmer.location,
      farmId: randomFarmer.id,
      batchNumber: `B${String(i).padStart(4, '0')}`,
      quantity: Math.floor(Math.random() * 1000) + 100,
      unit: "kg",
      qualityGrade: ["A", "B", "C", "Premium"][Math.floor(Math.random() * 4)] as any,
      verifiedBy: randomFarmer.owner.name,
      certifications: [randomFarmer.gacp, randomFarmer.euGmp].filter(cert => cert === "Passed"),
      temperature: Math.floor(Math.random() * 10) + 20,
      humidity: Math.floor(Math.random() * 30) + 40
    };
  }

  // Generate 300 transactions (lite version)
  for (let i = 1; i <= 300; i++) {
    const transactionId = `TX${String(i).padStart(4, '0')}`;
    const randomUser = Object.values(users)[Math.floor(Math.random() * Object.values(users).length)];
    const randomHerb = herbsArray[Math.floor(Math.random() * herbsArray.length)];
    
    transactions[transactionId] = {
      id: transactionId,
      userId: randomUser.id,
      timestamp: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      amount: Math.floor(Math.random() * 10000) + 1000,
      productName: randomHerb.name,
      quantity: Math.floor(Math.random() * 100) + 10,
      status: ["Completed", "Pending", "Failed"][Math.floor(Math.random() * 3)] as any,
      paymentMethod: ["เงินสด", "โอนธนาคาร", "บัตรเครดิต"][Math.floor(Math.random() * 3)],
      herbId: randomHerb.id
    };
  }

  return {
    users,
    farmers,
    herbs,
    traces,
    transactions,
    inspectionProcesses
  };
};
