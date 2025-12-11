import { Client as PrismaClient } from "@prisma/client";
import { Client } from "../../../../domain/entities/Client";
import { Mapper } from "../MapperInterface";

type ClientToPersist = {
  clientIdentifier: string,
  userIdentifier: string,
}

export class PrismaClientMapper implements Mapper<PrismaClient, Client, ClientToPersist>{
  toDomain(raw: PrismaClient): Client {
    return Client.create({...raw})
  }

  toPersistence(obj: Client): ClientToPersist {
    return {...obj}
  }
}