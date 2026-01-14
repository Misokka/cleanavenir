import { Result, ok, err } from '../../../shared/Result';
import { GroupMessageRepository } from '../../ports/repositories/GroupMessageRepository';
import { UserRepository } from '../../ports/repositories/UserRepository';
import { GroupMessageDTO } from '../../dtos/GroupMessageDTO';

export interface ListGroupMessagesInput {
  limit?: number;
  offset?: number;
}

export class ListGroupMessagesUseCase {
  constructor(
    private readonly groupMessageRepository: GroupMessageRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: ListGroupMessagesInput): Promise<Result<GroupMessageDTO[], Error>> {
    const messagesResult = await this.groupMessageRepository.findAll(
      input.limit || 100,
      input.offset || 0
    );

    if (!messagesResult.ok) {
      return err(messagesResult.error);
    }

    const messages = messagesResult.value;

    const enrichedMessages = await Promise.all(
      messages.map(async (message) => {
        const userResult = await this.userRepository.findById(message.senderIdentifier);
        const senderName = userResult.ok
          ? `${userResult.value.firstname} ${userResult.value.lastname}`
          : 'Unknown';

        return {
          id: message.messageIdentifier,
          senderId: message.senderIdentifier,
          senderName,
          senderRole: message.senderRole,
          content: message.content,
          createdAt: message.createdAt.toISOString(),
        };
      })
    );

    return ok(enrichedMessages);
  }
}
