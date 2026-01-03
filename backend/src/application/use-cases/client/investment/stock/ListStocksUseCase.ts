
import { Stock } from "../../../../../domain/entities/Stock";
import Result, { err, ok } from "../../../../../shared/Result";
import { StockRepository } from "../../../../ports/repositories/StockRepository";

type StockType = "ALL" | "AVAILABLE_ONLY"
interface ListStockUseCaseProps {
  stockType: StockType
}


export class ListStocksUseCase{
  constructor(
    private readonly stockRepository: StockRepository
  ){}

  async execute({stockType = "ALL"}: ListStockUseCaseProps): Promise<Result<Stock[], Error>>{
    let stockResult;

    if(stockType === "ALL"){
      stockResult = await this.stockRepository.all();
      if(!stockResult.ok){
        return err(stockResult.error);
      }

      return ok(stockResult.value);
    } else if(stockType === "AVAILABLE_ONLY"){
      stockResult = await this.stockRepository.allAvailableStocks();
      if(!stockResult.ok){
        return err(stockResult.error);
      }

      return ok(stockResult.value);
    }
    

    return err(new Error("Invalid stockType"));
  }
}