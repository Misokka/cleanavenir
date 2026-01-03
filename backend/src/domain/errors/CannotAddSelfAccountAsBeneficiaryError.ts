export class CannotAddSelfAccountAsBeneficiaryError extends Error {
  constructor(public readonly iban: string) {
    super(`Cannot add your own account (${iban}) as beneficiary`);
    this.name = "CannotAddSelfAccountAsBeneficiaryError";
  }
}
