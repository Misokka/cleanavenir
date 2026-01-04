import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const createClientController = asyncHandler(async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = req.body;

  if (!email || !firstName || !lastName || !password) {
    return res.status(400).json({
      message: "Tous les champs sont requis: email, firstName, lastName, password"
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Le mot de passe doit contenir au moins 8 caractères"
    });
  }

  const container = getContainer();
  const useCase = container.useCases.director.createClient;

  const result = await useCase.execute(email, firstName, lastName, password);

  if (!result.ok) {
    if (result.error.message.includes("already")) {
      return res.status(400).json({
        message: "Cette adresse email est déjà utilisée"
      });
    }
    return res.status(400).json({
      message: result.error.message
    });
  }

  const { user, profile } = result.value;

  return res.status(201).json({
    message: "Client créé avec succès",
    client: {
      id: user.userIdentifier,
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
      role: user.role,
      isActive: user.active,
      createdAt: user.createdAt
    }
  });
});
