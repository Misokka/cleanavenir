import { createPrismaContainer, PrismaContainer } from "./prismaContainer";

let containerInstance: PrismaContainer | null = null;

export function getPrismaContainer(): PrismaContainer {
  if (!containerInstance) {
    containerInstance = createPrismaContainer();
    console.log('📦 Container singleton initialisé');
  }
  return containerInstance;
}