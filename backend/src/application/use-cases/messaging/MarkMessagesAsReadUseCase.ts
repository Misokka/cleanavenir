import { DiscussionRepository } from '../../ports/repositories/DiscussionRepository';
import { Result, ok, err } from '../../../shared/Result';

interface MarkMessagesAsReadInput {
  discussionId: string;
  userId: string;
  userRole: 'CLIENT' | 'ADVISOR';
}

interface MarkMessagesAsReadOutput {
  markedCount: number;
}

export class MarkMessagesAsReadUseCase {
  constructor(
    private readonly discussionRepository: DiscussionRepository,
  ) {}

  async execute(input: MarkMessagesAsReadInput): Promise<Result<MarkMessagesAsReadOutput, Error>> {
    const discussionResult = await this.discussionRepository.findById(input.discussionId);
    if (!discussionResult.ok) {
      return err(discussionResult.error);
    }

    const markResult = await this.discussionRepository.markMessagesAsRead(
      input.discussionId,
      input.userRole
    );

    if (!markResult.ok) {
      return err(markResult.error);
    }

    return ok({ markedCount: markResult.value });
  }
}
