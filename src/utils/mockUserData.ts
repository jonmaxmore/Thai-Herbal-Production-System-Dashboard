
import { UserRole } from "@/components/RoleSelector";

// User status types
export type UserStatus = "active" | "inactive" | "suspended" | "pending";

// User model
export interface MockUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  organization?: string;
  province: string;
  registrationDate: Date;
  lastLoginDate?: Date;
  status: UserStatus;
  verificationStatus: boolean;
  profile: {
    phoneNumber?: string;
    address?: string;
    district?: string;
    postalCode?: string;
    profileImage?: string;
  };
  stats: {
    logins: number;
    submissions: number;
    certifications: number;
    traceabilityScans: number;
    marketplaceTransactions?: number;
  };
}

// List of Thai provinces
const thaiProvinces = [
  "กรุงเทพมหานคร", "เชียงใหม่", "เชียงราย", "น่าน", "พะเยา", "แพร่", "แม่ฮ่องสอน", "ลำปาง", "ลำพูน", 
  "อุตรดิตถ์", "กาฬสินธุ์", "ขอนแก่น", "ชัยภูมิ", "นครพนม", "นครราชสีมา", "บึงกาฬ", "บุรีรัมย์", "มหาสารคาม", 
  "มุกดาหาร", "ยโสธร", "ร้อยเอ็ด", "เลย", "สกลนคร", "สุรินทร์", "ศรีสะเกษ", "หนองคาย", "หนองบัวลำภู", "อุดรธานี", 
  "อุบลราชธานี", "อำนาจเจริญ", "กำแพงเพชร", "ตาก", "นครสวรรค์", "พิจิตร", "พิษณุโลก", "เพชรบูรณ์", "สุโขทัย", 
  "อุทัยธานี", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ตราด", "นครนายก", "ปราจีนบุรี", "ระยอง", "สระแก้ว", 
  "กาญจนบุรี", "นครปฐม", "ประจวบคีรีขันธ์", "เพชรบุรี", "ราชบุรี", "สมุทรสงคราม", "สมุทรสาคร", "สุพรรณบุรี", 
  "ชุมพร", "นครศรีธรรมราช", "พังงา", "พัทลุง", "ภูเก็ต", "ระนอง", "สุราษฎร์ธานี", "กระบี่", "ตรัง", "นราธิวาส", 
  "ปัตตานี", "พัทลุง", "ยะลา", "สงขลา", "สตูล"
];

