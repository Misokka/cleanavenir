import { Discussion } from "../../../../domain/entities/Discussion";
import { DiscussionDrizzle, NewDiscussionDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleDiscussionMapper implements Mapper<DiscussionDrizzle, Discussion, NewDiscussionDrizzle> {
  toDomain(raw: DiscussionDrizzle): Discussion {
    return {
      discussionIdentifier: raw.id,
      subject: raw.subject as string | undefined,
      clientIdentifier: raw.clientId,
      advisorIdentifier: raw.advisorId as string | undefined,
      createdAt: new Date(raw.createdAt),
    };
  }

  toPersistence(entity: Discussion): NewDiscussionDrizzle {
    return {
      id: entity.discussionIdentifier,
      subject: entity.subject,
      clientId: entity.clientIdentifier,
      advisorId: entity.advisorIdentifier,
      createdAt: new Date().toISOString(),
    };
  }
}
