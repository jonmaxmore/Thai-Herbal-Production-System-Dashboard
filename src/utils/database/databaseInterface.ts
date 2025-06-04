
import { 
  UserId, FarmerId, HerbId, TraceId, CertificationId, 
  ProcessStatus, InspectionProcess
} from './types';
import { generateMockUsers } from "../mockUserData";

// Re-export types for easy access
export type {
  UserId, FarmerId, HerbId, TraceId, CertificationId,
  ProcessStatus, InspectionProcess,
  EnhancedFarm, HerbData, EnhancedTrace, EnhancedTransaction
} from './types';

// Simplified database interface
export interface MockDatabase {
  users: Record<UserId, ReturnType<typeof generateMockUsers>[0]>;
  farmers: Record<FarmerId, import('./types').EnhancedFarm>;
  herbs: Record<HerbId, import('./types').HerbData>;
  traces: Record<TraceId, import('./types').EnhancedTrace>;
  transactions: Record<string, import('./types').EnhancedTransaction>;
  inspectionProcesses: Record<string, {
    id: string;
    herbId: HerbId;
    farmerId: FarmerId;
    processType: InspectionProcess;
    status: ProcessStatus;
    startDate: Date;
    completionDate?: Date;
    inspectorId?: UserId;
    notes?: string;
  }>;
}
