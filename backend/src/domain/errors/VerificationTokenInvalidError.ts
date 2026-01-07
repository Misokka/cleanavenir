export class VerificationTokenInvalidError extends Error {
  constructor() {
    super("Le lien de vérification est invalide ou a déjà été utilisé.");
    this.name = "VerificationTokenInvalidError";
  }
}
