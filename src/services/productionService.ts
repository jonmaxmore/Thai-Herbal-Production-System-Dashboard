
// Production Services Layer - Handles production tracking and management
import { FarmerId, TraceId, ActivityId } from '@/utils/database/types';
import { mockDatabase } from '@/utils/database';

export class ProductionService {
  // Production tracking services
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

  // Farming activity services
  static getFarmingActivities() {
    return Object.values(mockDatabase.farmingActivities);
  }

  static getActivitiesByFarm(farmId: FarmerId) {
    return this.getFarmingActivities().filter(activity => activity.farmId === farmId);
  }

  static getActivitiesByType(activityType: string) {
    return this.getFarmingActivities().filter(activity => activity.activityType === activityType);
  }

  // Quality control services
  static getQualityTests() {
    return Object.values(mockDatabase.inspectionProcesses)
      .filter(process => process.processType === 'Quality Control');
  }

  static getProductionBatches() {
    const traces = this.getAllTraces();
    const batches = new Map();
    
    traces.forEach(trace => {
      if (!batches.has(trace.batchNumber)) {
        batches.set(trace.batchNumber, {
          batchNumber: trace.batchNumber,
          herbId: trace.herbId,
          farmId: trace.farmId,
          traces: []
        });
      }
      batches.get(trace.batchNumber).traces.push(trace);
    });
    
    return Array.from(batches.values());
  }
}
