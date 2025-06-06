
// Enhanced cannabis varieties for 70% cannabis focus
export const cannabisVarieties = [
  "กัญชาสายพันธุ์เหนือ", "กัญชาไทยแลนด์", "กัญชาเชียงใหม่", "กัญชาแม่ฮ่องสอน", 
  "กัญชาน่าน", "กัญชาตาก", "กัญชาพะเยา", "กัญชาลำปาง", "กัญชาลำพูน",
  "กัญชาอุตรดิตถ์", "กัญชาสุโขทัย", "กัญชาเพชรบูรณ์", "กัญชากำแพงเพชร",
  "Thai Stick Original", "Northern Thai Cannabis", "Highland Cannabis", "Mekong Gold",
  "Thai Sativa", "Chocolate Thai", "Thai Landrace", "Golden Tiger Thai"
];

// Traditional herbs (30% of total)
export const traditionalHerbs = [
  "ฟ้าทะลายโจร", "ขมิ้นชัน", "ขิง", "กระชาย", "ตะไคร้", "ใบย่านาง", 
  "กะเพรา", "โหระพา", "สะระแหน่", "ผักบุ้ง", "ผักกาดหอม", "กระเจี๊ยบแดง",
  "มะขามป้อม", "น้อยหน่า", "ส้มป่อย", "หญ้าหวาน", "ใบหม่อน", "ใบขม"
];

// Enhanced herb list combining cannabis (70%) and traditional (30%)
export const enhancedHerbList = [
  ...cannabisVarieties, // 20 cannabis varieties
  ...traditionalHerbs.slice(0, 8) // 8 traditional varieties for total of 28 herbs
];

// Thai provinces for geographical distribution
export const thaiProvinces = [
  "กรุงเทพมหานคร", "เชียงใหม่", "เชียงราย", "น่าน", "พะเยา", "แพร่", "แม่ฮ่องสอน", "ลำปาง", "ลำพูน", 
  "อุตรดิตถ์", "กาฬสินธุ์", "ขอนแก่น", "ชัยภูมิ", "นครพนม", "นครราชสีมา", "บึงกาฬ", "บุรีรัมย์", "มหาสารคาม", 
  "มุกดาหาร", "ยโสธร", "ร้อยเอ็ด", "เลย", "สกลนคร", "สุรินทร์", "ศรีสะเกษ", "หนองคาย", "หนองบัวลำภู", "อุดรธานี", 
  "อุบลราชธานี", "อำนาจเจริญ", "กำแพงเพชร", "ตาก", "นครสวรรค์", "พิจิตร", "พิษณุโลก", "เพชรบูรณ์", "สุโขทัย", 
  "อุทัยธานี", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ตราด", "นครนายก", "ปราจีนบุรี", "ระยอง", "สระแก้ว", 
  "กาญจนบุรี", "นครปฐม", "ประจวบคีรีขันธ์", "เพชรบุรี", "ราชบุรี", "สมุทรสงคราม", "สมุทรสาคร", "สุพรรณบุรี", 
  "ชุมพร", "นครศรีธรรมราช", "พังงา", "พัทลุง", "ภูเก็ต", "ระนอง", "สุราษฎร์ธานี", "กระบี่", "ตรัง", "นราธิวาส", 
  "ปัตตานี", "ยะลา", "สงขลา", "สตูล"
];

// Cannabis-specific properties based on Department of Thai Traditional and Alternative Medicine data
export const cannabisProperties = {
  medicinal: [
    "ลดความเจ็บปวดเรื้อรัง", "ต้านการอักเสบ", "ลดความวิตกกังวล", "กระตุ้นความอยากอาหาร",
    "ลดอาการคลื่นไส้", "ช่วยในการนอนหลับ", "ลดอาการชัก", "ผ่อนคลายกล้ามเนื้อ"
  ],
  traditional: [
    "บำรุงธาตุ", "ขับลม", "แก้ปวดเมื่อย", "บำรุงกำลัง", "แก้ไข้", "ขับเสมหะ"
  ]
};

// Traditional herb properties from Thai traditional medicine
export const traditionalHerbProperties = {
  "ฟ้าทะลายโจร": ["แก้ไข้", "ต้านเชื้อโรค", "เสริมภูมิคุ้มกัน"],
  "ขมิ้นชัน": ["ต้านการอักเสบ", "ต้านอนุมูลอิสระ", "บำรุงตับ"],
  "ขิง": ["แก้คลื่นไส้", "อุ่นท้อง", "ขับลม"],
  "กระชาย": ["บำรุงธาตุ", "แก้ปวดเมื่อย", "บำรุงกำลัง"],
  "ตะไคร้": ["ขับปัสสาวะ", "แก้ท้องอืด", "ลดไข้"],
  "ใบย่านาง": ["บำรุงโลหิต", "แก้เบาหวาน", "ลดไข้"],
  "กะเพรา": ["ขับลม", "แก้ปวดท้อง", "ต้านเชื้อ"],
  "โหระพา": ["ขับเสมหะ", "แก้ไอ", "บำรุงปอด"]
};

// Quality grades for herbs
export const qualityGrades = ["Premium", "A", "B", "C"];

// Certification types
export const certificationTypes = {
  "GACP": "Good Agricultural and Collection Practice",
  "EU-GMP": "European Good Manufacturing Practice", 
  "DTTM": "Department of Thai Traditional and Alternative Medicine",
  "Organic": "Organic Certification"
};

// Processing stages
export const processingStages = [
  "เพาะเมล็ด", "ปลูก", "ดูแลรักษา", "เก็บเกี่ยว", "อบแห้ง", "แปรรูป", "ทดสอบคุณภาพ", "บรรจุ", "จัดส่ง"
];

// Cannabis-specific processing stages
export const cannabisProcessingStages = [
  "เพาะเมล็ด", "ปลูก", "รดน้ำ", "ให้ปุ่ย", "ตัดแต่ง", "ควบคุมแสง", "เก็บเกี่ยว", "อบแห้ง", 
  "ทดสอบ THC/CBD", "แปรรูป", "บรรจุปลอดภัย", "จัดเก็บตามมาตรฐาน", "จัดส่งตามกฎหมาย"
];
