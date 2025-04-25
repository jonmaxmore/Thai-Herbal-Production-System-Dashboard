
import { Shield, Leaf, FlaskConical, Factory, FileText, Building, Settings, Database, User } from 'lucide-react';

export type RoleCategory = 'production' | 'certification' | 'distribution' | 'system';

export interface RoleConfig {
  id: string;
  label: string;
  description: string;
  category: RoleCategory;
  icon: typeof Leaf;
  permissions: string[];
}

export const roleCategories: Record<RoleCategory, { label: string; description: string }> = {
  production: {
    label: "การผลิต",
    description: "บทบาทที่เกี่ยวข้องกับการผลิตและการเพาะปลูก"
  },
  certification: {
    label: "การรับรอง",
    description: "บทบาทที่เกี่ยวข้องกับการตรวจสอบและรับรอง"
  },
  distribution: {
    label: "การกระจายสินค้า",
    description: "บทบาทที่เกี่ยวข้องกับการจัดจำหน่ายและการซื้อขาย"
  },
  system: {
    label: "ระบบ",
    description: "บทบาทสำหรับการจัดการระบบ"
  }
};

export const rolesConfig: RoleConfig[] = [
  {
    id: 'farmer',
    label: 'เกษตรกร',
    description: 'จัดการแปลงเพาะปลูกและผลผลิตสมุนไพร',
    category: 'production',
    icon: Leaf,
    permissions: ['manage_farms', 'view_certifications']
  },
  {
    id: 'lab',
    label: 'ห้องปฏิบัติการ',
    description: 'ทดสอบและวิเคราะห์คุณภาพสมุนไพร',
    category: 'certification',
    icon: FlaskConical,
    permissions: ['perform_tests', 'issue_reports']
  },
  {
    id: 'manufacturer',
    label: 'ผู้ผลิต',
    description: 'แปรรูปและผลิตผลิตภัณฑ์สมุนไพร',
    category: 'production',
    icon: Factory,
    permissions: ['manage_production', 'manage_inventory']
  },
  {
    id: 'ttm_officer',
    label: 'เจ้าหน้าที่แพทย์แผนไทย',
    description: 'กำกับดูแลมาตรฐานการแพทย์แผนไทย',
    category: 'certification',
    icon: FileText,
    permissions: ['approve_standards', 'issue_certificates']
  },
  {
    id: 'acfs_officer',
    label: 'เจ้าหน้าที่ มกอช.',
    description: 'รับรองมาตรฐานเกษตรอินทรีย์',
    category: 'certification',
    icon: Shield,
    permissions: ['certify_organic', 'inspect_farms']
  },
  {
    id: 'customs_officer',
    label: 'เจ้าหน้าที่ศุลกากร',
    description: 'ควบคุมการนำเข้าและส่งออก',
    category: 'distribution',
    icon: Building,
    permissions: ['manage_exports', 'verify_documents']
  },
  {
    id: 'admin',
    label: 'ผู้ดูแลระบบ',
    description: 'จัดการระบบและสิทธิ์ผู้ใช้งาน',
    category: 'system',
    icon: Settings,
    permissions: ['manage_users', 'manage_system']
  },
  {
    id: 'data_consumer',
    label: 'ผู้ใช้ข้อมูล',
    description: 'เรียกดูและวิเคราะห์ข้อมูล',
    category: 'system',
    icon: Database,
    permissions: ['view_data', 'export_reports']
  },
  {
    id: 'guest',
    label: 'ผู้เยี่ยมชม',
    description: 'ดูข้อมูลทั่วไป',
    category: 'system',
    icon: User,
    permissions: ['view_public']
  }
];
