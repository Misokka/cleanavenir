export class EmailNotVerifiedError extends Error {
  constructor(email: string) {
    super(`Le compte avec l'email ${email} n'a pas été vérifié. Veuillez consulter vos emails pour activer votre compte.`);
    this.name = "EmailNotVerifiedError";
  }
}
