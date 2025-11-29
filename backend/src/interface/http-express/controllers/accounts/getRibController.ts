import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const getRibController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const accountId = req.params.id;

  const container = getContainer();
  const accountResult = await container.useCases.account.getBankAccount.execute({ userId, accountId });

  if (!accountResult.ok) {
    res.status(404).json({ error: 'NOT_FOUND', message: accountResult.error.message });
    return;
  }

  const account = accountResult.value;
  // RIB basique JSON (banque, agence, IBAN formaté, BIC mock)
  res.json({
    holderName: account.ownerName ?? 'Client',
    iban: account.iban,
    bic: 'CLEANFRPPXXX',
    bankName: 'Clean Avenir',
    accountLabel: account.name ?? account.label ?? 'Compte',
  });
});