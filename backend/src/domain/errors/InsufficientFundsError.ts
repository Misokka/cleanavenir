export class InsufficientFundsError extends Error {
  constructor(public readonly AccountId: string) {
    super(`Insufficient funds on account ${AccountId}`);
    this.name = "InsufficientFundsError";
  }
}
