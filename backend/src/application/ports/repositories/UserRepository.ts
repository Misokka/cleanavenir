import { Result } from "../../../shared/Result";
import { UserRole } from "../../dtos/UserDTO";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import { EmailAlreadyUsedError } from "../../../domain/errors/EmailAlreadyUsedError";
import { InvalidRoleError } from "../../../domain/errors/InvalidRoleError";
import { User } from "../../../domain/entities/User";

export interface UserRepository {
  save(user: User): Promise<Result<User, EmailAlreadyUsedError | InvalidRoleError | Error>>;
  getSystemUser(): Promise<Result<User, Error>>
  update(user: User): Promise<Result<User, UserNotFoundError | EmailAlreadyUsedError | InvalidRoleError | Error>>;
  delete(userId: string): Promise<Result<void, UserNotFoundError | Error>>;

  findById(id: string): Promise<Result<User, UserNotFoundError>>;
  findByEmail(email: string): Promise<Result<User, UserNotFoundError>>;

  listByRole(role: UserRole): Promise<Result<User[], Error>>;
}