// List of organization types by role
const organizationsByRole: Record<UserRole, string[]> = {
  farmer: [
    "เกษตรกรอิสระ", "วิสาหกิจชุมชน", "สหกรณ์การเกษตร", "ฟาร์มเกษตรอินทรีย์", 
    "กลุ่มเกษตรกรปลูกสมุนไพร", "ศูนย์เรียนรู้เกษตรพอเพียง"
  ],
  lab: [
    "ห้องปฏิบัติการกรมวิทยาศาสตร์การแพทย์", "ห้องปฏิบัติการมหาวิทยาลัย", 
    "ศูนย์วิทยาศาสตร์การแพทย์", "ห้องปฏิบัติการเอกชน", 
    "ศูนย์วิจัยสมุนไพร", "ห้องปฏิบัติการโรงพยาบาล"
  ],
  manufacturer: [
    "บริษัทผลิตยาสมุนไพร", "โรงงานแปรรูปสมุนไพร", "บริษัทผลิตผลิตภัณฑ์เสริมอาหาร", 
    "บริษัทเครื่องสำอางสมุนไพร", "โรงงานสกัดสารสำคัญจากสมุนไพร", "บริษัทบรรจุภัณฑ์สมุนไพร"
  ],
  ttm_officer: [
    "กรมการแพทย์แผนไทยและการแพทย์ทางเลือก", "สถาบันการแพทย์แผนไทย", 
    "สำนักงานสาธารณสุขจังหวัด", "โรงพยาบาลการแพทย์แผนไทย", 
    "คลินิกการแพทย์แผนไทย", "ศูนย์ส่งเสริมสมุนไพร"
  ],
  acfs_officer: [
    "สำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ", "หน่วยรับรองมาตรฐานเกษตรอินทรีย์", 
    "หน่วยตรวจประเมินGAP", "ศูนย์ทดสอบมาตรฐานสินค้าเกษตร", 
    "หน่วยรับรองระบบงาน", "สำนักงานมาตรฐานเกษตรอินทรีย์"
  ],
  customs_officer: [
    "กรมศุลกากร", "ด่านศุลกากร", "สำนักงานศุลกากรภาค", 
    "ศูนย์บริการศุลกากร", "หน่วยงานตรวจปล่อยสินค้า", "ศูนย์ประสานพิธีการศุลกากร"
  ],
  admin: [
    "ผู้ดูแลระบบส่วนกลาง", "ฝ่ายเทคโนโลยีสารสนเทศ", "ฝ่ายพัฒนาระบบ", 
    "ฝ่ายสนับสนุนผู้ใช้งาน", "ศูนย์ข้อมูลสมุนไพร", "ทีมบริหารจัดการแพลตฟอร์ม"
  ],
  data_consumer: [
    "บริษัทวิจัยตลาด", "หน่วยงานวิจัยภาครัฐ", "บริษัทที่ปรึกษา", 
    "สถาบันวิจัย", "มหาวิทยาลัย", "องค์กรระหว่างประเทศ", "บริษัทนำเข้า-ส่งออก"
  ],
  guest: ["ผู้เยี่ยมชมระบบ"]
};

// Weight for different roles distribution (out of 1000 users)
const roleDistribution: Record<UserRole, number> = {
  farmer: 600,         // 60% of users are farmers
  lab: 50,             // 5% lab staff
  manufacturer: 100,   // 10% manufacturers
  ttm_officer: 50,     // 5% Thai Traditional Medicine officers
  acfs_officer: 30,    // 3% ACFS officers
  customs_officer: 20, // 2% customs officers
  admin: 10,           // 1% admins
  data_consumer: 40,   // 4% data consumers
  guest: 100           // 10% guests
};

