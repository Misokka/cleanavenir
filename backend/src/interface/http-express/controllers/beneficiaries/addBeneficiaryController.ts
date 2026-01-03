import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { BeneficiaryAlreadyExistsError } from '../../../../domain/errors/BeneficiaryAlreadyExistsError';
import { BeneficiaryIbanNotInBankError } from '../../../../domain/errors/BeneficiaryIbanNotInBankError';
import { CannotAddSelfAccountAsBeneficiaryError } from '../../../../domain/errors/CannotAddSelfAccountAsBeneficiaryError';

interface AddBeneficiaryRequestBody {
  iban: string;
  label: string;
  accountName?: string;
}

export const addBeneficiaryController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Non authentifié',
      });
      return;
    }

    const { iban, label, accountName } = req.body as AddBeneficiaryRequestBody;

    if (!iban || !label) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'IBAN et label sont requis',
      });
      return;
    }

    const container = getContainer();
    const result = await container.useCases.beneficiary.add.execute({
      userId,
      iban: iban.trim(),
      label: label.trim(),
      accountName: accountName?.trim(),
    });

    if (!result.ok) {
      if (result.error instanceof BeneficiaryAlreadyExistsError) {
        res.status(409).json({
          error: 'BENEFICIARY_ALREADY_EXISTS',
          message: result.error.message,
        });
        return;
      }

      if (result.error instanceof BeneficiaryIbanNotInBankError) {
        res.status(404).json({
          error: 'IBAN_NOT_IN_BANK',
          message: result.error.message,
        });
        return;
      }

      if (result.error instanceof CannotAddSelfAccountAsBeneficiaryError) {
        res.status(400).json({
          error: 'CANNOT_ADD_SELF_ACCOUNT',
          message: result.error.message,
        });
        return;
      }

      res.status(400).json({
        error: 'ADD_BENEFICIARY_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.status(201).json({
      id: result.value.beneficiaryIdentifier,
      iban: result.value.iban.value,
      label: result.value.label,
      accountName: result.value.accountName,
      createdAt: result.value.createdAt,
    });
  }
);
