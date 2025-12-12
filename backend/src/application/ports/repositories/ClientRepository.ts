import { Client } from "../../../domain/entities/Client";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import { Result } from "../../../shared/Result";

export interface ClientRepository{
  save(client: Client): Promise<Result<Client, Error>>
  findById(userIdentifier: string): Promise<Result<Client, UserNotFoundError>>
}