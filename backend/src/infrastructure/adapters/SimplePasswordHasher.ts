import { PasswordHasher } from '../../application/ports/services/PasswordHasher';

// Ne fait aucun hashage réel - à utiliser uniquement en développement
export class SimplePasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    return `plain:${plain}`;
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    if (hashed.startsWith('plain:')) {
      return hashed === `plain:${plain}`;
    }
    return plain === hashed;
  }
}
