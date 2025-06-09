
// Simplified Master Data Services - Core functionality only
import { HerbId, FarmerId } from '@/utils/database/types';
import { mockDatabase } from '@/utils/database';
import { HerbData, EnhancedFarm } from '@/utils/database/types';

export class MasterDataService {
  // Core herb services
  static getAllHerbs() {
    return Object.values(mockDatabase.herbs) as HerbData[];
  }

  static getHerbById(herbId: HerbId) {
    return mockDatabase.herbs[herbId] as HerbData;
  }

  static getCannabisHerbs() {
    return this.getAllHerbs().filter(herb => herb.category === 'cannabis');
  }

  static getTraditionalHerbs() {
    return this.getAllHerbs().filter(herb => herb.category === 'traditional');
  }

  // Core farm services
  static getAllFarms() {
    return Object.values(mockDatabase.farmers) as EnhancedFarm[];
  }

  static getFarmById(farmerId: FarmerId) {
    return mockDatabase.farmers[farmerId] as EnhancedFarm;
  }

  static getFarmsByProvince(province: string) {
    return this.getAllFarms().filter(farm => farm.province === province);
  }

  // Updated certification services - GACP primary, others optional
  static getCertificationTypes() {
    return {
      primary: ['gacp'],
      optional: ['euGmp', 'dttm', 'tis']
    };
  }

  static getInspectionProcessTypes() {
    return ['GACP Certification', 'EU-GMP Certification', 'DTTM Certification', 'TIS Certification', 'Quality Control'];
  }

  // Get farms with GACP certification status
  static getFarmsByGACPStatus(status: string) {
    return this.getAllFarms().filter(farm => farm.gacp === status);
  }

  // Get farms with optional certifications
  static getFarmsWithOptionalCertifications() {
    return this.getAllFarms().filter(farm => 
      farm.optionalCertifications && (
        farm.optionalCertifications.euGmp === "Approved" ||
        farm.optionalCertifications.dttm === "Approved" ||
        farm.optionalCertifications.tis === "Approved"
      )
    );
  }

  // Get certification statistics
  static getCertificationStatistics() {
    const farms = this.getAllFarms();
    
    const gacpStats = farms.reduce((acc, farm) => {
      acc[farm.gacp] = (acc[farm.gacp] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const optionalStats = {
      euGmp: {},
      dttm: {},
      tis: {}
    };

    farms.forEach(farm => {
      if (farm.optionalCertifications) {
        if (farm.optionalCertifications.euGmp) {
          optionalStats.euGmp[farm.optionalCertifications.euGmp] = 
            (optionalStats.euGmp[farm.optionalCertifications.euGmp] || 0) + 1;
        }
        if (farm.optionalCertifications.dttm) {
          optionalStats.dttm[farm.optionalCertifications.dttm] = 
            (optionalStats.dttm[farm.optionalCertifications.dttm] || 0) + 1;
        }
        if (farm.optionalCertifications.tis) {
          optionalStats.tis[farm.optionalCertifications.tis] = 
            (optionalStats.tis[farm.optionalCertifications.tis] || 0) + 1;
        }
      }
    });

    return {
      gacp: gacpStats,
      optional: optionalStats,
      totalFarms: farms.length,
      gacpCoverage: ((gacpStats["Passed"] || 0) / farms.length * 100).toFixed(1)
    };
  }
}
