import type { IdGenerator } from '../../application/ports/services/IdGenerator';
import { randomUUID } from 'crypto';

/**
 * Générateur d'ID basé sur UUID v4
 */
export class UUIDGenerator implements IdGenerator {
  next(): string {
    return randomUUID();
  }
}
