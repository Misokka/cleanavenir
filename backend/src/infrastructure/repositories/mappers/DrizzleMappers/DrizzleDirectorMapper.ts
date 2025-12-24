import { Director } from "../../../../domain/entities/Director";
import { DirectorDrizzle, NewDirectorDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleDirectorMapper implements Mapper<DirectorDrizzle, Director, NewDirectorDrizzle> {
  toDomain(raw: DirectorDrizzle): Director {
    return {
      directorIdentifier: raw.id,
      userIdentifier: raw.userId
    };
  }

  toPersistence(entity: Director): NewDirectorDrizzle {
    return {
      id: entity.directorIdentifier,
      userId: entity.userIdentifier,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
