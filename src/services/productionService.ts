
// Simplified Production Services - Core traceability only
import { FarmerId, TraceId } from '@/utils/database/types';
import { mockDatabase } from '@/utils/database';

export class ProductionService {
  // Core trace services
  static getAllTraces() {
    return Object.values(mockDatabase.traces);
  }

  static getTraceById(traceId: TraceId) {
    return mockDatabase.traces[traceId];
  }

  static getTracesByFarm(farmId: FarmerId) {
    return this.getAllTraces().filter(trace => trace.farmId === farmId);
  }

  static getTracesByHerb(herbId: string) {
    return this.getAllTraces().filter(trace => trace.herbId === herbId);
  }

  // Core production batch services
  static getProductionBatches() {
    const traces = this.getAllTraces();
    const batches = new Map();
    
    traces.forEach(trace => {
      if (!batches.has(trace.batchNumber)) {
        batches.set(trace.batchNumber, {
          batchNumber: trace.batchNumber,
          herbId: trace.herbId,
          herb: trace.herb,
          farmId: trace.farmId,
          totalQuantity: 0,
          qualityGrade: trace.qualityGrade,
          events: []
        });
      }
      
      const batch = batches.get(trace.batchNumber);
      batch.totalQuantity += trace.quantity;
      batch.events.push(trace);
    });
    
    return Array.from(batches.values());
  }
}
