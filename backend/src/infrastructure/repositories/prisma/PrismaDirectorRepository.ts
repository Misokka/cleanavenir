import { PrismaClient } from "@prisma/client";
import { DirectorRepository } from "../../../application/ports/repositories/DirectorRepository";
import { Director } from "../../../domain/entities/Director";
import Result, { err, ok } from "../../../shared/Result";
import { InvalidRoleError } from "../../../domain/errors/InvalidRoleError";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";

export class PrismaDirectorRepository implements DirectorRepository{
  constructor(
    private readonly prismaClient: PrismaClient
  ){}

  async save(director: Director): Promise<Result<Director, InvalidRoleError>>{
    try{
      const registeredDirector = await this.prismaClient.director.create({
        data: {
          userIdentifier: director.userIdentifier,
        }
      });
      return ok(registeredDirector);
    } catch (error){
      return err(new InvalidRoleError(""));
    }
  }

  async findById(directorIdentifier: string): Promise<Result<Director, UserNotFoundError>>{
    try{
      const maybeDirector = await this.prismaClient.director.findUnique({
        where: {
          userIdentifier: directorIdentifier
        }
      });

      if(!maybeDirector){
        return err(new UserNotFoundError(directorIdentifier));
      }

      const director = new Director(
        maybeDirector.userIdentifier
      );

      return ok(director);
    } catch (error){
      return err(new UserNotFoundError(directorIdentifier));
    }
  }
}