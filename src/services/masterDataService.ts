
// Simplified Master Data Services - Core functionality only
import { HerbId, FarmerId } from '@/utils/database/types';
import { mockDatabase } from '@/utils/database';

export class MasterDataService {
  // Core herb services
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

  // Core farm services
  static getAllFarms() {
    return Object.values(mockDatabase.farmers);
  }

  static getFarmById(farmerId: FarmerId) {
    return mockDatabase.farmers[farmerId];
  }

  static getFarmsByProvince(province: string) {
    return this.getAllFarms().filter(farm => farm.province === province);
  }

  // Core certification data
  static getCertificationTypes() {
    return ['gacp', 'euGmp', 'dttm'];
  }

  static getInspectionProcessTypes() {
    return ['GACP Certification', 'EU-GMP Certification', 'DTTM Certification', 'Quality Control'];
  }
}
