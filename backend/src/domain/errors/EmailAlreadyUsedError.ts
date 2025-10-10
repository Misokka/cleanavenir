export class EmailAlreadyUsedError extends Error {
  constructor(public readonly email: string) {
    super(`Email already used: ${email}`);
    this.name = "EmailAlreadyUsedError";
  }
}