import { Client as PrismaClient } from "@prisma/client";
import { Client } from "../../../../domain/entities/Client";
import { Mapper } from "../MapperInterface";

type ClientToPersist = {
  clientIdentifier: string,
  firstname: string,
  lastname: string,
  email: string
}

export class PrismaClientMapper implements Mapper<PrismaClient, Client, ClientToPersist>{
  toDomain(raw: PrismaClient): Client {
    return new Client(
      raw.clientIdentifier,
      raw.firstname,
      raw.lastname,
      raw.email
    )
  }

  toPersistence(obj: Client): ClientToPersist {
    return {...obj}
  }
}