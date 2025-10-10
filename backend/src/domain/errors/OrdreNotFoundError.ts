export class OrdreNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Ordre not found: ${id}`);
    this.name = "OrdreNotFoundError";
  }
}