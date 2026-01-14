import { eq, desc } from 'drizzle-orm';
import { db } from '../drizzle/client';
import { activities, ActivityDrizzle, NewActivityDrizzle } from '../drizzle/schema';
import { ActivityRepository } from '../../application/ports/repositories/ActivityRepository';
import { Activity } from '../../domain/entities/Activity';
import { Result, ok, err } from '../../shared/Result';

export class DrizzleActivityRepository implements ActivityRepository {
  async save(activity: Activity): Promise<Result<Activity, Error>> {
    try {
      const newActivity: NewActivityDrizzle = {
        id: activity.activityIdentifier,
        authorId: activity.authorIdentifier,
        title: activity.title,
        content: activity.content,
        type: activity.type,
        isPublished: activity.isPublished ? 1 : 0,
        createdAt: activity.createdAt.toISOString(),
        updatedAt: activity.updatedAt.toISOString(),
      };

      await db.insert(activities).values(newActivity);
      return ok(activity);
    } catch (error) {
      return err(new Error(`Failed to save activity: ${error}`));
    }
  }

  async findById(id: string): Promise<Result<Activity, Error>> {
    try {
      const rows = await db.select().from(activities).where(eq(activities.id, id));
      if (rows.length === 0) {
        return err(new Error('Activity not found'));
      }

      const row = rows[0];
      const activity = this.toDomain(row);
      return ok(activity);
    } catch (error) {
      return err(new Error(`Failed to find activity: ${error}`));
    }
  }

  async findAll(limit = 50, offset = 0): Promise<Result<Activity[], Error>> {
    try {
      const rows = await db
        .select()
        .from(activities)
        .orderBy(desc(activities.createdAt))
        .limit(limit)
        .offset(offset);

      const activityList = rows.map(row => this.toDomain(row));
      return ok(activityList);
    } catch (error) {
      return err(new Error(`Failed to find activities: ${error}`));
    }
  }

  async findPublished(limit = 50, offset = 0): Promise<Result<Activity[], Error>> {
    try {
      const rows = await db
        .select()
        .from(activities)
        .where(eq(activities.isPublished, 1))
        .orderBy(desc(activities.createdAt))
        .limit(limit)
        .offset(offset);

      const activityList = rows.map(row => this.toDomain(row));
      return ok(activityList);
    } catch (error) {
      return err(new Error(`Failed to find published activities: ${error}`));
    }
  }

  async update(activity: Activity): Promise<Result<Activity, Error>> {
    try {
      await db
        .update(activities)
        .set({
          title: activity.title,
          content: activity.content,
          type: activity.type,
          isPublished: activity.isPublished ? 1 : 0,
          updatedAt: activity.updatedAt.toISOString(),
        })
        .where(eq(activities.id, activity.activityIdentifier));

      return ok(activity);
    } catch (error) {
      return err(new Error(`Failed to update activity: ${error}`));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      await db.delete(activities).where(eq(activities.id, id));
      return ok(undefined);
    } catch (error) {
      return err(new Error(`Failed to delete activity: ${error}`));
    }
  }

  private toDomain(row: ActivityDrizzle): Activity {
    return new Activity(
      row.id,
      row.authorId,
      row.title,
      row.content,
      row.type,
      row.isPublished === 1,
      new Date(row.createdAt),
      new Date(row.updatedAt)
    );
  }
}
