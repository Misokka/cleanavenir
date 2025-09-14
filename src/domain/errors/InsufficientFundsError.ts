export class InsufficientFundsError extends Error {
  constructor(public readonly compteId: string) {
    super(`Insufficient funds on account ${compteId}`);
    this.name = "InsufficientFundsError";
  }
}
