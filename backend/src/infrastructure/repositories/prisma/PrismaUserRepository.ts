import { PrismaClient } from "@prisma/client";
import { UserRole } from "../../../application/dtos/UserDTO";
import { UserRepository } from "../../../application/ports/repositories/UserRepository";
import { User } from "../../../domain/entities/User";
import { EmailAlreadyUsedError } from "../../../domain/errors/EmailAlreadyUsedError";
import Result, { err, ok } from "../../../shared/Result";
import { PrismaUserMapper } from "../mappers/PrismaMappers/PrismaUserMapper";
import { InvalidRoleError } from "../../../domain/errors/InvalidRoleError";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";


export class PrismaUserRepository implements UserRepository {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaUserMapper: PrismaUserMapper
  ){}
  async save(user: User): Promise<Result<User, EmailAlreadyUsedError | InvalidRoleError | Error>> {
    try {
      const existingUser = await this.findByEmail(user.email);
      if (existingUser.ok) {
        return err(new EmailAlreadyUsedError(user.email));
      }

      const userToPersist = this.prismaUserMapper.toPersistence(user);
      const persistedUser = await this.prismaClient.user.create({
        data: userToPersist
      });

      const domainUser = this.prismaUserMapper.toDomain(persistedUser);
      return ok(domainUser);
    } catch {
      return err(new Error("Could not save user"))
    }
  }

  async findById(userIdentifier: string): Promise<Result<User, UserNotFoundError>> {
    const prismaUser = await this.prismaClient.user.findUnique({
      where: {userIdentifier}
    });

    if(!prismaUser){
      return err(new UserNotFoundError(userIdentifier))
    }

    const domainUser = this.prismaUserMapper.toDomain(prismaUser);
    return ok(domainUser);
  }

  async findByEmail(email: string): Promise<Result<User, UserNotFoundError>> {
    const prismaUser = await this.prismaClient.user.findUnique({
      where: {email}
    });

    if(!prismaUser){
      return err(new UserNotFoundError(email))
    }

    const domainUser = this.prismaUserMapper.toDomain(prismaUser);
    return ok(domainUser);
  }

  async setRole(userIdentifier: string, role: UserRole): Promise<Result<User, UserNotFoundError | InvalidRoleError>> {
    const existingUser = await this.prismaClient.user.findUnique({
      where: {userIdentifier}
    });

    if(!existingUser){
      return err(new UserNotFoundError(userIdentifier))
    }

    const updatedUser = await this.prismaClient.user.update({
      where: {userIdentifier},
      data: {role}
    });

    const domainUser = this.prismaUserMapper.toDomain(updatedUser);
    return ok(domainUser);
  }

  async setEmailVerified(userIdentifier: string, whenISO: string): Promise<Result<User, UserNotFoundError>> {
    const existingUser = await this.prismaClient.user.findUnique({
      where: {userIdentifier}
    });

    if(!existingUser){
      return err(new UserNotFoundError(userIdentifier))
    }

    const updatedUser = await this.prismaClient.user.update({
      where: {userIdentifier},
      data: {
        emailVerifiedAt: new Date(whenISO)
      }
    });

    const domainUser = this.prismaUserMapper.toDomain(updatedUser);
    return ok(domainUser);
  }

  async setActive(userIdentifier: string, active: boolean): Promise<Result<User, UserNotFoundError>> {
    const existingUser = await this.prismaClient.user.findUnique({
      where: {userIdentifier}
    });

    if(!existingUser){
      return err(new UserNotFoundError(userIdentifier))
    }

    const updatedUser = await this.prismaClient.user.update({
      where: {userIdentifier},
      data: {active}
    });

    const domainUser = this.prismaUserMapper.toDomain(updatedUser);
    return ok(domainUser);
  }

  async listByRole(role: UserRole): Promise<Result<User[], never>> {
    const prismaUsers = await this.prismaClient.user.findMany({
      where: {role}
    });

    const domainUsers = prismaUsers.map((prismaUser) =>
      this.prismaUserMapper.toDomain(prismaUser)
    );

    return ok(domainUsers);
  }
}