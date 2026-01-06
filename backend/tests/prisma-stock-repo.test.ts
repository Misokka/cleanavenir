import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaStockMapper } from '../src/infrastructure/repositories/mappers/PrismaMappers/PrismaStockMapper';
import { PrismaStockRepository } from '../src/infrastructure/repositories/prisma/PrismaStockRepository';
import { Stock } from '../src/domain/entities/Stock';
import { Ticker } from '../src/domain/value-objects/Ticker';
import { createPrismaTestDb, cleanupPrismaTestDb } from './helpers/createPrismaTestDb';

describe('Prisma Stock repository', () => {
  let prisma: PrismaClient;
  let stockRepository: PrismaStockRepository;
  const stockMapper = new PrismaStockMapper();

  beforeAll(async () => {
    prisma = await createPrismaTestDb();
    stockRepository = new PrismaStockRepository(prisma, stockMapper);
  });

  afterAll(async () => {
    await cleanupPrismaTestDb(prisma);
  });

  it('peut insérer et retrouver un stock', async () => {
    const stockId = randomUUID();
    const companyId = randomUUID();
    const tickerValue = `TST${stockId.slice(0, 4).toUpperCase()}`;

    // D'abord créer une company pour la relation
    await prisma.company.create({
      data: {
        companyIdentifier: companyId,
        name: 'Test Company',
        description: 'Une entreprise de test'
      }
    });

    const tickerResult = Ticker.from(tickerValue);
    expect(tickerResult.ok).toBe(true);
    if (!tickerResult.ok) return;

    const stock = Stock.create({
      stockIdentifier: stockId,
      companyIdentifier: companyId,
      ticker: tickerResult.value,
      price: 100.50,
      isAvailable: true,
      createdAt: new Date()
    });

    // Sauvegarder le stock
    const saveResult = await stockRepository.save(stock);
    expect(saveResult.ok).toBe(true);

    // Retrouver par ID
    const findResult = await stockRepository.findById(stockId);
    expect(findResult.ok).toBe(true);
    if (findResult.ok) {
      expect(findResult.value.stockIdentifier).toBe(stockId);
      expect(findResult.value.ticker.value).toBe(tickerValue);
      expect(findResult.value.price).toBe(100.50);
    }
  });

  it('peut retrouver un stock par ticker', async () => {
    const stockId = randomUUID();
    const companyId = randomUUID();
    const tickerValue = `TCK${stockId.slice(0, 4).toUpperCase()}`;

    await prisma.company.create({
      data: {
        companyIdentifier: companyId,
        name: 'Ticker Test Company',
        description: 'Test'
      }
    });

    const tickerResult = Ticker.from(tickerValue);
    expect(tickerResult.ok).toBe(true);
    if (!tickerResult.ok) return;

    const stock = Stock.create({
      stockIdentifier: stockId,
      companyIdentifier: companyId,
      ticker: tickerResult.value,
      price: 50.25,
      isAvailable: true,
      createdAt: new Date()
    });

    await stockRepository.save(stock);

    const findResult = await stockRepository.findByTicker(tickerValue);
    expect(findResult.ok).toBe(true);
    if (findResult.ok) {
      expect(findResult.value.ticker.value).toBe(tickerValue);
    }
  });

  it('peut mettre à jour un stock', async () => {
    const stockId = randomUUID();
    const companyId = randomUUID();
    const tickerValue = `UPD${stockId.slice(0, 4).toUpperCase()}`;

    await prisma.company.create({
      data: {
        companyIdentifier: companyId,
        name: 'Update Test Company',
        description: 'Test'
      }
    });

    const tickerResult = Ticker.from(tickerValue);
    if (!tickerResult.ok) return;

    const stock = Stock.create({
      stockIdentifier: stockId,
      companyIdentifier: companyId,
      ticker: tickerResult.value,
      price: 100,
      isAvailable: true,
      createdAt: new Date()
    });

    await stockRepository.save(stock);

    // Mettre à jour le prix
    stock.updatePrice(150);
    const updateResult = await stockRepository.update(stock);
    expect(updateResult.ok).toBe(true);
    if (updateResult.ok) {
      expect(updateResult.value.price).toBe(150);
    }
  });

  it('peut lister tous les stocks', async () => {
    const allResult = await stockRepository.all();
    expect(allResult.ok).toBe(true);
    if (allResult.ok) {
      expect(allResult.value.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('peut lister uniquement les stocks disponibles', async () => {
    const availableResult = await stockRepository.allAvailableStocks();
    expect(availableResult.ok).toBe(true);
    if (availableResult.ok) {
      availableResult.value.forEach(stock => {
        expect(stock.isAvailable).toBe(true);
      });
    }
  });

  it('retourne une erreur pour un stock non trouvé', async () => {
    const findResult = await stockRepository.findById('non-existent-id');
    expect(findResult.ok).toBe(false);
  });

  it('peut supprimer un stock', async () => {
    const stockId = randomUUID();
    const companyId = randomUUID();
    const tickerValue = `DEL${stockId.slice(0, 4).toUpperCase()}`;

    await prisma.company.create({
      data: {
        companyIdentifier: companyId,
        name: 'Delete Test Company',
        description: 'Test'
      }
    });

    const tickerResult = Ticker.from(tickerValue);
    if (!tickerResult.ok) return;

    const stock = Stock.create({
      stockIdentifier: stockId,
      companyIdentifier: companyId,
      ticker: tickerResult.value,
      price: 75,
      isAvailable: true,
      createdAt: new Date()
    });

    await stockRepository.save(stock);

    const removeResult = await stockRepository.remove(stockId);
    expect(removeResult.ok).toBe(true);

    // Vérifier que le stock n'existe plus
    const findResult = await stockRepository.findById(stockId);
    expect(findResult.ok).toBe(false);
  });
});
