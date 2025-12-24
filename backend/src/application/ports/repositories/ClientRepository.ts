import { Client } from "../../../domain/entities/Client";
import { ClientNotFoundError } from "../../../domain/errors/ClientNotFoundError";
import { Result } from "../../../shared/Result";

export interface ClientRepository{
  save(client: Client): Promise<Result<Client, Error>>
  findById(clientIdentifier: string): Promise<Result<Client, ClientNotFoundError>>
  findByUserId(userIdentifier: string): Promise<Result<Client, ClientNotFoundError>>
  all(): Promise<Result<Client[], Error>>;
}