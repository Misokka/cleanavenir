import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

/**
 * Controller pour supprimer un compte client (Director uniquement)
 * DELETE /api/admin/clients/:userId
 */
export const deleteClientController = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      message: "userId est requis"
    });
  }

  const container = getContainer();
  const useCase = container.useCases.director.deleteClient;

  const result = await useCase.execute(userId);

  if (!result.ok) {
    if (result.error.message.includes("introuvable")) {
      return res.status(404).json({
        message: "Utilisateur introuvable"
      });
    }
    return res.status(400).json({
      message: result.error.message
    });
  }

  return res.status(200).json({
    message: "Client supprimé avec succès"
  });
});
