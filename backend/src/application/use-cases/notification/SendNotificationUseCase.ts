import { randomUUID } from 'crypto';
import { Result, ok, err } from '../../../shared/Result';
import { NotificationRepository } from '../../ports/repositories/NotificationRepository';
import { ClientRepository } from '../../ports/repositories/ClientRepository';
import { Notification } from '../../../domain/entities/Notification';
import { NotificationDTO } from '../../dtos/NotificationDTO';

export interface SendNotificationInput {
  userId: string;
  recipientUserId: string;
  title: string;
  message: string;
  type?: string;
  discussionId?: string;
  relatedEntityId?: string;
}

export class SendNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(input: SendNotificationInput): Promise<Result<NotificationDTO, Error>> {
    const clientResult = await this.clientRepository.findByUserId(input.recipientUserId);
    if (!clientResult.ok) {
      return err(new Error('Recipient not found'));
    }

    const notification = new Notification(
      randomUUID(),
      input.userId,
      input.recipientUserId,
      input.title,
      input.message,
      input.type || 'INFO',
      false,
      new Date(),
      input.discussionId,
      input.relatedEntityId
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
