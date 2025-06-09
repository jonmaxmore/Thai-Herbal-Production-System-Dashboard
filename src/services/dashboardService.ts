
// Shared Analytics Dashboard Service for Cross-Department Insights
import { mockDatabase } from '@/utils/database';
import { notificationService } from './notificationService';
import { serviceRegistry } from './serviceRegistry';

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'table' | 'map' | 'alert';
  department: string;
  data: any;
  config: {
    refreshInterval?: number;
    size: 'small' | 'medium' | 'large';
    position: { x: number; y: number };
  };
  permissions: {
    viewers: string[];
    editors: string[];
  };
}

export interface DashboardLayout {
  id: string;
  name: string;
  department: string;
  widgets: DashboardWidget[];
  shared: boolean;
  createdBy: string;
  lastModified: Date;
}

class DashboardService {
  private dashboards: Map<string, DashboardLayout> = new Map();
  private widgets: Map<string, DashboardWidget> = new Map();

  constructor() {
    this.initializeDefaultDashboards();
  }

  // Initialize default dashboards for each department
  private initializeDefaultDashboards() {
    const defaultDashboards: Omit<DashboardLayout, 'lastModified'>[] = [
      {
        id: 'farm_overview',
        name: 'ภาพรวมการจัดการฟาร์ม',
        department: 'farm_management',
        shared: true,
        createdBy: 'system',
        widgets: []
      },
      {
        id: 'lab_operations',
        name: 'การดำเนินงานห้องปฏิบัติการ',
        department: 'lab_services',
        shared: true,
        createdBy: 'system',
        widgets: []
      },
      {
        id: 'certification_status',
        name: 'สถานะการรับรอง',
        department: 'certification',
        shared: true,
        createdBy: 'system',
        widgets: []
      },
      {
        id: 'production_metrics',
        name: 'ตัวชี้วัดการผลิต',
        department: 'manufacturing',
        shared: true,
        createdBy: 'system',
        widgets: []
      },
      {
        id: 'executive_summary',
        name: 'สรุปผู้บริหาร',
        department: 'analytics',
        shared: true,
        createdBy: 'system',
        widgets: []
      }
    ];

    defaultDashboards.forEach(dashboard => {
      this.createDashboard({
        ...dashboard,
        lastModified: new Date()
      });
    });

    this.createDefaultWidgets();
  }

  // Create default widgets for dashboards
  private createDefaultWidgets() {
    const data = mockDatabase;
    
    // Farm management widgets
    this.addWidget('farm_overview', {
      id: 'farm_count_metric',
      title: 'จำนวนฟาร์มทั้งหมด',
      type: 'metric',
      department: 'farm_management',
      data: { value: Object.keys(data.farmers).length, trend: '+5%' },
      config: { size: 'small', position: { x: 0, y: 0 } },
      permissions: { viewers: ['farm_management', 'analytics'], editors: ['farm_management'] }
    });

    this.addWidget('farm_overview', {
      id: 'certification_distribution',
      title: 'การกระจายตัวของการรับรอง',
      type: 'chart',
      department: 'farm_management',
      data: this.getCertificationDistribution(),
      config: { size: 'medium', position: { x: 1, y: 0 } },
      permissions: { viewers: ['farm_management', 'certification', 'analytics'], editors: ['farm_management'] }
    });

    // Lab services widgets
    this.addWidget('lab_operations', {
      id: 'pending_tests',
      title: 'การทดสอบที่รออยู่',
      type: 'metric',
      department: 'lab_services',
      data: { value: this.getPendingTestsCount(), trend: '-2%' },
      config: { size: 'small', position: { x: 0, y: 0 } },
      permissions: { viewers: ['lab_services', 'analytics'], editors: ['lab_services'] }
    });

    // Certification widgets
    this.addWidget('certification_status', {
      id: 'expiring_certificates',
      title: 'ใบรับรองที่ใกล้หมดอายุ',
      type: 'alert',
      department: 'certification',
      data: this.getExpiringCertificates(),
      config: { size: 'medium', position: { x: 0, y: 0 } },
      permissions: { viewers: ['certification', 'farm_management', 'analytics'], editors: ['certification'] }
    });

    // Executive summary widgets
    this.addWidget('executive_summary', {
      id: 'system_health',
      title: 'สุขภาพระบบ',
      type: 'chart',
      department: 'analytics',
      data: this.getSystemHealthData(),
      config: { size: 'large', position: { x: 0, y: 0 } },
      permissions: { viewers: ['analytics', 'admin'], editors: ['analytics'] }
    });
  }

  // Create a new dashboard
  createDashboard(dashboard: DashboardLayout) {
    this.dashboards.set(dashboard.id, dashboard);
    
    notificationService.createNotification({
      type: 'info',
      title: 'แดชบอร์ดใหม่ถูกสร้าง',
      message: `แดชบอร์ด ${dashboard.name} ถูกสร้างสำหรับ ${dashboard.department}`,
      department: dashboard.department,
      priority: 'low'
    });
  }

  // Add widget to dashboard
  addWidget(dashboardId: string, widget: DashboardWidget) {
    const dashboard = this.dashboards.get(dashboardId);
    if (dashboard) {
      dashboard.widgets.push(widget);
      dashboard.lastModified = new Date();
      this.widgets.set(widget.id, widget);
    }
  }

  // Get dashboard by ID
  getDashboard(dashboardId: string): DashboardLayout | undefined {
    return this.dashboards.get(dashboardId);
  }

  // Get dashboards for a department
  getDepartmentDashboards(department: string): DashboardLayout[] {
    return Array.from(this.dashboards.values()).filter(
      dashboard => dashboard.department === department || dashboard.shared
    );
  }

