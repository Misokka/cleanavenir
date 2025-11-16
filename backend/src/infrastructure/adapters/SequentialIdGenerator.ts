import type { IdGenerator } from '../../application/ports/services/IdGenerator';

/**
 * Générateur d'ID séquentiel pour les tests
 */
export class SequentialIdGenerator implements IdGenerator {
  private counter = 0;
  private readonly prefix: string;

  constructor(prefix = 'id') {
    this.prefix = prefix;
  }

  next(): string {
    this.counter++;
    return `${this.prefix}-${this.counter}`;
  }

  reset() {
    this.counter = 0;
  }
}
