import { describe, it, expect, beforeEach } from 'vitest';
import { SystemClock } from '../src/infrastructure/adapters/SystemClock';
import { FixedClock } from '../src/infrastructure/adapters/FixedClock';
import { UUIDGenerator } from '../src/infrastructure/adapters/UUIDGenerator';
import { SequentialIdGenerator } from '../src/infrastructure/adapters/SequentialIdGenerator';
import { ConsoleNotificationService } from '../src/infrastructure/adapters/ConsoleNotificationService';
import { InMemoryNotificationService } from '../src/infrastructure/adapters/InMemoryNotificationService';
import { StandardLoanCalculator } from '../src/infrastructure/adapters/StandardLoanCalculator';

describe('Adapters Tests', () => {
  describe('Clock', () => {
    it('SystemClock should return current date', () => {
      const clock = new SystemClock();
      const now = clock.now();
      
      expect(now).toBeInstanceOf(Date);
      expect(now.getTime()).toBeCloseTo(new Date().getTime(), -2);
    });

    it('SystemClock should return ISO date string', () => {
      const clock = new SystemClock();
      const isoDate = clock.todayISO();
      
      expect(isoDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('FixedClock should return fixed date', () => {
      const fixedDate = new Date('2024-01-15T10:30:00Z');
      const clock = new FixedClock(fixedDate);
      
      expect(clock.now().toISOString()).toBe(fixedDate.toISOString());
      expect(clock.todayISO()).toBe('2024-01-15');
    });
  });

  describe('IdGenerator', () => {
    it('UUIDGenerator should generate valid UUIDs', () => {
      const generator = new UUIDGenerator();
      const id1 = generator.next();
      const id2 = generator.next();
      
      expect(id1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      expect(id2).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      expect(id1).not.toBe(id2);
    });

    it('SequentialIdGenerator should generate sequential IDs', () => {
      const generator = new SequentialIdGenerator('test');
      
      expect(generator.next()).toBe('test-1');
      expect(generator.next()).toBe('test-2');
      expect(generator.next()).toBe('test-3');
    });

    it('SequentialIdGenerator should reset counter', () => {
      const generator = new SequentialIdGenerator('reset');
      
      generator.next();
      generator.next();
      generator.reset();
      
      expect(generator.next()).toBe('reset-1');
    });
  });

  describe('NotificationService', () => {
    it('ConsoleNotificationService should not throw', async () => {
      const service = new ConsoleNotificationService();
      
      await expect(
        service.notifyUser('user-123', 'Test notification')
      ).resolves.not.toThrow();
    });

    it('InMemoryNotificationService should store notifications', async () => {
      const service = new InMemoryNotificationService();
      
      await service.notifyUser('user-1', 'Message 1');
      await service.notifyUser('user-2', 'Message 2');
      await service.notifyUser('user-1', 'Message 3');
      
      const allNotifs = service.getNotifications();
      expect(allNotifs).toHaveLength(3);
      
      const user1Notifs = service.getNotifications('user-1');
      expect(user1Notifs).toHaveLength(2);
      
      service.clear();
      expect(service.getNotifications()).toHaveLength(0);
    });
  });

  describe('LoanCalculator', () => {
    let calculator: StandardLoanCalculator;

    beforeEach(() => {
      calculator = new StandardLoanCalculator();
    });

    it('should calculate loan mensualities correctly', () => {
      // Emprunt de 100 000€ sur 20 ans à 3% d'intérêt annuel, 0.3% d'assurance
      const mensualities = calculator.getMensualities(100000, 3, 20, 0.3);
      
      // La mensualité devrait être autour de 580€
      expect(mensualities).toBeGreaterThan(550);
      expect(mensualities).toBeLessThan(600);
    });

    it('should calculate loan part without insurance', () => {
      const loanPart = calculator.computeLoanMensualities(100000, 3, 20);
      
      expect(loanPart).toBeGreaterThan(500);
      expect(loanPart).toBeLessThan(600);
    });

    it('should calculate insurance mensualities', () => {
      const insurance = calculator.computeInsuranceMensualities(100000, 0.3);
      
      // 100000 * 0.3% / 12 = 25€
      expect(insurance).toBeCloseTo(25, 0);
    });

    it('should generate amortization table', () => {
      const table = calculator.getAmortizationTable(100000, 3, 20, 0.3);
      
      expect(Object.keys(table)).toHaveLength(240); // 20 ans * 12 mois
      expect(table['Month 1']).toHaveProperty('interestPart');
      expect(table['Month 1']).toHaveProperty('insurancePart');
      expect(table['Month 1']).toHaveProperty('capitalPart');
      expect(table['Month 1']).toHaveProperty('remainingAmountToPay');
    });
  });
});