  // Get cross-departmental insights
  getCrossDepartmentalInsights() {
    const data = mockDatabase;
    const farms = Object.values(data.farmers);
    const traces = Object.values(data.traces);
    const inspections = Object.values(data.inspectionProcesses);

    return {
      farmToLabEfficiency: {
        averageTestTurnaround: this.calculateAverageTestTurnaround(),
        sampleBacklog: this.getPendingTestsCount()
      },
      certificationTrends: {
        gacp: this.getCertificationTrend('gacp'),
        euGmp: this.getCertificationTrend('euGmp'),
        dttm: this.getCertificationTrend('dttm')
      },
      productionFlow: {
        totalBatches: traces.length,
        averageBatchSize: traces.reduce((sum, t) => sum + t.quantity, 0) / traces.length,
        qualityGradeDistribution: this.getQualityGradeDistribution()
      },
      systemPerformance: {
        activeServices: serviceRegistry.performHealthCheck().activeServices,
        dataIntegrity: this.calculateDataIntegrityScore(),
        departmentCollaboration: this.getDepartmentCollaborationScore()
      }
    };
  }

  // Helper methods for data calculations
  private getCertificationDistribution() {
    const farms = Object.values(mockDatabase.farmers);
    const distribution = {
      gacp: { passed: 0, pending: 0, failed: 0 },
      euGmp: { passed: 0, pending: 0, failed: 0 },
      dttm: { passed: 0, pending: 0, failed: 0 }
    };

    farms.forEach(farm => {
      distribution.gacp[farm.gacp.toLowerCase() as keyof typeof distribution.gacp]++;
      distribution.euGmp[farm.euGmp.toLowerCase() as keyof typeof distribution.euGmp]++;
      distribution.dttm[farm.dttm.toLowerCase() as keyof typeof distribution.dttm]++;
    });

    return distribution;
  }

  private getPendingTestsCount(): number {
    const inspections = Object.values(mockDatabase.inspectionProcesses);
    return inspections.filter(i => i.status === 'In Progress' || i.status === 'Pending').length;
  }

  private getExpiringCertificates() {
    const farms = Object.values(mockDatabase.farmers);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return farms.filter(farm => {
      const nextInspection = farm.nextInspectionDate ? new Date(farm.nextInspectionDate) : null;
      return nextInspection && nextInspection <= thirtyDaysFromNow;
    }).map(farm => ({
      farmName: farm.name,
      nextInspectionDate: farm.nextInspectionDate,
      certificationType: 'GACP' // Simplified
    }));
  }

  private getSystemHealthData() {
    const healthCheck = serviceRegistry.performHealthCheck();
    return {
      services: {
        active: healthCheck.activeServices,
        inactive: healthCheck.inactiveServices,
        maintenance: healthCheck.maintenanceServices
      },
      dataQuality: this.calculateDataIntegrityScore(),
      notifications: notificationService.getNotificationStats('analytics')
    };
  }

  private calculateAverageTestTurnaround(): number {
    const completedInspections = Object.values(mockDatabase.inspectionProcesses)
      .filter(i => i.completionDate);
    
    if (completedInspections.length === 0) return 0;

    const totalDays = completedInspections.reduce((sum, inspection) => {
      const start = new Date(inspection.startDate);
      const end = new Date(inspection.completionDate!);
      return sum + Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);

    return Math.round(totalDays / completedInspections.length);
  }

  private getCertificationTrend(type: 'gacp' | 'euGmp' | 'dttm') {
    const farms = Object.values(mockDatabase.farmers);
    const passedCount = farms.filter(farm => farm[type] === 'Passed').length;
    return {
      current: passedCount,
      total: farms.length,
      percentage: Math.round((passedCount / farms.length) * 100)
    };
  }

  private getQualityGradeDistribution() {
    const traces = Object.values(mockDatabase.traces);
    const distribution = { A: 0, B: 0, C: 0, Premium: 0 };
    
    traces.forEach(trace => {
      if (trace.qualityGrade in distribution) {
        distribution[trace.qualityGrade as keyof typeof distribution]++;
      }
    });

    return distribution;
  }

  private calculateDataIntegrityScore(): number {
    const farms = Object.values(mockDatabase.farmers);
    const herbs = Object.values(mockDatabase.herbs);
    const traces = Object.values(mockDatabase.traces);
    
    const linkedHerbs = herbs.filter(h => farms.find(f => f.id === h.farmerId));
    const linkedTraces = traces.filter(t => farms.find(f => f.id === t.farmId));
    
    const herbsIntegrity = herbs.length > 0 ? linkedHerbs.length / herbs.length : 1;
    const tracesIntegrity = traces.length > 0 ? linkedTraces.length / traces.length : 1;
    
    return Math.round(((herbsIntegrity + tracesIntegrity) / 2) * 100);
  }

  private getDepartmentCollaborationScore(): number {
    const coordination = serviceRegistry.getDepartmentCoordination();
    const totalDepartments = coordination.length;
    const activeDepartments = coordination.filter(dept => dept.activeServices > 0).length;
    
    return Math.round((activeDepartments / totalDepartments) * 100);
  }

  // Real-time data update method
  updateWidgetData(widgetId: string, newData: any) {
    const widget = this.widgets.get(widgetId);
    if (widget) {
      widget.data = newData;
      
      // Notify subscribers of data update
      notificationService.createNotification({
        type: 'info',
        title: 'ข้อมูลแดชบอร์ดอัปเดต',
        message: `ข้อมูลใน ${widget.title} ถูกอัปเดตแล้ว`,
        department: widget.department,
        priority: 'low'
      });
    }
  }
}

export const dashboardService = new DashboardService();
