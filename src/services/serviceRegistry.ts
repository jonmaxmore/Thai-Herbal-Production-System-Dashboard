
// Service Registry for Department Coordination and Service Discovery
import { notificationService } from './notificationService';

export interface ServiceInfo {
  id: string;
  name: string;
  department: string;
  version: string;
  status: 'active' | 'inactive' | 'maintenance';
  endpoints: string[];
  capabilities: string[];
  lastHealthCheck: Date;
  dependencies: string[];
}

export interface DepartmentInfo {
  id: string;
  name: string;
  services: ServiceInfo[];
  coordinators: string[];
  dataSharing: {
    canRead: string[];
    canWrite: string[];
    requiresApproval: string[];
  };
}

class ServiceRegistry {
  private services: Map<string, ServiceInfo> = new Map();
  private departments: Map<string, DepartmentInfo> = new Map();

  constructor() {
    this.initializeDepartments();
    this.registerCoreServices();
  }

  // Initialize department configurations
  private initializeDepartments() {
    const departmentConfigs: DepartmentInfo[] = [
      {
        id: 'farm_management',
        name: 'ฝ่ายจัดการฟาร์ม',
        services: [],
        coordinators: ['farm_coordinator'],
        dataSharing: {
          canRead: ['certification', 'lab', 'analytics'],
          canWrite: ['farm_data', 'production_data'],
          requiresApproval: ['certification_data', 'export_data']
        }
      },
      {
        id: 'lab_services',
        name: 'ฝ่ายห้องปฏิบัติการ',
        services: [],
        coordinators: ['lab_manager'],
        dataSharing: {
          canRead: ['farm_management', 'certification', 'analytics'],
          canWrite: ['test_results', 'quality_data'],
          requiresApproval: ['certification_approval']
        }
      },
      {
        id: 'certification',
        name: 'ฝ่ายรับรองมาตรฐาน',
        services: [],
        coordinators: ['certification_officer'],
        dataSharing: {
          canRead: ['farm_management', 'lab_services', 'analytics'],
          canWrite: ['certification_data', 'inspection_data'],
          requiresApproval: []
        }
      },
      {
        id: 'manufacturing',
        name: 'ฝ่ายการผลิต',
        services: [],
        coordinators: ['production_manager'],
        dataSharing: {
          canRead: ['farm_management', 'lab_services', 'certification'],
          canWrite: ['production_data', 'inventory_data'],
          requiresApproval: ['quality_assurance']
        }
      },
      {
        id: 'analytics',
        name: 'ฝ่ายวิเคราะห์ข้อมูล',
        services: [],
        coordinators: ['data_analyst'],
        dataSharing: {
          canRead: ['farm_management', 'lab_services', 'certification', 'manufacturing'],
          canWrite: ['reports', 'insights'],
          requiresApproval: []
        }
      }
    ];

    departmentConfigs.forEach(dept => {
      this.departments.set(dept.id, dept);
    });
  }

