import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterUseCase } from '../src/application/use-cases/user/auth/RegisterUseCase';
import { UserInMemoryRepository } from '../src/infrastructure/repositories/in-memory/UserInMemoryRepository';
import { Client } from '../src/domain/entities/Client';

// --- Mocks des services dont le Use Case a besoin ---

// Mock simple pour le Hashage de mot de passe
const mockPasswordHasher = {
  hash: async (password: string) => `hashed_${password}`,
  compare: async (plain: string, hash: string) => `hashed_${plain}` === hash,
};

// Mock pour le ProfileManager
const mockProfileManager = {
  clientRepository: {} as any,
  directorRepository: {} as any,
  advisorRepository: {} as any,
  fetch: async (userId: string, role: string) => {
    return { ok: true, value: new Client(userId) };
  },
  create: async (userId: string, role: string) => {
    return { ok: true, value: new Client(userId) };
  },
};

// --- Début du Test ---

describe('RegisterUseCase', () => {
  let userRepository: UserInMemoryRepository;
  let registerUseCase: RegisterUseCase;

  // Recrée une BDD "neuve" avant chaque test
  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    registerUseCase = new RegisterUseCase(
      userRepository,
      mockProfileManager as any,
      mockPasswordHasher as any,
    );
  });

  it('devrait pouvoir enregistrer un nouvel utilisateur', async () => {
    // 1. Définir les données d'entrée
    const result = await registerUseCase.execute(
      'Jérémy',
      'Test',
      'jeremy@example.com',
      'password123',
      'password123',
      'CLIENT'
    );

    // 3. Vérifier que le résultat est un succès
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toHaveProperty('user');
      expect(result.value).toHaveProperty('profile');
      expect(result.value.user.firstname).toBe('Jérémy');
      expect(result.value.user.email).toBe('jeremy@example.com');
    }
  });

  it('devrait échouer si l email est déjà pris', async () => {
    // 1. Créer un utilisateur "existant"
    await registerUseCase.execute(
      'Utilisateur',
      'Existant',
      'existing@example.com',
      'password123',
      'password123',
      'CLIENT'
    );

    // 2. Tenter de s'enregistrer avec le même email
    const result = await registerUseCase.execute(
      'Utilisateur',
      'Duplicata',
      'existing@example.com',
      'password456',
      'password456',
      'CLIENT'
    );

    // 3. Vérifier que le résultat est un échec
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeDefined();
      expect(result.error.message).toContain('existing@example.com');
    }
  });
});