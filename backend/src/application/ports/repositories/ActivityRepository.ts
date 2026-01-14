import { Result } from '../../../shared/Result';
import { Activity } from '../../../domain/entities/Activity';

export interface ActivityRepository {
  save(activity: Activity): Promise<Result<Activity, Error>>;
  findById(id: string): Promise<Result<Activity, Error>>;
  findAll(limit?: number, offset?: number): Promise<Result<Activity[], Error>>;
  findPublished(limit?: number, offset?: number): Promise<Result<Activity[], Error>>;
  update(activity: Activity): Promise<Result<Activity, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
}
