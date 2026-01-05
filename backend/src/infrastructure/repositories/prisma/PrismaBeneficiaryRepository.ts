import { PrismaClient } from "@prisma/client";
import { BeneficiaryRepository } from "../../../application/ports/repositories/BeneficiaryRepository";
import { Beneficiary } from "../../../domain/entities/Beneficiary";
import { BeneficiaryNotFoundError } from "../../../domain/errors/BeneficiaryNotFoundError";
import { UnexpectedBeneficiaryError } from "../../../domain/errors/UnexpectedBeneficiaryError";
import Result, { err, ok } from "../../../shared/Result";
import { PrismaBeneficiaryMapper } from "../mappers/PrismaMappers/PrismaBeneficiaryMapper";

export class PrismaBeneficiaryRepository implements BeneficiaryRepository {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaBeneficiaryMapper: PrismaBeneficiaryMapper
  ) {}

  async save(beneficiary: Beneficiary): Promise<Result<Beneficiary, Error>> {
    try {
      const beneficiaryToPersist = this.prismaBeneficiaryMapper.toPersistence(beneficiary);
      const registered = await this.prismaClient.beneficiary.create({
        data: { ...beneficiaryToPersist }
      });
      return ok(this.prismaBeneficiaryMapper.toDomain(registered));
    } catch (error: any) {
      return err(new Error(`Error saving beneficiary: ${error.message}`));
    }
  }

  async findById(beneficiaryIdentifier: string): Promise<Result<Beneficiary, BeneficiaryNotFoundError | UnexpectedBeneficiaryError>> {
    try {
      const maybeBeneficiary = await this.prismaClient.beneficiary.findUnique({
        where: { beneficiaryIdentifier }
      });

      if (!maybeBeneficiary) {
        return err(new BeneficiaryNotFoundError(beneficiaryIdentifier));
      }

      return ok(this.prismaBeneficiaryMapper.toDomain(maybeBeneficiary));
    } catch (error: any) {
      return err(new UnexpectedBeneficiaryError(`Error fetching beneficiary: ${error.message}`, error));
    }
  }

  async findByClientIdentifier(clientIdentifier: string): Promise<Result<Beneficiary[], UnexpectedBeneficiaryError>> {
    try {
      const beneficiaries = await this.prismaClient.beneficiary.findMany({
        where: { clientIdentifier }
      });
      return ok(beneficiaries.map(b => this.prismaBeneficiaryMapper.toDomain(b)));
    } catch (error: any) {
      return err(new UnexpectedBeneficiaryError(`Error fetching beneficiaries for client ${clientIdentifier}: ${error.message}`, error));
    }
  }

  async findByClientAndIban(clientIdentifier: string, iban: string): Promise<Result<Beneficiary | null, UnexpectedBeneficiaryError>> {
    try {
      const maybeBeneficiary = await this.prismaClient.beneficiary.findFirst({
        where: { 
          clientIdentifier,
          iban
        }
      });

      if (!maybeBeneficiary) {
        return ok(null);
      }

      return ok(this.prismaBeneficiaryMapper.toDomain(maybeBeneficiary));
    } catch (error: any) {
      return err(new UnexpectedBeneficiaryError(`Error fetching beneficiary by client and IBAN: ${error.message}`, error));
    }
  }

  async delete(beneficiaryIdentifier: string): Promise<Result<true, BeneficiaryNotFoundError | UnexpectedBeneficiaryError>> {
    try {
      await this.prismaClient.beneficiary.delete({
        where: { beneficiaryIdentifier }
      });
      return ok(true);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return err(new BeneficiaryNotFoundError(beneficiaryIdentifier));
      }
      return err(new UnexpectedBeneficiaryError(`Error deleting beneficiary: ${error.message}`, error));
    }
  }

  async updateLabel(beneficiaryIdentifier: string, label: string): Promise<Result<Beneficiary, BeneficiaryNotFoundError | UnexpectedBeneficiaryError>> {
    try {
      const updatedBeneficiary = await this.prismaClient.beneficiary.update({
        where: { beneficiaryIdentifier },
        data: { label }
      });
      return ok(this.prismaBeneficiaryMapper.toDomain(updatedBeneficiary));
    } catch (error: any) {
      if (error.code === 'P2025') {
        return err(new BeneficiaryNotFoundError(beneficiaryIdentifier));
      }
      return err(new UnexpectedBeneficiaryError(`Error updating beneficiary label: ${error.message}`, error));
    }
  }
}
