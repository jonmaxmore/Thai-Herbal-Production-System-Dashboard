
// Centralized Notification Service for Cross-Department Communication
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  department: string;
  targetDepartments?: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
  relatedEntityId?: string;
  relatedEntityType?: 'farm' | 'herb' | 'trace' | 'inspection' | 'transaction';
}

class NotificationService {
  private notifications: Notification[] = [];
  private subscribers: Map<string, (notifications: Notification[]) => void> = new Map();

  // Subscribe to notifications for a specific department
  subscribe(department: string, callback: (notifications: Notification[]) => void) {
    this.subscribers.set(department, callback);
    // Send current notifications for this department
    callback(this.getNotificationsForDepartment(department));
  }

  // Unsubscribe from notifications
  unsubscribe(department: string) {
    this.subscribers.delete(department);
  }

  // Create and broadcast a notification
  createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      id: `NOTIF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
      ...notification
    };

    this.notifications.push(newNotification);
    this.broadcastNotification(newNotification);
    return newNotification;
  }

  // Get notifications for a specific department
  getNotificationsForDepartment(department: string): Notification[] {
    return this.notifications.filter(notif => 
      notif.department === department || 
      notif.targetDepartments?.includes(department) ||
      !notif.targetDepartments // Global notifications
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Mark notification as read
  markAsRead(notificationId: string, department: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifySubscriber(department);
    }
  }

  // Broadcast notification to relevant departments
  private broadcastNotification(notification: Notification) {
    const targetDepts = notification.targetDepartments || ['farm', 'lab', 'manufacturer', 'certification', 'admin'];
    
    targetDepts.forEach(dept => {
      this.notifySubscriber(dept);
    });
  }

  // Notify specific subscriber
  private notifySubscriber(department: string) {
    const callback = this.subscribers.get(department);
    if (callback) {
      callback(this.getNotificationsForDepartment(department));
    }
  }

  // Create system notifications for common events
  createSystemNotification(event: string, data: any) {
    switch (event) {
      case 'inspection_completed':
        this.createNotification({
          type: 'success',
          title: 'การตรวจสอบเสร็จสิ้น',
          message: `การตรวจสอบ ${data.processType} สำหรับ ${data.herbName} เสร็จสิ้นแล้ว`,
          department: 'certification',
          targetDepartments: ['farm', 'lab'],
          priority: 'medium',
          relatedEntityId: data.inspectionId,
          relatedEntityType: 'inspection'
        });
        break;
        
      case 'new_trace_event':
        this.createNotification({
          type: 'info',
          title: 'เหตุการณ์ใหม่ในระบบติดตาม',
          message: `${data.event} - ${data.herbName} ที่ ${data.farmName}`,
          department: 'farm',
          targetDepartments: ['manufacturer', 'lab'],
          priority: 'low',
          relatedEntityId: data.traceId,
          relatedEntityType: 'trace'
        });
        break;
        
      case 'certification_expiring':
        this.createNotification({
          type: 'warning',
          title: 'ใบรับรองใกล้หมดอายุ',
          message: `ใบรับรอง ${data.certificationType} ของ ${data.farmName} จะหมดอายุในอีก ${data.daysRemaining} วัน`,
          department: 'certification',
          targetDepartments: ['farm'],
          priority: 'high',
          actionRequired: true,
          relatedEntityId: data.farmId,
          relatedEntityType: 'farm'
        });
        break;
        
      case 'quality_issue':
        this.createNotification({
          type: 'error',
          title: 'พบปัญหาคุณภาพ',
          message: `พบปัญหาคุณภาพในผลิตภัณฑ์ ${data.productName} จากฟาร์ม ${data.farmName}`,
          department: 'lab',
          targetDepartments: ['farm', 'manufacturer', 'certification'],
          priority: 'critical',
          actionRequired: true,
          relatedEntityId: data.herbId,
          relatedEntityType: 'herb'
        });
        break;
    }
  }

  // Get notification statistics
  getNotificationStats(department: string) {
    const notifications = this.getNotificationsForDepartment(department);
    return {
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      critical: notifications.filter(n => n.priority === 'critical').length,
      actionRequired: notifications.filter(n => n.actionRequired).length
    };
  }
}

export const notificationService = new NotificationService();