  // Register core platform services
  private registerCoreServices() {
    const coreServices: Omit<ServiceInfo, 'lastHealthCheck'>[] = [
      {
        id: 'farm_data_service',
        name: 'Farm Data Management',
        department: 'farm_management',
        version: '1.0.0',
        status: 'active',
        endpoints: ['/api/farms', '/api/farmers', '/api/cultivation'],
        capabilities: ['farm_registration', 'crop_tracking', 'harvest_recording'],
        dependencies: ['notification_service']
      },
      {
        id: 'lab_testing_service',
        name: 'Laboratory Testing Service',
        department: 'lab_services',
        version: '1.0.0',
        status: 'active',
        endpoints: ['/api/tests', '/api/samples', '/api/results'],
        capabilities: ['sample_analysis', 'quality_testing', 'contamination_detection'],
        dependencies: ['notification_service', 'farm_data_service']
      },
      {
        id: 'certification_service',
        name: 'Certification Management',
        department: 'certification',
        version: '1.0.0',
        status: 'active',
        endpoints: ['/api/certifications', '/api/inspections', '/api/compliance'],
        capabilities: ['gacp_certification', 'eu_gmp_certification', 'inspection_scheduling'],
        dependencies: ['farm_data_service', 'lab_testing_service']
      },
      {
        id: 'traceability_service',
        name: 'Product Traceability',
        department: 'manufacturing',
        version: '1.0.0',
        status: 'active',
        endpoints: ['/api/traces', '/api/batches', '/api/tracking'],
        capabilities: ['seed_to_sale_tracking', 'batch_management', 'qr_generation'],
        dependencies: ['farm_data_service', 'lab_testing_service', 'certification_service']
      },
      {
        id: 'analytics_service',
        name: 'Data Analytics Platform',
        department: 'analytics',
        version: '1.0.0',
        status: 'active',
        endpoints: ['/api/analytics', '/api/reports', '/api/insights'],
        capabilities: ['performance_analytics', 'compliance_reporting', 'trend_analysis'],
        dependencies: ['farm_data_service', 'lab_testing_service', 'certification_service', 'traceability_service']
      }
    ];

    coreServices.forEach(service => {
      this.registerService({
        ...service,
        lastHealthCheck: new Date()
      });
    });
  }

  // Register a new service
  registerService(service: ServiceInfo) {
    this.services.set(service.id, service);
    
    // Add service to department
    const department = this.departments.get(service.department);
    if (department) {
      department.services.push(service);
    }

    // Notify about new service registration
    notificationService.createNotification({
      type: 'info',
      title: 'บริการใหม่ถูกลงทะเบียน',
      message: `บริการ ${service.name} ถูกลงทะเบียนในระบบแล้ว`,
      department: 'admin',
      priority: 'low'
    });
  }

  // Get service information
  getService(serviceId: string): ServiceInfo | undefined {
    return this.services.get(serviceId);
  }

  // Get all services for a department
  getDepartmentServices(departmentId: string): ServiceInfo[] {
    const department = this.departments.get(departmentId);
    return department?.services || [];
  }

  // Check service dependencies
  checkServiceDependencies(serviceId: string): { available: string[], missing: string[] } {
    const service = this.services.get(serviceId);
    if (!service) return { available: [], missing: [] };

    const available = service.dependencies.filter(dep => this.services.has(dep));
    const missing = service.dependencies.filter(dep => !this.services.has(dep));

    return { available, missing };
  }

  // Get department coordination info
  getDepartmentCoordination() {
    const coordination = Array.from(this.departments.values()).map(dept => ({
      id: dept.id,
      name: dept.name,
      serviceCount: dept.services.length,
      activeServices: dept.services.filter(s => s.status === 'active').length,
      dataSharing: dept.dataSharing,
      coordinators: dept.coordinators
    }));

    return coordination;
  }

  // Perform health check on all services
  performHealthCheck() {
    const healthReport = {
      timestamp: new Date(),
      totalServices: this.services.size,
      activeServices: 0,
      inactiveServices: 0,
      maintenanceServices: 0,
      serviceIssues: [] as string[]
    };

    this.services.forEach((service, serviceId) => {
      // Update last health check
      service.lastHealthCheck = new Date();

      // Check service status
      switch (service.status) {
        case 'active':
          healthReport.activeServices++;
          break;
        case 'inactive':
          healthReport.inactiveServices++;
          healthReport.serviceIssues.push(`${service.name} is inactive`);
          break;
        case 'maintenance':
          healthReport.maintenanceServices++;
          break;
      }

      // Check dependencies
      const deps = this.checkServiceDependencies(serviceId);
      if (deps.missing.length > 0) {
        healthReport.serviceIssues.push(`${service.name} has missing dependencies: ${deps.missing.join(', ')}`);
      }
    });

    return healthReport;
  }

  // Get service discovery information
  discoverServices(capability: string): ServiceInfo[] {
    return Array.from(this.services.values()).filter(service =>
      service.capabilities.includes(capability) && service.status === 'active'
    );
  }
}

export const serviceRegistry = new ServiceRegistry();
