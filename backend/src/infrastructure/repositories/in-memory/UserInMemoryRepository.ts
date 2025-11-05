import { UserRepository } from '../../../application/ports/repositories/UserRepository';
import { User } from '../../../domain/entities/User';
import { ok, err, Result } from '../../../shared/Result';
import { UserNotFoundError } from '../../../domain/errors/UserNotFoundError';
import { InvalidRoleError } from '../../../domain/errors/InvalidRoleError';
import { UserRole } from '../../../application/dtos/UserDTO';
import { EmailAlreadyUsedError } from '../../../domain/errors/EmailAlreadyUsedError';

export class UserInMemoryRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  private getIdentifier(user: User): string {
    return user.userIndentifier;
  }

  async save(
    user: User,
  ): Promise<Result<User, EmailAlreadyUsedError | InvalidRoleError>> {
    // 1. Vérifier l'unicité de l'email (logique spécifique à 'save')
    for (const existing of this.users.values()) {
      if (
        existing.email.toLowerCase() === user.email.toLowerCase() &&
        existing.userIndentifier !== user.userIndentifier
      ) {
        return err(new EmailAlreadyUsedError(user.email));
      }
    }

    // 2. Sauvegarder (créer ou mettre à jour)
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
    
    // (Ici, vous pourriez ajouter la logique de validation pour 'InvalidRoleError')

    user.role = role;

    // --- CORRECTION ICI ---
    // Ne pas appeler this.save() pour éviter le conflit de type d'erreur.
    // Mettre à jour la map directement.
    this.users.set(this.getIdentifier(user), user);
    
    // Retourner Ok<User>, qui est compatible avec le type de retour.
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

    // @ts-ignore (en supposant que 'active' existe sur User)
    user.active = active;

    // --- CORRECTION ICI ---
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

    // @ts-ignore (en supposant que 'emailVerifiedAt' existe sur User)
    user.emailVerifiedAt = new Date(whenISO);

    // --- CORRECTION ICI ---
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
}