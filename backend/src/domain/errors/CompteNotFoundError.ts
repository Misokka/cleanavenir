export class CompteNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Compte with id ${id} not found`);
    this.name = "CompteNotFoundError";
  }
}