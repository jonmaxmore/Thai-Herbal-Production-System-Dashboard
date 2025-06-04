
// Master Data API Layer - Frontend API interface
import { MasterDataService } from '@/services/masterDataService';
import { HerbId, FarmerId } from '@/utils/database/types';

export class MasterDataApi {
  // Herb endpoints
  static async getHerbs() {
    try {
      return {
        success: true,
        data: MasterDataService.getAllHerbs()
      };
    } catch (error) {
      console.error('Get herbs API error:', error);
      return { success: false, error: 'Failed to fetch herbs' };
    }
  }

  static async getHerbById(herbId: HerbId) {
    try {
      const herb = MasterDataService.getHerbById(herbId);
      return {
        success: true,
        data: herb
      };
    } catch (error) {
      console.error('Get herb API error:', error);
      return { success: false, error: 'Failed to fetch herb' };
    }
  }

  // Farm endpoints
  static async getFarms() {
    try {
      return {
        success: true,
        data: MasterDataService.getAllFarms()
      };
    } catch (error) {
      console.error('Get farms API error:', error);
      return { success: false, error: 'Failed to fetch farms' };
    }
  }

  static async getFarmById(farmId: FarmerId) {
    try {
      const farm = MasterDataService.getFarmById(farmId);
      return {
        success: true,
        data: farm
      };
    } catch (error) {
      console.error('Get farm API error:', error);
      return { success: false, error: 'Failed to fetch farm' };
    }
  }

  // Location endpoints
  static async getFarmsByProvince(province: string) {
    try {
      return {
        success: true,
        data: MasterDataService.getFarmsByProvince(province)
      };
    } catch (error) {
      console.error('Get farms by province API error:', error);
      return { success: false, error: 'Failed to fetch farms by province' };
    }
  }
}
