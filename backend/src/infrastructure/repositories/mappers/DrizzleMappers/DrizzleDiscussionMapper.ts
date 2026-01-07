import { Discussion, DiscussionStatus } from "../../../../domain/entities/Discussion";
import { DiscussionDrizzle, NewDiscussionDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleDiscussionMapper implements Mapper<DiscussionDrizzle, Discussion, NewDiscussionDrizzle> {
  toDomain(raw: DiscussionDrizzle): Discussion {
    return new Discussion(
      raw.id,
      raw.clientId,
      raw.advisorId ?? null,
      raw.subject ?? null,
      raw.status as DiscussionStatus,
      new Date(raw.createdAt),
      new Date(raw.updatedAt),
    );
  }

  toPersistence(entity: Discussion): NewDiscussionDrizzle {
    const now = new Date().toISOString();
    return {
      id: entity.discussionIdentifier,
      subject: entity.subject ?? null,
      clientId: entity.clientIdentifier,
      advisorId: entity.advisorIdentifier ?? null,
      status: entity.status,
      createdAt: entity.createdAt?.toISOString() ?? now,
      updatedAt: entity.updatedAt?.toISOString() ?? now,
    };
  }
}
