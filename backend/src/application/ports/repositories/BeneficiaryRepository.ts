import { Result } from "../../../shared/Result";
import { Beneficiary } from "../../../domain/entities/Beneficiary";
import { BeneficiaryNotFoundError } from "../../../domain/errors/BeneficiaryNotFoundError";
import { UnexpectedBeneficiaryError } from "../../../domain/errors/UnexpectedBeneficiaryError";

export interface BeneficiaryRepository {
  save(beneficiary: Beneficiary): Promise<Result<Beneficiary, Error>>;
  findById(beneficiaryIdentifier: string): Promise<Result<Beneficiary, BeneficiaryNotFoundError | UnexpectedBeneficiaryError>>;
  findByClientIdentifier(clientIdentifier: string): Promise<Result<Beneficiary[], UnexpectedBeneficiaryError>>;
  findByClientAndIban(clientIdentifier: string, iban: string): Promise<Result<Beneficiary | null, UnexpectedBeneficiaryError>>;
  delete(beneficiaryIdentifier: string): Promise<Result<true, BeneficiaryNotFoundError | UnexpectedBeneficiaryError>>;
  updateLabel(beneficiaryIdentifier: string, label: string): Promise<Result<Beneficiary, BeneficiaryNotFoundError | UnexpectedBeneficiaryError>>;
}
