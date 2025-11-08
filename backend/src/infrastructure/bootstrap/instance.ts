import { createContainer, Container } from './container';

let containerInstance: Container | null = null;

export function getContainer(): Container {
  if (!containerInstance) {
    containerInstance = createContainer();
    console.log('📦 Container singleton initialisé');
  }
  return containerInstance;
}

export function resetContainer(): void {
  containerInstance = null;
  console.log('🔄 Container réinitialisé');
}

export function setContainer(container: Container): void {
  containerInstance = container;
}
