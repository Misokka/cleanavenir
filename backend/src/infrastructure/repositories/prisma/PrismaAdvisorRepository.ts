import { PrismaClient } from "@prisma/client";
import { AdvisorRepository } from "../../../application/ports/repositories/AdvisorRepository";
import { Advisor } from "../../../domain/entities/Advisor";
import Result, { err, ok } from "../../../shared/Result";
import { InvalidRoleError } from "../../../domain/errors/InvalidRoleError";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import { PrismaAdvisorMapper } from "../mappers/PrismaMappers/PrismaAdvisorMapper";

export class PrismaAdvisorRepository implements AdvisorRepository{
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaAdvisorMapper: PrismaAdvisorMapper
  ){}

  async save(advisor: Advisor): Promise<Result<Advisor, InvalidRoleError>>{
    try{
      const advisorToPersist = this.prismaAdvisorMapper.toPersistence(advisor)
      const registeredAdvisor = await this.prismaClient.advisor.create({
        data: {
          ...advisorToPersist
        }
      });

      const returnedAdvisor = this.prismaAdvisorMapper.toDomain(registeredAdvisor)
      return ok(returnedAdvisor);
    } catch (error){
      return err(new InvalidRoleError(""));
    }
  }

  async findById(advisorIdentifier: string): Promise<Result<Advisor, UserNotFoundError>>{
    try{
      const maybeAdvisor = await this.prismaClient.advisor.findUnique({
        where: {
          advisorIdentifier: advisorIdentifier
        }
      });

      if(!maybeAdvisor){
        return err(new UserNotFoundError(advisorIdentifier));
      }

      const returnedAdvisor = this.prismaAdvisorMapper.toDomain(maybeAdvisor)

      return ok(returnedAdvisor);
    } catch (error){
      return err(new UserNotFoundError(advisorIdentifier));
    }
  }
}