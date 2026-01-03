import { randomUUID } from "crypto";
import { InvalidSavingRateError } from "../../../../domain/errors/InvalidSavingRateError";
import { SavingProductAlreadyExistsError } from "../../../../domain/errors/SavingProductAlreadyExistsError";
import Result, { err, ok } from "../../../../shared/Result";
import { SavingProductRepository } from "../../../ports/repositories/SavingProductRepository";
import { SavingProduct } from "../../../../domain/entities/SavingProduct";
import { InvalidSavingProductLabelError } from "../../../../domain/errors/InvalidSavingProductLabelError";

export class CreateSavingProductUseCase{
  constructor(
    private savingProductRepository: SavingProductRepository
  ){}

  public async execute(label: string, rate: number): Promise<Result<SavingProduct, Error>>{
    if(!label || label.length < 3){
      return err(new InvalidSavingProductLabelError("Label must be atleast 2 characters long."))
    }

    const existingSavingProduct = await this.savingProductRepository.findByLabel(label);

    if(existingSavingProduct.ok){
      return err(new SavingProductAlreadyExistsError(`Saving product ${label} already exists.`));
    }

    if(rate < 0){
      return err(new InvalidSavingRateError("Rate must be superior or equal to 0."))
    }

    const savingProductIdentifier = randomUUID();
    const savingProduct = SavingProduct.create({savingProductIdentifier, label, rate: rate});
    const saved = await this.savingProductRepository.save(savingProduct);

    if(!saved.ok){
      return err(saved.error);
    }

    return ok(saved.value);

  }
}