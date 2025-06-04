
import { createEnhancedDatabase } from './generators';
import { getUserActivityStats } from "../mockUserData";

// Create our enhanced database singleton
export const mockDatabase = createEnhancedDatabase();

// Export functions for dashboard data
export const getDashboardData = () => {
  const farmers = Object.values(mockDatabase.farmers);
  const traces = Object.values(mockDatabase.traces).slice(0, 50);
  
  // Calculate certification status counts
  const gapcStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0 };
  const euGmpStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0 };
  const dttmStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0 };
  
  farmers.forEach(farmer => {
    gapcStatus[farmer.gacp?.status || "Pending"]++;
    euGmpStatus[farmer.euGmp]++;
    dttmStatus[farmer.dttm]++;
  });

  // Calculate process stats with complete status counts
  const allProcesses = Object.values(mockDatabase.inspectionProcesses);
  const statusCounts = {
    "Not Started": allProcesses.filter(p => p.status === "Not Started").length,
    "In Progress": allProcesses.filter(p => p.status === "In Progress").length,
    "Passed": allProcesses.filter(p => p.status === "Passed").length,
    "Failed": allProcesses.filter(p => p.status === "Failed").length,
    "Pending Review": allProcesses.filter(p => p.status === "Pending Review").length,
    "Certified": allProcesses.filter(p => p.status === "Certified").length,
    "Expired": allProcesses.filter(p => p.status === "Expired").length
  };

  // Prepare recentInspections with all required properties
  const recentInspections = Object.values(mockDatabase.inspectionProcesses)
    .slice(0, 10)
    .map(inspection => {
      const herb = mockDatabase.herbs[inspection.herbId];
      const farmer = mockDatabase.farmers[inspection.farmerId];
      const inspector = inspection.inspectorId ? mockDatabase.users[inspection.inspectorId] : undefined;
      
      return {
        id: inspection.id,
        herbId: inspection.herbId,
        herbName: herb?.name || 'Unknown Herb',
        processType: inspection.processType,
        status: inspection.status,
        startDate: inspection.startDate,
        completionDate: inspection.completionDate,
        inspectorName: inspector?.fullName,
        farmerName: farmer?.owner.name
      };
    });

  return {
    farmers,
    traces,
    gapcStatus,
    euGmpStatus,
    dttmStatus,
    userStats: getUserActivityStats(),
    transactions: Object.values(mockDatabase.transactions).slice(0, 10),
    totalSales: Object.values(mockDatabase.transactions)
      .filter(tx => tx.status === 'Completed')
      .reduce((sum, tx) => sum + tx.totalAmount, 0),
    pendingOrders: Object.values(mockDatabase.transactions)
      .filter(tx => tx.status === 'Pending').length,
    processStats: {
      totalProcesses: Object.keys(mockDatabase.inspectionProcesses).length,
      statusCounts,
      processCounts: {} as any,
      averageCompletionRate: 0.75,
      averageFailureRate: 0.15
    },
    stakeholdersByRole: [],
    stakeholderInvolvement: [],
    recentInspections
  };
};

// Backward compatibility exports
export const generateFarmers = (count: number) => Object.values(mockDatabase.farmers).slice(0, count);
export const generateTraces = (count: number) => Object.values(mockDatabase.traces).slice(0, count);
export const generateTransactions = (count: number) => Object.values(mockDatabase.transactions).slice(0, count);

// New cannabis-specific functions
export const getCannabisStatistics = () => {
  const allHerbs = Object.values(mockDatabase.herbs);
  const cannabisHerbs = allHerbs.filter(h => h.category === "cannabis");
  const traditionalHerbs = allHerbs.filter(h => h.category === "traditional");
  
  return {
    totalHerbs: allHerbs.length,
    cannabisCount: cannabisHerbs.length,
    traditionalCount: traditionalHerbs.length,
    cannabisPercentage: (cannabisHerbs.length / allHerbs.length) * 100,
    averageThc: cannabisHerbs.reduce((sum, h) => sum + (h.thcContent || 0), 0) / cannabisHerbs.length,
    averageCbd: cannabisHerbs.reduce((sum, h) => sum + (h.cbdContent || 0), 0) / cannabisHerbs.length
  };
};

export const getFarmingActivitiesByFarm = (farmId: string) => {
  return Object.values(mockDatabase.farmingActivities)
    .filter(activity => activity.farmId === farmId)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const getWeatherDataByFarm = (farmId: string, days: number = 30) => {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return Object.values(mockDatabase.weatherData)
    .filter(weather => weather.farmId === farmId && weather.date >= cutoffDate)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const getFieldsByFarm = (farmId: string) => {
  const farmer = mockDatabase.farmers[farmId];
  if (!farmer) return [];
  
  return farmer.fields.map(fieldId => mockDatabase.fields[fieldId]).filter(Boolean);
};

// Re-export types for convenience
export type { EnhancedTrace, EnhancedFarm, ProcessStatus, InspectionProcess } from './types';
