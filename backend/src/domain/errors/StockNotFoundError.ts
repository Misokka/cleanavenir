export class StockNotFoundError extends Error {
  constructor(idOrSymbol: string) {
    super(`Stock not found: ${idOrSymbol}`);
    this.name = "StockNotFoundError";
  }
}