export class BeneficiaryIbanNotInBankError extends Error {
  constructor(public readonly iban: string) {
    super(`IBAN ${iban} does not exist in our bank`);
    this.name = "BeneficiaryIbanNotInBankError";
  }
}
