import type { Clock } from '../../application/ports/services/Clock';

/**
 * Implémentation réelle du Clock basée sur le système
 */
export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }

  todayISO(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
