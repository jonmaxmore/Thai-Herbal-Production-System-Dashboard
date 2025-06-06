
import { MockDatabase, EnhancedFarm, HerbData, EnhancedTrace, EnhancedTransaction } from './databaseInterface';
import { ProcessStatus, InspectionProcess } from './types';
import { thaiProvinces } from './constants';
import { generateMockUsers } from "../mockUserData";

// Enhanced cannabis varieties (70% of herbs will be cannabis)
const cannabisVarieties = [
  "กัญชาสายพันธุ์เหนือ", "กัญชาไทยแลนด์", "กัญชาเชียงใหม่", "กัญชาแม่ฮ่องสอน", 
  "กัญชาน่าน", "กัญชาตาก", "กัญชาพะเยา", "กัญชาลำปาง", "กัญชาลำพูน",
  "กัญชาอุตรดิตถ์", "กัญชาสุโขทัย", "กัญชาเพชรบูรณ์", "กัญชากำแพงเพชร",
  "Thai Stick Original", "Northern Thai Cannabis", "Highland Cannabis", "Mekong Gold",
  "Thai Sativa", "Chocolate Thai", "Thai Landrace", "Golden Tiger Thai"
];

// Traditional herbs (30% of total)
const traditionalHerbs = [
  "ฟ้าทะลายโจร", "ขมิ้นชัน", "ขิง", "กระชาย", "ตะไคร้", "ใบย่านาง", 
  "กะเพรา", "โหระพา", "สะระแหน่", "ผักบุ้ง", "ผักกาดหอม", "กระเจี๊ยบแดง",
  "มะขามป้อม", "น้อยหน่า", "ส้มป่อย", "หญ้าหวาน", "ใบหม่อน", "ใบขม"
];

// Enhanced herb list combining cannabis (70%) and traditional (30%)
const enhancedHerbList = [
  ...cannabisVarieties, // 20 cannabis varieties
  ...traditionalHerbs.slice(0, 8) // 8 traditional varieties for total of 28 herbs
];

