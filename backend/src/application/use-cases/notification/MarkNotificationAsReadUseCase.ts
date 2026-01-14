import { Result, ok, err } from '../../../shared/Result';
import { NotificationRepository } from '../../ports/repositories/NotificationRepository';

export interface MarkNotificationAsReadInput {
  userId: string;
  notificationId: string;
}

export class MarkNotificationAsReadUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(input: MarkNotificationAsReadInput): Promise<Result<void, Error>> {
    const notificationResult = await this.notificationRepository.findById(input.notificationId);
    if (!notificationResult.ok) {
      return err(new Error('Notification not found'));
    }

    const notification = notificationResult.value;

    if (notification.recipientIdentifier !== input.userId) {
      return err(new Error('Access denied'));
    }

    notification.markAsRead();
    
    const updateResult = await this.notificationRepository.update(notification);
    if (!updateResult.ok) {
      return err(updateResult.error);
    }

    return ok(undefined);
  }
}
