import { randomUUID } from "node:crypto";
import { err, ok, Result } from "../../../../shared/Result";
import { BeneficiaryRepository } from "../../../ports/repositories/BeneficiaryRepository";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";
import { Beneficiary } from "../../../../domain/entities/Beneficiary";
import { Iban } from "../../../../domain/value-objects/Iban";
import { BeneficiaryAlreadyExistsError } from "../../../../domain/errors/BeneficiaryAlreadyExistsError";
import { BeneficiaryIbanNotInBankError } from "../../../../domain/errors/BeneficiaryIbanNotInBankError";
import { CannotAddSelfAccountAsBeneficiaryError } from "../../../../domain/errors/CannotAddSelfAccountAsBeneficiaryError";

export interface AddBeneficiaryInput {
  userId: string;
  iban: string;
  label: string;
  accountName?: string;
}

export class AddBeneficiaryUseCase {
  constructor(
    private readonly beneficiaryRepository: BeneficiaryRepository,
    private readonly clientRepository: ClientRepository,
    private readonly bankAccountRepository: BankAccountRepository
  ) {}

  public async execute(input: AddBeneficiaryInput): Promise<Result<Beneficiary, Error>> {
    const trimmedLabel = input.label.trim();
    if (!trimmedLabel || trimmedLabel.length < 2) {
      return err(new Error('Le label doit contenir au moins 2 caractères'));
    }

    const clientResult = await this.clientRepository.findByUserId(input.userId);
    if (!clientResult.ok) {
      return err(clientResult.error);
    }
    const client = clientResult.value;

    const ibanResult = Iban.from(input.iban);
    if (!ibanResult.ok) {
      return err(ibanResult.error);
    }
    const ibanVO = ibanResult.value;

    const destinationAccountResult = await this.bankAccountRepository.findByIban(ibanVO.value);
    if (!destinationAccountResult.ok) {
      return err(new BeneficiaryIbanNotInBankError(ibanVO.value));
    }
    const destinationAccount = destinationAccountResult.value;

    if (destinationAccount.clientIdentifier === client.clientIdentifier) {
      return err(new CannotAddSelfAccountAsBeneficiaryError(ibanVO.value));
    }

    const existingBeneficiaryResult = await this.beneficiaryRepository.findByClientAndIban(
      client.clientIdentifier,
      ibanVO.value
    );
    if (!existingBeneficiaryResult.ok) {
      return err(existingBeneficiaryResult.error);
    }
    if (existingBeneficiaryResult.value !== null) {
      return err(new BeneficiaryAlreadyExistsError(ibanVO.value, client.clientIdentifier));
    }

    const beneficiaryId = randomUUID();
    const beneficiary = Beneficiary.create({
      beneficiaryIdentifier: beneficiaryId,
      clientIdentifier: client.clientIdentifier,
      iban: ibanVO,
      label: trimmedLabel,
      accountName: input.accountName,
    });

    const saveResult = await this.beneficiaryRepository.save(beneficiary);
    if (!saveResult.ok) {
      return err(saveResult.error);
    }

    return ok(saveResult.value);
  }
}
