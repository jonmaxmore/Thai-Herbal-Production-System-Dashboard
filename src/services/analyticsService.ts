
// Simplified Analytics Services - Core metrics only
import { mockDatabase } from '@/utils/database';

export class AnalyticsService {
  // Core certification statistics
  static getCertificationStatistics() {
    const farms = Object.values(mockDatabase.farmers);
    
    const gapcStats = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0 };
    const euGmpStats = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0 };
    const dttmStats = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0 };
    
    farms.forEach(farm => {
      gapcStats[farm.gacp]++;
      euGmpStats[farm.euGmp]++;
      dttmStats[farm.dttm]++;
    });

    return { gapcStats, euGmpStats, dttmStats };
  }

  // Core production statistics
  static getProductionStatistics() {
    const traces = Object.values(mockDatabase.traces);
    const herbs = Object.values(mockDatabase.herbs);
    
    const qualityDistribution = { "A": 0, "B": 0, "C": 0, "Premium": 0 };
    const categoryDistribution = { "cannabis": 0, "traditional": 0 };
    
    traces.forEach(trace => {
      qualityDistribution[trace.qualityGrade]++;
    });
    
    herbs.forEach(herb => {
      categoryDistribution[herb.category]++;
    });

    return {
      totalTraces: traces.length,
      totalHerbs: herbs.length,
      qualityDistribution,
      categoryDistribution,
      averageQuality: this.calculateAverageQuality(traces)
    };
  }

  // Core production trends
  static getProductionTrends() {
    const traces = Object.values(mockDatabase.traces);
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const recentTraces = traces.filter(trace => 
      new Date(trace.timestamp) >= last30Days
    );

    const trendData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayTraces = recentTraces.filter(trace => {
        const traceDate = new Date(trace.timestamp);
        return traceDate.toDateString() === date.toDateString();
      });
      
      trendData.push({
        date: date.toISOString().split('T')[0],
        traces: dayTraces.length,
        quantity: dayTraces.reduce((sum, trace) => sum + trace.quantity, 0)
      });
    }

    return trendData;
  }

  private static calculateAverageQuality(traces: any[]) {
    const qualityMap = { Premium: 4, A: 3, B: 2, C: 1 };
    const total = traces.reduce((sum, trace) => sum + (qualityMap[trace.qualityGrade] || 0), 0);
    return total / traces.length;
  }
}
