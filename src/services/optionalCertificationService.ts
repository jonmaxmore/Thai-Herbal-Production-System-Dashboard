
// Optional Certification Service - Handles EU-GMP, DTTM, TIS certifications
import { OptionalCertificationApplication, OptionalCertificationStatus, FarmerId } from '@/utils/database/types';
import { notificationService } from './notificationService';

export class OptionalCertificationService {
  // Mock data for demonstration
  private static applications: Record<string, OptionalCertificationApplication> = {};

  // Create new optional certification application (farmer-entered)
  static createFarmerApplication(
    farmerId: FarmerId, 
    certificationType: "EU-GMP" | "DTTM" | "TIS",
    certificateData: {
      certificateNumber: string;
      issueDate: Date;
      expiryDate: Date;
      documentFile?: string;
    }
  ): OptionalCertificationApplication {
    const applicationId = `OPT_${certificationType}_${Date.now()}`;
    
    const newApplication: OptionalCertificationApplication = {
      id: applicationId,
      farmerId,
      certificationType,
      status: "Applied",
      submittedDate: new Date(),
      source: "farmer_entered",
      ...certificateData
    };

    this.applications[applicationId] = newApplication;
    
    // Create notification
    notificationService.createNotification({
      type: 'info',
      title: 'ใบรับรอง Optional ใหม่',
      message: `เกษตรกรได้ส่งใบรับรอง ${certificationType} แล้ว`,
      department: 'certification',
      priority: 'medium',
      relatedEntityId: farmerId,
      relatedEntityType: 'farm'
    });

    return newApplication;
  }

  // Sync certification from ministry API
  static syncFromMinistryAPI(
    farmerId: FarmerId,
    certificationType: "EU-GMP" | "DTTM" | "TIS",
    apiEndpoint: string
  ): OptionalCertificationApplication {
    const applicationId = `API_${certificationType}_${Date.now()}`;
    
    // Mock API response
    const mockApiData = this.getMockAPIResponse(certificationType);
    
    const newApplication: OptionalCertificationApplication = {
      id: applicationId,
      farmerId,
      certificationType,
      status: mockApiData.status,
      submittedDate: new Date(),
      source: "ministry_api",
      certificateNumber: mockApiData.certificateNumber,
      issueDate: mockApiData.issueDate,
      expiryDate: mockApiData.expiryDate,
      apiSyncData: {
        lastSyncDate: new Date(),
        ministryApiEndpoint: apiEndpoint,
        syncStatus: "success"
      }
    };

    this.applications[applicationId] = newApplication;
    
    // Create notification
    notificationService.createNotification({
      type: 'success',
      title: 'API Sync สำเร็จ',
      message: `ข้อมูลใบรับรอง ${certificationType} ได้รับการอัพเดทจาก API แล้ว`,
      department: 'certification',
      priority: 'low',
      relatedEntityId: farmerId,
      relatedEntityType: 'farm'
    });

    return newApplication;
  }

  // Mock API response generator
  private static getMockAPIResponse(certificationType: string) {
    const responses = {
      "EU-GMP": {
        status: "Approved" as OptionalCertificationStatus,
        certificateNumber: `EU-GMP-${Date.now().toString().slice(-6)}`,
        issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      },
      "DTTM": {
        status: "Approved" as OptionalCertificationStatus,
        certificateNumber: `DTTM-${Date.now().toString().slice(-6)}`,
        issueDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        expiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000) // 2 years from now
      },
      "TIS": {
        status: "Approved" as OptionalCertificationStatus,
        certificateNumber: `TIS-${Date.now().toString().slice(-6)}`,
        issueDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        expiryDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000) // 3 years from now
      }
    };

    return responses[certificationType as keyof typeof responses];
  }

  // Get applications by farmer
  static getApplicationsByFarmer(farmerId: FarmerId): OptionalCertificationApplication[] {
    return Object.values(this.applications).filter(app => app.farmerId === farmerId);
  }

  // Get applications by type
  static getApplicationsByType(certificationType: "EU-GMP" | "DTTM" | "TIS"): OptionalCertificationApplication[] {
    return Object.values(this.applications).filter(app => app.certificationType === certificationType);
  }

  // Update application status (for manual review)
  static updateApplicationStatus(
    applicationId: string, 
    status: OptionalCertificationStatus,
    notes?: string
  ): boolean {
    const application = this.applications[applicationId];
    if (!application) return false;

    this.applications[applicationId] = {
      ...application,
      status
    };

    // Create notification
    notificationService.createNotification({
      type: status === "Approved" ? 'success' : status === "Rejected" ? 'error' : 'info',
      title: `สถานะใบรับรอง ${application.certificationType} เปลี่ยนแปลง`,
      message: `สถานะเปลี่ยนเป็น: ${status}${notes ? ` - ${notes}` : ''}`,
      department: 'certification',
      targetDepartments: ['farm_management'],
      priority: 'medium',
      relatedEntityId: application.farmerId,
      relatedEntityType: 'farm'
    });

    return true;
  }

  // Re-sync from API (for periodic updates)
  static resyncFromAPI(applicationId: string): boolean {
    const application = this.applications[applicationId];
    if (!application || application.source !== "ministry_api") return false;

    // Mock re-sync
    const updatedData = this.getMockAPIResponse(application.certificationType);
    
    this.applications[applicationId] = {
      ...application,
      ...updatedData,
      apiSyncData: {
        ...application.apiSyncData!,
        lastSyncDate: new Date(),
        syncStatus: "success"
      }
    };

    return true;
  }

  // Get statistics for optional certifications
  static getOptionalCertificationStats() {
    const applications = Object.values(this.applications);
    
    const stats = {
      total: applications.length,
      byType: {
        "EU-GMP": applications.filter(app => app.certificationType === "EU-GMP").length,
        "DTTM": applications.filter(app => app.certificationType === "DTTM").length,
        "TIS": applications.filter(app => app.certificationType === "TIS").length
      },
      byStatus: applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {} as Record<OptionalCertificationStatus, number>),
      bySource: {
        farmer_entered: applications.filter(app => app.source === "farmer_entered").length,
        ministry_api: applications.filter(app => app.source === "ministry_api").length
      }
    };

    return stats;
  }
}
