import { Result, ok, err } from '../../../shared/Result';
import { NotificationRepository } from '../../ports/repositories/NotificationRepository';
import { UserRepository } from '../../ports/repositories/UserRepository';
import { NotificationDTO } from '../../dtos/NotificationDTO';

export interface ListNotificationsInput {
  userId: string;
  limit?: number;
  offset?: number;
}

export class ListNotificationsUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: ListNotificationsInput): Promise<Result<NotificationDTO[], Error>> {
    const notificationsResult = await this.notificationRepository.findByRecipientId(
      input.userId,
      input.limit || 50,
      input.offset || 0
    );

    if (!notificationsResult.ok) {
      return err(notificationsResult.error);
    }

    const notifications = notificationsResult.value;

    const enrichedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        const userResult = await this.userRepository.findById(notification.senderIdentifier);
        const senderName = userResult.ok
          ? `${userResult.value.firstname} ${userResult.value.lastname}`
          : 'Unknown';

        return {
          id: notification.notificationIdentifier,
          senderId: notification.senderIdentifier,
          senderName,
          recipientId: notification.recipientIdentifier,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          isRead: notification.isRead,
          createdAt: notification.createdAt.toISOString(),
          discussionId: notification.discussionId,
          relatedEntityId: notification.relatedEntityId,
        };
      })
    );

    return ok(enrichedNotifications);
  }
}
