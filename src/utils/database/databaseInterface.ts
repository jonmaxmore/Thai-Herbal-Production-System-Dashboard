
import { 
  UserId, FarmerId, HerbId, TraceId, TransactionId, CertificationId, 
  ActivityId, WeatherId, FieldId, ProcessStatus, InspectionProcess
} from './types';
import { generateMockUsers } from "../mockUserData";

// Re-export types for easy access
export type {
  UserId, FarmerId, HerbId, TraceId, TransactionId, CertificationId,
  ActivityId, WeatherId, FieldId, ProcessStatus, InspectionProcess,
  EnhancedFarm, Field, HerbData, EnhancedTrace, EnhancedTransaction, 
  FarmingActivity, WeatherData
} from './types';

// Enhanced database interface
export interface MockDatabase {
  users: Record<UserId, ReturnType<typeof generateMockUsers>[0]>;
  farmers: Record<FarmerId, import('./types').EnhancedFarm>;
  fields: Record<FieldId, import('./types').Field>;
  herbs: Record<HerbId, import('./types').HerbData>;
  traces: Record<TraceId, import('./types').EnhancedTrace>;
  transactions: Record<TransactionId, import('./types').EnhancedTransaction>;
  certifications: Record<CertificationId, {
    id: CertificationId;
    type: "gapc" | "euGmp" | "dttm" | "cannabis_license";
    status: "Passed" | "Failed" | "Pending" | "Expired";
    farmerId: FarmerId;
    issuerId?: UserId;
    issueDate: Date;
    expiryDate: Date;
    documentUrl?: string;
  }>;
  inspectionProcesses: Record<string, {
    id: string;
    herbId: HerbId;
    farmerId: FarmerId;
    fieldId?: FieldId;
    processType: InspectionProcess;
    status: ProcessStatus;
    startDate: Date;
    completionDate?: Date;
    inspectorId?: UserId;
    notes?: string;
    previousProcess?: string;
    nextProcess?: string;
    results?: {
      passedCriteria: string[];
      failedCriteria: string[];
      measurements?: Record<string, number>;
      recommendedActions?: string[];
    };
  }>;
  farmingActivities: Record<ActivityId, import('./types').FarmingActivity>;
  weatherData: Record<WeatherId, import('./types').WeatherData>;
}
