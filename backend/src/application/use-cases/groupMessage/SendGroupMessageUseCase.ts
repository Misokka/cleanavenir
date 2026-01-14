import { randomUUID } from 'crypto';
import { Result, ok, err } from '../../../shared/Result';
import { GroupMessageRepository } from '../../ports/repositories/GroupMessageRepository';
import { UserRepository } from '../../ports/repositories/UserRepository';
import { GroupMessage } from '../../../domain/entities/GroupMessage';
import { GroupMessageDTO } from '../../dtos/GroupMessageDTO';

export interface SendGroupMessageInput {
  userId: string;
  userRole: string;
  content: string;
}

export class SendGroupMessageUseCase {
  constructor(
    private readonly groupMessageRepository: GroupMessageRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: SendGroupMessageInput): Promise<Result<GroupMessageDTO, Error>> {
    if (input.userRole !== 'ADVISOR' && input.userRole !== 'DIRECTOR') {
      return err(new Error('Only advisors and directors can send group messages'));
    }

    const userResult = await this.userRepository.findById(input.userId);
    if (!userResult.ok) {
      return err(new Error('User not found'));
    }

    const user = userResult.value;

    const message = new GroupMessage(
      randomUUID(),
      input.userId,
      input.userRole as 'ADVISOR' | 'DIRECTOR',
      input.content,
      new Date()
    );

    const saveResult = await this.groupMessageRepository.save(message);
    if (!saveResult.ok) {
      return err(saveResult.error);
    }

    const saved = saveResult.value;
    return ok({
      id: saved.messageIdentifier,
      senderId: saved.senderIdentifier,
      senderName: `${user.firstname} ${user.lastname}`,
      senderRole: saved.senderRole,
      content: saved.content,
      createdAt: saved.createdAt.toISOString(),
    });
  }
}
