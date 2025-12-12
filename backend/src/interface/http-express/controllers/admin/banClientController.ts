import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const banClientController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id: clientId } = req.params;

    const container = getContainer();
    const clientRepository = container.repositories.client;

    // Récupérer le client
    const clientResult = await clientRepository.findById(clientId);

    if (!clientResult.ok) {
      res.status(404).json({
        error: 'CLIENT_NOT_FOUND',
        message: 'Client introuvable',
      });
      return;
    }

    const client = clientResult.value;

    // Désactiver le client
    client.isActive = false;

    const updateResult = await clientRepository.update(client);

    if (!updateResult.ok) {
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: updateResult.error.message,
      });
      return;
    }

    res.json({
      message: 'Client banni avec succès',
      client: {
        id: client.userIdentifier,
        email: client.email,
        isActive: client.isActive,
      },
    });
  }
);
