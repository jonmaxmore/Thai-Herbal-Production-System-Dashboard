// List of Thai herbs
export const herbList = [
  "ใบบัวบก", "ใบเตย", "ใบย่านาง", "กุ่ยช่าย", "โหระพา", "ข่า", "ขมิ้น", "ขิง", "กระชาย", "กะเพรา",
  "กระเทียม", "แมงลัก", "ผักชี", "ผักชีฝรั่ง", "ผักชีลาว", "ผักไผ่", "พริกชี้ฟ้า", "พริกขี้หนู", "พริกขี้หนูสวน", "พริกไทยอ่อน",
  "พริกหยวก", "รากผักชี", "สะระแหน่", "ตะไคร้", "มะกรูด", "ดีปลี", "ดอกเงี้ยว", "กานพลู", "ลูกจันทน์เทศ", "มะแขว่น",
  "งา", "อบเชย", "ผงกะหรี่", "ผงพะโล้", "พริกแห้ง", "พริกป่น", "พริกไทยดำ", "พริกไทย (พริกไทยขาว)", "เทียนข้าวเปลือก", "ใบปอ",
  "ใบยอ", "บวบหอม", "บวบเหลี่ยม", "ชะพลู", "หอมแดง", "กะหล่ำปลี", "ขี้เหล็ก", "กระเจี๊ยบ", "มะเขือพวง", "มะเขือเปราะ",
  "มะเขือเทศ", "มะระ", "มะรุม", "หน่อไม้", "หน่อไม้ฝรั่ง", "ผักชีล้อม", "ผักกาดฮ่องเต้", "ผักกาดขาว", "ผักกาดเขียว", "ผักแขยง",
  "ผักกระเฉด", "ผักกระถิน", "ผักกวางตุ้ง", "ผักเสี้ยน", "ผักแว่น", "ผักหวาน", "เหรียง", "สะตอข้าว", "แตงกวา", "ตาลปัตรฤๅษี",
  "ถั่วฝักยาว", "ถั่วงอก", "ถั่วพู", "ชะอม", "ดาหลา", "ดอกอัญชัน", "ดอกแค", "ดอกแคทะเล", "ดอกแคหัวหมู", "ดอกสลิด",
  "ดอกโสน", "หัวปลี", "เล็บครุฑ", "ผักเหลียง", "ผักเลือด", "เพกา"
];

// Herb name translations (Thai -> English)
export const herbTranslations: Record<string, string> = {
  "ใบบัวบก": "Gotu Kola",
  "ใบเตย": "Pandan Leaf",
  "ใบย่านาง": "Yanang Leaf",
  "กุ่ยช่าย": "Chinese Chives",
  "โหระพา": "Thai Basil",
  "ข่า": "Galangal",
  "ขมิ้น": "Turmeric",
  "ขิง": "Ginger",
  "กระชาย": "Lesser Galangal",
  "กะเพรา": "Holy Basil",
  "กระเทียม": "Garlic",
  "แมงลัก": "Lemon Basil",
  "ผักชี": "Coriander",
  "ผักชีฝรั่ง": "Culantro",
  "ผักชีลาว": "Dill",
  "ผักไผ่": "Vietnamese Mint",
  "พริกชี้ฟ้า": "Chili Spur Pepper",
  "พริกขี้หนู": "Bird's Eye Chili",
  "พริกขี้หนูสวน": "Thai Chili",
  "พริกไทยอ่อน": "Young Peppercorns",
  "พริกหยวก": "Bell Pepper",
  "รากผักชี": "Coriander Root",
  "สะระแหน่": "Mint",
  "ตะไคร้": "Lemongrass",
  "มะกรูด": "Kaffir Lime",
  "ดีปลี": "Long Pepper",
  "ดอกเงี้ยว": "Kapok Flower",
  "กานพลู": "Clove",
  "ลูกจันทน์เทศ": "Nutmeg",
  "มะแขว่น": "Prickly Ash",
  "งา": "Sesame",
  "อบเชย": "Cinnamon",
  "ผงกะหรี่": "Curry Powder",
  "ผงพะโล้": "Five-Spice Powder",
  "พริกแห้ง": "Dried Chili",
  "พริกป่น": "Chili Powder",
  "พริกไทยดำ": "Black Pepper",
  "พริกไทย (พริกไทยขาว)": "White Pepper",
  "เทียนข้าวเปลือก": "Cumin",
  "ใบปอ": "Jute Leaf",
  "ใบยอ": "Noni Leaf",
  "บวบหอม": "Sponge Gourd",
  "บวบเหลี่ยม": "Angled Luffa",
  "ชะพลู": "Wild Betel Leafbush",
  "หอมแดง": "Shallot",
  "กะหล่ำปลี": "Cabbage",
  "ขี้เหล็ก": "Siamese Cassia",
  "กระเจี๊ยบ": "Roselle",
  "มะเขือพวง": "Thai Eggplant",
  "มะเขือเปราะ": "Green Brinjal",
  "มะเขือเทศ": "Tomato",
  "มะระ": "Bitter Gourd",
  "มะรุม": "Moringa",
  "หน่อไม้": "Bamboo Shoot",
  "หน่อไม้ฝรั่ง": "Asparagus",
  "ผักชีล้อม": "Water Dropwort",
  "ผักกาดฮ่องเต้": "Choy Sum",
  "ผักกาดขาว": "Napa Cabbage",
  "ผักกาดเขียว": "Mustard Greens",
  "ผักแขยง": "Rice Paddy Herb",
  "ผักกระเฉด": "Water Mimosa",
  "ผักกระถิน": "Lead Tree",
  "ผักกวางตุ้ง": "Chinese Cabbage",
  "ผักเสี้ยน": "Spiderwort",
  "ผักแว่น": "Asiatic Pennywort",
  "ผักหวาน": "Melientha Suavis",
  "เหรียง": "Niang Palm",
  "สะตอข้าว": "Stink Bean",
  "แตงกวา": "Cucumber",
  "ตาลปัตรฤๅษี": "Gymnema Inodorum",
  "ถั่วฝักยาว": "Yardlong Bean",
  "ถั่วงอก": "Bean Sprout",
  "ถั่วพู": "Winged Bean",
  "ชะอม": "Acacia Pennata",
  "ดาหลา": "Torch Ginger",
  "ดอกอัญชัน": "Butterfly Pea",
  "ดอกแค": "Sesbania Grandiflora",
  "ดอกแคทะเล": "Sea Bean",
  "ดอกแคหัวหมู": "Swamp Pea",
  "ดอกสลิด": "Cowslip Creeper",
  "ดอกโสน": "Sesbania Javanica",
  "หัวปลี": "Banana Blossom",
  "เล็บครุฑ": "Geranium Aralia",
  "ผักเหลียง": "Gnetum Gnemon",
  "ผักเลือด": "Houttuynia Cordata",
  "เพกา": "Broken Bones Tree"
};

