
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
  // Add translations for other herbs
  // For now, let's return the Thai name if translation is not available
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
