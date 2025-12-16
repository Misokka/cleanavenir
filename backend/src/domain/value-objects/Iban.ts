import { err, ok } from "../../shared/Result";
import { IbanTooLongError } from "../errors/IbanTooLongError";
import { IbanTooShortError } from "../errors/IbanTooShortError";

export class Iban{
  private constructor(public value: string){}

  public static from(value: string){
    if(value.length < 34){
      return err(new IbanTooShortError(value));
    }

    if(value.length > 36){
      return err(new IbanTooLongError(value));
    }

    return ok(new Iban(value));
  }
}