// Generate placeholder images (in production you'd use real herb images)
export const getHerbImage = (herbName: string): string => {
  return `https://via.placeholder.com/150?text=${encodeURIComponent(herbName)}`;
};

// Status types for certifications
export type CertificationStatus = "Passed" | "Failed" | "Pending" | "Other";

// Status colors for certifications
export const statusColors: Record<CertificationStatus, string> = {
  "Passed": "bg-green-500 text-white",
  "Failed": "bg-red-500 text-white",
  "Pending": "bg-yellow-500 text-white",
  "Other": "bg-gray-400 text-white"
};

// Helper function to generate random status
export function generateRandomStatus(): CertificationStatus {
  const statuses: CertificationStatus[] = ["Passed", "Failed", "Pending", "Other"];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

// Farm interface
export interface Farm {
  id: number;
  name: string;
  herb: string;
  gapc: CertificationStatus;
  euGmp: CertificationStatus;
  dttm: CertificationStatus;
  tis: CertificationStatus;
  location: {
    lat: number;
    lng: number;
  };
}

// Trace interface
export interface Trace {
  id: number;
  herb: string;
  event: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
}

// Generate random farm name
export function generateRandomName(id: number): string {
  return `Farm ${id}`;
}

// Generate random farms
export function generateFarmers(count = 100): Farm[] {
  const farmers: Farm[] = [];
  for (let i = 1; i <= count; i++) {
    const herb = herbList[Math.floor(Math.random() * herbList.length)];
    farmers.push({
      id: i,
      name: generateRandomName(i),
      herb,
      gapc: generateRandomStatus(),
      euGmp: generateRandomStatus(),
      dttm: generateRandomStatus(),
      tis: generateRandomStatus(),
      location: {
        lat: 13 + Math.random() * 2,
        lng: 100 + Math.random() * 2
      }
    });
  }
  return farmers;
}

// Generate random traces
export function generateTraces(count = 100): Trace[] {
  const events = ["Harvested", "Processed", "Packaged", "Shipped"];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    herb: herbList[Math.floor(Math.random() * herbList.length)],
    event: events[Math.floor(Math.random() * events.length)],
    timestamp: new Date().toISOString(),
    location: {
      lat: 13 + Math.random() * 2,
      lng: 100 + Math.random() * 2,
    }
  }));
}

// Calculate status counts
export function calculateStatusCounts(farmers: Farm[], field: keyof Pick<Farm, 'gapc' | 'euGmp' | 'dttm' | 'tis'>) {
  return farmers.reduce((acc: Record<string, number>, f) => {
    acc[f[field]] = (acc[f[field]] || 0) + 1;
    return acc;
  }, {});
}
