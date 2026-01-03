import { Result, err, ok } from "../../../../shared/Result";
import { BeneficiaryRepository } from "../../../ports/repositories/BeneficiaryRepository";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";
import { Beneficiary } from "../../../../domain/entities/Beneficiary";

export class ListUserBeneficiariesUseCase {
  constructor(
    private readonly beneficiaryRepository: BeneficiaryRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  public async execute(params: { userId: string }): Promise<Result<Beneficiary[], Error>> {
    const clientResult = await this.clientRepository.findByUserId(params.userId);
    if (!clientResult.ok) {
      return err(clientResult.error);
    }

    const client = clientResult.value;

    return this.beneficiaryRepository.findByClientIdentifier(client.clientIdentifier);
  }
}
