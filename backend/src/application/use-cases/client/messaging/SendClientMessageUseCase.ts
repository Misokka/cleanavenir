import { randomUUID } from 'crypto';
import { Result, ok, err } from '../../../../shared/Result';
import { DiscussionRepository } from '../../../ports/repositories/DiscussionRepository';
import { MessageRepository } from '../../../ports/repositories/MessageRepository';
import { ClientRepository } from '../../../ports/repositories/ClientRepository';
import { Message } from '../../../../domain/entities/Message';
import { MessageDTO } from '../../../dtos/DiscussionDTO';
import { ClientNotFoundError } from '../../../../domain/errors/ClientNotFoundError';
import { DiscussionNotFoundError } from '../../../../domain/errors/DiscussionNotFoundError';
import { DiscussionAccessDeniedError } from '../../../../domain/errors/DiscussionAccessDeniedError';

export interface SendClientMessageInput {
  userId: string;
  discussionId: string;
  content: string;
}

export class SendClientMessageUseCase {
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly messageRepository: MessageRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(input: SendClientMessageInput): Promise<Result<MessageDTO, Error>> {
    const clientResult = await this.clientRepository.findByUserId(input.userId);
    if (!clientResult.ok) {
      return err(new ClientNotFoundError(input.userId));
    }
    const client = clientResult.value;

    const discussionResult = await this.discussionRepository.findById(input.discussionId);
    if (!discussionResult.ok) {
      return err(discussionResult.error);
    }
    const discussion = discussionResult.value;

    if (discussion.clientIdentifier !== client.clientIdentifier) {
      return err(new DiscussionAccessDeniedError(input.discussionId));
    }

    const message = new Message(
      randomUUID(),
      input.discussionId,
      input.userId,
      'CLIENT',
      input.content,
      new Date()
    );

    const saveResult = await this.messageRepository.save(message);
    if (!saveResult.ok) {
      return err(saveResult.error);
    }

    discussion.updatedAt = new Date();
    await this.discussionRepository.update(discussion);

    const saved = saveResult.value;
    return ok({
      id: saved.messageIdentifier,
      discussionId: saved.discussionIdentifier,
      senderId: saved.senderIdentifier,
      senderRole: saved.senderRole,
      content: saved.content,
      createdAt: saved.createdAt.toISOString(),
      isRead: saved.isRead,
      readAt: saved.readAt?.toISOString() ?? null,
    });
  }
}
