export class AlreadyHasSavingAccountError extends Error {
  constructor(public readonly AccountId: string) {
    super(`Account ${AccountId} already has an Saving account`);
    this.name = "AlreadyHasSavingAccountError";
  }
}
