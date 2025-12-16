import { randomUUID } from "crypto";
import { SavingProduct } from "../../../../domain/entities/SavingProduct";
import Result, { err, ok } from "../../../../shared/Result";
import { SavingProductRepository } from "../../../ports/repositories/SavingProductRepository";

interface CreateSavingProductInput {
  label: string;
  rate: number; // en pourcentage
}

export class CreateSavingProductUseCase {
  constructor(
    private readonly savingProductRepository: SavingProductRepository
  ) {}

  public async execute(input: CreateSavingProductInput): Promise<Result<SavingProduct, Error>> {
    if (!input.label || input.label.trim().length === 0) {
      return err(new Error("Le label du produit d'épargne est requis"));
    }

    if(input.label.trim().length < 3){
      return err(new Error("Le label du produit d'épargne doit contenir au moins 3 caractères"));
    }

    const existingProductResult = await this.savingProductRepository.findByLabel(input.label.trim());
    if (existingProductResult.ok) {
      return err(new Error("Un produit d'épargne avec ce label existe déjà"));
    }

    if (input.rate < 1.5 || input.rate > 3.5) {
      return err(new Error('Le taux doit être compris entre 1.5% et 3.5%'));
    }

    const savingProductId = randomUUID();
    const newSavingProduct = SavingProduct.create({
      savingProductIdentifier: savingProductId,
      label: input.label,
      rate: Math.round(input.rate * 100), // Convertir en basis points
    });
    const createSavingProductResult = await this.savingProductRepository.save(newSavingProduct);

    if (!createSavingProductResult.ok) {
      return err(new Error('Erreur lors de la création du produit d\'épargne'));
    }

    return ok(createSavingProductResult.value);
  }
}