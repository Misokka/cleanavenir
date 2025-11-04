import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterUseCase } from '../src/application/use-cases/user/auth/RegisterUseCase';
import { UserInMemoryRepository } from '../src/infrastructure/repositories/in-memory/UserInMemoryRepository';

// --- Mocks des services dont le Use Case a besoin ---
// (Ce sont les "adapters" que Thibault doit aussi implémenter)

// Mock simple pour le Hashage de mot de passe
const mockPasswordHasher = {
  hash: async (password: string) => `hashed_${password}`,
  compare: async (plain: string, hash: string) => `hashed_${plain}` === hash,
};

// Mock simple pour le générateur d'ID
const mockIdGenerator = {
  generate: () => 'mock-uuid-12345',
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
      mockPasswordHasher,
      mockIdGenerator,
    );
  });

  it('devrait pouvoir enregistrer un nouvel utilisateur', async () => {
    // 1. Définir les données d'entrée
    const input = {
      firstname: 'Jérémy',
      lastname: 'Test',
      email: 'jeremy@example.com',
      password: 'password123',
    };

    // 2. Exécuter le Use Case
    const result = await registerUseCase.execute(input);

    // 3. Vérifier que le résultat est un succès
    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toHaveProperty('id');

    // 4. Vérifier que l'utilisateur existe VRAIMENT dans le repository in-memory
    const savedUser = await userRepository.findById('mock-uuid-12345');

    expect(savedUser).not.toBeNull();
    expect(savedUser?.firstname).toBe('Jérémy');
    expect(savedUser?.email).toBe('jeremy@example.com');
    expect(savedUser?.password).toBe('hashed_password123'); // Le mot de passe est hashé
    expect(savedUser?.id).toBe('mock-uuid-12345'); // L'ID a été généré
  });

  it('devrait échouer si l email est déjà pris', async () => {
    // 1. Créer un utilisateur "existant"
    await registerUseCase.execute({
      firstname: 'Utilisateur',
      lastname: 'Existant',
      email: 'existing@example.com',
      password: 'password123',
    });

    // 2. Tenter de s'enregistrer avec le même email
    const result = await registerUseCase.execute({
      firstname: 'Utilisateur',
      lastname: 'Duplicata',
      email: 'existing@example.com', // <-- Même email
      password: 'password456',
    });

    // 3. Vérifier que le résultat est un échec
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeDefined();
    // Vous devriez aussi vérifier le type d'erreur (ex: EmailAlreadyUsedError)

    // 4. Vérifier que le nombre d'utilisateurs n'a pas changé (il n'y en a qu'un)
    const count = await userRepository.count();
    expect(count).toBe(1);
  });
});