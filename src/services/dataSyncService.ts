
// Real-time Data Synchronization Service for Cross-Department Coordination
import { mockDatabase } from '@/utils/database';
import { notificationService } from './notificationService';
import { dashboardService } from './dashboardService';

export interface SyncEvent {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'farm' | 'herb' | 'trace' | 'inspection' | 'transaction';
  entityId: string;
  data: any;
  timestamp: Date;
  triggeredBy: string;
  affectedDepartments: string[];
}

export interface DataSubscription {
  id: string;
  department: string;
  entityTypes: string[];
  filters?: Record<string, any>;
  callback: (event: SyncEvent) => void;
}

class DataSyncService {
  private subscriptions: Map<string, DataSubscription> = new Map();
  private syncEvents: SyncEvent[] = [];
  private syncQueue: SyncEvent[] = [];
  private isProcessing = false;

  constructor() {
    this.initializeDepartmentSubscriptions();
    this.startSyncProcessor();
  }

  // Initialize default subscriptions for each department
  private initializeDepartmentSubscriptions() {
    // Farm management subscriptions
    this.subscribe({
      id: 'farm_mgmt_sub',
      department: 'farm_management',
      entityTypes: ['farm', 'herb', 'trace'],
      callback: (event) => this.handleFarmManagementSync(event)
    });

    // Lab services subscriptions
    this.subscribe({
      id: 'lab_services_sub',
      department: 'lab_services',
      entityTypes: ['inspection', 'herb'],
      filters: { inspectionType: ['Quality Control', 'Contamination'] },
      callback: (event) => this.handleLabServicesSync(event)
    });

    // Certification subscriptions
    this.subscribe({
      id: 'certification_sub',
      department: 'certification',
      entityTypes: ['farm', 'inspection'],
      filters: { processType: ['GACP Certification', 'EU-GMP Certification', 'DTTM Certification'] },
      callback: (event) => this.handleCertificationSync(event)
    });

    // Manufacturing subscriptions
    this.subscribe({
      id: 'manufacturing_sub',
      department: 'manufacturing',
      entityTypes: ['trace', 'herb', 'transaction'],
      callback: (event) => this.handleManufacturingSync(event)
    });

    // Analytics subscriptions (subscribes to all)
    this.subscribe({
      id: 'analytics_sub',
      department: 'analytics',
      entityTypes: ['farm', 'herb', 'trace', 'inspection', 'transaction'],
      callback: (event) => this.handleAnalyticsSync(event)
    });
  }

  // Subscribe to data changes
  subscribe(subscription: DataSubscription) {
    this.subscriptions.set(subscription.id, subscription);
    console.log(`📡 Department ${subscription.department} subscribed to ${subscription.entityTypes.join(', ')} changes`);
  }

  // Unsubscribe from data changes
  unsubscribe(subscriptionId: string) {
    this.subscriptions.delete(subscriptionId);
  }

