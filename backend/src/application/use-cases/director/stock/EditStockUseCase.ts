import { off } from "process";
import { CompanyRepository } from "../../../ports/repositories/CompanyRepository";
import { StockRepository } from "../../../ports/repositories/StockRepository";
import Result, { err, ok } from "../../../../shared/Result";
import { Ticker } from "../../../../domain/value-objects/Ticker";
import { TickerTooLongError } from "../../../../domain/errors/TickerTooLongError";

interface EditStockProps{
  stockToEdit: StockToEditType
}

export type StockToEditType = {
  id: string,
  isAvailable: boolean,
  ticker: string
}

export class EditStockUseCase {
  constructor(
    private readonly stockRepository: StockRepository,
  ){}

  async execute({ stockToEdit }: EditStockProps): Promise<Result<boolean, Error>>{
    const stockResult = await this.stockRepository.findById(stockToEdit.id);
    if(!stockResult.ok) return err(stockResult.error);
    const stock = stockResult.value;

    stock.isAvailable = stockToEdit.isAvailable;
    const stockTickerResult = Ticker.from(stockToEdit.ticker);
    if(!stockTickerResult.ok) return err(new TickerTooLongError(stockToEdit.ticker));
    stock.ticker = stockTickerResult.value;

    const updatedStockResult = await this.stockRepository.update(stock);
    if(!updatedStockResult.ok) return err(updatedStockResult.error);
    
    return ok(true);
  }
}