export class ActionNotFoundError extends Error {
  constructor(public readonly idOrSymbol: string) {
    super(`Action not found: ${idOrSymbol}`);
    this.name = "ActionNotFoundError";
  }
}