import { User, UserRole } from "../../../../domain/entities/User";
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
      role: raw.role as UserRole
    };
  }

  toPersistence(entity: User): NewUserDrizzle {
    return {
      id: entity.userIdentifier,
      firstname: entity.firstname,
      lastname: entity.lastname,
      email: entity.email,
      password: entity.password,
      role: entity.role,
      createdAt: entity.createdAt.toISOString(),
      isActive: entity.active ? 1 : 0,
      updatedAt: new Date().toISOString(),
      emailVerifiedAt: entity.emailVerifiedAt?.toISOString() || null,
    };
  }
}
