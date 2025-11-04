import { UserRepository } from '../../application/ports/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { BaseInMemoryRepository } from './BaseInMemoryRepository';

export class UserInMemoryRepository
  extends BaseInMemoryRepository<User>
  implements UserRepository
{
  constructor() {
    super((user) => user.id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.firstWhere(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }
}