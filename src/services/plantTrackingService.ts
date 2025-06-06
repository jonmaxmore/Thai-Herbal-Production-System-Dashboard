
import { PlantData, PackageData, PlantGrowthStage, LabResult } from '@/utils/database/types';

export class PlantTrackingService {
  
  // Individual Plant Management
  static generatePlantQRCode(plantId: string, farmId: string): string {
    const timestamp = new Date().getTime();
    return `QR_PLANT_${plantId}_${farmId}_${timestamp}`;
  }

  static createNewPlant(farmId: string, herbId: string, parentPlantId?: string): PlantData {
    const plantId = `PLANT_${Date.now()}`;
    const qrCode = this.generatePlantQRCode(plantId, farmId);
    
    return {
      id: plantId,
      qrCode: qrCode,
      parentPlantId: parentPlantId,
      plantingDate: new Date(),
      farmId: farmId,
      herbId: herbId,
      status: "Seedling",
      currentLocation: {
        lat: 0, // Should be set based on actual farm location
        lng: 0,
        facilityType: "Farm"
      },
      growthStages: [
        {
          id: `STAGE_${Date.now()}`,
          plantId: plantId,
          stage: "Seeding",
          date: new Date(),
          notes: "เริ่มต้นการปลูก"
        }
      ]
    };
  }

  static addGrowthStage(plantId: string, stage: Omit<PlantGrowthStage, 'id' | 'plantId'>): PlantGrowthStage {
    return {
      id: `STAGE_${Date.now()}`,
      plantId: plantId,
      ...stage
    };
  }

  static addLabResult(plantId: string, result: Omit<LabResult, 'id' | 'plantId'>): LabResult {
    return {
      id: `LAB_${Date.now()}`,
      plantId: plantId,
      ...result
    };
  }

  // Package-Level Management
  static generatePackageQRCode(packageId: string, plantIds: string[]): string {
    const timestamp = new Date().getTime();
    const plantCount = plantIds.length;
    return `QR_PKG_${packageId}_${plantCount}PLANTS_${timestamp}`;
  }

  static createPackage(
    plantIds: string[], 
    packageType: PackageData['packageType'],
    totalWeight: number,
    packagedBy: string
  ): PackageData {
    const packageId = `PKG_${Date.now()}`;
    const qrCode = this.generatePackageQRCode(packageId, plantIds);
    const packageDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(packageDate.getFullYear() + 1); // 1 year expiry

    return {
      id: packageId,
      qrCode: qrCode,
      packageType: packageType,
      plantIds: plantIds,
      totalWeight: totalWeight,
      packageDate: packageDate,
      expiryDate: expiryDate,
      batchNumber: `BATCH_${Date.now()}`,
      qualityGrade: "A", // Should be determined based on plant quality
      packagedBy: packagedBy
    };
  }

  // QR Code Validation and Decoding
  static validatePlantQRCode(qrCode: string): boolean {
    return qrCode.startsWith('QR_PLANT_');
  }

  static validatePackageQRCode(qrCode: string): boolean {
    return qrCode.startsWith('QR_PKG_');
  }

  static decodeQRCode(qrData: string): any {
    try {
      return JSON.parse(qrData);
    } catch (error) {
      console.error('Invalid QR Code data:', error);
      return null;
    }
  }

  // Journey Tracking
  static getPlantJourney(plantId: string, allTraces: any[]): any[] {
    return allTraces
      .filter(trace => trace.plantId === plantId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  static getPackageJourney(packageId: string, allTraces: any[]): any[] {
    return allTraces
      .filter(trace => trace.packageId === packageId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Traceability Chain
  static getCompleteTraceabilityChain(packageId: string, plants: PlantData[], packages: PackageData[]) {
    const packageData = packages.find(pkg => pkg.id === packageId);
    if (!packageData) return null;

    const relatedPlants = plants.filter(plant => 
      packageData.plantIds.includes(plant.id)
    );

    // Build complete chain from each plant to package
    const traceabilityChain = {
      package: packageData,
      plants: relatedPlants.map(plant => ({
        plant: plant,
        motherPlant: plant.parentPlantId ? 
          plants.find(p => p.id === plant.parentPlantId) : null,
        growthHistory: plant.growthStages,
        labResults: plant.labResults || []
      }))
    };

    return traceabilityChain;
  }

  // Quality Assurance
  static validatePackageQuality(plantIds: string[], plants: PlantData[]): {
    isValid: boolean;
    issues: string[];
    overallGrade: string;
  } {
    const packagePlants = plants.filter(plant => plantIds.includes(plant.id));
    const issues: string[] = [];
    
    // Check if all plants have lab results
    const plantsWithoutLabResults = packagePlants.filter(
      plant => !plant.labResults || plant.labResults.length === 0
    );
    
    if (plantsWithoutLabResults.length > 0) {
      issues.push(`${plantsWithoutLabResults.length} ต้นยังไม่มีผลแล็บ`);
    }

    // Check if all plants passed lab tests
    const failedPlants = packagePlants.filter(plant => 
      plant.labResults && plant.labResults.some(result => !result.passed)
    );
    
    if (failedPlants.length > 0) {
      issues.push(`${failedPlants.length} ต้นไม่ผ่านการตรวจสอบจากแล็บ`);
    }

    // Determine overall grade
    let overallGrade = "Premium";
    if (issues.length > 0) overallGrade = "B";
    if (failedPlants.length > 0) overallGrade = "C";

    return {
      isValid: issues.length === 0,
      issues,
      overallGrade
    };
  }
}
