export class MissingCredentialsError extends Error{
  constructor(message: string){
    super(message);
    this.name = "MissingCredentialsError";
  }
}