export class VerificationTokenExpiredError extends Error {
  constructor() {
    super("Le lien de vérification a expiré. Veuillez demander un nouveau lien.");
    this.name = "VerificationTokenExpiredError";
  }
}
