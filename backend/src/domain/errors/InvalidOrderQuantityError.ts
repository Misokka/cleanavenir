export class InvalidOrderQuantityError extends Error {
  constructor(public readonly quantity: number) {
    super(`Invalid order quantity: ${quantity}`);
    this.name = "InvalidOrderQuantityError";
  }
}