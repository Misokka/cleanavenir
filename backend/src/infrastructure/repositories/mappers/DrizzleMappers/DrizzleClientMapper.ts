import { Client } from "../../../../domain/entities/Client";
import { ClientDrizzle, NewClientDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleClientMapper implements Mapper<ClientDrizzle, Client, NewClientDrizzle> {
  toDomain(raw: ClientDrizzle): Client {
    return {
      clientIdentifier: raw.id,
      userIdentifier: raw.userId,
      advisorIdentifier: raw.advisorId
    };
  }

  toPersistence(entity: Client): NewClientDrizzle {
    return {
      id: entity.clientIdentifier,
      userId: entity.userIdentifier,
      advisorId: entity.advisorIdentifier,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}