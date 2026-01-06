import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { execSync } from 'child_process';
import path from 'path';

/**
 * Helper pour créer une connexion de test Prisma (Prisma 7.x).
 * 
 * IMPORTANT: Pour les tests Prisma, vous devez:
 * 1. Configurer une base PostgreSQL de test (ex: cleanavenir_test)
 * 2. Définir DATABASE_URL_TEST dans votre .env.test ou en variable d'environnement
 * 3. Exécuter `DATABASE_URL=$DATABASE_URL_TEST npx prisma db push` avant les tests
 * 
 * Ou utiliser un conteneur Docker PostgreSQL pour les tests:
 * docker run --name postgres-test -e POSTGRES_PASSWORD=test -e POSTGRES_DB=cleanavenir_test -p 5433:5432 -d postgres
 * DATABASE_URL_TEST="postgresql://postgres:test@localhost:5433/cleanavenir_test"
 */

let pool: Pool | null = null;

export async function createPrismaTestDb(): Promise<PrismaClient> {
  const testDatabaseUrl = process.env.DATABASE_URL_TEST || process.env.DATABASE_URL;
  
  if (!testDatabaseUrl) {
    throw new Error(
      'DATABASE_URL_TEST ou DATABASE_URL doit être défini pour les tests Prisma.\n' +
      'Exemple: DATABASE_URL_TEST="postgresql://postgres:test@localhost:5433/cleanavenir_test"'
    );
  }

  // Synchronise le schéma avec la base de données de test
  try {
    const schemaPath = path.join(process.cwd(), 'src/infrastructure/repositories/prisma/schema.prisma');
    execSync(
      `npx prisma db push --schema="${schemaPath}" --skip-generate --accept-data-loss`, 
      {
        cwd: process.cwd(),
        stdio: 'pipe',
        env: {
          ...process.env,
          DATABASE_URL: testDatabaseUrl
        }
      }
    );
  } catch (error: any) {
    // On continue quand même, le schéma est peut-être déjà à jour
  }

  // Créer le pool de connexion PostgreSQL
  pool = new Pool({ connectionString: testDatabaseUrl });
  
  // Créer l'adaptateur Prisma pour PostgreSQL
  const adapter = new PrismaPg(pool);
  
  // Configure le client Prisma avec l'adaptateur
  const prisma = new PrismaClient({ adapter });

  return prisma;
}

// Helper pour nettoyer la connexion après les tests
export async function cleanupPrismaTestDb(prisma: PrismaClient): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
  }
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/**
 * Helper pour nettoyer les données de test (optionnel).
 * À utiliser dans beforeEach/afterEach si nécessaire.
 */
export async function clearPrismaTestData(prisma: PrismaClient): Promise<void> {
  // Supprime les données dans l'ordre inverse des dépendances
  const tableNames = [
    'StockPriceHistory',
    'Trade',
    'Order',
    'Holding',
    'Portfolio',
    'Transaction',
    'BankAccount',
    'SavingAccount',
    'Loan',
    'Discussion',
    'Beneficiary',
    'Stock',
    'Company',
    'SavingProduct',
    'Client',
    'Director',
    'Advisor',
    'User'
  ];

  for (const tableName of tableNames) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${tableName}"`);
    } catch (e) {
      // Ignorer les erreurs si la table n'existe pas encore
    }
  }
}

