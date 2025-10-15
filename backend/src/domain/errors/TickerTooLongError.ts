export class TickerTooLongError extends Error{
  constructor(value: string){
    super(value);
    this.name = "TickerTooLongError"
  }
}