// Generate enhanced database with focused data set (100 farmers, 1000 inspections)
export const createEnhancedDatabase = (): MockDatabase => {
  const users: MockDatabase['users'] = {};
  const farmers: MockDatabase['farmers'] = {};
  const herbs: MockDatabase['herbs'] = {};
  const traces: MockDatabase['traces'] = {};
  const transactions: MockDatabase['transactions'] = {};
  const inspectionProcesses: MockDatabase['inspectionProcesses'] = {};

  // Generate 500 users with proper roles including all stakeholder types
  const usersList = generateMockUsers(500);
  usersList.forEach(user => {
    users[user.id] = user;
  });

  // Get farmers and other stakeholders from users
  const farmerUsers = Object.values(users).filter(u => u.role === 'farmer');
  const labUsers = Object.values(users).filter(u => u.role === 'lab');
  const manufacturerUsers = Object.values(users).filter(u => u.role === 'manufacturer');
  const ttmOfficerUsers = Object.values(users).filter(u => u.role === 'ttm_officer');
  const acfsOfficerUsers = Object.values(users).filter(u => u.role === 'acfs_officer');
  
  console.log(`Generated ${Object.keys(users).length} users: ${farmerUsers.length} farmers, ${labUsers.length} lab staff, ${manufacturerUsers.length} manufacturers`);

  // Generate exactly 100 farmers with cannabis focus
  for (let i = 1; i <= 100; i++) {
    const farmerId = `F${String(i).padStart(4, '0')}`;
    const province = thaiProvinces[Math.floor(Math.random() * thaiProvinces.length)];
    const userId = i <= farmerUsers.length ? farmerUsers[i - 1].id : `U${String(i).padStart(4, '0')}`;
    
    // 70% cannabis, 30% traditional herbs
    const isCannabis = Math.random() < 0.7;
    const herbName = isCannabis 
      ? cannabisVarieties[Math.floor(Math.random() * cannabisVarieties.length)]
      : traditionalHerbs[Math.floor(Math.random() * traditionalHerbs.length)];
    
    farmers[farmerId] = {
      id: farmerId,
      name: `ฟาร์ม${isCannabis ? 'กัญชา' : 'สมุนไพร'} ${i}`,
      herb: herbName,
      gacp: ["Passed", "Failed", "Pending", "Expired", "In Progress"][Math.floor(Math.random() * 5)] as ProcessStatus,
      euGmp: ["Passed", "Failed", "Pending", "Expired", "In Progress"][Math.floor(Math.random() * 5)] as ProcessStatus,
      dttm: ["Passed", "Failed", "Pending", "Expired", "In Progress"][Math.floor(Math.random() * 5)] as ProcessStatus,
      location: {
        lat: 13 + Math.random() * 7,
        lng: 98 + Math.random() * 7
      },
      owner: {
        name: userId && users[userId] ? users[userId].fullName : `เกษตกร ${i}`,
        phoneNumber: `08${Math.floor(10000000 + Math.random() * 90000000)}`,
        email: `farmer${i}@thaiherbs.go.th`
      },
      province,
      organicCertified: Math.random() > 0.3, // 70% organic certified
      lastInspectionDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      cultivationArea: Math.floor(Math.random() * 50) + 1,
      userId,
      registrationNumber: `TH-HERB-${String(i).padStart(4, '0')}`,
      establishedYear: 2020 + Math.floor(Math.random() * 4),
      nextInspectionDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  // Generate herbs database with proper distribution
  enhancedHerbList.forEach((herbName, index) => {
    const herbId = `H${String(index + 1).padStart(4, '0')}`;
    const isCannabis = cannabisVarieties.includes(herbName);
    
    const farmersArray = Object.values(farmers);
    const relevantFarmers = farmersArray.filter(f => f.herb === herbName);
    const randomFarmer = relevantFarmers.length > 0 
      ? relevantFarmers[Math.floor(Math.random() * relevantFarmers.length)]
      : farmersArray[Math.floor(Math.random() * farmersArray.length)];
    
    herbs[herbId] = {
      id: herbId,
      name: herbName,
      farmerId: randomFarmer.id,
      category: isCannabis ? "cannabis" : "traditional",
      thcContent: isCannabis ? Math.random() * 25 : undefined,
      cbdContent: isCannabis ? Math.random() * 20 : undefined,
      properties: isCannabis 
        ? ["ลดความเจ็บปวด", "ต้านการอักเสบ", "ลดความวิตกกังวล", "กระตุ้นความอยากอาหาร"]
        : ["สมุนไพรดั้งเดิม", "ต้านอนุมูลอิสระ", "บำรุงร่างกาย", "เสริมภูมิคุ้มกัน"]
    };
  });

  // Generate 2000 inspection processes for comprehensive system testing
  const farmersArray = Object.values(farmers);
  const herbsArray = Object.values(herbs);
  const inspectorUsers = [...labUsers, ...ttmOfficerUsers, ...acfsOfficerUsers];

  for (let i = 1; i <= 2000; i++) {
    const processId = `P${String(i).padStart(4, '0')}`;
    const randomFarmer = farmersArray[Math.floor(Math.random() * farmersArray.length)];
    const relevantHerbs = herbsArray.filter(h => h.farmerId === randomFarmer.id);
    const randomHerb = relevantHerbs.length > 0 
      ? relevantHerbs[Math.floor(Math.random() * relevantHerbs.length)]
      : herbsArray[Math.floor(Math.random() * herbsArray.length)];
    
    const processTypes: InspectionProcess[] = [
      "GACP Certification", "EU-GMP Certification", "DTTM Certification", "Quality Control"
    ];
    
    // Cannabis requires more certifications
    const isCannabis = randomHerb.category === 'cannabis';
    const processType = isCannabis 
      ? processTypes[Math.floor(Math.random() * processTypes.length)]
      : processTypes[Math.floor(Math.random() * (processTypes.length - 1))]; // Exclude EU-GMP for traditional herbs mostly
    
    const inspector = inspectorUsers[Math.floor(Math.random() * inspectorUsers.length)];
    
    const statuses: ProcessStatus[] = ["Passed", "Failed", "In Progress", "Pending", "Expired"];
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
      notes: `ตรวจสอบ ${processType} สำหรับ ${randomHerb.name} ${isCannabis ? '(กัญชา)' : '(สมุนไพรดั้งเดิม)'}`
    };
  }

  // Generate 1500 traces for comprehensive tracking
  for (let i = 1; i <= 1500; i++) {
    const traceId = `T${String(i).padStart(4, '0')}`;
    const randomFarmer = farmersArray[Math.floor(Math.random() * farmersArray.length)];
    const relevantHerbs = herbsArray.filter(h => h.farmerId === randomFarmer.id);
    const randomHerb = relevantHerbs.length > 0 
      ? relevantHerbs[Math.floor(Math.random() * relevantHerbs.length)]
      : herbsArray[Math.floor(Math.random() * herbsArray.length)];
    
    const isCannabis = randomHerb.category === 'cannabis';
    const events = isCannabis 
      ? ["เพาะเมล็ด", "ปลูก", "รดน้ำ", "ให้ปุ่ย", "ตัดแต่ง", "เก็บเกี่ยว", "อบแห้ง", "แปรรูป", "บรรจุ", "ทดสอบคุณภาพ"]
      : ["เพาะเมล็ด", "ปลูก", "รดน้ำ", "เก็บเกี่ยว", "แปรรูป", "บรรจุ"];
    
    traces[traceId] = {
      id: traceId,
      herbId: randomHerb.id,
      herb: randomHerb.name,
      event: events[Math.floor(Math.random() * events.length)],
      timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      location: randomFarmer.location,
      farmId: randomFarmer.id,
      batchNumber: `B${String(i).padStart(4, '0')}`,
      quantity: Math.floor(Math.random() * 1000) + 100,
      unit: isCannabis ? "กรัม" : "กิโลกรัม",
      qualityGrade: ["A", "B", "C", "Premium"][Math.floor(Math.random() * 4)] as any,
      verifiedBy: randomFarmer.owner.name,
      certifications: [randomFarmer.gacp, randomFarmer.euGmp, randomFarmer.dttm].filter(cert => cert === "Passed"),
      temperature: Math.floor(Math.random() * 10) + 20,
      humidity: Math.floor(Math.random() * 30) + 40,
      moistureLevel: Math.floor(Math.random() * 20) + 10,
      notes: `${isCannabis ? 'กัญชา' : 'สมุนไพร'}: ${randomHerb.name}`,
      referenceCode: `REF-${traceId}`,
      herbName: randomHerb.name
    };
  }

  // Generate 800 transactions for marketplace functionality
  for (let i = 1; i <= 800; i++) {
    const transactionId = `TX${String(i).padStart(4, '0')}`;
    const allUsers = Object.values(users);
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    const randomHerb = herbsArray[Math.floor(Math.random() * herbsArray.length)];
    
    const isCannabis = randomHerb.category === 'cannabis';
    const basePrice = isCannabis ? 500 : 50; // Cannabis is more expensive
    
    transactions[transactionId] = {
      id: transactionId,
      userId: randomUser.id,
      timestamp: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      amount: Math.floor(Math.random() * basePrice * 10) + basePrice,
      productName: randomHerb.name,
      quantity: Math.floor(Math.random() * (isCannabis ? 100 : 1000)) + (isCannabis ? 10 : 100),
      status: ["Completed", "Pending", "Failed"][Math.floor(Math.random() * 3)] as any,
      paymentMethod: ["เงินสด", "โอนธนาคาร", "บัตรเครดิต", "QR Code"][Math.floor(Math.random() * 4)],
      herbId: randomHerb.id
    };
  }

  console.log(`Generated enhanced database:
  - ${Object.keys(users).length} users (${farmerUsers.length} farmers)
  - ${Object.keys(farmers).length} farms (70% cannabis focus)
  - ${Object.keys(herbs).length} herbs
  - ${Object.keys(traces).length} trace events
  - ${Object.keys(transactions).length} transactions
  - ${Object.keys(inspectionProcesses).length} inspection processes`);

  return {
    users,
    farmers,
    herbs,
    traces,
    transactions,
    inspectionProcesses
  };
};
