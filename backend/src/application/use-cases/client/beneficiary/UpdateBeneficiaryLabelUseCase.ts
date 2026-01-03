import { Result, err, ok } from "../../../../shared/Result";
import { BeneficiaryRepository } from "../../../ports/repositories/BeneficiaryRepository";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";
import { Beneficiary } from "../../../../domain/entities/Beneficiary";

export interface UpdateBeneficiaryLabelInput {
  beneficiaryId: string;
  userId: string;
  newLabel: string;
}

export class UpdateBeneficiaryLabelUseCase {
  constructor(
    private readonly beneficiaryRepository: BeneficiaryRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  public async execute(input: UpdateBeneficiaryLabelInput): Promise<Result<Beneficiary, Error>> {
    // Validate label
    const trimmedLabel = input.newLabel.trim();
    if (!trimmedLabel || trimmedLabel.length < 2) {
      return err(new Error('Le label doit contenir au moins 2 caractères'));
    }

    // Get client
    const clientResult = await this.clientRepository.findByUserId(input.userId);
    if (!clientResult.ok) {
      return err(clientResult.error);
    }
    const client = clientResult.value;

    // Check beneficiary exists and belongs to client
    const beneficiaryResult = await this.beneficiaryRepository.findById(input.beneficiaryId);
    if (!beneficiaryResult.ok) {
      return err(beneficiaryResult.error);
    }

    const beneficiary = beneficiaryResult.value;
    if (beneficiary.clientIdentifier !== client.clientIdentifier) {
      return err(new Error('Accès non autorisé à ce bénéficiaire'));
    }

    // Update
    return this.beneficiaryRepository.updateLabel(input.beneficiaryId, trimmedLabel);
  }
}
