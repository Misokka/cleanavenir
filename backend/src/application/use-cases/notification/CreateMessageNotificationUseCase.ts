import { randomUUID } from 'crypto';
import { Result, ok, err } from '../../../shared/Result';
import { NotificationRepository } from '../../ports/repositories/NotificationRepository';
import { Notification } from '../../../domain/entities/Notification';
import { NotificationDTO } from '../../dtos/NotificationDTO';

export interface CreateMessageNotificationInput {
  senderId: string;
  recipientId: string;
  senderName: string;
  messageContent: string;
  discussionId: string;
  messageId: string;
}

export class CreateMessageNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(input: CreateMessageNotificationInput): Promise<Result<NotificationDTO, Error>> {
    const notification = new Notification(
      randomUUID(),
      input.senderId,
      input.recipientId,
      `Nouveau message de ${input.senderName}`,
      input.messageContent.substring(0, 100) + (input.messageContent.length > 100 ? '...' : ''),
      'MESSAGE',
      false,
      new Date(),
      input.discussionId,
      input.messageId
    );

    const saveResult = await this.notificationRepository.save(notification);
    if (!saveResult.ok) {
      return err(saveResult.error);
    }

    const saved = saveResult.value;
    return ok({
      id: saved.notificationIdentifier,
      senderId: saved.senderIdentifier,
      recipientId: saved.recipientIdentifier,
      title: saved.title,
      message: saved.message,
      type: saved.type,
      isRead: saved.isRead,
      createdAt: saved.createdAt.toISOString(),
      discussionId: saved.discussionId,
      relatedEntityId: saved.relatedEntityId,
    });
  }
}
