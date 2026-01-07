import { Result, ok, err } from '../../../../shared/Result';
import { DiscussionRepository } from '../../../ports/repositories/DiscussionRepository';
import { MessageRepository } from '../../../ports/repositories/MessageRepository';
import { ClientRepository } from '../../../ports/repositories/ClientRepository';
import { AdvisorRepository } from '../../../ports/repositories/AdvisorRepository';
import { UserRepository } from '../../../ports/repositories/UserRepository';
import { DiscussionWithMessagesDTO, MessageDTO, DiscussionDTO } from '../../../dtos/DiscussionDTO';
import { ClientNotFoundError } from '../../../../domain/errors/ClientNotFoundError';
import { DiscussionAccessDeniedError } from '../../../../domain/errors/DiscussionAccessDeniedError';

export interface GetClientDiscussionInput {
  userId: string;
  discussionId: string;
}

export class GetClientDiscussionUseCase {
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly messageRepository: MessageRepository,
    private readonly clientRepository: ClientRepository,
    private readonly advisorRepository?: AdvisorRepository,
    private readonly userRepository?: UserRepository
  ) {}

  async execute(input: GetClientDiscussionInput): Promise<Result<DiscussionWithMessagesDTO, Error>> {
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

    let advisorName: string | undefined;
    if (discussion.advisorIdentifier && this.advisorRepository && this.userRepository) {
      const advisorResult = await this.advisorRepository.findById(discussion.advisorIdentifier);
      if (advisorResult.ok) {
        const userResult = await this.userRepository.findById(advisorResult.value.userIdentifier);
        if (userResult.ok) {
          advisorName = `${userResult.value.firstname} ${userResult.value.lastname}`;
        }
      }
    }

    const messagesResult = await this.messageRepository.listForDiscussion(input.discussionId);
    if (!messagesResult.ok) {
      return err(messagesResult.error);
    }

    const discussionDTO: DiscussionDTO = {
      id: discussion.discussionIdentifier,
      clientId: discussion.clientIdentifier,
      advisorId: discussion.advisorIdentifier,
      subject: discussion.subject,
      status: discussion.status,
      createdAt: discussion.createdAt.toISOString(),
      updatedAt: discussion.updatedAt.toISOString(),
      advisorName,
    };

    const senderNames: Record<string, string> = {};
    
    if (this.userRepository) {
      const senderIds = [...new Set(messagesResult.value.map(m => m.senderIdentifier))];
      for (const senderId of senderIds) {
        const userResult = await this.userRepository.findById(senderId);
        if (userResult.ok) {
          senderNames[senderId] = `${userResult.value.firstname} ${userResult.value.lastname}`;
        }
      }
    }

    const messageDTOs: MessageDTO[] = messagesResult.value.map(m => ({
      id: m.messageIdentifier,
      discussionId: m.discussionIdentifier,
      senderId: m.senderIdentifier,
      senderRole: m.senderRole,
      senderName: senderNames[m.senderIdentifier],
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    }));

    return ok({
      discussion: discussionDTO,
      messages: messageDTOs,
    });
  }
}
