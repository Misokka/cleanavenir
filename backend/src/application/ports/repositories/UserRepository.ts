import { Result } from "../../../shared/Result";
import { UserRole } from "../../dtos/UserDTO";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import { EmailAlreadyUsedError } from "../../../domain/errors/EmailAlreadyUsedError";
import { InvalidRoleError } from "../../../domain/errors/InvalidRoleError";
import { User } from "../../../domain/entities/User";

export interface UserRepository {
  save(user: User): Promise<Result<User, EmailAlreadyUsedError | InvalidRoleError>>;

  findById(id: string): Promise<Result<User, UserNotFoundError>>;
  findByEmail(email: string): Promise<Result<User, UserNotFoundError>>;

  setRole(id: string, role: UserRole): Promise<Result<User, UserNotFoundError | InvalidRoleError>>;

  setActive(id: string, active: boolean): Promise<Result<User, UserNotFoundError>>;
  setEmailVerified(id: string, whenISO: string): Promise<Result<User, UserNotFoundError>>;

  listByRole(role: UserRole): Promise<Result<User[], never>>;
}