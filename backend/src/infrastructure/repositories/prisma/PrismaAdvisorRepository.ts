import { PrismaClient } from "@prisma/client";
import { AdvisorRepository } from "../../../application/ports/repositories/AdvisorRepository";
import { Advisor } from "../../../domain/entities/Advisor";
import Result, { err, ok } from "../../../shared/Result";
import { InvalidRoleError } from "../../../domain/errors/InvalidRoleError";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";

export class PrismaAdvisorRepository implements AdvisorRepository{
  constructor(
    private readonly prismaClient: PrismaClient
  ){}

  async save(advisor: Advisor): Promise<Result<Advisor, InvalidRoleError>>{
    try{
      const registeredAdvisor = await this.prismaClient.advisor.create({
        data: {
          userIdentifier: advisor.userIdentifier,
        }
      });
      return ok(registeredAdvisor);
    } catch (error){
      return err(new InvalidRoleError(""));
    }
  }

  async findById(directorIdentifier: string): Promise<Result<Advisor, UserNotFoundError>>{
    try{
      const maybeAdvisor = await this.prismaClient.director.findUnique({
        where: {
          userIdentifier: directorIdentifier
        }
      });

      if(!maybeAdvisor){
        return err(new UserNotFoundError(directorIdentifier));
      }

      const director = new Advisor(
        maybeAdvisor.userIdentifier
      );

      return ok(director);
    } catch (error){
      return err(new UserNotFoundError(directorIdentifier));
    }
  }
}