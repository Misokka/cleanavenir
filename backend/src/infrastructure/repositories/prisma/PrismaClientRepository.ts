import { PrismaClient } from "@prisma/client";
import { ClientRepository } from "../../../application/ports/repositories/ClientRepository";
import { Client } from "../../../domain/entities/Client";
import Result, { err, ok } from "../../../shared/Result";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";

export class PrismaClientRepository implements ClientRepository{
  constructor(
    private readonly prismaClient: PrismaClient
  ){}

  async save(client: Client): Promise<Result<Client, Error>>{
    try{
      const registeredClient = await this.prismaClient.client.create({
        data: {
          userIdentifier: client.userIdentifier,
          firstname: client.firstname,
          lastname: client.lastname,
          email: client.email
        }
      });

      return ok(registeredClient as Client);

    } catch (error){
      return err(new Error("Error saving client"));
    }

  }

  async findById(userIdentifier: string): Promise<Result<Client, UserNotFoundError>> {
    const maybeClient = await this.prismaClient.client.findUnique({
      where: {
        userIdentifier: userIdentifier
      }
    });

    if(!maybeClient){
      return err(new UserNotFoundError(userIdentifier));
    }

    const client = new Client(
      maybeClient.userIdentifier,
      maybeClient.firstname,
      maybeClient.lastname,
      maybeClient.email
    );

    return ok(client);
  }

  async findByEmail(email: string): Promise<Result<Client, UserNotFoundError>> {
    const maybeClient = await this.prismaClient.client.findUnique({
      where: {
        email: email
      }
    });

    if(!maybeClient){
      return err(new UserNotFoundError(email));
    }

    const client = new Client(
      maybeClient.userIdentifier,
      maybeClient.firstname,
      maybeClient.lastname,
      maybeClient.email
    );

    return ok(client);
  }
}