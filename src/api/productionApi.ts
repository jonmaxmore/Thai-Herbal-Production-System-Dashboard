
// Production API Layer - Frontend API interface
import { ProductionService } from '@/services/productionService';
import { FarmerId, TraceId } from '@/utils/database/types';

export class ProductionApi {
  // Trace endpoints
  static async getTraces() {
    try {
      return {
        success: true,
        data: ProductionService.getAllTraces()
      };
    } catch (error) {
      console.error('Get traces API error:', error);
      return { success: false, error: 'Failed to fetch traces' };
    }
  }

  static async getTraceById(traceId: TraceId) {
    try {
      const trace = ProductionService.getTraceById(traceId);
      return {
        success: true,
        data: trace
      };
    } catch (error) {
      console.error('Get trace API error:', error);
      return { success: false, error: 'Failed to fetch trace' };
    }
  }

  static async getTracesByFarm(farmId: FarmerId) {
    try {
      return {
        success: true,
        data: ProductionService.getTracesByFarm(farmId)
      };
    } catch (error) {
      console.error('Get traces by farm API error:', error);
      return { success: false, error: 'Failed to fetch traces by farm' };
    }
  }

  // Activity endpoints
  static async getFarmingActivities() {
    try {
      return {
        success: true,
        data: ProductionService.getFarmingActivities()
      };
    } catch (error) {
      console.error('Get farming activities API error:', error);
      return { success: false, error: 'Failed to fetch farming activities' };
    }
  }

  static async getActivitiesByFarm(farmId: FarmerId) {
    try {
      return {
        success: true,
        data: ProductionService.getActivitiesByFarm(farmId)
      };
    } catch (error) {
      console.error('Get activities by farm API error:', error);
      return { success: false, error: 'Failed to fetch activities by farm' };
    }
  }

  // Production batch endpoints
  static async getProductionBatches() {
    try {
      return {
        success: true,
        data: ProductionService.getProductionBatches()
      };
    } catch (error) {
      console.error('Get production batches API error:', error);
      return { success: false, error: 'Failed to fetch production batches' };
    }
  }
}
