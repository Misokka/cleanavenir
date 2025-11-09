import type { NotificationService } from '../../application/ports/services/NotificationService';

/**
 * Mock Notification Service pour le développement
 * Affiche les notifications dans la console
 */
export class ConsoleNotificationService implements NotificationService {
  async notifyUser(userId: string, message: string): Promise<void> {
    console.log('🔔 [NOTIFICATION]');
    console.log(`User ID: ${userId}`);
    console.log(`Message: ${message}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('---');
  }
}
