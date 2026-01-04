import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';


export const updateClientController = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { email, firstName, lastName, password } = req.body;

  if (!userId) {
    return res.status(400).json({
      message: "userId est requis"
    });
  }

  if (!email && !firstName && !lastName && !password) {
    return res.status(400).json({
      message: "Au moins un champ doit être fourni pour la mise à jour"
    });
  }

  if (password && password.length < 8) {
    return res.status(400).json({
      message: "Le mot de passe doit contenir au moins 8 caractères"
    });
  }

  const container = getContainer();
  const useCase = container.useCases.director.updateClient;

  const result = await useCase.execute({
    userId,
    email,
    firstName,
    lastName,
    password
  });

  if (!result.ok) {
    if (result.error.message.includes("introuvable")) {
      return res.status(404).json({
        message: "Utilisateur introuvable"
      });
    }
    if (result.error.message.includes("already") || result.error.message.includes("déjà")) {
      return res.status(400).json({
        message: "Cette adresse email est déjà utilisée"
      });
    }
    return res.status(400).json({
      message: result.error.message
    });
  }

  const user = result.value;

  return res.status(200).json({
    message: "Client modifié avec succès",
    client: {
      id: user.userIdentifier,
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
      role: user.role,
      isActive: user.active,
      updatedAt: new Date()
    }
  });
});
