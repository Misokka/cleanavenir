export class NotEnoughHoldingsError extends Error {
  constructor(public readonly userId: string, public readonly stockId: string, public readonly requested: number) {
    super(`User ${userId} does not have enough holdings of stock ${stockId} (requested ${requested})`);
    this.name = "NotEnoughHoldingsError";
  }
}