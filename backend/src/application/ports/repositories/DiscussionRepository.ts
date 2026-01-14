import { Discussion } from '../../../domain/entities/Discussion';
import { Result } from '../../../shared/Result';

export interface DiscussionRepository {
  save(discussion: Discussion): Promise<Result<Discussion, Error>>;
  findById(discussionId: string): Promise<Result<Discussion, Error>>;
  listForClient(clientId: string): Promise<Result<Discussion[], Error>>;
  listPending(): Promise<Result<Discussion[], Error>>; 
  listForAdvisor(advisorId: string): Promise<Result<Discussion[], Error>>; 
  update(discussion: Discussion): Promise<Result<Discussion, Error>>;
  claimDiscussion(discussionId: string, advisorId: string): Promise<Result<Discussion, Error>>;
  markMessagesAsRead(discussionId: string, readerRole: 'CLIENT' | 'ADVISOR'): Promise<Result<number, Error>>;
}
