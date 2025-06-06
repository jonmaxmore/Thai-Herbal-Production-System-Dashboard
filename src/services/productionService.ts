
// Simplified Production Services - Core traceability only
import { FarmerId, TraceId, EnhancedTrace } from '@/utils/database/types';
import { mockDatabase } from '@/utils/database';

export class ProductionService {
  // Core trace services
  static getAllTraces() {
    return Object.values(mockDatabase.traces) as EnhancedTrace[];
  }

  static getTraceById(traceId: TraceId) {
    return mockDatabase.traces[traceId] as EnhancedTrace;
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

  // Mock farming activities - to fix the API error
  static getFarmingActivities() {
    return [
      { id: "1", farmId: "FARM_001", activity: "Planting", date: "2024-01-15" },
      { id: "2", farmId: "FARM_002", activity: "Harvesting", date: "2024-02-10" }
    ];
  }

  static getActivitiesByFarm(farmId: string) {
    return this.getFarmingActivities().filter(activity => activity.farmId === farmId);
  }
}
