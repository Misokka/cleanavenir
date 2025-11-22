import { Director as PrismaDirector } from "@prisma/client";
import { Director } from "../../../../domain/entities/Director";
import { Mapper } from "../MapperInterface";

type DirectorToPersist = {
  directorIdentifier: string
}

export class PrismaDirectorMapper implements Mapper<PrismaDirector, Director, DirectorToPersist>{
  toDomain(raw: PrismaDirector): Director {
    return new Director(raw.directorIdentifier)
  }

  toPersistence(obj: Director): DirectorToPersist {
    return {
      ...obj
    }
  }
}