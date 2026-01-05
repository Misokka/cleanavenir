import { err, ok } from "../../shared/Result";
import { TickerTooLongError } from "../errors/TickerTooLongError";

export class Ticker{
  constructor(public value: string){}

  public static from(value: string){
    
    if(value.length > 10){
      return err(new TickerTooLongError(value));
    }

    return ok(new Ticker(value));
  }
}