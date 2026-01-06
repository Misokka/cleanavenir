import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaBeneficiaryMapper } from '../src/infrastructure/repositories/mappers/PrismaMappers/PrismaBeneficiaryMapper';
import { PrismaBeneficiaryRepository } from '../src/infrastructure/repositories/prisma/PrismaBeneficiaryRepository';
import { Beneficiary } from '../src/domain/entities/Beneficiary';
import { Iban } from '../src/domain/value-objects/Iban';
import { createPrismaTestDb, cleanupPrismaTestDb } from './helpers/createPrismaTestDb';

describe('Prisma Beneficiary repository', () => {
  let prisma: PrismaClient;
  let beneficiaryRepository: PrismaBeneficiaryRepository;
  const beneficiaryMapper = new PrismaBeneficiaryMapper();

  // Helper pour générer un IBAN valide (27-36 caractères)
  const generateValidIban = () => `FR76${randomUUID().replace(/-/g, '').slice(0, 23)}`;

  beforeAll(async () => {
    prisma = await createPrismaTestDb();
    beneficiaryRepository = new PrismaBeneficiaryRepository(prisma, beneficiaryMapper);
  });

  afterAll(async () => {
    await cleanupPrismaTestDb(prisma);
  });

  it('peut insérer et retrouver un bénéficiaire', async () => {
    const beneficiaryId = randomUUID();
    const clientId = randomUUID();
    const ibanValue = generateValidIban();

    const ibanResult = Iban.from(ibanValue);
    expect(ibanResult.ok).toBe(true);
    if (!ibanResult.ok) return;

    const beneficiary = Beneficiary.create({
      beneficiaryIdentifier: beneficiaryId,
      clientIdentifier: clientId,
      iban: ibanResult.value,
      label: 'Test Beneficiary',
      accountName: 'John Doe',
      createdAt: new Date()
    });

    // Sauvegarder le bénéficiaire
    const saveResult = await beneficiaryRepository.save(beneficiary);
    expect(saveResult.ok).toBe(true);

    // Retrouver par ID
    const findResult = await beneficiaryRepository.findById(beneficiaryId);
    expect(findResult.ok).toBe(true);
    if (findResult.ok) {
      expect(findResult.value.beneficiaryIdentifier).toBe(beneficiaryId);
      expect(findResult.value.label).toBe('Test Beneficiary');
      expect(findResult.value.accountName).toBe('John Doe');
    }
  });

  it('peut lister les bénéficiaires par client', async () => {
    const clientId = randomUUID();
    const beneficiary1Id = randomUUID();
    const beneficiary2Id = randomUUID();

    const iban1Result = Iban.from(generateValidIban());
    const iban2Result = Iban.from(generateValidIban());
    if (!iban1Result.ok || !iban2Result.ok) return;

    const beneficiary1 = Beneficiary.create({
      beneficiaryIdentifier: beneficiary1Id,
      clientIdentifier: clientId,
      iban: iban1Result.value,
      label: 'Bénéficiaire 1',
      createdAt: new Date()
    });

    const beneficiary2 = Beneficiary.create({
      beneficiaryIdentifier: beneficiary2Id,
      clientIdentifier: clientId,
      iban: iban2Result.value,
      label: 'Bénéficiaire 2',
      createdAt: new Date()
    });

    await beneficiaryRepository.save(beneficiary1);
    await beneficiaryRepository.save(beneficiary2);

    const listResult = await beneficiaryRepository.findByClientIdentifier(clientId);
    expect(listResult.ok).toBe(true);
    if (listResult.ok) {
      expect(listResult.value.length).toBe(2);
    }
  });

  it('peut retrouver un bénéficiaire par client et IBAN', async () => {
    const clientId = randomUUID();
    const beneficiaryId = randomUUID();
    const ibanValue = generateValidIban();

    const ibanResult = Iban.from(ibanValue);
    if (!ibanResult.ok) return;

    const beneficiary = Beneficiary.create({
      beneficiaryIdentifier: beneficiaryId,
      clientIdentifier: clientId,
      iban: ibanResult.value,
      label: 'IBAN Search Test',
      createdAt: new Date()
    });

    await beneficiaryRepository.save(beneficiary);

    const findResult = await beneficiaryRepository.findByClientAndIban(clientId, ibanValue);
    expect(findResult.ok).toBe(true);
    if (findResult.ok && findResult.value) {
      expect(findResult.value.iban.value).toBe(ibanValue);
    }
  });

  it('retourne null si bénéficiaire non trouvé par client et IBAN', async () => {
    const findResult = await beneficiaryRepository.findByClientAndIban('non-existent', 'FR7600000000000000000000000');
    expect(findResult.ok).toBe(true);
    if (findResult.ok) {
      expect(findResult.value).toBeNull();
    }
  });

  it('peut mettre à jour le label d\'un bénéficiaire', async () => {
    const beneficiaryId = randomUUID();
    const clientId = randomUUID();
    const ibanValue = generateValidIban();

    const ibanResult = Iban.from(ibanValue);
    if (!ibanResult.ok) return;

    const beneficiary = Beneficiary.create({
      beneficiaryIdentifier: beneficiaryId,
      clientIdentifier: clientId,
      iban: ibanResult.value,
      label: 'Original Label',
      createdAt: new Date()
    });

    await beneficiaryRepository.save(beneficiary);

    const updateResult = await beneficiaryRepository.updateLabel(beneficiaryId, 'Nouveau Label');
    expect(updateResult.ok).toBe(true);
    if (updateResult.ok) {
      expect(updateResult.value.label).toBe('Nouveau Label');
    }
  });

  it('retourne une erreur pour un bénéficiaire non trouvé', async () => {
    const findResult = await beneficiaryRepository.findById('non-existent-id');
    expect(findResult.ok).toBe(false);
  });

  it('peut supprimer un bénéficiaire', async () => {
    const beneficiaryId = randomUUID();
    const clientId = randomUUID();
    const ibanValue = generateValidIban();

    const ibanResult = Iban.from(ibanValue);
    if (!ibanResult.ok) return;

    const beneficiary = Beneficiary.create({
      beneficiaryIdentifier: beneficiaryId,
      clientIdentifier: clientId,
      iban: ibanResult.value,
      label: 'To Delete',
      createdAt: new Date()
    });

    await beneficiaryRepository.save(beneficiary);

    const deleteResult = await beneficiaryRepository.delete(beneficiaryId);
    expect(deleteResult.ok).toBe(true);

    // Vérifier que le bénéficiaire n'existe plus
    const findResult = await beneficiaryRepository.findById(beneficiaryId);
    expect(findResult.ok).toBe(false);
  });

  it('retourne une erreur lors de la suppression d\'un bénéficiaire non existant', async () => {
    const deleteResult = await beneficiaryRepository.delete('non-existent-id');
    expect(deleteResult.ok).toBe(false);
  });
});
