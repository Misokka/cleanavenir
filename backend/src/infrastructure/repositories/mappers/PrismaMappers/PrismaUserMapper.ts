import { User as PrismaUser } from "@prisma/client";
import { UserRole as PrismaUserRole } from "@prisma/client";
import { User } from "../../../../domain/entities/User";
import { Mapper } from "../MapperInterface";

type UserToPersist = {
  userIdentifier: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: PrismaUserRole;
  active: boolean;
  emailVerifiedAt: Date | null;
};
export class PrismaUserMapper implements Mapper<PrismaUser, User, UserToPersist> {
  toDomain(raw: PrismaUser): User {
    return User.create({
      ...raw
    })
  }

  toPersistence(obj: User): UserToPersist {
    return {...obj}
  }
}