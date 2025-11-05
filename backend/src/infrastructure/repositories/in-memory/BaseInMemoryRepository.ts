/**
 * Repository in-memory générique de base.
 * Gère le clonage systématique pour simuler l'immutabilité d'une base de données
 * et éviter les effets de bord lors des tests.
 */
export abstract class BaseInMemoryRepository<T> {
  protected readonly items = new Map<string, T>();

  constructor(private readonly getId: (entity: T) => string) {}

  async save(entity: T): Promise<T> {
    const clone = structuredClone(entity);
    const id = this.getId(clone);
    this.items.set(id, clone);
    return entity;
  }

  async saveAll(entities: T[]): Promise<T[]> {
    for (const e of entities) {
      await this.save(e);
    }
    return entities;
  }

  async findById(id: string): Promise<T | null> {
    const item = this.items.get(id);
    if (!item) return null;
    return structuredClone(item);
  }

  async findAll(): Promise<T[]> {
    return [...this.items.values()].map(structuredClone);
  }

  async existsById(id: string): Promise<boolean> {
    return this.items.has(id);
  }

  async deleteById(id: string): Promise<void> {
    this.items.delete(id);
  }

  async deleteAll(): Promise<void> {
    this.items.clear();
  }

  async count(): Promise<number> {
    return this.items.size;
  }

  // --- Helpers pour les classes enfants ---

  protected where(predicate: (entity: T) => boolean): T[] {
    return [...this.items.values()].filter(predicate).map(structuredClone);
  }

  protected firstWhere(predicate: (entity: T) => boolean): T | null {
    for (const item of this.items.values()) {
      if (predicate(item)) {
        return structuredClone(item);
      }
    }
    return null;
  }
}