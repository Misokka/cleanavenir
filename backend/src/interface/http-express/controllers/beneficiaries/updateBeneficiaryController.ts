import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { BeneficiaryNotFoundError } from '../../../../domain/errors/BeneficiaryNotFoundError';

interface UpdateBeneficiaryRequestBody {
  label: string;
}

export const updateBeneficiaryController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Non authentifié',
      });
      return;
    }

    const { id } = req.params;
    const { label } = req.body as UpdateBeneficiaryRequestBody;

    if (!id || !label) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'ID et nouveau label sont requis',
      });
      return;
    }

    const container = getContainer();
    const result = await container.useCases.beneficiary.update.execute({
      beneficiaryId: id,
      userId,
      newLabel: label.trim(),
    });

    if (!result.ok) {
      if (result.error instanceof BeneficiaryNotFoundError) {
        res.status(404).json({
          error: 'BENEFICIARY_NOT_FOUND',
          message: result.error.message,
        });
        return;
      }

      res.status(400).json({
        error: 'UPDATE_BENEFICIARY_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.status(200).json({
      id: result.value.beneficiaryIdentifier,
      iban: result.value.iban.value,
      label: result.value.label,
      accountName: result.value.accountName,
      createdAt: result.value.createdAt,
    });
  }
);
