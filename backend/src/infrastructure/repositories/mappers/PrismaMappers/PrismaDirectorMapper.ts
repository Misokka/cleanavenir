import { Director as PrismaDirector } from "@prisma/client";
import { Director } from "../../../../domain/entities/Director";
import { Mapper } from "../MapperInterface";

type DirectorToPersist = {
  directorIdentifier: string,
  userIdentifier: string,
}

export class PrismaDirectorMapper implements Mapper<PrismaDirector, Director, DirectorToPersist>{
  toDomain(raw: PrismaDirector): Director {
    return Director.create({...raw})
  }

  toPersistence(obj: Director): DirectorToPersist {
    return {
      ...obj
    }
  }
}