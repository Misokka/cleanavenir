import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { toUserDTO } from '../../mappers/dtoMappers';

export const listClientsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const container = getContainer();
    const clientRepository = container.repositories.client;

    // Récupérer tous les clients
    const result = await clientRepository.all();

    if (!result.ok) {
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.json({
      clients: result.value.map((client) => {
        const {password, ...rest} = client;
        return rest
      }),
    });
  }
);
