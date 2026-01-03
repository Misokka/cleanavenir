import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { BeneficiaryNotFoundError } from '../../../../domain/errors/BeneficiaryNotFoundError';

export const deleteBeneficiaryController = asyncHandler(
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

    if (!id) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'ID du bénéficiaire requis',
      });
      return;
    }

    const container = getContainer();
    const result = await container.useCases.beneficiary.delete.execute({
      beneficiaryId: id,
      userId,
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
        error: 'DELETE_BENEFICIARY_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.status(200).json({ success: true, message: 'Bénéficiaire supprimé' });
  }
);
