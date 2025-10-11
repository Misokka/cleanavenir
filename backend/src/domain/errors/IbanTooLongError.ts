export class IbanTooLongError extends Error{
  constructor(value: string){
    super(value);
    this.name = "IbanTooLongError";
  }
}