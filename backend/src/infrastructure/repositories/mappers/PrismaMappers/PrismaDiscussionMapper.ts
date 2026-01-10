import { Mapper } from "../MapperInterface";
import { Discussion as PrismaDiscussion } from "@prisma/client";
import { Discussion } from "../../../../domain/entities/Discussion";

type DiscussionToPersit = {
  discussionIdentifier: string,
  clientIdentifier: string,
  advisorIdentifier?: string,
  subject?: string,
  createdAt: Date,
}

export class PrismaDiscussionMapper implements Mapper<PrismaDiscussion, Discussion, DiscussionToPersit>{
  toDomain(raw: PrismaDiscussion): Discussion {
    return new Discussion(
      raw.discussionIdentifier,
      raw.clientIdentifier,
      raw.advisorIdentifier || undefined,
      raw.subject || undefined,
      raw.status,
      raw.createdAt || undefined
    )
  };

  toPersistence(obj: Discussion): DiscussionToPersit {
    return {
      ...obj,
      advisorIdentifier: obj.advisorIdentifier as string | undefined,
      subject: obj.subject as string | undefined,
    }
  }
}