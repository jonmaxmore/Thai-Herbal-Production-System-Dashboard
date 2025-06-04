
// Authentication API Layer - Frontend API interface
import { UserService } from '@/services/userService';

export class AuthApi {
  static async login(email: string, password: string) {
    try {
      return await UserService.authenticateUser(email, password);
    } catch (error) {
      console.error('Login API error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  static async getCurrentUser() {
    // In a real app, this would validate JWT token
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
      return UserService.getUserById(currentUserId);
    }
    return null;
  }

  static async logout() {
    localStorage.removeItem('currentUserId');
    return { success: true };
  }

  static async validatePermission(permission: string) {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return false;
    
    return UserService.hasPermission(currentUserId, permission);
  }
}
