export class IbanTooShortError extends Error{
  constructor(value: string){
    super(value);
    this.name = "IbanTooShortError";
  }
}