import { Director } from "../../../domain/entities/Director";
import { DirectorNotFoundError } from "../../../domain/errors/DirectorNotFoundError";
import { InvalidRoleError } from "../../../domain/errors/InvalidRoleError";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import { Result } from "../../../shared/Result";

export interface DirectorRepository{
  save(client: Director): Promise<Result<Director, Error>>
  findById(directorIdentifier: string): Promise<Result<Director, UserNotFoundError>>;
  findByUserId(userIdentifier: string): Promise<Result<Director, DirectorNotFoundError>>;
}