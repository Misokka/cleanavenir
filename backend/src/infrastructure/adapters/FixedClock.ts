import type { Clock } from '../../application/ports/services/Clock';

/**
 * Clock configurable pour les tests
 * Permet de fixer une date spécifique
 */
export class FixedClock implements Clock {
  constructor(private readonly fixedDate: Date) {}

  now(): Date {
    return new Date(this.fixedDate);
  }

  todayISO(): string {
    return this.fixedDate.toISOString().split('T')[0];
  }
}
