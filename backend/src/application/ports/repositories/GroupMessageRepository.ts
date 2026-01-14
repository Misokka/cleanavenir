import { Result } from '../../../shared/Result';
import { GroupMessage } from '../../../domain/entities/GroupMessage';

export interface GroupMessageRepository {
  save(message: GroupMessage): Promise<Result<GroupMessage, Error>>;
  findAll(limit?: number, offset?: number): Promise<Result<GroupMessage[], Error>>;
  findRecent(limit: number): Promise<Result<GroupMessage[], Error>>;
}
