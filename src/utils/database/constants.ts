
// Cannabis-focused herb list (70% cannabis varieties)
export const cannabisVarieties = [
  "กัญชาพันธุ์ไทย", "กัญชาเชียงใหม่", "กัญชาอีสาน", "กัญชาใต้", "กัญชากรุงเทพ",
  "กัญชาลาว", "กัญชาเขมร", "กัญชาพม่า", "กัญชาอินเดีย", "กัญชาเนปาล",
  "กัญชาCBD", "กัญชaTHC", "กัญชาไฮบริด", "กัญชาอินดิกา", "กัญชาซาติวา",
  "กัญชาทางการแพทย์", "กัญชาอุตสาหกรรม", "กัญชาเส้นใย", "กัญชาเมล็ด", "กัญชาใบ",
  "กัญชาน้ำมัน", "กัญชาครีม", "กัญชาผง", "กัญชาสกัด", "กัญชาต้นแห้ง"
];

export const traditionalHerbs = [
  "ใบบัวบก", "ขมิ้น", "ขิง", "กระชาย", "ตะไคร้", "มะกรูด", "กะเพรา", 
  "โหระพา", "สะระแหน่", "ผักชี", "กระเทียม", "หอมแดง", "พริกไทย"
];

// Combined herb list with 70% cannabis
export const enhancedHerbList = [
  ...cannabisVarieties,
  ...cannabisVarieties, // Duplicate to reach 70%
  ...cannabisVarieties.slice(0, 10), // Additional cannabis for 70%+
  ...traditionalHerbs
];

// Generate Thai provinces for realistic location data
export const thaiProvinces = [
  "เชียงใหม่", "เชียงราย", "น่าน", "แพร่", "แม่ฮ่องสอน", "ลำปาง", "ลำพูน", "อุตรดิตถ์",
  "นครราชสีมา", "บุรีรัมย์", "สุรินทร์", "ศรีสะเกษ", "อุบลราชธานี", "ยโสธร", "อำนาจเจริญ",
  "กาญจนบุรี", "ราชบุรี", "เพชรบุรี", "ประจวบคีรีขันธ์", "สุพรรณบุรี", "นครปฐม"
];
