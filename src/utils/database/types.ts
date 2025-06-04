
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
