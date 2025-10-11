import { Client } from "../../../domain/entities/Client";
import { InvalidRoleError } from "../../../domain/errors/InvalidRoleError";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import { Result } from "../../../shared/Result";

export interface ClientRepository{
  save(client: Client): Promise<Result<Client, InvalidRoleError>>
  findById(userIdentifier: string): Promise<Result<Client, UserNotFoundError>>
}