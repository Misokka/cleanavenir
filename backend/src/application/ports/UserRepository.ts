import { Result } from "../../shared/Result";
import { UserDTO, UserRole } from "../dtos/UserDTO";
import { UserNotFoundError } from "../../domain/errors/UserNotFoundError";
import { EmailAlreadyUsedError } from "../../domain/errors/EmailAlreadyUsedError";
import { InvalidRoleError } from "../../domain/errors/InvalidRoleError";

export interface UserRepository {
  create(input: {
    email: string;
    role: UserRole;      
  }): Promise<Result<UserDTO, EmailAlreadyUsedError | InvalidRoleError>>;

  findById(id: string): Promise<Result<UserDTO, UserNotFoundError>>;
  findByEmail(email: string): Promise<Result<UserDTO, UserNotFoundError>>;

  setRole(id: string, role: UserRole): Promise<Result<UserDTO, UserNotFoundError | InvalidRoleError>>;

  setActive(id: string, active: boolean): Promise<Result<UserDTO, UserNotFoundError>>;
  setEmailVerified(id: string, whenISO: string): Promise<Result<UserDTO, UserNotFoundError>>;

  listByRole(role: UserRole): Promise<Result<UserDTO[], never>>;
}