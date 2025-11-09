import type { NotificationService } from '../../application/ports/services/NotificationService';

/**
 * In-Memory Notification Service pour les tests
 * Stocke les notifications en mémoire pour vérification
 */
export class InMemoryNotificationService implements NotificationService {
  private notifications: Array<{ userId: string; message: string; timestamp: Date }> = [];

  async notifyUser(userId: string, message: string): Promise<void> {
    this.notifications.push({
      userId,
      message,
      timestamp: new Date(),
    });
  }

  getNotifications(userId?: string) {
    if (userId) {
      return this.notifications.filter((n) => n.userId === userId);
    }
    return this.notifications;
  }

  clear() {
    this.notifications = [];
  }
}
