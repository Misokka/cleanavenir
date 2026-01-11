import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

if (!process.env.DATABASE_URL_PRISMA) {
  console.log(envPath);
  console.error(`❌ Erreur: Impossible de trouver .env à : ${envPath}`);
  console.error("DATABASE_URL est undefined !");
} else {
  console.log('✅ .env chargé avec succès pour Prisma Container');
  console.log(envPath);
}

export function getPrismaClient() {
  const connectionString = process.env.DATABASE_URL_PRISMA;
  console.log(connectionString);
  const adapter = new PrismaPg({connectionString})
  const prismaClient = new PrismaClient({adapter});
  return prismaClient
}