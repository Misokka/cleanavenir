import { Result, ok, err } from '../../../shared/Result';
import { ActivityRepository } from '../../ports/repositories/ActivityRepository';
import { UserRepository } from '../../ports/repositories/UserRepository';
import { ActivityDTO } from '../../dtos/ActivityDTO';

export interface ListActivitiesInput {
  limit?: number;
  offset?: number;
}

export class ListActivitiesUseCase {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: ListActivitiesInput): Promise<Result<ActivityDTO[], Error>> {
    const activitiesResult = await this.activityRepository.findPublished(
      input.limit || 50,
      input.offset || 0
    );

    if (!activitiesResult.ok) {
      return err(activitiesResult.error);
    }

    const activities = activitiesResult.value;
    
    // Enrich with author names
    const enrichedActivities = await Promise.all(
      activities.map(async (activity) => {
        const userResult = await this.userRepository.findById(activity.authorIdentifier);
        const authorName = userResult.ok
          ? `${userResult.value.firstname} ${userResult.value.lastname}`
          : 'Unknown';

        return {
          id: activity.activityIdentifier,
          authorId: activity.authorIdentifier,
          authorName,
          title: activity.title,
          content: activity.content,
          type: activity.type,
          isPublished: activity.isPublished,
          createdAt: activity.createdAt.toISOString(),
          updatedAt: activity.updatedAt.toISOString(),
        };
      })
    );

    return ok(enrichedActivities);
  }
}
