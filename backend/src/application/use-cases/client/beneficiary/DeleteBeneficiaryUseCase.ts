import { Result, err, ok } from "../../../../shared/Result";
import { BeneficiaryRepository } from "../../../ports/repositories/BeneficiaryRepository";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";

export interface DeleteBeneficiaryInput {
  beneficiaryId: string;
  userId: string;
}

export class DeleteBeneficiaryUseCase {
  constructor(
    private readonly beneficiaryRepository: BeneficiaryRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  public async execute(input: DeleteBeneficiaryInput): Promise<Result<true, Error>> {
    const clientResult = await this.clientRepository.findByUserId(input.userId);
    if (!clientResult.ok) {
      return err(clientResult.error);
    }
    const client = clientResult.value;

    const beneficiaryResult = await this.beneficiaryRepository.findById(input.beneficiaryId);
    if (!beneficiaryResult.ok) {
      return err(beneficiaryResult.error);
    }

    const beneficiary = beneficiaryResult.value;
    if (beneficiary.clientIdentifier !== client.clientIdentifier) {
      return err(new Error('Accès non autorisé à ce bénéficiaire'));
    }

    return this.beneficiaryRepository.delete(input.beneficiaryId);
  }
}