// Generate a random date between start and end
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate a mock Thai phone number
const generateThaiPhone = () => {
  const prefixes = ['08', '09', '06'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  let number = '';
  for (let i = 0; i < 8; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return prefix + number;
};

// Generate a random user id
const generateUserId = (index: number) => {
  return `USER${String(index + 1).padStart(6, '0')}`;
};

// Generate a random email based on name
const generateEmail = (name: string, domain: string) => {
  // Transliterate Thai to English-like characters for email
  const transliterated = name
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '.') || 'user'; // Replace spaces with dots or default to 'user'
  
  const randomNum = Math.floor(Math.random() * 1000);
  return `${transliterated}${randomNum}@${domain}`;
};

// Thai first names and last names for generating realistic user names
const thaiFirstNames = [
  "สมชาย", "สมศรี", "วิชัย", "มานี", "สุดา", "ประเสริฐ", "วรรณา", "สมพร", "บุญมี", "ทองดี",
  "สมบัติ", "นารี", "พิชัย", "รัตนา", "สมหมาย", "จันทร์", "สมใจ", "วิเชียร", "นงลักษณ์", "เสริม",
  "พรทิพย์", "ณรงค์", "สุวรรณ", "ประภา", "ชัยวัฒน์", "เพ็ญศรี", "ธีระ", "กมลา", "จักรพงษ์", "สุนันทา"
];

const thaiLastNames = [
  "สมบูรณ์", "แสงทอง", "ชูเชิด", "บุญมา", "ศรีสุข", "วรรณวิเศษ", "แก้วใส", "รักษาดี", "จันทร์สว่าง", "รุ่งโรจน์",
  "พลเดช", "แสนสุข", "คงคา", "บุญเรือง", "สุขเกษม", "พิบูลย์", "สีดา", "พิทักษ์", "เจริญศรี", "วัฒนา",
  "กลิ่นหอม", "ศรีทอง", "ดวงแก้ว", "จิตรดี", "ภูเขียว", "จันทร์แก้ว", "สุขสมบูรณ์", "พันธ์เพชร", "บุญช่วย", "มีสุข"
];

// Email domains
const emailDomains = [
  "gmail.com", "hotmail.com", "yahoo.com", "outlook.com",
  "gov.th", "ac.th", "go.th", "or.th", "co.th"
];

// Generate 1000 mock users spanning 2 years
export const generateMockUsers = (count: number = 1000): MockUser[] => {
  // Set registration date range - 2 years ago until now
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 2);
  
  const users: MockUser[] = [];
  let userCount = 0;
  
  // Generate users according to role distribution
  Object.entries(roleDistribution).forEach(([role, count]) => {
    for (let i = 0; i < count; i++) {
      // Generate random registration date within the 2-year period
      const registrationDate = randomDate(startDate, endDate);
      
      // Generate some last login dates (some users might never have logged in)
      let lastLoginDate: Date | undefined;
      if (Math.random() > 0.1) { // 90% of users have logged in at least once
        lastLoginDate = randomDate(registrationDate, endDate);
      }
      
      // Generate random name
      const firstName = thaiFirstNames[Math.floor(Math.random() * thaiFirstNames.length)];
      const lastName = thaiLastNames[Math.floor(Math.random() * thaiLastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      
      // Generate username (first name + random number)
      const username = `${firstName.toLowerCase()}${Math.floor(Math.random() * 1000)}`;
      
      // Select random province
      const province = thaiProvinces[Math.floor(Math.random() * thaiProvinces.length)];
      
      // Generate organization based on role
      const roleKey = role as UserRole;
      let organization = undefined;
      if (roleKey !== 'guest') {
        const orgs = organizationsByRole[roleKey];
        organization = orgs[Math.floor(Math.random() * orgs.length)];
      }
      
      // Generate random stats based on account age and role
      const accountAgeInDays = Math.floor((endDate.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24));
      const activityMultiplier = Math.random() * 0.5 + 0.5; // 0.5 to 1.0 activity level
      
      const logins = Math.floor(accountAgeInDays * activityMultiplier * 0.2); // Average login frequency
      
      // Different roles have different typical activities
      let submissions = 0;
      let certifications = 0;
      let traceabilityScans = 0;
      let marketplaceTransactions = undefined;
      
      switch(roleKey) {
        case 'farmer':
          submissions = Math.floor(accountAgeInDays * activityMultiplier * 0.05); // Less frequent submissions
          certifications = Math.floor(submissions * 0.3); // Not all submissions lead to certification
          marketplaceTransactions = Math.floor(accountAgeInDays * activityMultiplier * 0.02);
          break;
        case 'lab':
          submissions = Math.floor(accountAgeInDays * activityMultiplier * 0.2); // Labs do more submissions
          break;
        case 'manufacturer':
          traceabilityScans = Math.floor(accountAgeInDays * activityMultiplier * 0.1);
          marketplaceTransactions = Math.floor(accountAgeInDays * activityMultiplier * 0.05);
          break;
        case 'ttm_officer':
        case 'acfs_officer':
          certifications = Math.floor(accountAgeInDays * activityMultiplier * 0.1);
          break;
        case 'customs_officer':
          traceabilityScans = Math.floor(accountAgeInDays * activityMultiplier * 0.15);
          break;
        case 'data_consumer':
          traceabilityScans = Math.floor(accountAgeInDays * activityMultiplier * 0.2);
          break;
      }
      
      // Generate email with appropriate domain
      let emailDomain;
      if (['ttm_officer', 'acfs_officer', 'customs_officer', 'admin'].includes(roleKey)) {
        // Government emails
        emailDomain = roleKey === 'ttm_officer' ? 'dtam.go.th' : 
                      roleKey === 'acfs_officer' ? 'acfs.go.th' :
                      roleKey === 'customs_officer' ? 'customs.go.th' : 'thaiherbs.go.th';
      } else {
        emailDomain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
      }
      
      const email = generateEmail(fullName, emailDomain);
      
      // Determine user status (most are active)
      const statusRandom = Math.random();
      let status: UserStatus = "active";
      if (statusRandom > 0.9) status = "inactive";
      else if (statusRandom > 0.85) status = "suspended";
      else if (statusRandom > 0.8) status = "pending";
      
      // Create user object
      users.push({
        id: generateUserId(userCount),
        username,
        email,
        fullName,
        role: roleKey,
        organization,
        province,
        registrationDate,
        lastLoginDate,
        status,
        verificationStatus: Math.random() > 0.15, // 85% are verified
        profile: {
          phoneNumber: Math.random() > 0.3 ? generateThaiPhone() : undefined, // 70% have phone numbers
          address: Math.random() > 0.5 ? `${Math.floor(Math.random() * 100) + 1} หมู่ ${Math.floor(Math.random() * 20) + 1}` : undefined,
          district: Math.random() > 0.5 ? `ตำบล${Math.floor(Math.random() * 10) + 1}` : undefined,
          postalCode: Math.random() > 0.5 ? `${Math.floor(Math.random() * 90000) + 10000}` : undefined,
          profileImage: Math.random() > 0.7 ? `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg` : undefined,
        },
        stats: {
          logins,
          submissions,
          certifications,
          traceabilityScans,
          marketplaceTransactions
        }
      });
      
      userCount++;
    }
  });
  
  return users;
};

// Generate users by registration month over 2 years
export const getUsersByMonth = () => {
  const users = generateMockUsers();
  const months: Record<string, number> = {};
  
  // Initialize all months in the past 2 years
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const d = new Date();
    d.setMonth(now.getMonth() - i);
    const monthKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    months[monthKey] = 0;
  }
  
  // Count users by registration month
  users.forEach(user => {
    const date = user.registrationDate;
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (months[monthKey] !== undefined) {
      months[monthKey]++;
    }
  });
  
  // Convert to array sorted by date
  return Object.entries(months)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

// Get users by role
export const getUsersByRole = () => {
  const users = generateMockUsers();
  const roleCount: Record<string, number> = {};
  
  users.forEach(user => {
    if (!roleCount[user.role]) {
      roleCount[user.role] = 0;
    }
    roleCount[user.role]++;
  });
  
  return Object.entries(roleCount).map(([role, count]) => ({ role, count }));
};

// Get users by province (top 10)
export const getUsersByProvince = (limit: number = 10) => {
  const users = generateMockUsers();
  const provinceCount: Record<string, number> = {};
  
  users.forEach(user => {
    if (!provinceCount[user.province]) {
      provinceCount[user.province] = 0;
    }
    provinceCount[user.province]++;
  });
  
  return Object.entries(provinceCount)
    .map(([province, count]) => ({ province, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Get user activity statistics
export const getUserActivityStats = () => {
  const users = generateMockUsers();
  
  const totalLogins = users.reduce((sum, user) => sum + user.stats.logins, 0);
  const totalSubmissions = users.reduce((sum, user) => sum + user.stats.submissions, 0);
  const totalCertifications = users.reduce((sum, user) => sum + user.stats.certifications, 0);
  const totalTraceabilityScans = users.reduce((sum, user) => sum + user.stats.traceabilityScans, 0);
  
  const activeUsers = users.filter(user => user.status === "active").length;
  const verifiedUsers = users.filter(user => user.verificationStatus).length;
  
  return {
    totalUsers: users.length,
    activeUsers,
    verifiedUsers,
    totalLogins,
    totalSubmissions,
    totalCertifications,
    totalTraceabilityScans,
    averageLoginsPerUser: totalLogins / users.length,
    averageSubmissionsPerUser: totalSubmissions / users.length
  };
};

// Export a single static instance of generated users for consistent data
export const mockUsers = generateMockUsers();
