export class InvalidOrdrePriceError extends Error {
  constructor(public readonly price: number) {
    super(`Invalid order price (limit): ${price}`);
    this.name = "InvalidOrdrePriceError";
  }
}