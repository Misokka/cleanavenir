export class NotEnoughHoldingsError extends Error {
  constructor(public readonly userId: string, public readonly actionId: string, public readonly requested: number) {
    super(`User ${userId} does not have enough holdings of action ${actionId} (requested ${requested})`);
    this.name = "NotEnoughHoldingsError";
  }
}