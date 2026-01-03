export class InsufficientStockQuantityError extends Error{
  constructor(stockTicker: string){
    super(`Insufficient stock quantity for stock: ${stockTicker}`);
    this.name = "InsufficientStockQuantityError"
  }
}