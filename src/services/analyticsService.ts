
// Analytics Services Layer - Data analysis and insights
import { mockDatabase } from '@/utils/database';
import { MasterDataService } from './masterDataService';
import { ProductionService } from './productionService';

export class AnalyticsService {
  // Production analytics
  static getProductionStatistics() {
    const farms = MasterDataService.getAllFarms();
    const traces = ProductionService.getAllTraces();
    const activities = ProductionService.getFarmingActivities();

    return {
      totalFarms: farms.length,
      totalProduction: traces.length,
      totalActivities: activities.length,
      averageProductionPerFarm: traces.length / farms.length,
      productionByProvince: this.getProductionByProvince(farms, traces),
      qualityDistribution: this.getQualityDistribution(traces)
    };
  }

  private static getProductionByProvince(farms: any[], traces: any[]) {
    const provinceStats = new Map();
    
    farms.forEach(farm => {
      const farmTraces = traces.filter(trace => trace.farmId === farm.id);
      provinceStats.set(farm.province, (provinceStats.get(farm.province) || 0) + farmTraces.length);
    });
    
    return Array.from(provinceStats.entries()).map(([province, count]) => ({
      province,
      count
    }));
  }

  private static getQualityDistribution(traces: any[]) {
    const qualityStats = traces.reduce((acc, trace) => {
      acc[trace.qualityGrade] = (acc[trace.qualityGrade] || 0) + 1;
      return acc;
    }, {});
    
    return qualityStats;
  }

  // Certification analytics
  static getCertificationStatistics() {
    const farms = MasterDataService.getAllFarms();
    
    const gapcStats = { Passed: 0, Failed: 0, Pending: 0, Expired: 0 };
    const euGmpStats = { Passed: 0, Failed: 0, Pending: 0, Expired: 0 };
    const dttmStats = { Passed: 0, Failed: 0, Pending: 0, Expired: 0 };
    
    farms.forEach(farm => {
      gapcStats[farm.gacp?.status || 'Pending']++;
      euGmpStats[farm.euGmp]++;
      dttmStats[farm.dttm]++;
    });

    return { gapcStats, euGmpStats, dttmStats };
  }

  // Trend analysis
  static getProductionTrends(period: 'daily' | 'weekly' | 'monthly' = 'monthly') {
    const traces = ProductionService.getAllTraces();
    const trendData = new Map();
    
    traces.forEach(trace => {
      const date = new Date(trace.timestamp);
      let key: string;
      
      switch (period) {
        case 'daily':
          key = date.toISOString().split('T')[0];
          break;
        case 'weekly':
          const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
      }
      
      trendData.set(key, (trendData.get(key) || 0) + 1);
    });
    
    return Array.from(trendData.entries()).map(([period, count]) => ({
      period,
      count
    })).sort((a, b) => a.period.localeCompare(b.period));
  }
}
