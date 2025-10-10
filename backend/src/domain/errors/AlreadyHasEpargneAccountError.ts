export class AlreadyHasEpargneAccountError extends Error {
  constructor(public readonly compteId: string) {
    super(`Compte ${compteId} already has an epargne account`);
    this.name = "AlreadyHasEpargneAccountError";
  }
}
