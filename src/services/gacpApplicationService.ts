
// GACP Application Service - Handles certification application workflow
import { GACPApplication, GACPApplicationStatus, FarmerId, UserId } from '@/utils/database/types';

export class GACPApplicationService {
  // Mock data for demonstration
  private static applications: Record<string, GACPApplication> = {};

  // Create new GACP application
  static createApplication(farmerId: FarmerId, userId: UserId): GACPApplication {
    const applicationId = `GACP_${Date.now()}`;
    
    const newApplication: GACPApplication = {
      id: applicationId,
      farmerId,
      userId,
      status: "Draft",
      farmData: {
        name: "",
        location: { lat: 0, lng: 0 },
        province: "",
        cultivationArea: 0,
        crops: [],
        farmImages: []
      },
      labResults: {
        files: []
      }
    };

    this.applications[applicationId] = newApplication;
    return newApplication;
  }

  // Get application by ID
  static getApplicationById(applicationId: string): GACPApplication | undefined {
    return this.applications[applicationId];
  }

  // Get applications by farmer
  static getApplicationsByFarmer(farmerId: FarmerId): GACPApplication[] {
    return Object.values(this.applications).filter(app => app.farmerId === farmerId);
  }

  // Update application data
  static updateApplication(applicationId: string, updates: Partial<GACPApplication>): GACPApplication | null {
    const application = this.applications[applicationId];
    if (!application) return null;

    this.applications[applicationId] = { ...application, ...updates };
    return this.applications[applicationId];
  }

  // Submit application for review
  static submitApplication(applicationId: string): boolean {
    const application = this.applications[applicationId];
    if (!application || application.status !== "Draft") return false;

    this.applications[applicationId] = {
      ...application,
      status: "Submitted",
      submittedDate: new Date()
    };

    // Simulate AI analysis
    setTimeout(() => {
      this.performAIAnalysis(applicationId);
    }, 2000);

    return true;
  }

  // Simulate AI analysis for pre-approval
  private static performAIAnalysis(applicationId: string) {
    const application = this.applications[applicationId];
    if (!application) return;

    // Mock AI analysis result
    const aiResult = Math.random() > 0.3 ? "Approved" : "Rejected";
    const analysisResult = aiResult === "Approved" 
      ? "AI Analysis: Crop health appears good, documentation complete."
      : "AI Analysis: Some documentation missing or crop health concerns detected.";

    this.applications[applicationId] = {
      ...application,
      status: "Under Review",
      preApprovalData: {
        aiAnalysisResult: analysisResult,
        preApprovalResult: aiResult as "Approved" | "Rejected",
        rejectionReason: aiResult === "Rejected" 
          ? "กรุณาปรับปรุงเอกสารและคุณภาพพืช แล้วยื่นใหม่อีกครั้ง"
          : undefined
      }
    };

    if (aiResult === "Approved") {
      // Schedule video call for pre-approval
      this.scheduleVideoCall(applicationId);
    }
  }

  // Schedule video call for pre-approval
  private static scheduleVideoCall(applicationId: string) {
    const application = this.applications[applicationId];
    if (!application || !application.preApprovalData) return;

    // Schedule video call (mock - 3 days from now)
    const videoCallDate = new Date();
    videoCallDate.setDate(videoCallDate.getDate() + 3);

    this.applications[applicationId] = {
      ...application,
      status: "Pre-Approved",
      preApprovalData: {
        ...application.preApprovalData,
        videoCallDate,
        videoCallStatus: "Scheduled"
      }
    };
  }

  // Complete video call pre-approval
  static completeVideoCall(applicationId: string, result: "Approved" | "Rejected", notes?: string): boolean {
    const application = this.applications[applicationId];
    if (!application || !application.preApprovalData) return false;

    if (result === "Approved") {
      // Forward to DTTM for site inspection
      this.forwardToDTTM(applicationId);
    }

    this.applications[applicationId] = {
      ...application,
      preApprovalData: {
        ...application.preApprovalData,
        videoCallStatus: "Completed",
        preApprovalResult: result,
        rejectionReason: result === "Rejected" ? notes : undefined
      }
    };

    return true;
  }

  // Forward to DTTM for site inspection
  private static forwardToDTTM(applicationId: string) {
    const application = this.applications[applicationId];
    if (!application) return;

    // Schedule site inspection (mock - 7 days from now)
    const inspectionDate = new Date();
    inspectionDate.setDate(inspectionDate.getDate() + 7);

    this.applications[applicationId] = {
      ...application,
      status: "Site Inspection Scheduled",
      siteInspection: {
        scheduledDate: inspectionDate,
        inspectors: ["นายสมชาย ใจดี", "นางสาวสุดา รักดี", "นายประยุทธ เทียงธรรม"]
      }
    };
  }

  // Complete site inspection
  static completeSiteInspection(applicationId: string, result: "Passed" | "Failed", notes: string): boolean {
    const application = this.applications[applicationId];
    if (!application || !application.siteInspection) return false;

    this.applications[applicationId] = {
      ...application,
      status: result === "Passed" ? "Approved" : "Rejected",
      siteInspection: {
        ...application.siteInspection,
        inspectionResult: result,
        notes
      }
    };

    if (result === "Passed") {
      // Issue certificate
      this.issueCertificate(applicationId);
    }

    return true;
  }

  // Issue GACP certificate
  private static issueCertificate(applicationId: string) {
    const application = this.applications[applicationId];
    if (!application) return;

    const issueDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 3); // 3 years validity

    this.applications[applicationId] = {
      ...application,
      status: "Certificate Issued",
      certificateData: {
        certificateNumber: `GACP-${issueDate.getFullYear()}-${String(issueDate.getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        issueDate,
        expiryDate,
        certificateFile: `certificate_${applicationId}.pdf`
      }
    };
  }

  // Get all applications with status filter
  static getAllApplications(statusFilter?: GACPApplicationStatus): GACPApplication[] {
    const applications = Object.values(this.applications);
    return statusFilter 
      ? applications.filter(app => app.status === statusFilter)
      : applications;
  }

  // Get application statistics
  static getApplicationStatistics() {
    const applications = Object.values(this.applications);
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<GACPApplicationStatus, number>);

    return {
      total: applications.length,
      statusCounts,
      approvalRate: applications.length > 0 
        ? (statusCounts["Certificate Issued"] || 0) / applications.length * 100 
        : 0
    };
  }
}
