import { PrismaClient } from "@prisma/client";
import { ClientRepository } from "../../../application/ports/repositories/ClientRepository";
import { Client } from "../../../domain/entities/Client";
import Result, { err, ok } from "../../../shared/Result";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import { PrismaClientMapper } from "../mappers/PrismaMappers/PrismaClientMapper";

export class PrismaClientRepository implements ClientRepository{
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaCientMapper: PrismaClientMapper
  ){}

  async save(client: Client): Promise<Result<Client, Error>>{
    try{
      const clientToPersist = this.prismaCientMapper.toPersistence(client)
      const registeredClient = await this.prismaClient.client.create({
        data: {
          ...clientToPersist
        }
      });

      const clientToDomain = this.prismaCientMapper.toDomain(registeredClient)
      return ok(clientToDomain);

    } catch (error){
      return err(new Error("Error saving client"));
    }

  }

  async findById(clientIdentifier: string): Promise<Result<Client, UserNotFoundError>> {
    const maybeClient = await this.prismaClient.client.findUnique({
      where: {
        clientIdentifier: clientIdentifier
      }
    });

    if(!maybeClient){
      return err(new UserNotFoundError(clientIdentifier));
    }

    const clientToDomain = this.prismaCientMapper.toDomain(maybeClient);
    return ok(clientToDomain);
  }

  async findByEmail(email: string): Promise<Result<Client, UserNotFoundError>> {
    const clientUser = await this.prismaClient.user.findUnique({
      where: {
        email: email,
        role: 'CLIENT'
      }
    });
    
    if(!clientUser){
      return err(new UserNotFoundError(email));
    }

    const maybeClient = await this.prismaClient.client.findUnique({
      where: {
        userIdentifier: clientUser.userIdentifier
      }
    });

    if(!maybeClient){
      return err(new UserNotFoundError(email));
    }

    const clientToDomain = this.prismaCientMapper.toDomain(maybeClient);
    return ok(clientToDomain);
  }
}