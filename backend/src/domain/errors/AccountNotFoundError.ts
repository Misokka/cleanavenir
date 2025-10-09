export class AccountNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Account with id ${id} not found`);
    this.name = "AccountNotFoundError";
  }
}