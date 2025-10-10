export class OperationNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Operation with id ${id} not found`);
    this.name = "OperationNotFoundError";
  }
}