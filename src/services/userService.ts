
// User Services Layer - Based on Business Logic Layer from architecture
import { UserId } from '@/utils/database/types';
import { mockDatabase } from '@/utils/database';

export class UserService {
  // Authentication services
  static async authenticateUser(email: string, password: string) {
    const users = Object.values(mockDatabase.users);
    const user = users.find(u => u.email === email);
    
    if (user && password) {
      return {
        success: true,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        }
      };
    }
    
    return { success: false, error: 'Invalid credentials' };
  }

  // User management services
  static getUserById(userId: UserId) {
    return mockDatabase.users[userId];
  }

  static getAllUsers() {
    return Object.values(mockDatabase.users);
  }

  // Role and permission services
  static getUserPermissions(userId: UserId) {
    const user = this.getUserById(userId);
    if (!user) return [];

    const rolePermissions = {
      admin: ['view_all', 'edit_all', 'delete_all', 'manage_users'],
      farmer: ['view_own', 'edit_own', 'create_records'],
      inspector: ['view_all', 'edit_inspections', 'create_inspections'],
      viewer: ['view_limited']
    };

    return rolePermissions[user.role] || [];
  }

  static hasPermission(userId: UserId, permission: string): boolean {
    const permissions = this.getUserPermissions(userId);
    return permissions.includes(permission);
  }
}
