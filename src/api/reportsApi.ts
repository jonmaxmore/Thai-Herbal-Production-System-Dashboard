
// Reports API Layer - Frontend API interface
import { ReportService } from '@/services/reportService';

export class ReportsApi {
  static async generateProductionReport(filters?: {
    farmId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    try {
      const report = ReportService.generateProductionReport(
        filters?.farmId,
        filters?.startDate,
        filters?.endDate
      );
      
      return {
        success: true,
        data: report
      };
    } catch (error) {
      console.error('Generate production report API error:', error);
      return { success: false, error: 'Failed to generate production report' };
    }
  }

  static async generateCertificationReport() {
    try {
      const report = ReportService.generateCertificationReport();
      
      return {
        success: true,
        data: report
      };
    } catch (error) {
      console.error('Generate certification report API error:', error);
      return { success: false, error: 'Failed to generate certification report' };
    }
  }

  static async generateComplianceReport() {
    try {
      const report = ReportService.generateComplianceReport();
      
      return {
        success: true,
        data: report
      };
    } catch (error) {
      console.error('Generate compliance report API error:', error);
      return { success: false, error: 'Failed to generate compliance report' };
    }
  }

  static async generateCustomReport(config: {
    title: string;
    sections: Array<'production' | 'certification' | 'compliance' | 'analytics'>;
    filters?: any;
  }) {
    try {
      const report = ReportService.buildCustomReport(config);
      
      return {
        success: true,
        data: report
      };
    } catch (error) {
      console.error('Generate custom report API error:', error);
      return { success: false, error: 'Failed to generate custom report' };
    }
  }
}
