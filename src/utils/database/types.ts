
// Streamlined types for the lite herb traceability platform
export type UserId = string;
export type FarmerId = string;
export type HerbId = string;
export type TraceId = string;
export type CertificationId = string;

// Simplified process status
export type ProcessStatus = "Pending" | "In Progress" | "Passed" | "Failed" | "Expired";

// Core inspection processes only
export type InspectionProcess = "GACP Certification" | "EU-GMP Certification" | "DTTM Certification" | "Quality Control";

// GACP Application Status
export type GACPApplicationStatus = "Draft" | "Submitted" | "Under Review" | "Pre-Approved" | "Rejected" | "Site Inspection Scheduled" | "Site Inspection Complete" | "Approved" | "Certificate Issued";

// Streamlined Herb type
export interface HerbData {
  id: string;
  name: string;
  farmerId: string;
  category: "cannabis" | "traditional";
  thcContent?: number;
  cbdContent?: number;
  properties: string[];
}

// Simplified Farm type
export interface EnhancedFarm {
  id: string;
  name: string;
  herb: string;
  userId: UserId;
  gacp: ProcessStatus;
  euGmp: ProcessStatus;
  dttm: ProcessStatus;
  location: {
    lat: number;
    lng: number;
  };
  owner: {
    name: string;
    phoneNumber: string;
    email: string;
  };
  province: string;
  organicCertified: boolean;
  lastInspectionDate: string;
  cultivationArea: number;
  registrationNumber?: string;
  establishedYear?: number;
  nextInspectionDate?: string;
}

// Simplified Trace type
export interface EnhancedTrace {
  id: string;
  herbId: string;
  herb: string;
  event: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
  farmId: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  qualityGrade: "A" | "B" | "C" | "Premium";
  verifiedBy: string;
  certifications: string[];
  temperature?: number;
  humidity?: number;
  moistureLevel?: number;
  notes?: string;
  referenceCode?: string;
  herbName?: string;
}

// Simplified Transaction type
export interface EnhancedTransaction {
  id: string;
  userId: string;
  timestamp: Date;
  amount: number;
  productName: string;
  quantity: number;
  status: "Completed" | "Pending" | "Failed";
  paymentMethod: string;
  herbId: HerbId;
}

// GACP Application Interface
export interface GACPApplication {
  id: string;
  farmerId: FarmerId;
  userId: UserId;
  status: GACPApplicationStatus;
  submittedDate?: Date;
  farmData: {
    name: string;
    location: {
      lat: number;
      lng: number;
    };
    province: string;
    cultivationArea: number;
    crops: string[];
    farmImages: string[];
  };
  labResults: {
    files: string[];
    uploadDate?: Date;
  };
  preApprovalData?: {
    aiAnalysisResult: string;
    videoCallDate?: Date;
    videoCallStatus?: "Scheduled" | "Completed" | "Failed";
    preApprovalResult?: "Approved" | "Rejected";
    rejectionReason?: string;
  };
  siteInspection?: {
    scheduledDate?: Date;
    inspectors: string[];
    inspectionResult?: "Passed" | "Failed";
    notes?: string;
  };
  certificateData?: {
    certificateNumber?: string;
    issueDate?: Date;
    expiryDate?: Date;
    certificateFile?: string;
  };
}

// Add inspection process interface
export interface InspectionProcessData {
  id: string;
  farmerId: string;
  herbId: string;
  herbName: string;
  processType: InspectionProcess;
  status: ProcessStatus;
  startDate: Date;
  completionDate?: Date;
  inspectorName?: string;
  farmerName?: string;
}

// Stakeholder data types
export interface StakeholderData {
  role: string;
  count: number;
}

export interface InvolvementData {
  status: string;
  count: number;
}
