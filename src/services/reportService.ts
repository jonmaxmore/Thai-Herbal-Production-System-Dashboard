
// Report Services Layer - Report generation and management
import { AnalyticsService } from './analyticsService';
import { MasterDataService } from './masterDataService';
import { ProductionService } from './productionService';
import { UserService } from './userService';
import { mockDatabase } from '@/utils/database';

export class ReportService {
  // Production reports
  static generateProductionReport(farmId?: string, startDate?: Date, endDate?: Date) {
    let traces = ProductionService.getAllTraces();
    
    if (farmId) {
      traces = traces.filter(trace => trace.farmId === farmId);
    }
    
    if (startDate || endDate) {
      traces = traces.filter(trace => {
        const traceDate = new Date(trace.timestamp);
        if (startDate && traceDate < startDate) return false;
        if (endDate && traceDate > endDate) return false;
        return true;
      });
    }

    return {
      reportType: 'Production Report',
      generatedAt: new Date(),
      filters: { farmId, startDate, endDate },
      summary: {
        totalTraces: traces.length,
        uniqueBatches: new Set(traces.map(t => t.batchNumber)).size,
        averageQuality: this.calculateAverageQuality(traces)
      },
      details: traces,
      charts: {
        productionTrends: AnalyticsService.getProductionTrends(),
        qualityDistribution: AnalyticsService.getProductionStatistics().qualityDistribution
      }
    };
  }

  // Certification reports
  static generateCertificationReport() {
    const farms = MasterDataService.getAllFarms();
    const certificationStats = AnalyticsService.getCertificationStatistics();
    
    return {
      reportType: 'Certification Report',
      generatedAt: new Date(),
      summary: {
        totalFarms: farms.length,
        certificationStats
      },
      details: farms.map(farm => ({
        farmId: farm.id,
        farmName: farm.name,
        gacp: farm.gacp,
        euGmp: farm.euGmp,
        dttm: farm.dttm,
        lastInspection: farm.lastInspectionDate
      }))
    };
  }

  // Compliance reports
  static generateComplianceReport() {
    const inspections = Object.values(mockDatabase.inspectionProcesses);
    
    const complianceStats = {
      totalInspections: inspections.length,
      passed: inspections.filter((i: any) => i.status === 'Passed').length,
      failed: inspections.filter((i: any) => i.status === 'Failed').length,
      pending: inspections.filter((i: any) => i.status === 'Pending Review').length
    };

    return {
      reportType: 'Compliance Report',
      generatedAt: new Date(),
      summary: complianceStats,
      details: inspections,
      complianceRate: (complianceStats.passed / complianceStats.totalInspections) * 100
    };
  }

  // Custom report builder
  static buildCustomReport(config: {
    title: string;
    sections: Array<'production' | 'certification' | 'compliance' | 'analytics'>;
    filters?: any;
  }) {
    const sections = {};
    
    if (config.sections.includes('production')) {
      sections['production'] = this.generateProductionReport();
    }
    
    if (config.sections.includes('certification')) {
      sections['certification'] = this.generateCertificationReport();
    }
    
    if (config.sections.includes('compliance')) {
      sections['compliance'] = this.generateComplianceReport();
    }
    
    if (config.sections.includes('analytics')) {
      sections['analytics'] = AnalyticsService.getProductionStatistics();
    }

    return {
      title: config.title,
      generatedAt: new Date(),
      sections,
      filters: config.filters
    };
  }

  private static calculateAverageQuality(traces: any[]) {
    const qualityMap = { Premium: 4, A: 3, B: 2, C: 1 };
    const total = traces.reduce((sum, trace) => sum + (qualityMap[trace.qualityGrade] || 0), 0);
    return total / traces.length;
  }
}
