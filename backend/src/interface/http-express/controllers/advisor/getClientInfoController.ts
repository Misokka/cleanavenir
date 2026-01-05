import { Request, Response } from 'express';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const getClientInfoController = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;

    const container = getContainer();
    const clientResult = await container.repositories.client.findById(clientId);
    
    if (!clientResult.ok) {
      return res.status(404).json({
        message: 'Client non trouvé',
        error: clientResult.error.message,
      });
    }

    const client = clientResult.value;
    const userResult = await container.repositories.user.findById(client.userIdentifier);
    
    if (!userResult.ok) {
      return res.status(404).json({
        message: 'Utilisateur du client non trouvé',
      });
    }

    const user = userResult.value;

    return res.status(200).json({
      clientId: client.clientIdentifier,
      userId: user.userIdentifier,
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des infos du client:', error);
    return res.status(500).json({
      message: 'Erreur serveur',
      error: error.message,
    });
  }
};
