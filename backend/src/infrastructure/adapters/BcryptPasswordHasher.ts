import { PasswordHasher } from '../../application/ports/services/PasswordHasher';
import * as bcrypt from 'bcrypt';

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds = 10;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
