import { eq, desc, and } from 'drizzle-orm';
import { db } from '../drizzle/client';
import { notifications, NotificationDrizzle, NewNotificationDrizzle } from '../drizzle/schema';
import { NotificationRepository } from '../../application/ports/repositories/NotificationRepository';
import { Notification } from '../../domain/entities/Notification';
import { Result, ok, err } from '../../shared/Result';

export class DrizzleNotificationRepository implements NotificationRepository {
  async save(notification: Notification): Promise<Result<Notification, Error>> {
    try {
      const newNotification: NewNotificationDrizzle = {
        id: notification.notificationIdentifier,
        senderId: notification.senderIdentifier,
        recipientId: notification.recipientIdentifier,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead ? 1 : 0,
        createdAt: notification.createdAt.toISOString(),
        discussionId: notification.discussionId ?? null,
        relatedEntityId: notification.relatedEntityId ?? null,
      };

      await db.insert(notifications).values(newNotification);
      return ok(notification);
    } catch (error) {
      return err(new Error(`Failed to save notification: ${error}`));
    }
  }

  async findById(id: string): Promise<Result<Notification, Error>> {
    try {
      const rows = await db.select().from(notifications).where(eq(notifications.id, id));
      if (rows.length === 0) {
        return err(new Error('Notification not found'));
      }

      const row = rows[0];
      const notification = this.toDomain(row);
      return ok(notification);
    } catch (error) {
      return err(new Error(`Failed to find notification: ${error}`));
    }
  }

  async findByRecipientId(recipientId: string, limit = 50, offset = 0): Promise<Result<Notification[], Error>> {
    try {
      const rows = await db
        .select()
        .from(notifications)
        .where(eq(notifications.recipientId, recipientId))
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset(offset);

      const notificationList = rows.map(row => this.toDomain(row));
      return ok(notificationList);
    } catch (error) {
      return err(new Error(`Failed to find notifications: ${error}`));
    }
  }

  async findUnreadByRecipientId(recipientId: string): Promise<Result<Notification[], Error>> {
    try {
      const rows = await db
        .select()
        .from(notifications)
        .where(and(
          eq(notifications.recipientId, recipientId),
          eq(notifications.isRead, 0)
        ))
        .orderBy(desc(notifications.createdAt));

      const notificationList = rows.map(row => this.toDomain(row));
      return ok(notificationList);
    } catch (error) {
      return err(new Error(`Failed to find unread notifications: ${error}`));
    }
  }

  async update(notification: Notification): Promise<Result<Notification, Error>> {
    try {
      await db
        .update(notifications)
        .set({
          isRead: notification.isRead ? 1 : 0,
        })
        .where(eq(notifications.id, notification.notificationIdentifier));

      return ok(notification);
    } catch (error) {
      return err(new Error(`Failed to update notification: ${error}`));
    }
  }

  async markAsRead(id: string): Promise<Result<void, Error>> {
    try {
      await db
        .update(notifications)
        .set({ isRead: 1 })
        .where(eq(notifications.id, id));

      return ok(undefined);
    } catch (error) {
      return err(new Error(`Failed to mark notification as read: ${error}`));
    }
  }

  async markAllAsReadForRecipient(recipientId: string): Promise<Result<void, Error>> {
    try {
      await db
        .update(notifications)
        .set({ isRead: 1 })
        .where(eq(notifications.recipientId, recipientId));

      return ok(undefined);
    } catch (error) {
      return err(new Error(`Failed to mark all notifications as read: ${error}`));
    }
  }

  private toDomain(row: NotificationDrizzle): Notification {
    return new Notification(
      row.id,
      row.senderId,
      row.recipientId,
      row.title,
      row.message,
      row.type,
      row.isRead === 1,
      new Date(row.createdAt),
      row.discussionId ?? undefined,
      row.relatedEntityId ?? undefined
    );
  }
}
