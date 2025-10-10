export class UserNotFoundError extends Error {
  constructor(public readonly idOrEmail: string) {
    super(`User not found: ${idOrEmail}`);
    this.name = "UserNotFoundError";
  }
}