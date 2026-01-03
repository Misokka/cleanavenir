export class BeneficiaryNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Beneficiary with id ${id} not found`);
    this.name = "BeneficiaryNotFoundError";
  }
}
