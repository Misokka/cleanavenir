import { Result, ok, err } from '../../../../shared/Result';
import { DiscussionRepository } from '../../../ports/repositories/DiscussionRepository';
import { MessageRepository } from '../../../ports/repositories/MessageRepository';
import { AdvisorRepository } from '../../../ports/repositories/AdvisorRepository';
import { UserRepository } from '../../../ports/repositories/UserRepository';
import { ClientRepository } from '../../../ports/repositories/ClientRepository';
import { DiscussionWithMessagesDTO, MessageDTO, DiscussionDTO } from '../../../dtos/DiscussionDTO';
import { AdvisorNotFoundError } from '../../../../domain/errors/AdvisorNotFoundError';
import { DiscussionAccessDeniedError } from '../../../../domain/errors/DiscussionAccessDeniedError';

export interface GetAdvisorDiscussionInput {
  userId: string;
  discussionId: string;
}

export class GetAdvisorDiscussionUseCase {
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly messageRepository: MessageRepository,
    private readonly advisorRepository: AdvisorRepository,
    private readonly userRepository: UserRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(input: GetAdvisorDiscussionInput): Promise<Result<DiscussionWithMessagesDTO, Error>> {
    const advisorResult = await this.advisorRepository.findByUserId(input.userId);
    if (!advisorResult.ok) {
      return err(new AdvisorNotFoundError(input.userId));
    }
    const advisor = advisorResult.value;

    const discussionResult = await this.discussionRepository.findById(input.discussionId);
    if (!discussionResult.ok) {
      return err(discussionResult.error);
    }
    const discussion = discussionResult.value;

    const canView = discussion.isPending() || 
                    (discussion.isAssigned() && discussion.advisorIdentifier === advisor.advisorIdentifier);
    
    if (!canView) {
      return err(new DiscussionAccessDeniedError(input.discussionId));
    }

    const messagesResult = await this.messageRepository.listForDiscussion(input.discussionId);
    if (!messagesResult.ok) {
      return err(messagesResult.error);
    }

    let clientName: string | undefined;
    const clientResult = await this.clientRepository.findById(discussion.clientIdentifier);
    if (clientResult.ok) {
      const userResult = await this.userRepository.findById(clientResult.value.userIdentifier);
      if (userResult.ok) {
        clientName = `${userResult.value.firstname} ${userResult.value.lastname}`;
      }
    }

    const discussionDTO: DiscussionDTO = {
      id: discussion.discussionIdentifier,
      clientId: discussion.clientIdentifier,
      advisorId: discussion.advisorIdentifier,
      subject: discussion.subject,
      status: discussion.status,
      createdAt: discussion.createdAt.toISOString(),
      updatedAt: discussion.updatedAt.toISOString(),
      clientName,
    };

    const messageDTOs: MessageDTO[] = messagesResult.value.map(m => ({
      id: m.messageIdentifier,
      discussionId: m.discussionIdentifier,
      senderId: m.senderIdentifier,
      senderRole: m.senderRole,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
      isRead: m.isRead,
      readAt: m.readAt?.toISOString() ?? null,
    }));

    return ok({
      discussion: discussionDTO,
      messages: messageDTOs,
    });
  }
}
