import { DiscussionTransfer } from '../../../domain/entities/DiscussionTransfer';
import { Result } from '../../../shared/Result';

export interface DiscussionTransferRepository {
  save(transfer: DiscussionTransfer): Promise<Result<DiscussionTransfer, Error>>;
  listForDiscussion(discussionId: string): Promise<Result<DiscussionTransfer[], Error>>;
}
