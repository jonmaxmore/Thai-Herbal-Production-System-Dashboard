
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
