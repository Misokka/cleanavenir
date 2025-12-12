export class HoldingNotFoundError extends Error {
  constructor(holdingIdentifier: string) {
    super(holdingIdentifier);
    this.name = "HoldingNotFoundError";
  }
}