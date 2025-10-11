import { Director } from "../../../domain/entities/Director";
import { InvalidRoleError } from "../../../domain/errors/InvalidRoleError";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import { Result } from "../../../shared/Result";

export interface DirectorRepository{
  save(client: Director): Promise<Result<Director, InvalidRoleError>>
  findById(userIdentifier: string): Promise<Result<Director, UserNotFoundError>>
}