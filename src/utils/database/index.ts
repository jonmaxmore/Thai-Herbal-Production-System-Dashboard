
import { createEnhancedDatabase } from './generators';
import { getUserActivityStats } from "../mockUserData";

// Create our lite database singleton
export const mockDatabase = createEnhancedDatabase();

// Export simplified functions for dashboard data
export const getDashboardData = () => {
  const farmers = Object.values(mockDatabase.farmers);
  const traces = Object.values(mockDatabase.traces).slice(0, 20);
  
  // Calculate certification status counts
  const gapcStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0 };
  const euGmpStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0 };
  const dttmStatus = { "Passed": 0, "Failed": 0, "Pending": 0, "Expired": 0 };
  
  farmers.forEach(farmer => {
    gapcStatus[farmer.gacp]++;
    euGmpStatus[farmer.euGmp]++;
    dttmStatus[farmer.dttm]++;
  });

  // Calculate simplified process stats
  const allProcesses = Object.values(mockDatabase.inspectionProcesses);
  const statusCounts = {
    "Pending": allProcesses.filter(p => p.status === "Pending").length,
    "In Progress": allProcesses.filter(p => p.status === "In Progress").length,
    "Passed": allProcesses.filter(p => p.status === "Passed").length,
    "Failed": allProcesses.filter(p => p.status === "Failed").length,
    "Expired": allProcesses.filter(p => p.status === "Expired").length
  };

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
      .reduce((sum, tx) => sum + tx.amount, 0),
    pendingOrders: Object.values(mockDatabase.transactions)
      .filter(tx => tx.status === 'Pending').length,
    processStats: {
      totalProcesses: Object.keys(mockDatabase.inspectionProcesses).length,
      statusCounts,
      averageCompletionRate: 0.75
    }
  };
};

// Simplified backward compatibility exports
export const generateFarmers = (count: number) => Object.values(mockDatabase.farmers).slice(0, count);
export const generateTraces = (count: number) => Object.values(mockDatabase.traces).slice(0, count);
export const generateTransactions = (count: number) => Object.values(mockDatabase.transactions).slice(0, count);

// Re-export types for convenience
export type { EnhancedTrace, EnhancedFarm, ProcessStatus, InspectionProcess } from './types';
