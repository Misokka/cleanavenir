export class OrderNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Order not found: ${id}`);
    this.name = "OrderNotFoundError";
  }
}