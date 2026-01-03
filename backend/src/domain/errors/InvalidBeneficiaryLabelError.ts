export class InvalidBeneficiaryLabelError extends Error {
  constructor(public readonly label: string) {
    super(`Invalid beneficiary label: ${label}. Must be at least 2 characters.`);
    this.name = "InvalidBeneficiaryLabelError";
  }
}
