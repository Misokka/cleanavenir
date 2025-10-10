export class InvalidRoleError extends Error {
  constructor(public readonly role: string) {
    super(`Invalid role: ${role}`);
    this.name = "InvalidRoleError";
  }
}