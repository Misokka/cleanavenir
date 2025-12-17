import { User, userRole } from "../../../../domain/entities/User";
import { UserDrizzle, NewUserDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleUserMapper implements Mapper<UserDrizzle, User, NewUserDrizzle> {
  toDomain(raw: UserDrizzle): User {
    return {
      ...raw,
      userIdentifier: raw.id,
      active: raw.isActive === 1 ? true : false,
      emailVerifiedAt: new Date(raw.emailVerifiedAt as string),
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
      role: raw.role as userRole
    };
  }

  toPersistence(entity: User): NewUserDrizzle {
    return {
      ...entity,
      id: entity.userIdentifier,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerifiedAt: entity.emailVerifiedAt?.toISOString(),
    };
  }
}
