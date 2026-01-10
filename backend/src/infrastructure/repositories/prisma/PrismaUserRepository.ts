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

  async update(user: User): Promise<Result<User, UserNotFoundError | EmailAlreadyUsedError | InvalidRoleError | Error>> {
    try {
      const existingUser = await this.prismaClient.user.findUnique({
        where: { userIdentifier: user.userIdentifier}
      });

      if(!existingUser){
        return err(new UserNotFoundError(user.userIdentifier));
      }

      if(user.email != existingUser.email){
        const existingUserWithEmail = await this.prismaClient.user.findFirst({
          where: {
            email: user.email, // L'email qu'on veut tester
            NOT: {
              userIdentifier: user.userIdentifier // On s'exclut soi-même de la recherche
            }
          }
        });

        if(existingUserWithEmail){
          return err(new EmailAlreadyUsedError(user.email))
        }
      }

      const userToPersist = this.prismaUserMapper.toPersistence(user);

      const updatedUser = await this.prismaClient.user.update({
        where: { userIdentifier: user.userIdentifier},
        data: {
          ...userToPersist
        }
      });

      if(!updatedUser){
        return err(new Error("Couldn't update user"));
      }

      const toDomainUpdatedUser = this.prismaUserMapper.toDomain(updatedUser);
      return ok(toDomainUpdatedUser);
    } catch (error){
      return err(new Error(`An error occured when updating user ${user.userIdentifier}`))
    }
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

  async delete(userId: string): Promise<Result<void, UserNotFoundError | Error>> {
    try {
      const existingUser = await this.prismaClient.user.findUnique({
        where: { userIdentifier: userId }
      });

      if (!existingUser) {
        return err(new UserNotFoundError(userId));
      }

      await this.prismaClient.user.delete({
        where: { userIdentifier: userId }
      });

      return ok(undefined);
    } catch (error) {
      return err(new Error(`An error occurred when deleting user ${userId}`));
    }
  }

  async getSystemUser(): Promise<Result<User, Error>> {
    try{
      const systemUser = await this.prismaClient.user.findUnique({
        where: {
          email: "sys@example.com"
        }
      });
      if(!systemUser) return err(new Error("System user not found."));

      const toDomain = this.prismaUserMapper.toDomain(systemUser);
      return ok(toDomain);
    } catch (error: any) {
      return err(new Error(`An error occured when retrieving system user: ${error.message}`))
    }
  }
}