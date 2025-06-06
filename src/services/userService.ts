
// User Service - Core user management functionality
import { mockDatabase } from '@/utils/database';
import { generateMockUsers } from '@/utils/mockUserData';

export class UserService {
  // Get all users
  static getAllUsers() {
    const users = generateMockUsers(300);
    return users;
  }

  // Get user by email
  static getUserByEmail(email: string) {
    const users = this.getAllUsers();
    return users.find(user => user.email === email);
  }

  // Get user by ID
  static getUserById(userId: string) {
    const users = this.getAllUsers();
    return users.find(user => user.id === userId);
  }

  // Authenticate user
  static async authenticateUser(email: string, password: string) {
    const user = this.getUserByEmail(email);
    if (user && password) { // Simple validation for demo
      return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials' };
  }

  // Check if user has permission
  static hasPermission(userId: string, permission: string) {
    const user = this.getUserById(userId);
    if (!user) return false;
    
    // Simple permission check based on role
    const rolePermissions = {
      'admin': ['all'],
      'farmer': ['farm_management', 'herb_registration'],
      'inspector': ['certification_review', 'inspection'],
      'authority': ['certification_approval', 'compliance_monitoring']
    };
    
    const userPermissions = rolePermissions[user.role as keyof typeof rolePermissions] || [];
    return userPermissions.includes(permission) || userPermissions.includes('all');
  }

  // Get user statistics
  static getUserStatistics() {
    const users = this.getAllUsers();
    return users.map(user => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      loginCount: user.stats.logins,
      lastLogin: user.lastLoginDate
    }));
  }

  // Get users by role
  static getUsersByRole(role: string) {
    const users = this.getAllUsers();
    return users.filter(user => user.role === role);
  }

  // Get active users
  static getActiveUsers() {
    const users = this.getAllUsers();
    return users.filter(user => user.status === 'active');
  }
}
