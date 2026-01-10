import { PrismaClient } from "@prisma/client";
import {EmailVerificationTokenRepository } from "../../../application/ports/repositories/EmailVerificationTokenRepository";
import { EmailVerificationToken } from "../../../domain/entities/EmailVerificationToken";
import Result, { err, ok } from "../../../shared/Result";
import { PrismaEmailVerificationTokenMapper } from "../mappers/PrismaMappers/PrismaEmailVerificationTokenMapper";
import { EmailVerificationTokenNotFoundError } from "../../../domain/errors/EmailVerificationTokenNotFoundError";

export class PrismaEmailVerificationTokenRepository implements EmailVerificationTokenRepository {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaEmailVerificationTokenMapper: PrismaEmailVerificationTokenMapper
  ){}

  async save(token: EmailVerificationToken): Promise<Result<EmailVerificationToken, Error>> {
    try{
      const tokenToPersist = this.prismaEmailVerificationTokenMapper.toPersistence(token);
      const savedToken = await this.prismaClient.emailVerificationToken.create({
        data: tokenToPersist
      });
      if(!savedToken) return err(new Error(`Couldn't save token ${token.tokenIdentifier}`));
      const toDomain = this.prismaEmailVerificationTokenMapper.toDomain(savedToken);
      return ok(toDomain)
    } catch (error: any) {
      return err(new Error(`An error occured when saving verification tokn ${token.tokenIdentifier}. message: ${error.message}`))
    }
  }

  async findByUserId(userId: string): Promise<Result<EmailVerificationToken | null, Error>> {
    try{
      const token = await this.prismaClient.emailVerificationToken.findFirst({
        where: {
          userIdentifier: userId
        }
      });
      if(!token) return err(new Error(`Couldn't retrieve token for user: ${userId}`));
      const toDomain = this.prismaEmailVerificationTokenMapper.toDomain(token);
      return ok(toDomain);
    } catch (error) {
      return err(new Error(`An error occured when retrieving token for user: ${userId}`))
    }
  }

  async findByTokenHash(tokenHash: string): Promise<Result<EmailVerificationToken, EmailVerificationTokenNotFoundError>> {
    try{
      const token = await this.prismaClient.emailVerificationToken.findFirst({
        where: {
          tokenHash
        }
      });
      if(!token) return err(new EmailVerificationTokenNotFoundError(`Token with token hash ${tokenHash} not found.`));
      const toDomain = this.prismaEmailVerificationTokenMapper.toDomain(token);
      return ok(toDomain);
    } catch (error: any) {
      return err(new Error(`An error occured when retrieving token with hash: ${tokenHash}. Message: ${error.message}`))
    }
  }

  async markAsUsed(tokenId: string): Promise<Result<void, Error>> {
    try{
      const updatedToken = await this.prismaClient.emailVerificationToken.update({
        where: {
          tokenIdentifier: tokenId
        },
        data: {
          usedAt: new Date()
        }
      });
      if(!updatedToken) return err(new Error(`Couldn't mark token ${tokenId} as used`));
      
      return ok(undefined);
    } catch (error) {
      return err(new Error(`An error occured when updating token: ${tokenId}`))
    }
  }

  async deleteByUserId(userId: string): Promise<Result<void, Error>> {
    try{
      const existingToken = await this.prismaClient.emailVerificationToken.findFirst({
        where: {
          userIdentifier: userId
        }
      });
      if(!existingToken) return err(new Error(`Token for user ${userId} not found`));

      const deletedToken = await this.prismaClient.emailVerificationToken.delete({
        where: {
          tokenIdentifier: existingToken.tokenIdentifier,
          userIdentifier: userId
        }
      });

      if(!deletedToken) return err(new Error(`Couldn't delete token for user ${userId}`));
      return ok(undefined);
    } catch (error) {
      return err(new Error(`An error occured when deleting token for user ${userId}`))
    }
  }
}