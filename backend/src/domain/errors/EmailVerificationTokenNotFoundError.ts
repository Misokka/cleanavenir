export class EmailVerificationTokenNotFoundError extends Error{
  constructor(message: string){
    super(message);
    this.name = "EmailVerificationTokenNotFoundError"
  }
}