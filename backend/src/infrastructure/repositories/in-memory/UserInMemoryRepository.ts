import { UserRepository } from '../../../application/ports/repositories/UserRepository';
import { User } from '../../../domain/entities/User';
import { ok, err, Result } from '../../../shared/Result';
import { UserNotFoundError } from '../../../domain/errors/UserNotFoundError';
import { InvalidRoleError } from '../../../domain/errors/InvalidRoleError';
import { UserRole } from '../../../application/dtos/UserDTO';
import { EmailAlreadyUsedError } from '../../../domain/errors/EmailAlreadyUsedError';
import { randomUUID } from 'node:crypto';

export class UserInMemoryRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  private getIdentifier(user: User): string {
    return user.userIdentifier;
  }

  async save(
    user: User,
  ): Promise<Result<User, EmailAlreadyUsedError | InvalidRoleError>> {
    for (const existing of this.users.values()) {
      if (
        existing.email.toLowerCase() === user.email.toLowerCase() &&
        existing.userIdentifier !== user.userIdentifier
      ) {
        return err(new EmailAlreadyUsedError(user.email));
      }
    }

    this.users.set(this.getIdentifier(user), user);
    return ok(user);
  }

  async findById(id: string): Promise<Result<User, UserNotFoundError>> {
    const user = this.users.get(id);

    if (!user) {
      return err(new UserNotFoundError(id));
    }
    return ok(user);
  }

  async findByEmail(email: string): Promise<Result<User, UserNotFoundError>> {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return ok(user);
      }
    }
    return err(new UserNotFoundError(email));
  }

  async setRole(
    id: string,
    role: UserRole,
  ): Promise<Result<User, UserNotFoundError | InvalidRoleError>> {
    const userResult = await this.findById(id);
    if (!userResult.ok) {
      return userResult; // Renvoie UserNotFoundError
    }

    const user = userResult.value;
    

    user.role = role;

    this.users.set(this.getIdentifier(user), user);
    
    return ok(user);
  }

  async setActive(
    id: string,
    active: boolean,
  ): Promise<Result<User, UserNotFoundError>> {
    const userResult = await this.findById(id);
    if (!userResult.ok) {
      return userResult;
    }
    const user = userResult.value;

    user.active = active;

    this.users.set(this.getIdentifier(user), user);
    return ok(user);
  }

  async setEmailVerified(
    id: string,
    whenISO: string,
  ): Promise<Result<User, UserNotFoundError>> {
    const userResult = await this.findById(id);
    if (!userResult.ok) {
      return userResult;
    }
    const user = userResult.value;

    user.emailVerifiedAt = new Date(whenISO);

    this.users.set(this.getIdentifier(user), user);
    return ok(user);
  }

  async listByRole(role: UserRole): Promise<Result<User[], never>> {
    const matchingUsers: User[] = [];
    for (const user of this.users.values()) {
      if (user.role === role) {
        matchingUsers.push(user);
      }
    }
    return ok(matchingUsers);
  }

  async update(user: User): Promise<Result<User, UserNotFoundError | EmailAlreadyUsedError | InvalidRoleError | Error>> {
    try{
      return ok(user)
    } catch {
      return err(new Error("An error occured"))
    }
  }

  async getSystemUser(): Promise<Result<User, Error>> {
    try{
      const user = User.create({
        userIdentifier: randomUUID(),
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        role: "CLIENT",
        createdAt: new Date()
      })
      return ok(user)
    } catch {
      return err(new Error("An error occured"))
    }
  }

  async delete(userId: string): Promise<Result<void, UserNotFoundError | Error>> {
    try{
      return ok(undefined)
    } catch {
      return err(new UserNotFoundError(userId))
    }
  }
}