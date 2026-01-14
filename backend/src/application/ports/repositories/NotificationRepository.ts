import { Result } from '../../../shared/Result';
import { Notification } from '../../../domain/entities/Notification';

export interface NotificationRepository {
  save(notification: Notification): Promise<Result<Notification, Error>>;
  findById(id: string): Promise<Result<Notification, Error>>;
  findByRecipientId(recipientId: string, limit?: number, offset?: number): Promise<Result<Notification[], Error>>;
  findUnreadByRecipientId(recipientId: string): Promise<Result<Notification[], Error>>;
  update(notification: Notification): Promise<Result<Notification, Error>>;
  markAsRead(id: string): Promise<Result<void, Error>>;
  markAllAsReadForRecipient(recipientId: string): Promise<Result<void, Error>>;
}
