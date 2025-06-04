
import { 
  UserId, FarmerId, HerbId, TraceId, TransactionId, CertificationId, 
  ActivityId, WeatherId, FieldId, ProcessStatus, InspectionProcess,
  EnhancedFarm, Field, HerbData, EnhancedTrace, EnhancedTransaction, FarmingActivity, WeatherData
} from './types';
import { generateMockUsers } from "../mockUserData";

// Enhanced database interface
export interface MockDatabase {
  users: Record<UserId, ReturnType<typeof generateMockUsers>[0]>;
  farmers: Record<FarmerId, EnhancedFarm>;
  fields: Record<FieldId, Field>;
  herbs: Record<HerbId, HerbData>;
  traces: Record<TraceId, EnhancedTrace>;
  transactions: Record<TransactionId, EnhancedTransaction>;
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
  farmingActivities: Record<ActivityId, FarmingActivity>;
  weatherData: Record<WeatherId, WeatherData>;
}
