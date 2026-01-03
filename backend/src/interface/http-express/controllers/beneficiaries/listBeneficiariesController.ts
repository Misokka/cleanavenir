import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const listBeneficiariesController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Non authentifié',
      });
      return;
    }

    const container = getContainer();
    const result = await container.useCases.beneficiary.list.execute({ userId });

    if (!result.ok) {
      res.status(500).json({
        error: 'LIST_BENEFICIARIES_ERROR',
        message: result.error.message,
      });
      return;
    }

    const beneficiaries = result.value.map((b) => ({
      id: b.beneficiaryIdentifier,
      iban: b.iban.value,
      label: b.label,
      accountName: b.accountName,
      createdAt: b.createdAt,
    }));

    res.status(200).json(beneficiaries);
  }
);
