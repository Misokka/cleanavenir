import { randomUUID } from 'crypto';
import { Result, ok, err } from '../../../../shared/Result';
import { DiscussionRepository } from '../../../ports/repositories/DiscussionRepository';
import { MessageRepository } from '../../../ports/repositories/MessageRepository';
import { AdvisorRepository } from '../../../ports/repositories/AdvisorRepository';
import { Message } from '../../../../domain/entities/Message';
import { MessageDTO } from '../../../dtos/DiscussionDTO';
import { AdvisorNotFoundError } from '../../../../domain/errors/AdvisorNotFoundError';
import { DiscussionAccessDeniedError } from '../../../../domain/errors/DiscussionAccessDeniedError';

export interface SendAdvisorMessageInput {
  userId: string;
  discussionId: string;
  content: string;
}

export interface SendAdvisorMessageOutput {
  message: MessageDTO;
  discussionClaimed: boolean;
}

export class SendAdvisorMessageUseCase {
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly messageRepository: MessageRepository,
    private readonly advisorRepository: AdvisorRepository
  ) {}

  async execute(input: SendAdvisorMessageInput): Promise<Result<SendAdvisorMessageOutput, Error>> {

    const advisorResult = await this.advisorRepository.findByUserId(input.userId);
    if (!advisorResult.ok) {
      return err(new AdvisorNotFoundError(input.userId));
    }
    const advisor = advisorResult.value;

    const discussionResult = await this.discussionRepository.findById(input.discussionId);
    if (!discussionResult.ok) {
      return err(discussionResult.error);
    }
    let discussion = discussionResult.value;

    let discussionClaimed = false;

    if (discussion.isPending()) {
      const claimResult = await this.discussionRepository.claimDiscussion(
        input.discussionId,
        advisor.advisorIdentifier
      );
      if (!claimResult.ok) {
        return err(claimResult.error);
      }
      discussion = claimResult.value;
      discussionClaimed = true;
    } else if (!discussion.canBeRespondedBy(advisor.advisorIdentifier)) {
      return err(new DiscussionAccessDeniedError(input.discussionId));
    }

    const message = new Message(
      randomUUID(),
      input.discussionId,
      input.userId,
      'ADVISOR',
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
      message: {
        id: saved.messageIdentifier,
        discussionId: saved.discussionIdentifier,
        senderId: saved.senderIdentifier,
        senderRole: saved.senderRole,
        content: saved.content,
        createdAt: saved.createdAt.toISOString(),
        isRead: saved.isRead,
        readAt: saved.readAt?.toISOString() ?? null,
      },
      discussionClaimed,
    });
  }
}
