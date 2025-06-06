
// Enhanced Analytics Services - Comprehensive metrics and insights
import { mockDatabase } from '@/utils/database';
import { EnhancedFarm, HerbData, EnhancedTrace } from '@/utils/database/types';

export class AnalyticsService {
  // Enhanced certification statistics with trends
  static getCertificationStatistics() {
    const farms = Object.values(mockDatabase.farmers) as EnhancedFarm[];
    
    const gapcStats = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0, "In Progress": 0 };
    const euGmpStats = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0, "In Progress": 0 };
    const dttmStats = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0, "In Progress": 0 };
    
    farms.forEach(farm => {
      gapcStats[farm.gacp as keyof typeof gapcStats]++;
      euGmpStats[farm.euGmp as keyof typeof euGmpStats]++;
      dttmStats[farm.dttm as keyof typeof dttmStats]++;
    });

    // Calculate certification rates
    const totalFarms = farms.length;
    const gapcPassRate = Math.round((gapcStats.Passed / totalFarms) * 100);
    const euGmpPassRate = Math.round((euGmpStats.Passed / totalFarms) * 100);
    const dttmPassRate = Math.round((dttmStats.Passed / totalFarms) * 100);

    return { 
      gapcStats, 
      euGmpStats, 
      dttmStats,
      passRates: {
        gacp: gapcPassRate,
        euGmp: euGmpPassRate,
        dttm: dttmPassRate,
        overall: Math.round(((gapcStats.Passed + euGmpStats.Passed + dttmStats.Passed) / (totalFarms * 3)) * 100)
      }
    };
  }

  // Enhanced production statistics with cannabis focus
  static getProductionStatistics() {
    const traces = Object.values(mockDatabase.traces) as EnhancedTrace[];
    const herbs = Object.values(mockDatabase.herbs) as HerbData[];
    const farms = Object.values(mockDatabase.farmers) as EnhancedFarm[];
    
    const qualityDistribution = { "A": 0, "B": 0, "C": 0, "Premium": 0 };
    const categoryDistribution = { "cannabis": 0, "traditional": 0 };
    
    traces.forEach(trace => {
      qualityDistribution[trace.qualityGrade as keyof typeof qualityDistribution]++;
    });
    
    herbs.forEach(herb => {
      categoryDistribution[herb.category as keyof typeof categoryDistribution]++;
    });

    // Calculate cannabis-specific metrics
    const cannabisHerbs = herbs.filter(h => h.category === 'cannabis');
    const traditionalHerbs = herbs.filter(h => h.category === 'traditional');
    const cannabisPercentage = Math.round((cannabisHerbs.length / herbs.length) * 100);

    // Provincial distribution
    const provincialDistribution: Record<string, number> = {};
    farms.forEach(farm => {
      provincialDistribution[farm.province] = (provincialDistribution[farm.province] || 0) + 1;
    });

    // Top 5 provinces
    const topProvinces = Object.entries(provincialDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([province, count]) => ({ province, count }));

    return {
      totalTraces: traces.length,
      totalHerbs: herbs.length,
      totalFarms: farms.length,
      qualityDistribution,
      categoryDistribution,
      cannabisPercentage,
      traditionalPercentage: 100 - cannabisPercentage,
      organicFarms: farms.filter(f => f.organicCertified).length,
      averageQuality: this.calculateAverageQuality(traces),
      topProvinces,
      monthlyProduction: this.getMonthlyProductionTrends()
    };
  }

  // Enhanced production trends with cannabis vs traditional breakdown
  static getProductionTrends() {
    const traces = Object.values(mockDatabase.traces) as EnhancedTrace[];
    const herbs = Object.values(mockDatabase.herbs) as HerbData[];
    const last90Days = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    
    const recentTraces = traces.filter(trace => 
      new Date(trace.timestamp) >= last90Days
    );

    const trendData = [];
    for (let i = 89; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayTraces = recentTraces.filter(trace => {
        const traceDate = new Date(trace.timestamp);
        return traceDate.toDateString() === date.toDateString();
      });
      
      const cannabisTraces = dayTraces.filter(trace => {
        const herb = herbs.find(h => h.id === trace.herbId);
        return herb?.category === 'cannabis';
      });

      const traditionalTraces = dayTraces.filter(trace => {
        const herb = herbs.find(h => h.id === trace.herbId);
        return herb?.category === 'traditional';
      });
      
      trendData.push({
        date: date.toISOString().split('T')[0],
        traces: dayTraces.length,
        cannabisTraces: cannabisTraces.length,
        traditionalTraces: traditionalTraces.length,
        quantity: dayTraces.reduce((sum, trace) => sum + trace.quantity, 0),
        cannabisQuantity: cannabisTraces.reduce((sum, trace) => sum + trace.quantity, 0),
        traditionalQuantity: traditionalTraces.reduce((sum, trace) => sum + trace.quantity, 0)
      });
    }

    return trendData;
  }

  // Get monthly production trends
  static getMonthlyProductionTrends() {
    const traces = Object.values(mockDatabase.traces) as EnhancedTrace[];
    const monthlyData: Record<string, { traces: number; quantity: number }> = {};
    
    traces.forEach(trace => {
      const date = new Date(trace.timestamp);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { traces: 0, quantity: 0 };
      }
      
      monthlyData[monthKey].traces++;
      monthlyData[monthKey].quantity += trace.quantity;
    });
    
    return Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months
  }

  // Cannabis-specific analytics
  static getCannabisAnalytics() {
    const herbs = Object.values(mockDatabase.herbs) as HerbData[];
    const traces = Object.values(mockDatabase.traces) as EnhancedTrace[];
    const farms = Object.values(mockDatabase.farmers) as EnhancedFarm[];
    
    const cannabisHerbs = herbs.filter(h => h.category === 'cannabis');
    const cannabisTraces = traces.filter(trace => {
      const herb = herbs.find(h => h.id === trace.herbId);
      return herb?.category === 'cannabis';
    });
    
    const cannabisFarms = farms.filter(farm => {
      const herb = herbs.find(h => h.farmerId === farm.id);
      return herb?.category === 'cannabis';
    });

    // THC/CBD content analysis
    const thcLevels = cannabisHerbs
      .filter(h => h.thcContent !== undefined)
      .map(h => h.thcContent!);
    
    const cbdLevels = cannabisHerbs
      .filter(h => h.cbdContent !== undefined)
      .map(h => h.cbdContent!);

    const avgTHC = thcLevels.length > 0 ? thcLevels.reduce((a, b) => a + b, 0) / thcLevels.length : 0;
    const avgCBD = cbdLevels.length > 0 ? cbdLevels.reduce((a, b) => a + b, 0) / cbdLevels.length : 0;

    return {
      totalCannabisHerbs: cannabisHerbs.length,
      totalCannabisTraces: cannabisTraces.length,
      totalCannabisFarms: cannabisFarms.length,
      avgTHCContent: Math.round(avgTHC * 100) / 100,
      avgCBDContent: Math.round(avgCBD * 100) / 100,
      cannabisPercentage: Math.round((cannabisHerbs.length / herbs.length) * 100),
      qualityDistribution: this.getCannabisQualityDistribution(cannabisTraces)
    };
  }

  // Get cannabis quality distribution
  static getCannabisQualityDistribution(cannabisTraces: EnhancedTrace[]) {
    const distribution = { "Premium": 0, "A": 0, "B": 0, "C": 0 };
    cannabisTraces.forEach(trace => {
      distribution[trace.qualityGrade as keyof typeof distribution]++;
    });
    return distribution;
  }

  // Enhanced stakeholder analytics
  static getStakeholderAnalytics() {
    const users = Object.values(mockDatabase.users);
    const farms = Object.values(mockDatabase.farmers);
    const processes = Object.values(mockDatabase.inspectionProcesses);
    
    const roleDistribution = users.reduce((acc: Record<string, number>, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    const activeUsers = users.filter(u => u.status === 'active').length;
    const verifiedUsers = users.filter(u => u.verificationStatus === true).length;
    
    const processingEfficiency = {
      totalProcesses: processes.length,
      completedProcesses: processes.filter((p: any) => ['Passed', 'Failed'].includes(p.status)).length,
      passedProcesses: processes.filter((p: any) => p.status === 'Passed').length,
      avgProcessingTime: this.calculateAverageProcessingTime(processes)
    };

    return {
      totalUsers: users.length,
      activeUsers,
      verifiedUsers,
      roleDistribution,
      processingEfficiency,
      farmOwnershipStats: {
        totalFarms: farms.length,
        organicFarms: farms.filter((f: any) => f.organicCertified).length,
        averageFarmSize: farms.reduce((sum: number, farm: any) => sum + (farm.cultivationArea || 0), 0) / farms.length
      }
    };
  }

  // Calculate average processing time for inspections
  private static calculateAverageProcessingTime(processes: any[]) {
    const completedProcesses = processes.filter(p => p.completionDate && p.startDate);
    if (completedProcesses.length === 0) return 0;
    
    const totalDays = completedProcesses.reduce((sum, process) => {
      const start = new Date(process.startDate);
      const end = new Date(process.completionDate);
      return sum + Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);
    
    return Math.round(totalDays / completedProcesses.length);
  }

  private static calculateAverageQuality(traces: EnhancedTrace[]) {
    const qualityMap = { Premium: 4, A: 3, B: 2, C: 1 };
    const total = traces.reduce((sum, trace) => sum + (qualityMap[trace.qualityGrade] || 0), 0);
    return Math.round((total / traces.length) * 100) / 100;
  }

  // System performance metrics
  static getSystemPerformanceMetrics() {
    const data = {
      farmers: Object.keys(mockDatabase.farmers).length,
      herbs: Object.keys(mockDatabase.herbs).length,
      traces: Object.keys(mockDatabase.traces).length,
      transactions: Object.keys(mockDatabase.transactions).length,
      processes: Object.keys(mockDatabase.inspectionProcesses).length,
      users: Object.keys(mockDatabase.users).length
    };

    const performance = {
      dataCompleteness: this.calculateDataCompleteness(),
      systemHealth: this.assessSystemHealth(data),
      recommendations: this.generateRecommendations(data)
    };

    return { data, performance };
  }

  private static calculateDataCompleteness() {
    const farms = Object.values(mockDatabase.farmers);
    let totalFields = 0;
    let completedFields = 0;

    farms.forEach((farm: any) => {
      const fields = ['name', 'herb', 'province', 'owner.name', 'owner.email', 'lastInspectionDate'];
      fields.forEach(field => {
        totalFields++;
        if (this.getNestedProperty(farm, field)) completedFields++;
      });
    });

    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  }

  private static getNestedProperty(obj: any, path: string) {
    return path.split('.').reduce((o, p) => o && o[p], obj);
  }

  private static assessSystemHealth(data: any) {
    const scores = {
      dataVolume: Math.min(100, (data.farmers / 100) * 100), // Target: 100 farmers
      dataQuality: this.calculateDataCompleteness(),
      certification: this.getCertificationScore(),
      cannabis: this.getCannabisTargetScore()
    };

    const overallScore = Object.values(scores).reduce((a, b) => a + b, 0) / 4;
    
    return {
      scores,
      overall: Math.round(overallScore),
      status: overallScore >= 80 ? 'ดีเยี่ยม' : overallScore >= 60 ? 'ดี' : overallScore >= 40 ? 'ปานกลาง' : 'ต้องปรับปรุง'
    };
  }

  private static getCertificationScore() {
    const { passRates } = this.getCertificationStatistics();
    return passRates.overall;
  }

  private static getCannabisTargetScore() {
    const { cannabisPercentage } = this.getCannabisAnalytics();
    return Math.min(100, (cannabisPercentage / 70) * 100); // Target: 70% cannabis
  }

  private static generateRecommendations(data: any) {
    const recommendations = [];
    
    if (data.farmers < 100) {
      recommendations.push("เพิ่มจำนวนเกษตรกรให้ถึง 100 ราย");
    }
    
    const { cannabisPercentage } = this.getCannabisAnalytics();
    if (cannabisPercentage < 70) {
      recommendations.push("เพิ่มสัดส่วนการปลูกกัญชาให้ถึง 70%");
    }
    
    const { passRates } = this.getCertificationStatistics();
    if (passRates.overall < 60) {
      recommendations.push("ปรับปรุงอัตราการผ่านการรับรองมาตรฐาน");
    }
    
    if (data.traces < 1000) {
      recommendations.push("เพิ่มข้อมูลการตรวจสอบย้อนกลับ");
    }

    return recommendations;
  }
}
