import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const getOperationsHistoryController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Non authentifié',
      });
      return;
    }

    const filters: any = {};

    if (req.query.type) {
      filters.type = Array.isArray(req.query.type) 
        ? req.query.type 
        : [req.query.type];
    }

    if (req.query.dateFrom) {
      filters.dateFrom = req.query.dateFrom as string;
    }

    if (req.query.dateTo) {
      filters.dateTo = req.query.dateTo as string;
    }

    if (req.query.amountMin) {
      filters.amountMin = Math.round(Number.parseFloat(req.query.amountMin as string) * 100);
    }

    if (req.query.amountMax) {
      filters.amountMax = Math.round(Number.parseFloat(req.query.amountMax as string) * 100);
    }

    if (req.query.accountId) {
      filters.accountId = req.query.accountId as string;
    }

    const container = getContainer();
    const result = await container.useCases.operation.getHistory.execute({
      userId,
      filters,
    });

    if (!result.ok) {
      if (result.error.message.includes('non autorisé')) {
        res.status(403).json({
          error: 'UNAUTHORIZED',
          message: 'Accès non autorisé',
        });
        return;
      }

      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: result.error.message,
      });
      return;
    }

    const operations = result.value.map((op) => ({
      id: op.id,
      fromAccountId: op.fromAccountId,
      toAccountId: op.toAccountId,
      amount: Math.abs(op.amount) / 100, // Convertir en euros et toujours positif
      type: op.type,
      description: op.description,
      createdAt: op.createdAt,
      direction: op.direction, // INCOMING, OUTGOING, INTERNAL
      userAccountId: op.userAccountId,
    }));

    res.json(operations);
  }
);
