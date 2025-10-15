export class StockNotFoundError extends Error {
  constructor(public readonly idOrSymbol: string) {
    super(`Stock not found: ${idOrSymbol}`);
    this.name = "StockNotFoundError";
  }
}