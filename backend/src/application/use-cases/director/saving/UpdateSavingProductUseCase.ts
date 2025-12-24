import { SavingProduct } from "../../../../domain/entities/SavingProduct";
import { InvalidSavingRateError } from "../../../../domain/errors/InvalidSavingRateError";
import Result, { err, ok } from "../../../../shared/Result";
import { SavingProductRepository } from "../../../ports/repositories/SavingProductRepository";


type UpdateSavingProductUseCaseProps = {
  savingProductIdentifier: string;
  label: string;
  rate: number;
}

export class UpdateSavingProductUseCase {
  constructor(
    private readonly savingProductRepository: SavingProductRepository
  ){}

  public async execute(props: UpdateSavingProductUseCaseProps): Promise<Result<SavingProduct, Error>>{
    const savingProductResult = await this.savingProductRepository.findById(props.savingProductIdentifier);
    if(!savingProductResult.ok){
      return err(savingProductResult.error);
    }

    if(props.rate < 0){
      return err(new InvalidSavingRateError("The saving rate should be higher than 0."));
    }

    const savingProduct = savingProductResult.value;
    savingProduct.label = props.label;
    savingProduct.rate = props.rate; // à voir pour stocker en décimal

    const updatedSavingProductResult = await this.savingProductRepository.update(savingProduct);
    if(!updatedSavingProductResult.ok){
      return err(updatedSavingProductResult.error);
    }

    return ok(updatedSavingProductResult.value)
  }
}