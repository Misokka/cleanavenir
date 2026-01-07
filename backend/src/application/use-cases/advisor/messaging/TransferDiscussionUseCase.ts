import { randomUUID } from 'crypto';
import { Result, ok, err } from '../../../../shared/Result';
import { DiscussionRepository } from '../../../ports/repositories/DiscussionRepository';
import { DiscussionTransferRepository } from '../../../ports/repositories/DiscussionTransferRepository';
import { AdvisorRepository } from '../../../ports/repositories/AdvisorRepository';
import { DiscussionTransfer } from '../../../../domain/entities/DiscussionTransfer';
import { DiscussionTransferDTO } from '../../../dtos/DiscussionDTO';
import { AdvisorNotFoundError } from '../../../../domain/errors/AdvisorNotFoundError';
import { DiscussionAccessDeniedError } from '../../../../domain/errors/DiscussionAccessDeniedError';
import { CannotTransferOwnDiscussionError } from '../../../../domain/errors/CannotTransferOwnDiscussionError';

export interface TransferDiscussionInput {
  userId: string;
  discussionId: string;
  toAdvisorId: string; // Advisor ID (not user ID)
  reason?: string;
}

export class TransferDiscussionUseCase {
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly transferRepository: DiscussionTransferRepository,
    private readonly advisorRepository: AdvisorRepository
  ) {}

  async execute(input: TransferDiscussionInput): Promise<Result<DiscussionTransferDTO, Error>> {
    const advisorResult = await this.advisorRepository.findByUserId(input.userId);
    if (!advisorResult.ok) {
      return err(new AdvisorNotFoundError(input.userId));
    }
    const fromAdvisor = advisorResult.value;

    const toAdvisorResult = await this.advisorRepository.findById(input.toAdvisorId);
    if (!toAdvisorResult.ok) {
      return err(new AdvisorNotFoundError(input.toAdvisorId));
    }
    const toAdvisor = toAdvisorResult.value;

    if (fromAdvisor.advisorIdentifier === toAdvisor.advisorIdentifier) {
      return err(new CannotTransferOwnDiscussionError());
    }

    const discussionResult = await this.discussionRepository.findById(input.discussionId);
    if (!discussionResult.ok) {
      return err(discussionResult.error);
    }
    const discussion = discussionResult.value;

    if (!discussion.isAssigned() || discussion.advisorIdentifier !== fromAdvisor.advisorIdentifier) {
      return err(new DiscussionAccessDeniedError(input.discussionId));
    }

    const transfer = new DiscussionTransfer(
      randomUUID(),
      input.discussionId,
      fromAdvisor.advisorIdentifier,
      toAdvisor.advisorIdentifier,
      input.reason ?? null,
      new Date()
    );

    const saveTransferResult = await this.transferRepository.save(transfer);
    if (!saveTransferResult.ok) {
      return err(saveTransferResult.error);
    }

    discussion.transfer(toAdvisor.advisorIdentifier);
    const updateResult = await this.discussionRepository.update(discussion);
    if (!updateResult.ok) {
      return err(updateResult.error);
    }

    const saved = saveTransferResult.value;
    return ok({
      id: saved.transferIdentifier,
      discussionId: saved.discussionIdentifier,
      fromAdvisorId: saved.fromAdvisorIdentifier,
      toAdvisorId: saved.toAdvisorIdentifier,
      reason: saved.reason,
      createdAt: saved.createdAt.toISOString(),
    });
  }
}
