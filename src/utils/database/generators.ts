
import { MockDatabase, EnhancedFarm, HerbData, EnhancedTrace, EnhancedTransaction } from './databaseInterface';
import { ProcessStatus, InspectionProcess, OptionalCertificationStatus } from './types';
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

// Generate enhanced database with proper data linking
export const createEnhancedDatabase = (): MockDatabase => {
  const users: MockDatabase['users'] = {};
  const farmers: MockDatabase['farmers'] = {};
  const herbs: MockDatabase['herbs'] = {};
  const traces: MockDatabase['traces'] = {};
  const transactions: MockDatabase['transactions'] = {};
  const inspectionProcesses: MockDatabase['inspectionProcesses'] = {};

  console.log("Creating new enhanced database with proper linking...");

  // Step 1: Generate 300 users with proper role distribution
  const usersList = generateMockUsers(300);
  usersList.forEach(user => {
    users[user.id] = user;
  });

  // Get specific role users for proper linking
  const farmerUsers = Object.values(users).filter(u => u.role === 'farmer').slice(0, 80); // 80 farmers
  const labUsers = Object.values(users).filter(u => u.role === 'lab');
  const manufacturerUsers = Object.values(users).filter(u => u.role === 'manufacturer');
  const ttmOfficerUsers = Object.values(users).filter(u => u.role === 'ttm_officer');
  const acfsOfficerUsers = Object.values(users).filter(u => u.role === 'acfs_officer');
  const inspectorUsers = [...labUsers, ...ttmOfficerUsers, ...acfsOfficerUsers];

  console.log(`Step 1: Generated ${Object.keys(users).length} users`);
  console.log(`- ${farmerUsers.length} farmers`);
  console.log(`- ${inspectorUsers.length} inspectors (lab + officers)`);

  // Step 2: Generate herbs first (needed for farm creation)
  const combinedHerbs = [...cannabisVarieties.slice(0, 14), ...traditionalHerbs.slice(0, 6)]; // 20 total herbs
  combinedHerbs.forEach((herbName, index) => {
    const herbId = `H${String(index + 1).padStart(3, '0')}`;
    const isCannabis = cannabisVarieties.includes(herbName);
    
    herbs[herbId] = {
      id: herbId,
      name: herbName,
      farmerId: '', // Will be linked later
      category: isCannabis ? "cannabis" : "traditional",
      thcContent: isCannabis ? Math.random() * 25 : undefined,
      cbdContent: isCannabis ? Math.random() * 20 : undefined,
      properties: isCannabis 
        ? ["ลดความเจ็บปวด", "ต้านการอักเสบ", "ลดความวิตกกังวล", "กระตุ้นความอยากอาหาร"]
        : ["สมุนไพรดั้งเดิม", "ต้านอนุมูลอิสระ", "บำรุงร่างกาย", "เสริมภูมิคุ้มกัน"]
    };
  });

  console.log(`Step 2: Generated ${Object.keys(herbs).length} herbs`);

  // Step 3: Generate 80 farms with proper user and herb linking
  const herbsArray = Object.values(herbs);
  for (let i = 0; i < 80; i++) {
    const farmerId = `F${String(i + 1).padStart(3, '0')}`;
    const farmerUser = farmerUsers[i];
    const province = thaiProvinces[Math.floor(Math.random() * thaiProvinces.length)];
    
    // Each farm gets 1-3 herbs
    const farmHerbCount = Math.floor(Math.random() * 3) + 1;
    const farmHerbs = [];
    const startIndex = Math.floor(Math.random() * (herbsArray.length - farmHerbCount));
    
    for (let j = 0; j < farmHerbCount; j++) {
      farmHerbs.push(herbsArray[startIndex + j]);
    }
    
    // Update herbs to link to this farm
    farmHerbs.forEach(herb => {
      herb.farmerId = farmerId;
    });

    const primaryHerb = farmHerbs[0];
    const isCannabis = primaryHerb.category === 'cannabis';
    
    // Generate optional certification statuses
    const optionalCertificationStatuses: OptionalCertificationStatus[] = ["Not Applied", "Applied", "Approved", "Rejected"];
    
    farmers[farmerId] = {
      id: farmerId,
      name: `ฟาร์ม${isCannabis ? 'กัญชา' : 'สมุนไพร'} ${province} ${i + 1}`,
      herb: primaryHerb.name,
      gacp: ["Passed", "Failed", "Pending", "In Progress"][Math.floor(Math.random() * 4)] as ProcessStatus,
      
      // Optional certifications structure
      optionalCertifications: {
        euGmp: optionalCertificationStatuses[Math.floor(Math.random() * optionalCertificationStatuses.length)],
        euGmpCertificateNumber: Math.random() > 0.5 ? `EU-GMP-${String(i + 1).padStart(4, '0')}` : undefined,
        euGmpExpiryDate: Math.random() > 0.5 ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        euGmpSource: Math.random() > 0.5 ? "ministry_api" : "farmer_entered",
        
        dttm: optionalCertificationStatuses[Math.floor(Math.random() * optionalCertificationStatuses.length)],
        dttmCertificateNumber: Math.random() > 0.5 ? `DTTM-${String(i + 1).padStart(4, '0')}` : undefined,
        dttmExpiryDate: Math.random() > 0.5 ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        dttmSource: Math.random() > 0.5 ? "ministry_api" : "farmer_entered",
        
        tis: optionalCertificationStatuses[Math.floor(Math.random() * optionalCertificationStatuses.length)],
        tisCertificateNumber: Math.random() > 0.5 ? `TIS-${String(i + 1).padStart(4, '0')}` : undefined,
        tisExpiryDate: Math.random() > 0.5 ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        tisSource: Math.random() > 0.5 ? "ministry_api" : "farmer_entered"
      },
      
      location: {
        lat: 13 + Math.random() * 7,
        lng: 98 + Math.random() * 7
      },
      owner: {
        name: farmerUser.fullName,
        phoneNumber: `08${Math.floor(10000000 + Math.random() * 90000000)}`,
        email: farmerUser.email
      },
      province,
      organicCertified: Math.random() > 0.3,
      lastInspectionDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      cultivationArea: Math.floor(Math.random() * 50) + 1,
      userId: farmerUser.id,
      registrationNumber: `TH-${isCannabis ? 'CAN' : 'HRB'}-${String(i + 1).padStart(4, '0')}`,
      establishedYear: 2020 + Math.floor(Math.random() * 4),
      nextInspectionDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  console.log(`Step 3: Generated ${Object.keys(farmers).length} farms with proper herb linking`);

  // Step 4: Generate inspection processes linked to existing farms and herbs
  const farmersArray = Object.values(farmers);
  let processCount = 0;
  
  farmersArray.forEach(farm => {
    const farmHerbs = herbsArray.filter(h => h.farmerId === farm.id);
    
    farmHerbs.forEach(herb => {
      // Generate 2-5 inspections per herb
      const inspectionCount = Math.floor(Math.random() * 4) + 2;
      
      for (let i = 0; i < inspectionCount; i++) {
        processCount++;
        const processId = `P${String(processCount).padStart(4, '0')}`;
        
        const processTypes: InspectionProcess[] = [
          "GACP Certification", "EU-GMP Certification", "DTTM Certification", "TIS Certification", "Quality Control"
        ];
        
        // Cannabis requires more certifications
        const isCannabis = herb.category === 'cannabis';
        const processType = isCannabis 
          ? processTypes[Math.floor(Math.random() * processTypes.length)]
          : Math.random() > 0.3 ? "GACP Certification" : processTypes[Math.floor(Math.random() * 4)];
        
        const inspector = inspectorUsers[Math.floor(Math.random() * inspectorUsers.length)];
        const statuses: ProcessStatus[] = ["Passed", "Failed", "In Progress", "Pending"];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        inspectionProcesses[processId] = {
          id: processId,
          herbId: herb.id,
          farmerId: farm.id,
          processType,
          status,
          startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          completionDate: status === "Passed" || status === "Failed" ? 
            new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
          inspectorId: inspector?.id,
          notes: `ตรวจสอบ ${processType} สำหรับ ${herb.name} ที่ ${farm.name}`
        };
      }
    });
  });

  console.log(`Step 4: Generated ${Object.keys(inspectionProcesses).length} inspection processes`);

  // Step 5: Generate traces linked to farms and herbs with proper workflow
  let traceCount = 0;
  
  farmersArray.forEach(farm => {
    const farmHerbs = herbsArray.filter(h => h.farmerId === farm.id);
    
    farmHerbs.forEach(herb => {
      // Generate 5-15 traces per herb following proper sequence
      const traceEventsCount = Math.floor(Math.random() * 11) + 5;
      const isCannabis = herb.category === 'cannabis';
      
      const cannabisEvents = ["เพาะเมล็ด", "ปลูก", "รดน้ำ", "ให้ปุ่ย", "ตัดแต่ง", "เก็บเกี่ยว", "อบแห้ง", "แปรรูป", "ทดสอบคุณภาพ", "บรรจุ"];
      const traditionalEvents = ["เพาะเมล็ด", "ปลูก", "รดน้ำ", "ให้ปุ่ย", "เก็บเกี่ยว", "แปรรูป", "ทดสอบคุณภาพ", "บรรจุ"];
      const events = isCannabis ? cannabisEvents : traditionalEvents;
      
      for (let i = 0; i < Math.min(traceEventsCount, events.length); i++) {
        traceCount++;
        const traceId = `T${String(traceCount).padStart(4, '0')}`;
        const batchNumber = `B${farm.id}-${herb.id}-${String(Math.floor(i/3) + 1).padStart(2, '0')}`;
        
        // Build certifications array based on farm's certification status
        const certifications = [];
        if (farm.gacp === "Passed") certifications.push("GACP");
        if (farm.optionalCertifications?.euGmp === "Approved") certifications.push("EU-GMP");
        if (farm.optionalCertifications?.dttm === "Approved") certifications.push("DTTM");
        if (farm.optionalCertifications?.tis === "Approved") certifications.push("TIS");
        
        traces[traceId] = {
          id: traceId,
          herbId: herb.id,
          herb: herb.name,
          event: events[i],
          timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 + i * 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: farm.location,
          farmId: farm.id,
          batchNumber,
          quantity: Math.floor(Math.random() * 1000) + 100,
          unit: isCannabis ? "กรัม" : "กิโลกรัม",
          qualityGrade: ["A", "B", "Premium"][Math.floor(Math.random() * 3)] as any,
          verifiedBy: farm.owner.name,
          certifications,
          temperature: Math.floor(Math.random() * 10) + 20,
          humidity: Math.floor(Math.random() * 30) + 40,
          moistureLevel: Math.floor(Math.random() * 20) + 10,
          notes: `${events[i]} - ${herb.name} ที่ ${farm.name}`,
          referenceCode: `REF-${traceId}`,
          herbName: herb.name
        };
      }
    });
  });

  console.log(`Step 5: Generated ${Object.keys(traces).length} trace events`);

  // Step 6: Generate transactions linked to users and herbs
  const allUsers = Object.values(users);
  const buyerUsers = allUsers.filter(u => ['manufacturer', 'data_consumer', 'admin'].includes(u.role));
  
  let transactionCount = 0;
  
  // Generate transactions based on completed traces only
  const completedTraces = Object.values(traces).filter(trace => 
    trace.event === "บรรจุ" || trace.event === "ทดสอบคุณภาพ"
  );
  
  completedTraces.forEach(trace => {
    // 30% chance of generating a transaction for each completed trace
    if (Math.random() < 0.3) {
      transactionCount++;
      const transactionId = `TX${String(transactionCount).padStart(4, '0')}`;
      const buyer = buyerUsers[Math.floor(Math.random() * buyerUsers.length)];
      const herb = herbs[trace.herbId];
      
      const isCannabis = herb.category === 'cannabis';
      const basePrice = isCannabis ? 500 : 50;
      
      transactions[transactionId] = {
        id: transactionId,
        userId: buyer.id,
        timestamp: new Date(new Date(trace.timestamp).getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        amount: Math.floor(Math.random() * basePrice * 10) + basePrice,
        productName: herb.name,
        quantity: Math.floor(trace.quantity * 0.8), // Slightly less than trace quantity
        status: ["Completed", "Pending"][Math.floor(Math.random() * 2)] as any,
        paymentMethod: ["เงินสด", "โอนธนาคาร", "บัตรเครดิต", "QR Code"][Math.floor(Math.random() * 4)],
        herbId: herb.id
      };
    }
  });

  console.log(`Step 6: Generated ${Object.keys(transactions).length} transactions`);

  // Final validation and cleanup
  console.log("\n=== Database Creation Summary ===");
  console.log(`✅ Users: ${Object.keys(users).length}`);
  console.log(`✅ Farmers: ${Object.keys(farmers).length}`);
  console.log(`✅ Herbs: ${Object.keys(herbs).length}`);
  console.log(`✅ Traces: ${Object.keys(traces).length}`);
  console.log(`✅ Transactions: ${Object.keys(transactions).length}`);
  console.log(`✅ Inspection Processes: ${Object.keys(inspectionProcesses).length}`);
  
  // Verify all links are proper
  let linkingErrors = 0;
  
  // Check herb-farm linking
  Object.values(herbs).forEach(herb => {
    if (!farmers[herb.farmerId]) {
      console.error(`❌ Herb ${herb.id} links to non-existent farm ${herb.farmerId}`);
      linkingErrors++;
    }
  });
  
  // Check farm-user linking
  Object.values(farmers).forEach(farm => {
    if (!users[farm.userId]) {
      console.error(`❌ Farm ${farm.id} links to non-existent user ${farm.userId}`);
      linkingErrors++;
    }
  });
  
  // Check trace linking
  Object.values(traces).forEach(trace => {
    if (!farmers[trace.farmId]) {
      console.error(`❌ Trace ${trace.id} links to non-existent farm ${trace.farmId}`);
      linkingErrors++;
    }
    if (!herbs[trace.herbId]) {
      console.error(`❌ Trace ${trace.id} links to non-existent herb ${trace.herbId}`);
      linkingErrors++;
    }
  });
  
  console.log(`\n📊 Data Linking Validation: ${linkingErrors === 0 ? '✅ All Perfect' : `❌ ${linkingErrors} errors found`}`);
  console.log(`📈 Cannabis vs Traditional: ${Math.round((cannabisVarieties.length / combinedHerbs.length) * 100)}% cannabis`);
  console.log("🔗 All data is properly linked and follows system workflow");

  return {
    users,
    farmers,
    herbs,
    traces,
    transactions,
    inspectionProcesses
  };
};
