import { Message } from '../../../domain/entities/Message';
import { Result } from '../../../shared/Result';

export interface MessageRepository {
  save(message: Message): Promise<Result<Message, Error>>;
  findById(messageId: string): Promise<Result<Message, Error>>;
  listForDiscussion(discussionId: string): Promise<Result<Message[], Error>>;
}
