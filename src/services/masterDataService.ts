
// Master Data Services Layer - Handles all master data operations
import { HerbId, FarmerId } from '@/utils/database/types';
import { mockDatabase } from '@/utils/database';

export class MasterDataService {
  // Herb master data services
  static getAllHerbs() {
    return Object.values(mockDatabase.herbs);
  }

  static getHerbById(herbId: HerbId) {
    return mockDatabase.herbs[herbId];
  }

  static getCannabisHerbs() {
    return this.getAllHerbs().filter(herb => herb.category === 'cannabis');
  }

  static getTraditionalHerbs() {
    return this.getAllHerbs().filter(herb => herb.category === 'traditional');
  }

  // Farm master data services
  static getAllFarms() {
    return Object.values(mockDatabase.farmers);
  }

  static getFarmById(farmerId: FarmerId) {
    return mockDatabase.farmers[farmerId];
  }

  static getFarmsByProvince(province: string) {
    return this.getAllFarms().filter(farm => farm.province === province);
  }

  // Field master data services
  static getFieldsByFarm(farmId: FarmerId) {
    const farm = this.getFarmById(farmId);
    if (!farm) return [];
    
    return farm.fields.map(fieldId => mockDatabase.fields[fieldId]).filter(Boolean);
  }

  // Certification master data
  static getCertificationTypes() {
    return ['gapc', 'euGmp', 'dttm', 'cannabis_license'];
  }

  static getInspectionProcessTypes() {
    return ['Lab Testing', 'GACP Certification', 'EU-GMP Certification', 'DTTM Certification', 'Quality Control', 'Market Approval'];
  }
}
