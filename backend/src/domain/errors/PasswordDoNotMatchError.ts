export class PasswordDoNotMatchError extends Error{
  constructor(message: string){
    super(message);
    this.name = "PasswordDoNotMatchError";
  }
}