import { Advisor as PrismaAdvisor } from "@prisma/client";
import { Advisor } from "../../../../domain/entities/Advisor";
import { Mapper } from "../MapperInterface";

export type AdvisorToPersist = {
  advisorIdentifier: string,
  userIdentifier: string,
}

export class PrismaAdvisorMapper implements Mapper<PrismaAdvisor, Advisor, AdvisorToPersist>{
  toDomain(raw: PrismaAdvisor): Advisor {
    return Advisor.create({...raw})
  }

  toPersistence(obj: Advisor): AdvisorToPersist {
    return {
      ...obj
    }
  }
}