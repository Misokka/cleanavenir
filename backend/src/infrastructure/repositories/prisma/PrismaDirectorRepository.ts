import { PrismaClient } from "@prisma/client";
import { DirectorRepository } from "../../../application/ports/repositories/DirectorRepository";
import { Director } from "../../../domain/entities/Director";
import Result, { err, ok } from "../../../shared/Result";
import { InvalidRoleError } from "../../../domain/errors/InvalidRoleError";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import { PrismaDirectorMapper } from "../mappers/PrismaMappers/PrismaDirectorMapper";

export class PrismaDirectorRepository implements DirectorRepository{
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaDirectorMapper: PrismaDirectorMapper
  ){}

  async save(director: Director): Promise<Result<Director, InvalidRoleError>>{
    try{

      const directorToPersist = this.prismaDirectorMapper.toPersistence(director)
      const registeredDirector = await this.prismaClient.director.create({
        data: {
          ...directorToPersist,
        }
      });

      const directorToDomain = this.prismaDirectorMapper.toDomain(registeredDirector)
      return ok(directorToDomain);
    } catch (error){
      return err(new InvalidRoleError(""));
    }
  }

  async findById(directorIdentifier: string): Promise<Result<Director, UserNotFoundError>>{
    try{
      const maybeDirector = await this.prismaClient.director.findUnique({
        where: {
          directorIdentifier: directorIdentifier
        }
      });

      if(!maybeDirector){
        return err(new UserNotFoundError(directorIdentifier));
      }

      const directorToDomain = this.prismaDirectorMapper.toDomain(maybeDirector)

      return ok(directorToDomain);
    } catch (error){
      return err(new UserNotFoundError(directorIdentifier));
    }
  }
}