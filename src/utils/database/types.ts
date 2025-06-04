
// Shared types for the herb traceability database
export type UserId = string;
export type FarmerId = string;
export type HerbId = string;
export type TraceId = string;
export type TransactionId = string;
export type CertificationId = string;
export type ActivityId = string;
export type WeatherId = string;
export type FieldId = string;

// Process status for herb inspection workflow
export type ProcessStatus = "Not Started" | "In Progress" | "Passed" | "Failed" | "Pending Review" | "Certified" | "Expired";

// Herb inspection processes
export type InspectionProcess = "Lab Testing" | "GACP Certification" | "EU-GMP Certification" | "DTTM Certification" | "Quality Control" | "Market Approval";

// Enhanced Herb type
export interface HerbData {
  id: string;
  name: string;
  farmerId?: string;
  englishName?: string;
  properties?: string[];
  activeCompounds?: string[];
  traditionalUses?: string[];
  scientificReferences?: string[];
  category: "cannabis" | "traditional";
  thcContent?: number;
  cbdContent?: number;
}

// Enhanced Farm type with detailed information
export interface EnhancedFarm {
  id: string;
  name: string;
  herb: string;
  userId?: UserId;
  fields: FieldId[];
  totalArea: number;
  cannabisLicense?: {
    number: string;
    issueDate: Date;
    expiryDate: Date;
    type: "medical" | "industrial" | "research";
  };
  gacp: {
    status: "Passed" | "Failed" | "Pending" | "Expired";
    issueDate?: Date;
    expiryDate?: Date;
  };
  euGmp: "Passed" | "Failed" | "Pending" | "Expired";
  dttm: "Passed" | "Failed" | "Pending" | "Expired";
  tis: "Passed" | "Failed" | "Pending" | "Expired";
  location: {
    lat: number;
    lng: number;
  };
  owner: {
    name: string;
    phoneNumber: string;
    email: string;
    licenseNumber: string;
    registrationDate: string;
  };
  province: string;
  registrationNumber: string;
  organicCertified: boolean;
  lastInspectionDate: string;
  nextInspectionDate: string;
  fdaApproved: boolean;
  cultivationArea: number;
  establishedYear: number;
}

// Field management interface
export interface Field {
  id: string;
  farmId: string;
  name: string;
  area: number;
  soilType: string;
  irrigationType: string;
  currentCrop?: string;
  plantingDate?: Date;
  expectedHarvestDate?: Date;
  coordinates: {
    lat: number;
    lng: number;
  }[];
}

// Farming activity interface
export interface FarmingActivity {
  id: string;
  farmId: string;
  fieldId?: string;
  herbId?: string;
  activityType: "planting" | "watering" | "fertilizing" | "pruning" | "harvesting" | "pest_control" | "soil_preparation" | "transplanting";
  date: Date;
  description: string;
  quantity?: number;
  unit?: string;
  cost?: number;
  laborHours?: number;
  equipmentUsed?: string[];
  notes?: string;
  weather?: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
}

// Weather data interface
export interface WeatherData {
  id: string;
  farmId: string;
  date: Date;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  humidity: number;
  rainfall: number;
  windSpeed: number;
  soilMoisture: number;
  uvIndex: number;
  notes?: string;
}

// Enhanced Trace type with farming activity links
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
  referenceCode?: string;
  farmId: string;
  fieldId?: string;
  activityId?: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  qualityGrade: "A" | "B" | "C" | "Premium";
  userId?: string;
  herbName?: string;
  verifiedBy?: string;
  certifications: string[];
  temperature?: number;
  humidity?: number;
  moistureLevel?: number;
  destinationName?: string;
  destinationContact?: string;
  transportMethod?: string;
  notes?: string;
  thcLevel?: number;
  cbdLevel?: number;
}

// Enhanced Transaction type
export interface EnhancedTransaction {
  id: string;
  userId: string;
  timestamp: Date;
  amount: number;
  productName: string;
  quantity: number;
  status: "Completed" | "Pending" | "Failed" | "Processing" | "Refunded";
  paymentMethod: string;
  buyerId?: UserId;
  sellerId?: UserId;
  herbId?: HerbId;
  totalAmount: number;
}