  // Trigger a sync event
  triggerSync(event: Omit<SyncEvent, 'id' | 'timestamp'>) {
    const syncEvent: SyncEvent = {
      id: `SYNC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...event
    };

    this.syncQueue.push(syncEvent);
    console.log(`🔄 Sync event triggered: ${event.type} ${event.entity} ${event.entityId}`);
  }

  // Start the sync processor
  private startSyncProcessor() {
    setInterval(() => {
      this.processSyncQueue();
    }, 1000); // Process every second
  }

  // Process queued sync events
  private processSyncQueue() {
    if (this.isProcessing || this.syncQueue.length === 0) return;

    this.isProcessing = true;
    const eventsToProcess = [...this.syncQueue];
    this.syncQueue = [];

    eventsToProcess.forEach(event => {
      this.processSync(event);
    });

    this.isProcessing = false;
  }

  // Process individual sync event
  private processSync(event: SyncEvent) {
    // Store the event
    this.syncEvents.push(event);

    // Notify relevant subscribers
    this.subscriptions.forEach(subscription => {
      if (this.shouldNotifySubscriber(subscription, event)) {
        try {
          subscription.callback(event);
        } catch (error) {
          console.error(`Error notifying subscriber ${subscription.id}:`, error);
        }
      }
    });

    // Create system notification for critical events
    if (this.isCriticalEvent(event)) {
      this.createCriticalNotification(event);
    }
  }

  // Check if subscriber should be notified
  private shouldNotifySubscriber(subscription: DataSubscription, event: SyncEvent): boolean {
    // Check entity type
    if (!subscription.entityTypes.includes(event.entity)) return false;

    // Check department (don't notify department of their own changes)
    if (subscription.department === event.triggeredBy) return false;

    // Check filters if any
    if (subscription.filters) {
      for (const [key, values] of Object.entries(subscription.filters)) {
        if (event.data[key] && !values.includes(event.data[key])) {
          return false;
        }
      }
    }

    return true;
  }

  // Check if event is critical
  private isCriticalEvent(event: SyncEvent): boolean {
    if (event.entity === 'inspection' && event.data.status === 'Failed') return true;
    if (event.entity === 'herb' && event.data.qualityIssue) return true;
    if (event.entity === 'farm' && event.data.certificationExpired) return true;
    return false;
  }

  // Create critical notification
  private createCriticalNotification(event: SyncEvent) {
    let message = '';
    let title = '';

    switch (event.entity) {
      case 'inspection':
        if (event.data.status === 'Failed') {
          title = 'การตรวจสอบล้มเหลว';
          message = `การตรวจสอบ ${event.data.processType} ล้มเหลว - ต้องการการแก้ไข`;
        }
        break;
      case 'herb':
        if (event.data.qualityIssue) {
          title = 'พบปัญหาคุณภาพ';
          message = `พบปัญหาคุณภาพในสมุนไพร ${event.data.name}`;
        }
        break;
      case 'farm':
        if (event.data.certificationExpired) {
          title = 'ใบรับรองหมดอายุ';
          message = `ใบรับรองของฟาร์ม ${event.data.name} หมดอายุแล้ว`;
        }
        break;
    }

    if (message) {
      notificationService.createNotification({
        type: 'error',
        title,
        message,
        department: 'certification',
        targetDepartments: event.affectedDepartments,
        priority: 'critical',
        actionRequired: true,
        relatedEntityId: event.entityId,
        relatedEntityType: event.entity as any
      });
    }
  }

  // Department-specific sync handlers
  private handleFarmManagementSync(event: SyncEvent) {
    console.log(`🌾 Farm Management: Processing ${event.type} ${event.entity}`);
    
    // Update farm management specific dashboards
    if (event.entity === 'farm') {
      dashboardService.updateWidgetData('farm_count_metric', {
        value: Object.keys(mockDatabase.farmers).length,
        lastUpdated: new Date()
      });
    }
  }

  private handleLabServicesSync(event: SyncEvent) {
    console.log(`🔬 Lab Services: Processing ${event.type} ${event.entity}`);
    
    // Update lab-specific metrics
    if (event.entity === 'inspection') {
      const pendingTests = Object.values(mockDatabase.inspectionProcesses)
        .filter(i => i.status === 'In Progress' || i.status === 'Pending').length;
      
      dashboardService.updateWidgetData('pending_tests', {
        value: pendingTests,
        lastUpdated: new Date()
      });
    }
  }

  private handleCertificationSync(event: SyncEvent) {
    console.log(`📋 Certification: Processing ${event.type} ${event.entity}`);
    
    // Update certification status
    if (event.entity === 'inspection' && event.data.processType?.includes('Certification')) {
      const expiring = this.getExpiringCertificates();
      dashboardService.updateWidgetData('expiring_certificates', {
        alerts: expiring,
        count: expiring.length,
        lastUpdated: new Date()
      });
    }
  }

  private handleManufacturingSync(event: SyncEvent) {
    console.log(`🏭 Manufacturing: Processing ${event.type} ${event.entity}`);
    
    // Update production metrics
    if (event.entity === 'trace') {
      // Trigger production flow updates
      this.updateProductionMetrics();
    }
  }

  private handleAnalyticsSync(event: SyncEvent) {
    console.log(`📊 Analytics: Processing ${event.type} ${event.entity}`);
    
    // Update analytics dashboards
    const insights = dashboardService.getCrossDepartmentalInsights();
    dashboardService.updateWidgetData('system_health', {
      insights,
      lastUpdated: new Date()
    });
  }

  // Helper methods
  private getExpiringCertificates() {
    const farms = Object.values(mockDatabase.farmers);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return farms.filter(farm => {
      const nextInspection = farm.nextInspectionDate ? new Date(farm.nextInspectionDate) : null;
      return nextInspection && nextInspection <= thirtyDaysFromNow;
    });
  }

  private updateProductionMetrics() {
    const traces = Object.values(mockDatabase.traces);
    const metrics = {
      totalBatches: traces.length,
      recentActivity: traces.slice(-10),
      qualityDistribution: this.getQualityDistribution(traces)
    };

    dashboardService.updateWidgetData('production_metrics', metrics);
  }

  private getQualityDistribution(traces: any[]) {
    const distribution = { A: 0, B: 0, C: 0, Premium: 0 };
    traces.forEach(trace => {
      if (trace.qualityGrade in distribution) {
        distribution[trace.qualityGrade as keyof typeof distribution]++;
      }
    });
    return distribution;
  }

  // Get sync statistics
  getSyncStatistics() {
    const recentEvents = this.syncEvents.filter(event => 
      Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    );

    return {
      totalEvents: this.syncEvents.length,
      recentEvents: recentEvents.length,
      eventsByType: {
        create: recentEvents.filter(e => e.type === 'create').length,
        update: recentEvents.filter(e => e.type === 'update').length,
        delete: recentEvents.filter(e => e.type === 'delete').length
      },
      eventsByEntity: {
        farm: recentEvents.filter(e => e.entity === 'farm').length,
        herb: recentEvents.filter(e => e.entity === 'herb').length,
        trace: recentEvents.filter(e => e.entity === 'trace').length,
        inspection: recentEvents.filter(e => e.entity === 'inspection').length,
        transaction: recentEvents.filter(e => e.entity === 'transaction').length
      },
      activeSubscriptions: this.subscriptions.size,
      queueSize: this.syncQueue.length
    };
  }
}

export const dataSyncService = new DataSyncService();

// Simulate some real-time events for demonstration
setTimeout(() => {
  // Simulate a new farm registration
  dataSyncService.triggerSync({
    type: 'create',
    entity: 'farm',
    entityId: 'F999',
    data: { name: 'ฟาร์มใหม่', province: 'เชียงใหม่' },
    triggeredBy: 'farm_management',
    affectedDepartments: ['certification', 'lab_services', 'analytics']
  });

  // Simulate an inspection completion
  dataSyncService.triggerSync({
    type: 'update',
    entity: 'inspection',
    entityId: 'I999',
    data: { status: 'Passed', processType: 'GACP Certification' },
    triggeredBy: 'certification',
    affectedDepartments: ['farm_management', 'analytics']
  });
}, 5000);
