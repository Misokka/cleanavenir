export class OrderBookNotFoundError extends Error {
  constructor(orderBookId: string) {
    super(`Order Book with ID ${orderBookId} not found.`);
    this.name = "OrderBookNotFoundError";
  }
}