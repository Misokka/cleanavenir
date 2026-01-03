export class BeneficiaryAlreadyExistsError extends Error {
  constructor(public readonly iban: string, public readonly clientId: string) {
    super(`Beneficiary with IBAN ${iban} already exists for client ${clientId}`);
    this.name = "BeneficiaryAlreadyExistsError";
  }
}
