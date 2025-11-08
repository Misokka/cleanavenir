import { Discussion } from '../../../domain/entities/Discussion';
import { Result } from '../../../shared/Result';

export interface DiscussionRepository {
  save(discussion: Discussion): Promise<Result<Discussion, Error>>;
  listForClient(clientId: string): Promise<Result<Discussion[], Error>>;
}
