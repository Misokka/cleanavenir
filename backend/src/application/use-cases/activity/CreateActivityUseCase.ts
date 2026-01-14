import { randomUUID } from 'crypto';
import { Result, ok, err } from '../../../shared/Result';
import { ActivityRepository } from '../../ports/repositories/ActivityRepository';
import { Activity } from '../../../domain/entities/Activity';
import { ActivityDTO } from '../../dtos/ActivityDTO';

export interface CreateActivityInput {
  userId: string;
  title: string;
  content: string;
  type?: string;
}

export class CreateActivityUseCase {
  constructor(
    private readonly activityRepository: ActivityRepository
  ) {}

  async execute(input: CreateActivityInput): Promise<Result<ActivityDTO, Error>> {
    const activity = new Activity(
      randomUUID(),
      input.userId,
      input.title,
      input.content,
      input.type || 'NEWS',
      true,
      new Date(),
      new Date()
    );

    const saveResult = await this.activityRepository.save(activity);
    if (!saveResult.ok) {
      return err(saveResult.error);
    }

    const saved = saveResult.value;
    return ok({
      id: saved.activityIdentifier,
      authorId: saved.authorIdentifier,
      title: saved.title,
      content: saved.content,
      type: saved.type,
      isPublished: saved.isPublished,
      createdAt: saved.createdAt.toISOString(),
      updatedAt: saved.updatedAt.toISOString(),
    });
  }
}
